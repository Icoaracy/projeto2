import jsPDF from 'jspdf';
import { formatProcessNumber } from '@/pages/CreateDFD';

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
    this.pdf.setGState(new this.pdf.GState({ opacity: 0.1 }));
    this.pdf.setFontSize(50);
    this.pdf.setTextColor(200, 200, 200);
    this.pdf.text('DFD', 105, 150, { align: 'center', angle: 45 });
    this.pdf.setGState(new this.pdf.GState({ opacity: 1 }));
    this.pdf.setFontSize(this.options.fontSize);
    this.pdf.setTextColor(0, 0, 0);
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
    const fontSize = level === 1 ? 16 : level === 2 ? 14 : 12;
    this.pdf.setFontSize(fontSize);
    this.pdf.setFont('helvetica', 'bold');
    
    this.addPageIfNeeded(15);
    
    this.yPosition += 5;
    this.pdf.text(text, this.options.margins.left, this.yPosition);
    this.yPosition += 10;
    
    // Adicionar ao sumário
    if (this.options.includeTableOfContents && level <= 2) {
      this.tocEntries.push({ title: text, page: this.currentPage });
    }
    
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(this.options.fontSize);
  }

  addText(text: string, indent: number = 0): void {
    if (!text || text.trim() === '') return;
    
    const lines = this.pdf.splitTextToSize(text, 170 - indent);
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
    
    this.tocEntries.forEach((entry, index) => {
      const dots = '.'.repeat(50 - entry.title.length - entry.page.toString().length);
      this.addText(`${entry.title} ${dots} ${entry.page}`, 0);
    });
    
    this.addNewPage();
  }

  addHeader(formData: any): void {
    this.addTitle('DIAGRAMA DE FLUXO DE DADOS (DFD)', 1);
    this.addText(`Número do Processo: ${formatProcessNumber(formData.numeroProcesso)}`);
    this.addText(`Data de Geração: ${new Date().toLocaleDateString('pt-BR')}`);
    this.addText('');
  }

  addFooter(): void {
    this.addPageNumber();
  }

  generate(content: any, formData: any): jsPDF {
    // Adicionar cabeçalho
    this.addHeader(formData);
    
    // Gerar sumário se habilitado
    if (this.options.includeTableOfContents) {
      this.addTableOfContents();
    }
    
    // Adicionar conteúdo principal
    Object.entries(content).forEach(([sectionTitle, sectionContent]) => {
      if (typeof sectionContent === 'string' && sectionContent.trim()) {
        this.addSection(sectionTitle, sectionContent, 1);
      }
    });
    
    // Adicionar rodapé à última página
    this.addFooter();
    
    return this.pdf;
  }

  save(filename: string): void {
    this.pdf.save(filename);
  }
}

export const generateAdvancedPDF = (content: any, formData: any, options?: PDFOptions) => {
  const generator = new AdvancedPDFGenerator(options);
  const pdf = generator.generate(content, formData);
  
  const processNumber = formatProcessNumber(formData.numeroProcesso).replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `DFD_${processNumber}.pdf`;
  
  generator.save(filename);
  return filename;
};