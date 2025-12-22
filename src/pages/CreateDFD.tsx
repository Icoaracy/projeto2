import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, FileText, Download, Wand2, Check, X, RefreshCw, AlertTriangle, Keyboard, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError, showInfo } from "@/utils/toast";
import { apiClient } from "@/lib/api";
import { useSecurity } from "@/hooks/use-security";
import { useAutoSave } from "@/hooks/use-auto-save";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { KeyboardShortcutsHelp } from "@/components/KeyboardShortcutsHelp";
import { FormProgress } from "@/components/FormProgress";
import { FormValidationSummary } from "@/components/FormValidationSummary";
import { FormTemplates } from "@/components/FormTemplates";
import { DataManager } from "@/components/DataManager";
import { validateForm, getFieldValidationIssues } from "@/lib/form-validation";
import { generateAdvancedPDF } from "@/lib/pdf-generator";

interface ImproveTextResponse {
  success: boolean;
  improvedText?: string;
  error?: string;
}

const CreateDFD = () => {
  const navigate = useNavigate();
  const { canMakeRequest } = useSecurity();
  const formRef = useRef<HTMLFormElement>(null);
  
  const [formData, setFormData] = useState({
    // 1. Informações Básicas
    numeroProcesso: "",
    
    // 2. Descrição da Necessidade
    objetoAquisicao: "",
    objetoAquisicaoOriginal: "",
    objetoAquisicaoMelhorado: "",
    showObjetoAquisicaoAI: false,
    origemNecessidade: "",
    localAplicacao: "",
    fundamentoLegal: "",
    
    // 3. Área Requisitante
    areaRequisitante: "",
    requisitante: "",
    cargo: "",
    fundamentoLegalArea: "",
    
    // 4. Descrição dos Requisitos da Contratação
    opcaoExecucaoIndireta: "",
    opcaoRegimeExecucao: "",
    essencialidadeObjeto: "",
    requisitosGerais: "",
    requisitosEspecificos: {
      niveisQualidade: "",
      legislacaoPertinente: "",
      normasTecnicas: "",
      requisitosTemporais: "",
      requisitosGarantia: "",
      fornecimentoAssociado: ""
    },
    criteriosSustentabilidade: "",
    avaliacaoDuracaoContrato: "",
    necessidadeTransicao: "",
    levantamentoRiscos: "",
    
    // 5. Levantamento de Mercado
    alternativa1: {
      descricao: "",
      pontosPositivos: "",
      pontosNegativos: ""
    },
    alternativa2: {
      descricao: "",
      pontosPositivos: "",
      pontosNegativos: ""
    },
    alternativa3: {
      descricao: "",
      pontosPositivos: "",
      pontosNegativos: ""
    },
    impactosPrevistos: "",
    consultaPublica: "",
    justificativaAlternativa: "",
    enquadramentoBemServico: "",
    
    // 6. Descrição da solução como um todo
    descricaoSolucao: "",
    
    // 7. Estimativa das Quantidades
    metodoLevantamentoQuantidades: "",
    resultadoLevantamento: "",
    compatibilidadeQuantidades: "",
    memoriaCalculo: "",
    
    // 8. Estimativa do Valor
    valorTotalEstimacao: "",
    metodosLevantamentoPrecos: "",
    precosDentroMercado: "",
    
    // 9. Justificativa Parcelamento
    viabilidadeTecnicaDivisao: "",
    viabilidadeEconomicaDivisao: "",
    perdaEscalaDivisao: "",
    aproveitamentoMercadoDivisao: "",
    conclusaoParcelamento: "",
    
    // 10. Contratações Correlatas
    contratacoesCorrelatas: "",
    
    // 11. Alinhamento Planejamento
    perspectivaProcessos: "",
    identificadorDespesa: "",
    alinhamentoPDL: "",
    alinhamentoNormas: "",
    
    // 12. Benefícios
    beneficiosContratacao: "",
    
    // 13. Providências
    providenciasAdotar: "",
    
    // 14. Impactos Ambientais
    impactosAmbientais: "",
    
    // 15. Declaração de Viabilidade
    justificativaViabilidade: "",
    
    // 16. Equipe de Planejamento
    equipePlanejamento: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImprovingText, setIsImprovingText] = useState(false);
  const [processNumberError, setProcessNumberError] = useState("");
  const [showValidation, setShowValidation] = useState(false);
  const [currentSection, setCurrentSection] = useState("basic-info");
  const [showPreview, setShowPreview] = useState(false);

  // Auto-save functionality
  const autoSave = useAutoSave(formData, {
    interval: 30,
    debounceTime: 2000,
    storageKey: 'dfd-form-data'
  });

  // Load saved data on mount
  useEffect(() => {
    const savedData = autoSave.loadSavedData();
    if (savedData && savedData.data) {
      setFormData(savedData.data);
      showInfo('Dados recuperados do salvamento automático');
    }
  }, [autoSave]);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 's',
      ctrlKey: true,
      handler: () => handleForceSave(),
      description: 'Salvar formulário'
    },
    {
      key: 'p',
      ctrlKey: true,
      handler: () => handleSaveAsPDF(),
      description: 'Gerar PDF'
    },
    {
      key: 'v',
      ctrlKey: true,
      handler: () => setShowValidation(!showValidation),
      description: 'Mostrar/ocultar validação'
    },
    {
      key: 'h',
      ctrlKey: true,
      handler: () => setShowPreview(!showPreview),
      description: 'Mostrar/ocultar preview'
    }
  ]);

  // Form sections for progress tracking
  const formSections = [
    { id: 'basic-info', title: '1. Informações Básicas', isCompleted: !!formData.numeroProcesso },
    { id: 'necessidade', title: '2. Descrição da Necessidade', isCompleted: !!formData.objetoAquisicao && !!formData.origemNecessidade },
    { id: 'area-requisitante', title: '3. Área Requisitante', isCompleted: !!formData.areaRequisitante && !!formData.requisitante },
    { id: 'requisitos', title: '4. Requisitos da Contratação', isCompleted: !!formData.opcaoExecucaoIndireta && !!formData.requisitosGerais },
    { id: 'mercado', title: '5. Levantamento de Mercado', isCompleted: !!formData.alternativa1.descricao },
    { id: 'solucao', title: '6. Descrição da Solução', isCompleted: !!formData.descricaoSolucao },
    { id: 'quantidades', title: '7. Estimativa de Quantidades', isCompleted: !!formData.metodoLevantamentoQuantidades },
    { id: 'valor', title: '8. Estimativa de Valor', isCompleted: !!formData.valorTotalEstimacao },
    { id: 'parcelamento', title: '9. Justificativa Parcelamento', isCompleted: !!formData.conclusaoParcelamento },
    { id: 'correlatas', title: '10. Contratações Correlatas', isCompleted: true },
    { id: 'alinhamento', title: '11. Alinhamento Planejamento', isCompleted: !!formData.perspectivaProcessos },
    { id: 'beneficios', title: '12. Benefícios', isCompleted: !!formData.beneficiosContratacao },
    { id: 'providencias', title: '13. Providências', isCompleted: !!formData.providenciasAdotar },
    { id: 'ambientais', title: '14. Impactos Ambientais', isCompleted: !!formData.impactosAmbientais },
    { id: 'viabilidade', title: '15. Declaração de Viabilidade', isCompleted: !!formData.justificativaViabilidade },
    { id: 'equipe', title: '16. Equipe de Planejamento', isCompleted: !!formData.equipePlanejamento }
  ];

  // Validation
  const validationResult = validateForm(formData);
  const validationIssues = getFieldValidationIssues(validationResult);

  // Function to validate process number according to specified algorithm with AND condition
  const validateProcessNumber = (numbers: string): boolean => {
    if (numbers.length !== 17) {
      return false;
    }

    const digits = numbers.split('').map(d => parseInt(d, 10));
    
    // 1º DÍGITO VERIFICADOR
    const penultimateDigit = digits[14];
    const first15Digits = digits.slice(0, 15);
    
    let weightedSum = 0;
    for (let i = 0; i < 15; i++) {
      const weight = 2 + (14 - i);
      weightedSum += first15Digits[i] * weight;
    }
    
    const remainder = weightedSum % 11;
    const calculatedDigit = 11 - remainder;
    
    // 2º DÍGITO VERIFICADOR
    const lastDigit = digits[16];
    const first16Digits = digits.slice(0, 16);
    
    let weightedSum2 = 0;
    for (let i = 0; i < 16; i++) {
      const weight = 2 + (15 - i);
      weightedSum2 += first16Digits[i] * weight;
    }
    
    const remainder2 = weightedSum2 % 11;
    const calculatedDigit2 = 11 - remainder2;
    
    // Apply AND condition
    const firstDigitValid = calculatedDigit === penultimateDigit;
    const secondDigitValid = calculatedDigit2 === lastDigit;
    
    return firstDigitValid && secondDigitValid;
  };

  // Format process number: xxxxx.xxxxxx/xxxx-xx
  const formatProcessNumber = (value: string): string => {
    const numbersOnly = value.replace(/\D/g, '').slice(0, 17);
    
    if (numbersOnly.length <= 5) {
      return numbersOnly;
    } else if (numbersOnly.length <= 11) {
      return `${numbersOnly.slice(0, 5)}.${numbersOnly.slice(5)}`;
    } else if (numbersOnly.length <= 15) {
      return `${numbersOnly.slice(0, 5)}.${numbersOnly.slice(5, 11)}/${numbersOnly.slice(11)}`;
    } else {
      return `${numbersOnly.slice(0, 5)}.${numbersOnly.slice(5, 11)}/${numbersOnly.slice(11, 15)}-${numbersOnly.slice(15, 17)}`;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'numeroProcesso') {
      const numbersOnly = value.replace(/\D/g, '').slice(0, 17);
      setFormData(prev => ({
        ...prev,
        [name]: numbersOnly
      }));
      
      if (processNumberError) {
        setProcessNumberError("");
      }
      
      if (numbersOnly.length === 17) {
        if (!validateProcessNumber(numbersOnly)) {
          setProcessNumberError("Numero de Processo está errado, revise o número de processo informado");
        }
      }
    } else if (name === 'objetoAquisicao') {
      setFormData(prev => ({
        ...prev,
        objetoAquisicao: value,
        objetoAquisicaoOriginal: value,
        showObjetoAquisicaoAI: false
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleNestedInputChange = (section: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev as any)[section],
        [field]: value
      }
    }));
  };

  const handleForceSave = async () => {
    try {
      await autoSave.forceSave();
      showSuccess('Dados salvos com sucesso!');
    } catch (error) {
      showError('Erro ao salvar dados');
    }
  };

  const handleApplyTemplate = (template: any) => {
    setFormData(prev => ({
      ...prev,
      ...template.data
    }));
    showSuccess('Template aplicado com sucesso!');
  };

  const handleLoadData = (data: any) => {
    setFormData(data);
  };

  const handleClearData = () => {
    setFormData({
      numeroProcesso: "",
      objetoAquisicao: "",
      objetoAquisicaoOriginal: "",
      objetoAquisicaoMelhorado: "",
      showObjetoAquisicaoAI: false,
      origemNecessidade: "",
      localAplicacao: "",
      fundamentoLegal: "",
      areaRequisitante: "",
      requisitante: "",
      cargo: "",
      fundamentoLegalArea: "",
      opcaoExecucaoIndireta: "",
      opcaoRegimeExecucao: "",
      essencialidadeObjeto: "",
      requisitosGerais: "",
      requisitosEspecificos: {
        niveisQualidade: "",
        legislacaoPertinente: "",
        normasTecnicas: "",
        requisitosTemporais: "",
        requisitosGarantia: "",
        fornecimentoAssociado: ""
      },
      criteriosSustentabilidade: "",
      avaliacaoDuracaoContrato: "",
      necessidadeTransicao: "",
      levantamentoRiscos: "",
      alternativa1: {
        descricao: "",
        pontosPositivos: "",
        pontosNegativos: ""
      },
      alternativa2: {
        descricao: "",
        pontosPositivos: "",
        pontosNegativos: ""
      },
      alternativa3: {
        descricao: "",
        pontosPositivos: "",
        pontosNegativos: ""
      },
      impactosPrevistos: "",
      consultaPublica: "",
      justificativaAlternativa: "",
      enquadramentoBemServico: "",
      descricaoSolucao: "",
      metodoLevantamentoQuantidades: "",
      resultadoLevantamento: "",
      compatibilidadeQuantidades: "",
      memoriaCalculo: "",
      valorTotalEstimacao: "",
      metodosLevantamentoPrecos: "",
      precosDentroMercado: "",
      viabilidadeTecnicaDivisao: "",
      viabilidadeEconomicaDivisao: "",
      perdaEscalaDivisao: "",
      aproveitamentoMercadoDivisao: "",
      conclusaoParcelamento: "",
      contratacoesCorrelatas: "",
      perspectivaProcessos: "",
      identificadorDespesa: "",
      alinhamentoPDL: "",
      alinhamentoNormas: "",
      beneficiosContratacao: "",
      providenciasAdotar: "",
      impactosAmbientais: "",
      justificativaViabilidade: "",
      equipePlanejamento: ""
    });
  };

  const improveTextWithAI = async () => {
    if (!formData.objetoAquisicao.trim()) {
      showError("Por favor, escreva o objeto da aquisição antes de solicitar melhoria.");
      return;
    }

    if (!canMakeRequest()) {
      showError("Limite de requisições excedido. Por favor, aguarde antes de tentar novamente.");
      return;
    }

    setIsImprovingText(true);

    try {
      const response = await apiClient.post<ImproveTextResponse>('/api/improve-text', {
        text: formData.objetoAquisicao,
        context: "licitação e aquisição de bens e serviços"
      });

      if (response.success && response.improvedText) {
        setFormData(prev => ({
          ...prev,
          objetoAquisicaoMelhorado: response.improvedText,
          showObjetoAquisicaoAI: true
        }));
        showSuccess("Texto melhorado com sucesso!");
      } else {
        showError(response.error || "Falha ao melhorar texto");
      }
    } catch (error) {
      showError("Erro ao processar solicitação. Tente novamente.");
    } finally {
      setIsImprovingText(false);
    }
  };

  const acceptImprovedText = () => {
    setFormData(prev => ({
      ...prev,
      objetoAquisicao: prev.objetoAquisicaoMelhorado,
      showObjetoAquisicaoAI: false
    }));
    showSuccess("Texto atualizado!");
  };

  const rejectImprovedText = () => {
    setFormData(prev => ({
      ...prev,
      showObjetoAquisicaoAI: false
    }));
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setCurrentSection(sectionId);
    }
  };

  const handleFieldClick = (fieldId: string) => {
    const element = document.getElementById(fieldId);
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const generatePDFContent = () => {
    let content = "";
    
    const addSection = (title: string, fields: Array<{label: string, value: string}>) => {
      content += `${title}\n`;
      content += "=".repeat(title.length) + "\n\n";
      
      fields.forEach(field => {
        if (field.value && field.value.trim()) {
          content += `${field.label}\n`;
          content += `${field.value}\n\n`;
        }
      });
      
      content += "\n";
    };

    // 1. Informações Básicas
    addSection("1. INFORMAÇÕES BÁSICAS", [
      { label: "1.1. Número do Processo Administrativo:", value: formatProcessNumber(formData.numeroProcesso) }
    ]);

    // 2. Descrição da Necessidade
    addSection("2. DESCRIÇÃO DA NECESSIDADE", [
      { label: "2.1. Objeto da Aquisição:", value: formData.objetoAquisicao },
      { label: "2.2. Origem da Necessidade:", value: formData.origemNecessidade },
      { label: "2.3. Local de Aplicação:", value: formData.localAplicacao },
      { label: "2.4. Fundamento Legal:", value: formData.fundamentoLegal }
    ]);

    // 3. Área Requisitante
    addSection("3. ÁREA REQUISITANTE", [
      { label: "3.1. Área Requisitante:", value: formData.areaRequisitante },
      { label: "3.2. Requisitante:", value: formData.requisitante },
      { label: "3.3. Cargo:", value: formData.cargo },
      { label: "3.4. Fundamento Legal:", value: formData.fundamentoLegalArea }
    ]);

    // 4. Descrição dos Requisitos da Contratação
    addSection("4. DESCRIÇÃO DOS REQUISITOS DA CONTRATAÇÃO", [
      { label: "4.1. Da opção pela execução Indireta:", value: formData.opcaoExecucaoIndireta },
      { label: "4.2. Da opção por regime de execução contínua ou por escopo:", value: formData.opcaoRegimeExecucao },
      { label: "4.3. Da essencialidade do objeto:", value: formData.essencialidadeObjeto },
      { label: "4.4.1. Gerais:", value: formData.requisitosGerais },
      { label: "4.4.2.1. Os níveis de qualidade do serviço ou produto:", value: formData.requisitosEspecificos.niveisQualidade },
      { label: "4.4.2.2. A Legislação pertinente:", value: formData.requisitosEspecificos.legislacaoPertinente },
      { label: "4.4.2.3. As normas técnicas:", value: formData.requisitosEspecificos.normasTecnicas },
      { label: "4.4.2.4. Os requisitos temporais:", value: formData.requisitosEspecificos.requisitosTemporais },
      { label: "4.4.2.5. Os requisitos de garantia e assistência técnica:", value: formData.requisitosEspecificos.requisitosGarantia },
      { label: "4.4.2.6. A necessidade de contratação do fornecimento associado ao serviço:", value: formData.requisitosEspecificos.fornecimentoAssociado },
      { label: "4.5. Critérios e práticas de sustentabilidade:", value: formData.criteriosSustentabilidade },
      { label: "4.6. Avaliação da duração inicial do contrato:", value: formData.avaliacaoDuracaoContrato },
      { label: "4.7. Necessidade de transição contratual:", value: formData.necessidadeTransicao },
      { label: "4.8. Levantamento de Riscos associados a Contratação:", value: formData.levantamentoRiscos }
    ]);

    // 5. Levantamento de Mercado
    addSection("5. LEVANTAMENTO DE MERCADO", [
      { label: "5.1.1. Descrição - Alternativa 01:", value: formData.alternativa1.descricao },
      { label: "5.1.2. Pontos Positivos - Alternativa 01:", value: formData.alternativa1.pontosPositivos },
      { label: "5.1.3. Pontos Negativos - Alternativa 01:", value: formData.alternativa1.pontosNegativos },
      { label: "5.2.1. Descrição - Alternativa 02:", value: formData.alternativa2.descricao },
      { label: "5.2.2. Pontos Positivos - Alternativa 02:", value: formData.alternativa2.pontosPositivos },
      { label: "5.2.3. Pontos Negativos - Alternativa 02:", value: formData.alternativa2.pontosNegativos },
      { label: "5.3.1. Descrição - Alternativa 03:", value: formData.alternativa3.descricao },
      { label: "5.3.2. Pontos Positivos - Alternativa 03:", value: formData.alternativa3.pontosPositivos },
      { label: "5.3.3. Pontos Negativos - Alternativa 03:", value: formData.alternativa3.pontosNegativos },
      { label: "5.4. Dos Impactos Previstos:", value: formData.impactosPrevistos },
      { label: "5.5. Da consulta ou audiência pública:", value: formData.consultaPublica },
      { label: "5.6. Justificativa da alternativa escolhida:", value: formData.justificativaAlternativa },
      { label: "5.7. Enquadramento como bem ou serviço comum:", value: formData.enquadramentoBemServico }
    ]);

    // 6. Descrição da solução como um todo
    addSection("6. DESCRIÇÃO DA SOLUÇÃO COMO UM TODO", [
      { label: "Descrição completa da solução:", value: formData.descricaoSolucao }
    ]);

    // 7. Estimativa das Quantidades
    addSection("7. ESTIMATIVA DAS QUANTIDADES A SEREM CONTRATADAS", [
      { label: "7.1. Método de levantamento das quantidades:", value: formData.metodoLevantamentoQuantidades },
      { label: "7.2. Resultado do Levantamento:", value: formData.resultadoLevantamento },
      { label: "7.3. Compatibilidade entre quantidades e demanda:", value: formData.compatibilidadeQuantidades },
      { label: "7.4. Memória de Cálculo:", value: formData.memoriaCalculo }
    ]);

    // 8. Estimativa do Valor
    addSection("8. ESTIMATIVA DO VALOR DA CONTRATAÇÃO", [
      { label: "8.1. Valor Total da Estimativa:", value: formData.valorTotalEstimacao },
      { label: "8.2. Métodos de levantamento de preços usados:", value: formData.metodosLevantamentoPrecos },
      { label: "8.3. Os preços estão dentro da margem de mercado?", value: formData.precosDentroMercado }
    ]);

    // 9. Justificativa Parcelamento
    addSection("9. JUSTIFICATIVA PARA O PARCELAMENTO OU NÃO DA SOLUÇÃO", [
      { label: "9.1. É tecnicamente viável dividir a solução?", value: formData.viabilidadeTecnicaDivisao },
      { label: "9.2. É economicamente viável dividir a solução?", value: formData.viabilidadeEconomicaDivisao },
      { label: "9.3. Não há perda de escala ao dividir a solução?", value: formData.perdaEscalaDivisao },
      { label: "9.4. Há o melhor aproveitamento do mercado e ampliação da competitividade ao dividir a solução?", value: formData.aproveitamentoMercadoDivisao },
      { label: "9.5. Conclusão sobre o parcelamento ou não da solução:", value: formData.conclusaoParcelamento }
    ]);

    // 10. Contratações Correlatas
    addSection("10. CONTRATAÇÕES CORRELATAS E/OU INTERDEPENDENTES", [
      { label: "Descrição das contratações correlatas e/ou interdependentes:", value: formData.contratacoesCorrelatas }
    ]);

    // 11. Alinhamento Planejamento
    addSection("11. ALINHAMENTO ENTRE A CONTRATAÇÃO E O PLANEJAMENTO", [
      { label: "11.1. A qual Perspectiva de Processos a aquisição está alinhada?", value: formData.perspectivaProcessos },
      { label: "11.2. A qual Identificador de Despesa está vinculada a aquisição?", value: formData.identificadorDespesa },
      { label: "11.3. Alinhamento ao Plano Diretor de Logística Sustentável:", value: formData.alinhamentoPDL },
      { label: "11.4. Alinhamento as Normas Internas e de Órgãos Externos:", value: formData.alinhamentoNormas }
    ]);

    // 12. Benefícios
    addSection("12. BENEFÍCIOS A SEREM ALCANÇADOS COM A CONTRATAÇÃO", [
      { label: "Descrição dos benefícios esperados:", value: formData.beneficiosContratacao }
    ]);

    // 13. Providências
    addSection("13. PROVIDÊNCIAS A SEREM ADOTADAS", [
      { label: "Descrição das providências necessárias:", value: formData.providenciasAdotar }
    ]);

    // 14. Impactos Ambientais
    addSection("14. POSSÍVEIS IMPACTOS AMBIENTAIS", [
      { label: "Descrição dos possíveis impactos ambientais:", value: formData.impactosAmbientais }
    ]);

    // 15. Declaração de Viabilidade
    addSection("15. DECLARAÇÃO DE VIABILIDADE", [
      { label: "15.1. Justificativa da Viabilidade:", value: formData.justificativaViabilidade }
    ]);

    // 16. Equipe de Planejamento
    addSection("16. EQUIPE DE PLANEJAMENTO", [
      { label: "Descrição da equipe responsável pelo planejamento:", value: formData.equipePlanejamento }
    ]);

    return content;
  };

  const handleSaveAsPDF = async () => {
    if (!formData.numeroProcesso.trim()) {
      showError("Por favor, informe o número do processo antes de salvar.");
      return;
    }

    if (formData.numeroProcesso.length !== 17) {
      showError("O número do processo deve ter exatamente 17 dígitos.");
      return;
    }

    if (!validateProcessNumber(formData.numeroProcesso)) {
      showError("Numero de Processo está errado, revise o número de processo informado");
      return;
    }

    if (!validationResult.isValid) {
      showError("Existem erros de validação. Corrija-os antes de gerar o PDF.");
      setShowValidation(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const content = generatePDFContent();
      const filename = generateAdvancedPDF(content, formData, {
        includeWatermark: true,
        includePageNumbers: true,
        includeTableOfContents: true,
        fontSize: 10,
        lineHeight: 5
      });
      
      showSuccess(`PDF "${filename}" gerado com sucesso!`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      showError("Erro ao gerar PDF. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const shortcuts = [
    { keys: ['Ctrl', 'S'], description: 'Salvar formulário' },
    { keys: ['Ctrl', 'P'], description: 'Gerar PDF' },
    { keys: ['Ctrl', 'V'], description: 'Mostrar/ocultar validação' },
    { keys: ['Ctrl', 'H'], description: 'Mostrar/ocultar preview' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <section className="py-8 px-4 border-b border-gray-200 sticky top-0 bg-white z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Diagrama de Fluxo de Dados (DFD)</h1>
                  <p className="text-gray-600">Formulário completo para análise de fluxo de dados do processo licitatório</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <FormTemplates onApplyTemplate={handleApplyTemplate} currentData={formData} />
              <DataManager 
                formData={formData} 
                onLoadData={handleLoadData} 
                onClearData={handleClearData} 
              />
              <KeyboardShortcutsHelp shortcuts={shortcuts} />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowValidation(!showValidation)}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Validação
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleForceSave}
                disabled={autoSave.isSaving}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {autoSave.isSaving ? "Salvando..." : "Salvar"}
              </Button>
              <Button 
                size="sm"
                onClick={handleSaveAsPDF}
                disabled={isSubmitting || !validationResult.isValid}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {isSubmitting ? "Gerando..." : "Gerar PDF"}
              </Button>
            </div>
          </div>
          
          {/* Status Bar */}
          <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-4">
              {autoSave.lastSaved && (
                <span>Salvo automaticamente: {autoSave.lastSaved.toLocaleTimeString()}</span>
              )}
              {autoSave.hasUnsavedChanges && (
                <span className="text-orange-600">Alterações não salvas</span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span>Seções concluídas: {formSections.filter(s => s.isCompleted).length}/{formSections.length}</span>
              {validationResult.isValid ? (
                <span className="text-green-600">✓ Formulário válido</span>
              ) : (
                <span className="text-red-600">⚠ {validationResult.errors.length} erro(s)</span>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <FormProgress 
              sections={formSections}
              currentSection={currentSection}
              onSectionClick={scrollToSection}
            />
            
            {showValidation && (
              <FormValidationSummary 
                issues={validationIssues}
                onFieldClick={handleFieldClick}
              />
            )}
          </div>

          {/* Main Form */}
          <div className="lg:col-span-3">
            <form ref={formRef} onSubmit={(e) => { e.preventDefault(); handleSaveAsPDF(); }} className="space-y-8">
              {/* 1. Informações Básicas */}
              <Card id="basic-info">
                <CardHeader>
                  <CardTitle className="text-xl">1. Informações Básicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="numeroProcesso">1.1. Número do Processo Administrativo</Label>
                    <Input
                      id="numeroProcesso"
                      name="numeroProcesso"
                      value={formatProcessNumber(formData.numeroProcesso)}
                      onChange={handleInputChange}
                      placeholder="xxxxx.xxxxxx/xxxx-xx"
                      maxLength={21}
                      className={processNumberError ? "border-red-500" : ""}
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Formato: xxxxx.xxxxxx/xxxx-xx (17 dígitos numéricos)
                    </p>
                    {processNumberError && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <AlertTriangle className="w-4 h-4" />
                        {processNumberError}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* 2. Descrição da Necessidade */}
              <Card id="necessidade">
                <CardHeader>
                  <CardTitle className="text-xl">2. Descrição da Necessidade</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="objetoAquisicao">2.1. Objeto da Aquisição</Label>
                    <Textarea
                      id="objetoAquisicao"
                      name="objetoAquisicao"
                      value={formData.objetoAquisicao}
                      onChange={handleInputChange}
                      placeholder="Descreva o objeto da aquisição. A IA pode ajudar a melhorar seu texto!"
                      rows={3}
                      required
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={improveTextWithAI}
                        disabled={!formData.objetoAquisicao.trim() || isImprovingText || !canMakeRequest()}
                        className="flex items-center gap-2"
                      >
                        <Wand2 className="w-4 h-4" />
                        {isImprovingText ? "Melhorando..." : "Melhorar com IA"}
                      </Button>
                      <span className="text-xs text-gray-500">
                        Use a IA para melhorar a clareza e formalidade do texto
                      </span>
                    </div>
                  </div>

                  {/* AI Improvement Section */}
                  {formData.showObjetoAquisicaoAI && formData.objetoAquisicaoMelhorado && (
                    <Card className="border-green-200 bg-green-50">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Wand2 className="w-5 h-5 text-green-600" />
                            <CardTitle className="text-lg text-green-800">Texto Melhorado pela IA</CardTitle>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={rejectImprovedText}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="bg-white p-4 rounded-lg border border-green-200">
                          <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">
                            {formData.objetoAquisicaoMelhorado}
                          </pre>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            onClick={acceptImprovedText}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                          >
                            <Check className="w-4 h-4" />
                            Aceitar
                          </Button>
                          
                          <Button
                            type="button"
                            variant="outline"
                            onClick={improveTextWithAI}
                            disabled={isImprovingText}
                            className="flex items-center gap-2"
                          >
                            <RefreshCw className="w-4 h-4" />
                            Tentar Novamente
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="origemNecessidade">2.2. Origem da Necessidade</Label>
                    <Textarea
                      id="origemNecessidade"
                      name="origemNecessidade"
                      value={formData.origemNecessidade}
                      onChange={handleInputChange}
                      placeholder="Descreva a origem da necessidade"
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="localAplicacao">2.3. Local de Aplicação</Label>
                    <Input
                      id="localAplicacao"
                      name="localAplicacao"
                      value={formData.localAplicacao}
                      onChange={handleInputChange}
                      placeholder="Informe o local de aplicação"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fundamentoLegal">2.4. Fundamento Legal</Label>
                    <Textarea
                      id="fundamentoLegal"
                      name="fundamentoLegal"
                      value={formData.fundamentoLegal}
                      onChange={handleInputChange}
                      placeholder="Informe o fundamento legal"
                      rows={3}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* 3. Área Requisitante */}
              <Card id="area-requisitante">
                <CardHeader>
                  <CardTitle className="text-xl">3. Área Requisitante</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="areaRequisitante">3.1. Área Requisitante</Label>
                    <Input
                      id="areaRequisitante"
                      name="areaRequisitante"
                      value={formData.areaRequisitante}
                      onChange={handleInputChange}
                      placeholder="Informe a área requisitante"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="requisitante">3.2. Requisitante</Label>
                    <Input
                      id="requisitante"
                      name="requisitante"
                      value={formData.requisitante}
                      onChange={handleInputChange}
                      placeholder="Nome do requisitante"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cargo">3.3. Cargo</Label>
                    <Input
                      id="cargo"
                      name="cargo"
                      value={formData.cargo}
                      onChange={handleInputChange}
                      placeholder="Cargo do requisitante"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fundamentoLegalArea">3.4. Fundamento Legal</Label>
                    <Textarea
                      id="fundamentoLegalArea"
                      name="fundamentoLegalArea"
                      value={formData.fundamentoLegalArea}
                      onChange={handleInputChange}
                      placeholder="Fundamento legal da área"
                      rows={3}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* 6. Descrição da solução como um todo */}
              <Card id="solucao">
                <CardHeader>
                  <CardTitle className="text-xl">6. Descrição da solução como um todo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="descricaoSolucao">Descrição completa da solução</Label>
                    <Textarea
                      id="descricaoSolucao"
                      name="descricaoSolucao"
                      value={formData.descricaoSolucao}
                      onChange={handleInputChange}
                      placeholder="Descreva a solução como um todo"
                      rows={4}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* 8. Estimativa do Valor */}
              <Card id="valor">
                <CardHeader>
                  <CardTitle className="text-xl">8. Estimativa do Valor da Contratação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="valorTotalEstimacao">8.1. Valor Total da Estimativa</Label>
                    <Input
                      id="valorTotalEstimacao"
                      name="valorTotalEstimacao"
                      value={formData.valorTotalEstimacao}
                      onChange={handleInputChange}
                      placeholder="R$ 0,00"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="metodosLevantamentoPrecos">8.2. Métodos de levantamento de preços usados</Label>
                    <Textarea
                      id="metodosLevantamentoPrecos"
                      name="metodosLevantamentoPrecos"
                      value={formData.metodosLevantamentoPrecos}
                      onChange={handleInputChange}
                      placeholder="Descreva os métodos utilizados"
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="precosDentroMercado">8.3. Os preços estão dentro da margem de mercado?</Label>
                    <Textarea
                      id="precosDentroMercado"
                      name="precosDentroMercado"
                      value={formData.precosDentroMercado}
                      onChange={handleInputChange}
                      placeholder="Analise se os preços estão dentro da margem de mercado"
                      rows={3}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* 16. Equipe de Planejamento */}
              <Card id="equipe">
                <CardHeader>
                  <CardTitle className="text-xl">16. Equipe de Planejamento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="equipePlanejamento">Descreva a equipe de planejamento</Label>
                    <Textarea
                      id="equipePlanejamento"
                      name="equipePlanejamento"
                      value={formData.equipePlanejamento}
                      onChange={handleInputChange}
                      placeholder="Descreva a equipe responsável pelo planejamento"
                      rows={3}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-center pt-8">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="text-lg px-8"
                  disabled={isSubmitting || !validationResult.isValid || !!processNumberError || formData.numeroProcesso.length !== 17}
                >
                  <Download className="w-5 h-5 mr-2" />
                  {isSubmitting ? "Gerando PDF..." : "Gerar PDF do DFD"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDFD;