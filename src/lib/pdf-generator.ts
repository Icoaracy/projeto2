import jsPDF from 'jspdf';
import { sanitizeHtml } from '@/lib/security';

// Local formatProcessNumber function to avoid circular dependency
const formatProcessNumber = (numero: string): string => {
  if (!numero || numero.length !== 17) return numero;
  
  const ano = numero.substring(0, 4);
  const justica = numero.substring(4, 6);
  const tribunal = numero.substring(6, 9);
  const vara = numero.substring(9, 13);
  const sequencial = numero.substring(13, 17);
  
  return `${ano}-${justica}.${tribunal}.${vara}.${sequencial}`;
};

export interface PDFOptions {
  includeWatermark?: boolean;
  includePageNumbers?: boolean;
  includeTableOfContents?: boolean;
  fontSize?: number;
  lineHeight?: number;
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

// Sanitize text content for PDF generation
const sanitizePDFText = (text: string): string => {
  if (!text || typeof text !== 'string') return '';
  
  // First sanitize HTML to prevent XSS
  const sanitized = sanitizeHtml(text);
  
  // Remove any remaining potentially problematic characters for PDF
  return sanitized
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
    .replace(/[\u2028\u2029]/g, ' ') // Replace line/paragraph separators
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
};

// Sanitize form data recursively
const sanitizeFormData = (data: any): any => {
  if (typeof data === 'string') {
    return sanitizePDFText(data);
  }
  
  if (Array.isArray(data)) {
    return data.map(item => sanitizeFormData(item));
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeFormData(value);
    }
    return sanitized;
  }
  
  return data;
};

export class AdvancedPDFGenerator {
  private pdf: jsPDF;
  private options: Required<PDFOptions>;
  private currentPage: number = 1;
  private yPosition: number = 20;
  private tocEntries: Array<{ title: string; page: number }> = [];

  constructor(options: PDFOptions = {}) {
    this.pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    this.options = {
      includeWatermark: options.includeWatermark ?? true,
      includePageNumbers: options.includePageNumbers ?? true,
      includeTableOfContents: options.includeTableOfContents ?? true,
      fontSize: options.fontSize ?? 10,
      lineHeight: options.lineHeight ?? 5,
      margins: options.margins ?? { top: 20, right: 15, bottom: 15, left: 15 }
    };

    this.setupDocument();
  }

  private setupDocument(): void {
    this.pdf.setFont('helvetica');
    this.pdf.setFontSize(this.options.fontSize);
    this.yPosition = this.options.margins.top;
  }

  private addPageIfNeeded(requiredHeight: number): void {
    if (this.yPosition + requiredHeight > 270) {
      this.addNewPage();
    }
  }

  private addNewPage(): void {
    this.pdf.addPage();
    this.currentPage++;
    this.yPosition = this.options.margins.top;
    
    if (this.options.includeWatermark) {
      this.addWatermark();
    }
  }

  private addWatermark(): void {
    // Use simpler watermark approach to avoid GState issues
    this.pdf.setTextColor(200, 200, 200);
    this.pdf.setFontSize(50);
    this.pdf.text('DFD', 105, 150, { 
      align: 'center',
      angle: 45,
      baseline: 'middle'
    });
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.setFontSize(this.options.fontSize);
  }

  private addPageNumber(): void {
    if (this.options.includePageNumbers) {
      this.pdf.setFontSize(8);
      this.pdf.text(
        `Página ${this.currentPage}`,
        105,
        285,
        { align: 'center' }
      );
      this.pdf.setFontSize(this.options.fontSize);
    }
  }

  addTitle(text: string, level: number = 1): void {
    // Sanitize title text
    const sanitizedText = sanitizePDFText(text);
    const fontSize = level === 1 ? 16 : level === 2 ? 14 : 12;
    this.pdf.setFontSize(fontSize);
    this.pdf.setFont('helvetica', 'bold');
    
    this.addPageIfNeeded(15);
    
    this.yPosition += 5;
    this.pdf.text(sanitizedText, this.options.margins.left, this.yPosition);
    this.yPosition += 10;
    
    // Adicionar ao sumário
    if (this.options.includeTableOfContents && level <= 2) {
      this.tocEntries.push({ title: sanitizedText, page: this.currentPage });
    }
    
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(this.options.fontSize);
  }

  addText(text: string, indent: number = 0): void {
    // Sanitize text content
    const sanitizedText = sanitizePDFText(text);
    if (!sanitizedText) return;
    
    const lines = this.pdf.splitTextToSize(sanitizedText, 170 - indent);
    const requiredHeight = lines.length * this.options.lineHeight;
    
    this.addPageIfNeeded(requiredHeight);
    
    lines.forEach((line: string) => {
      this.pdf.text(line, this.options.margins.left + indent, this.yPosition);
      this.yPosition += this.options.lineHeight;
    });
    
    this.yPosition += 2;
  }

  addSection(title: string, content: string, level: number = 1): void {
    this.addTitle(title, level);
    this.addText(content);
  }

  addTableOfContents(): void {
    if (!this.options.includeTableOfContents || this.tocEntries.length === 0) return;
    
    this.addNewPage();
    this.addTitle('Sumário', 1);
    
    this.tocEntries.forEach((entry) => {
      const dots = '.'.repeat(50 - entry.title.length - entry.page.toString().length);
      this.addText(`${entry.title} ${dots} ${entry.page}`, 0);
    });
    
    this.addNewPage();
  }

  addHeader(formData: any): void {
    // Sanitize form data before using
    const sanitizedFormData = sanitizeFormData(formData);
    
    this.addTitle('DIAGRAMA DE FLUXO DE DADOS (DFD)', 1);
    this.addText(`Número do Processo: ${formatProcessNumber(sanitizedFormData.numeroProcesso)}`);
    this.addText(`Data de Geração: ${new Date().toLocaleDateString('pt-BR')}`);
    this.addText('');
  }

  addFooter(): void {
    this.addPageNumber();
  }

  generate(content: any, formData: any): void {
    // Sanitize all input data
    const sanitizedContent = sanitizeFormData(content);
    const sanitizedFormData = sanitizeFormData(formData);
    
    // Adicionar cabeçalho
    this.addHeader(sanitizedFormData);
    
    // Gerar sumário se habilitado
    if (this.options.includeTableOfContents) {
      this.addTableOfContents();
    }
    
    // Adicionar conteúdo principal
    Object.entries(sanitizedContent).forEach(([sectionTitle, sectionContent]) => {
      if (typeof sectionContent === 'string' && sectionContent.trim()) {
        this.addSection(sectionTitle, sectionContent, 1);
      }
    });
    
    // Adicionar rodapé à última página
    this.addFooter();
  }

  save(filename: string): void {
    // Sanitize filename
    const sanitizedFilename = sanitizePDFText(filename).replace(/[^a-zA-Z0-9._-]/g, '_');
    this.pdf.save(sanitizedFilename);
  }
}

export const generateAdvancedPDF = (content: any, formData: any, options?: PDFOptions) => {
  // Validate inputs before processing
  if (!content || typeof content !== 'object') {
    throw new Error('Invalid content provided for PDF generation');
  }
  
  if (!formData || typeof formData !== 'object') {
    throw new Error('Invalid form data provided for PDF generation');
  }
  
  const generator = new AdvancedPDFGenerator(options);
  generator.generate(content, formData);
  
  const processNumber = formatProcessNumber(formData.numeroProcesso).replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `DFD_${processNumber}.pdf`;
  
  generator.save(filename);
  return filename;
};