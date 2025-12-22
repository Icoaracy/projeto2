import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Save, 
  FileText, 
  Download, 
  Upload, 
  Check, 
  AlertTriangle, 
  Info,
  Zap,
  Shield,
  FileJson,
  Keyboard,
  Eye,
  Copy,
  Database,
  Clock,
  Users,
  TrendingUp,
  ArrowRight,
  Star,
  Mail,
  Phone,
  MapPin,
  History
} from "lucide-react";
import { showSuccess, showError, showInfo } from "@/utils/toast";
import { useAutoSave } from "@/hooks/use-auto-save";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useSecurity } from "@/hooks/use-security";
import { FormProgress } from "@/components/FormProgress";
import { FormValidationSummary } from "@/components/FormValidationSummary";
import { KeyboardShortcutsHelp } from "@/components/KeyboardShortcutsHelp";
import { FormTemplates } from "@/components/FormTemplates";
import { DataManager } from "@/components/DataManager";
import { validateForm, getFieldValidationIssues } from "@/lib/form-validation";
import { generateAdvancedPDF } from "@/lib/pdf-generator";
import { apiClient } from "@/lib/api";

interface FormData {
  // Dados Gerais
  numeroProcesso: string;
  objetoAquisicao: string;
  origemNecessidade: string;
  localAplicacao: string;
  fundamentoLegal: string;
  areaRequisitante: string;
  requisitante: string;
  
  // Descrição da Solução
  descricaoSolucao: string;
  opcaoExecucaoIndireta: string;
  opcaoRegimeExecucao: string;
  essencialidadeObjeto: string;
  requisitosGerais: string;
  requisitosEspecificos: {
    niveisQualidade: string;
    legislacaoPertinente: string;
    normasTecnicas: string;
    requisitosTemporais: string;
    requisitosGarantia: string;
    fornecimentoAssociado: string;
  };
  criteriosSustentabilidade: string;
  avaliacaoDuracaoContrato: string;
  necessidadeTransicao: string;
  levantamentoRiscos: string;
  
  // Levantamento de Mercado
  alternativa1: {
    descricao: string;
    pontosPositivos: string;
    pontosNegativos: string;
  };
  alternativa2: {
    descricao: string;
    pontosPositivos: string;
    pontosNegativos: string;
  };
  alternativa3: {
    descricao: string;
    pontosPositivos: string;
    pontosNegativos: string;
  };
  impactosPrevistos: string;
  consultaPublica: string;
  justificativaAlternativa: string;
  enquadramentoBemServico: string;
  
  // Estimativa de Preços
  metodoLevantamentoQuantidades: string;
  resultadoLevantamento: string;
  compatibilidadeQuantidades: string;
  memoriaCalculo: string;
  valorTotalEstimacao: string;
  metodosLevantamentoPrecos: string;
  precosDentroMercado: string;
  
  // Parcelamento
  viabilidadeTecnicaDivisao: string;
  viabilidadeEconomicaDivisao: string;
  perdaEscalaDivisao: string;
  aproveitamentoMercadoDivisao: string;
  conclusaoParcelamento: string;
  
  // Contratações Correlatas
  contratacoesCorrelatas: string;
  
  // Alinhamento Planejamento
  perspectivaProcessos: string;
  identificadorDespesa: string;
  alinhamentoPDL: string;
  alinhamentoNormas: string;
  
  // Benefícios e Providências
  beneficiosContratacao: string;
  providenciasAdotar: string;
  impactosAmbientais: string;
  justificativaViabilidade: string;
  equipePlanejamento: string;
}

const initialFormData: FormData = {
  numeroProcesso: "",
  objetoAquisicao: "",
  origemNecessidade: "",
  localAplicacao: "",
  fundamentoLegal: "",
  areaRequisitante: "",
  requisitante: "",
  descricaoSolucao: "",
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
};

// Função de validação de número de processo
export const validateProcessNumber = (numero: string): boolean => {
  // Remove caracteres não numéricos
  const numbersOnly = numero.replace(/\D/g, '');
  
  // Verifica se tem 17 dígitos
  if (numbersOnly.length !== 17) {
    return false;
  }
  
  // Validação básica do formato XXXXX.YYYYYYYY.ZZZZ.WW
  const regex = /^(\d{5})\.?(\d{8})\.?(\d{4})\.?(\d{2})$/;
  const match = numbersOnly.match(regex);
  
  if (!match) {
    return false;
  }
  
  // Validação dos dígitos verificadores (simplificada)
  const [, ano, numeroUnico, orgao, dv] = match;
  
  // Verifica se o ano é razoável (entre 2000 e ano atual + 1)
  const anoNum = parseInt(ano);
  const anoAtual = new Date().getFullYear();
  if (anoNum < 2000 || anoNum > anoAtual + 1) {
    return false;
  }
  
  // Verificação básica dos dígitos verificadores
  // Esta é uma validação simplificada - a validação real é mais complexa
  const dvCalculado = (parseInt(ano) + parseInt(numeroUnico.substring(0, 4))) % 100;
  return parseInt(dv) === dvCalculado;
};

// Função para formatar número de processo
export const formatProcessNumber = (numero: string): string => {
  const numbersOnly = numero.replace(/\D/g, '');
  
  if (numbersOnly.length !== 17) {
    return numbersOnly;
  }
  
  return `${numbersOnly.substring(0, 5)}.${numbersOnly.substring(5, 13)}.${numbersOnly.substring(13, 17)}.${numbersOnly.substring(17, 19)}`;
};

const CreateDFD = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentSection, setCurrentSection] = useState("dados-gerais");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [validationIssues, setValidationIssues] = useState<any[]>([]);
  const { canMakeRequest } = useSecurity();

  // Configuração do auto-salvamento
  const autoSave = useAutoSave(formData, {
    interval: 30,
    debounceTime: 2000,
    storageKey: 'dfd-form-data',
    onSave: async (data) => {
      try {
        // Aqui você poderia salvar no backend
        console.log('Dados salvos:', data);
      } catch (error) {
        console.error('Erro ao salvar:', error);
      }
    }
  });

  // Configuração de atalhos de teclado
  const shortcuts = [
    {
      key: 's',
      ctrlKey: true,
      handler: () => autoSave.forceSave(),
      description: 'Salvar formulário'
    },
    {
      key: 'p',
      ctrlKey: true,
      handler: () => handleGeneratePDF(),
      description: 'Gerar PDF'
    },
    {
      key: 'e',
      ctrlKey: true,
      handler: () => handleExportData(),
      description: 'Exportar dados'
    },
    {
      key: 'i',
      ctrlKey: true,
      handler: () => handleImportData(),
      description: 'Importar dados'
    }
  ];

  useKeyboardShortcuts(shortcuts);

  // Carregar dados salvos ao montar o componente
  useEffect(() => {
    const savedData = autoSave.loadSavedData();
    if (savedData) {
      setFormData(savedData);
      showInfo('Dados anteriores foram recuperados');
    }
  }, [autoSave]);

  // Validação do formulário
  useEffect(() => {
    const validationResult = validateForm(formData);
    const issues = getFieldValidationIssues(validationResult);
    setValidationIssues(issues);
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNestedInputChange = (parent: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev as any)[parent],
        [field]: value
      }
    }));
  };

  const handleProcessNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formattedValue = formatProcessNumber(value);
    
    setFormData(prev => ({
      ...prev,
      numeroProcesso: formattedValue
    }));

    // Validação em tempo real
    if (value.length === 17) {
      if (validateProcessNumber(value)) {
        showSuccess('Número de processo válido');
      } else {
        showError('Número de processo inválido - verifique os dígitos');
      }
    }
  };

  const handleGeneratePDF = async () => {
    if (!canMakeRequest()) {
      showError('Aguarde um momento antes de gerar outro PDF');
      return;
    }

    setIsGeneratingPDF(true);
    
    try {
      const validationResult = validateForm(formData);
      if (!validationResult.isValid) {
        showError('Corrija os erros do formulário antes de gerar o PDF');
        return;
      }

      // Preparar conteúdo para o PDF
      const pdfContent = {
        'Dados Gerais': `
          Número do Processo: ${formatProcessNumber(formData.numeroProcesso)}
          Objeto da Aquisição: ${formData.objetoAquisicao}
          Origem da Necessidade: ${formData.origemNecessidade}
          Local de Aplicação: ${formData.localAplicacao}
          Fundamento Legal: ${formData.fundamentoLegal}
          Área Requisitante: ${formData.areaRequisitante}
          Requisitante: ${formData.requisitante}
        `,
        'Descrição da Solução': formData.descricaoSolucao,
        'Estimativa de Preços': `
          Valor Total Estimado: ${formData.valorTotalEstimacao}
          Método de Levantamento: ${formData.metodoLevantamentoQuantidades}
          Memória de Cálculo: ${formData.memoriaCalculo}
        `,
        'Justificativa da Contratação': formData.justificativaViabilidade
      };

      await generateAdvancedPDF(pdfContent, formData);
      showSuccess('PDF gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      showError('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleExportData = () => {
    try {
      const dataStr = JSON.stringify(formData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dfd-dados-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showSuccess('Dados exportados com sucesso!');
    } catch (error) {
      showError('Erro ao exportar dados');
    }
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            setFormData(data);
            showSuccess('Dados importados com sucesso!');
          } catch (error) {
            showError('Erro ao importar dados - arquivo inválido');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClearForm = () => {
    if (confirm('Tem certeza que deseja limpar todos os dados?')) {
      setFormData(initialFormData);
      autoSave.clearSavedData();
      showSuccess('Formulário limpo com sucesso!');
    }
  };

  const handleApplyTemplate = (template: any) => {
    setFormData(template.data);
    showSuccess('Template aplicado com sucesso!');
  };

  const handleLoadData = (data: any) => {
    setFormData(data);
    showSuccess('Dados carregados com sucesso!');
  };

  const sections = [
    { id: 'dados-gerais', title: 'Dados Gerais', isCompleted: false },
    { id: 'descricao-solucao', title: 'Descrição da Solução', isCompleted: false },
    { id: 'mercado', title: 'Levantamento de Mercado', isCompleted: false },
    { id: 'quantidades', title: 'Estimativa de Quantidades', isCompleted: false },
    { id: 'parcelamento', title: 'Justificativa de Parcelamento', isCompleted: false },
    { id: 'correlatas', title: 'Contratações Correlatas', isCompleted: false },
    { id: 'alinhamento', title: 'Alinhamento Planejamento', isCompleted: false },
    { id: 'beneficios', title: 'Benefícios e Providências', isCompleted: false },
    { id: 'viabilidade', title: 'Declaração de Viabilidade', isCompleted: false }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Voltar
              </Button>
              <h1 className="text-xl font-semibold">Diagrama de Fluxo de Dados</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <KeyboardShortcutsHelp shortcuts={shortcuts} />
              <FormTemplates onApplyTemplate={handleApplyTemplate} />
              <DataManager 
                formData={formData} 
                onLoadData={handleLoadData}
                onClearData={handleClearForm}
                autoSave={autoSave}
              />
              <Button
                onClick={handleGeneratePDF}
                disabled={isGeneratingPDF}
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                {isGeneratingPDF ? 'Gerando...' : 'Gerar PDF'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <FormProgress 
                sections={sections}
                currentSection={currentSection}
                onSectionClick={setCurrentSection}
              />
              
              <FormValidationSummary 
                issues={validationIssues}
                onFieldClick={(fieldId) => {
                  const element = document.getElementById(fieldId);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                    element.focus();
                  }
                }}
              />
              
              {autoSave.lastSaved && (
                <Alert>
                  <Clock className="w-4 h-4" />
                  <AlertDescription>
                    Salvo automaticamente às {autoSave.lastSaved.toLocaleTimeString()}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <div className="space-y-8">
                {/* 1. Dados Gerais */}
                <Card id="dados-gerais">
                  <CardHeader>
                    <CardTitle className="text-xl">1. Dados Gerais</CardTitle>
                    <CardDescription>
                      Informações básicas do processo licitatório
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="numeroProcesso">Número do Processo</Label>
                        <Input
                          id="numeroProcesso"
                          name="numeroProcesso"
                          value={formData.numeroProcesso}
                          onChange={handleProcessNumberChange}
                          placeholder="00000.00000000.0000.00"
                          maxLength={21}
                          required
                        />
                        <p className="text-xs text-gray-500">
                          Formato: XXXXX.YYYYYYYY.ZZZZ.WW
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="areaRequisitante">Área Requisitante</Label>
                        <Input
                          id="areaRequisitante"
                          name="areaRequisitante"
                          value={formData.areaRequisitante}
                          onChange={handleInputChange}
                          placeholder="Ex: Departamento de TI"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="objetoAquisicao">Objeto da Aquisição</Label>
                      <Textarea
                        id="objetoAquisicao"
                        name="objetoAquisicao"
                        value={formData.objetoAquisicao}
                        onChange={handleInputChange}
                        placeholder="Descreva detalhadamente o objeto da aquisição"
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="origemNecessidade">Origem da Necessidade</Label>
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="localAplicacao">Local de Aplicação</Label>
                        <Input
                          id="localAplicacao"
                          name="localAplicacao"
                          value={formData.localAplicacao}
                          onChange={handleInputChange}
                          placeholder="Ex: Sede da empresa"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="requisitante">Requisitante</Label>
                        <Input
                          id="requisitante"
                          name="requisitante"
                          value={formData.requisitante}
                          onChange={handleInputChange}
                          placeholder="Nome do requisitante"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="fundamentoLegal">Fundamento Legal</Label>
                      <Textarea
                        id="fundamentoLegal"
                        name="fundamentoLegal"
                        value={formData.fundamentoLegal}
                        onChange={handleInputChange}
                        placeholder="Lei nº 14.133/2021 e demais normativas aplicáveis"
                        rows={2}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* 2. Descrição da Solução */}
                <Card id="descricao-solucao">
                  <CardHeader>
                    <CardTitle className="text-xl">2. Descrição da Solução</CardTitle>
                    <CardDescription>
                      Detalhamento completo da solução a ser contratada
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="descricaoSolucao">Descrição Detalhada</Label>
                      <Textarea
                        id="descricaoSolucao"
                        name="descricaoSolucao"
                        value={formData.descricaoSolucao}
                        onChange={handleInputChange}
                        placeholder="Descreva detalhadamente a solução, incluindo características técnicas, funcionalidades, etc."
                        rows={6}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* 3. Estimativa de Preços */}
                <Card id="estimativa-precos">
                  <CardHeader>
                    <CardTitle className="text-xl">3. Estimativa de Preços</CardTitle>
                    <CardDescription>
                      Detalhamento dos custos estimados
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="valorTotalEstimacao">Valor Total Estimado</Label>
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
                      <Label htmlFor="metodosLevantamentoPrecos">Métodos de Levantamento de Preços</Label>
                      <Textarea
                        id="metodosLevantamentoPrecos"
                        name="metodosLevantamentoPrecos"
                        value={formData.metodosLevantamentoPrecos}
                        onChange={handleInputChange}
                        placeholder="Descreva os métodos utilizados para levantamento de preços"
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="precosDentroMercado">Análise de Preços de Mercado</Label>
                      <Textarea
                        id="precosDentroMercado"
                        name="precosDentroMercado"
                        value={formData.precosDentroMercado}
                        onChange={handleInputChange}
                        placeholder="Analise se os preços estão compatíveis com o mercado"
                        rows={3}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* 4. Descrição dos Requisitos da Contratação */}
                <Card id="requisitos">
                  <CardHeader>
                    <CardTitle className="text-xl">4. Descrição dos Requisitos da Contratação</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="opcaoExecucaoIndireta">4.1. Da opção pela execução Indireta</Label>
                      <Textarea
                        id="opcaoExecucaoIndireta"
                        name="opcaoExecucaoIndireta"
                        value={formData.opcaoExecucaoIndireta}
                        onChange={handleInputChange}
                        placeholder="Descreva a opção pela execução indireta"
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="opcaoRegimeExecucao">4.2. Da opção por regime de execução contínua ou por escopo</Label>
                      <Textarea
                        id="opcaoRegimeExecucao"
                        name="opcaoRegimeExecucao"
                        value={formData.opcaoRegimeExecucao}
                        onChange={handleInputChange}
                        placeholder="Descreva a opção por regime de execução"
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="essencialidadeObjeto">4.3. Da essencialidade do objeto</Label>
                      <Textarea
                        id="essencialidadeObjeto"
                        name="essencialidadeObjeto"
                        value={formData.essencialidadeObjeto}
                        onChange={handleInputChange}
                        placeholder="Descreva a essencialidade do objeto"
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="requisitosGerais">4.4.1. Gerais</Label>
                      <Textarea
                        id="requisitosGerais"
                        name="requisitosGerais"
                        value={formData.requisitosGerais}
                        onChange={handleInputChange}
                        placeholder="Descreva os requisitos gerais"
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="niveisQualidade">4.4.2.1. Os níveis de qualidade do serviço ou produto</Label>
                      <Textarea
                        id="niveisQualidade"
                        name="niveisQualidade"
                        value={formData.requisitosEspecificos.niveisQualidade}
                        onChange={(e) => handleNestedInputChange('requisitosEspecificos', 'niveisQualidade', e.target.value)}
                        placeholder="Descreva os níveis de qualidade"
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="legislacaoPertinente">4.4.2.2. A Legislação pertinente</Label>
                      <Textarea
                        id="legislacaoPertinente"
                        name="legislacaoPertinente"
                        value={formData.requisitosEspecificos.legislacaoPertinente}
                        onChange={(e) => handleNestedInputChange('requisitosEspecificos', 'legislacaoPertinente', e.target.value)}
                        placeholder="Descreva a legislação pertinente"
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="normasTecnicas">4.4.2.3. As normas técnicas</Label>
                      <Textarea
                        id="normasTecnicas"
                        name="normasTecnicas"
                        value={formData.requisitosEspecificos.normasTecnicas}
                        onChange={(e) => handleNestedInputChange('requisitosEspecificos', 'normasTecnicas', e.target.value)}
                        placeholder="Descreva as normas técnicas"
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="requisitosTemporais">4.4.2.4. Os requisitos temporais</Label>
                      <Textarea
                        id="requisitosTemporais"
                        name="requisitosTemporais"
                        value={formData.requisitosEspecificos.requisitosTemporais}
                        onChange={(e) => handleNestedInputChange('requisitosEspecificos', 'requisitosTemporais', e.target.value)}
                        placeholder="Descreva os requisitos temporais"
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="requisitosGarantia">4.4.2.5. Os requisitos de garantia e assistência técnica</Label>
                      <Textarea
                        id="requisitosGarantia"
                        name="requisitosGarantia"
                        value={formData.requisitosEspecificos.requisitosGarantia}
                        onChange={(e) => handleNestedInputChange('requisitosEspecificos', 'requisitosGarantia', e.target.value)}
                        placeholder="Descreva os requisitos de garantia e assistência técnica"
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="fornecimentoAssociado">4.4.2.6. A necessidade de contratação do fornecimento associado ao serviço</Label>
                      <Textarea
                        id="fornecimentoAssociado"
                        name="fornecimentoAssociado"
                        value={formData.requisitosEspecificos.fornecimentoAssociado}
                        onChange={(e) => handleNestedInputChange('requisitosEspecificos', 'fornecimentoAssociado', e.target.value)}
                        placeholder="Descreva a necessidade de fornecimento associado"
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="criteriosSustentabilidade">4.5. Critérios e práticas de sustentabilidade</Label>
                      <Textarea
                        id="criteriosSustentabilidade"
                        name="criteriosSustentabilidade"
                        value={formData.criteriosSustentabilidade}
                        onChange={handleInputChange}
                        placeholder="Descreva os critérios de sustentabilidade"
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="avaliacaoDuracaoContrato">4.6. Avaliação da duração inicial do contrato</Label>
                      <Textarea
                        id="avaliacaoDuracaoContrato"
                        name="avaliacaoDuracaoContrato"
                        value={formData.avaliacaoDuracaoContrato}
                        onChange={handleInputChange}
                        placeholder="Descreva a avaliação da duração do contrato"
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="necessidadeTransicao">4.7. Necessidade de transição contratual</Label>
                      <Textarea
                        id="necessidadeTransicao"
                        name="necessidadeTransicao"
                        value={formData.necessidadeTransicao}
                        onChange={handleInputChange}
                        placeholder="Descreva a necessidade de transição contratual"
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="levantamentoRiscos">4.8. Levantamento de Riscos associados a Contratação</Label>
                      <Textarea
                        id="levantamentoRiscos"
                        name="levantamentoRiscos"
                        value={formData.levantamentoRiscos}
                        onChange={handleInputChange}
                        placeholder="Descreva o levantamento de riscos"
                        rows={3}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* 5. Levantamento de Mercado */}
                <Card id="mercado">
                  <CardHeader>
                    <CardTitle className="text-xl">5. Levantamento de Mercado</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Alternativa 1 */}
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-3">Alternativa 01</h4>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="alt1-descricao">5.1.1. Descrição</Label>
                          <Textarea
                            id="alt1-descricao"
                            value={formData.alternativa1.descricao}
                            onChange={(e) => handleNestedInputChange('alternativa1', 'descricao', e.target.value)}
                            placeholder="Descreva a primeira alternativa"
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="alt1-positivos">5.1.2. Pontos Positivos</Label>
                          <Textarea
                            id="alt1-positivos"
                            value={formData.alternativa1.pontosPositivos}
                            onChange={(e) => handleNestedInputChange('alternativa1', 'pontosPositivos', e.target.value)}
                            placeholder="Liste os pontos positivos"
                            rows={2}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="alt1-negativos">5.1.3. Pontos Negativos</Label>
                          <Textarea
                            id="alt1-negativos"
                            value={formData.alternativa1.pontosNegativos}
                            onChange={(e) => handleNestedInputChange('alternativa1', 'pontosNegativos', e.target.value)}
                            placeholder="Liste os pontos negativos"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Alternativa 2 */}
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-3">Alternativa 02</h4>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="alt2-descricao">5.2.1. Descrição</Label>
                          <Textarea
                            id="alt2-descricao"
                            value={formData.alternativa2.descricao}
                            onChange={(e) => handleNestedInputChange('alternativa2', 'descricao', e.target.value)}
                            placeholder="Descreva a segunda alternativa"
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="alt2-positivos">5.2.2. Pontos Positivos</Label>
                          <Textarea
                            id="alt2-positivos"
                            value={formData.alternativa2.pontosPositivos}
                            onChange={(e) => handleNestedInputChange('alternativa2', 'pontosPositivos', e.target.value)}
                            placeholder="Liste os pontos positivos"
                            rows={2}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="alt2-negativos">5.2.3. Pontos Negativos</Label>
                          <Textarea
                            id="alt2-negativos"
                            value={formData.alternativa2.pontosNegativos}
                            onChange={(e) => handleNestedInputChange('alternativa2', 'pontosNegativos', e.target.value)}
                            placeholder="Liste os pontos negativos"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Alternativa 3 */}
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-3">Alternativa 03</h4>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="alt3-descricao">5.3.1. Descrição</Label>
                          <Textarea
                            id="alt3-descricao"
                            value={formData.alternativa3.descricao}
                            onChange={(e) => handleNestedInputChange('alternativa3', 'descricao', e.target.value)}
                            placeholder="Descreva a terceira alternativa"
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="alt3-positivos">5.3.2. Pontos Positivos</Label>
                          <Textarea
                            id="alt3-positivos"
                            value={formData.alternativa3.pontosPositivos}
                            onChange={(e) => handleNestedInputChange('alternativa3', 'pontosPositivos', e.target.value)}
                            placeholder="Liste os pontos positivos"
                            rows={2}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="alt3-negativos">5.3.3. Pontos Negativos</Label>
                          <Textarea
                            id="alt3-negativos"
                            value={formData.alternativa3.pontosNegativos}
                            onChange={(e) => handleNestedInputChange('alternativa3', 'pontosNegativos', e.target.value)}
                            placeholder="Liste os pontos negativos"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="impactosPrevistos">5.4. Dos Impactos Previstos</Label>
                      <Textarea
                        id="impactosPrevistos"
                        name="impactosPrevistos"
                        value={formData.impactosPrevistos}
                        onChange={handleInputChange}
                        placeholder="Descreva os impactos previstos"
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="consultaPublica">5.5. Da consulta ou audiência pública</Label>
                      <Textarea
                        id="consultaPublica"
                        name="consultaPublica"
                        value={formData.consultaPublica}
                        onChange={handleInputChange}
                        placeholder="Descreva a consulta ou audiência pública"
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="justificativaAlternativa">5.6. Justificativa da alternativa escolhida</Label>
                      <Textarea
                        id="justificativaAlternativa"
                        name="justificativaAlternativa"
                        value={formData.justificativaAlternativa}
                        onChange={handleInputChange}
                        placeholder="Justifique a alternativa escolhida"
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="enquadramentoBemServico">5.7. Enquadramento como bem ou serviço comum</Label>
                      <Textarea
                        id="enquadramentoBemServico"
                        name="enquadramentoBemServico"
                        value={formData.enquadramentoBemServico}
                        onChange={handleInputChange}
                        placeholder="Descreva o enquadramento"
                        rows={3}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* 7. Estimativa das Quantidades */}
                <Card id="quantidades">
                  <CardHeader>
                    <CardTitle className="text-xl">7. Estimativa das Quantidades a serem Contratadas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="metodoLevantamentoQuantidades">7.1. Método de levantamento das quantidades</Label>
                      <Textarea
                        id="metodoLevantamentoQuantidades"
                        name="metodoLevantamentoQuantidades"
                        value={formData.metodoLevantamentoQuantidades}
                        onChange={handleInputChange}
                        placeholder="Descreva o método utilizado"
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="resultadoLevantamento">7.2. Resultado do Levantamento</Label>
                      <Textarea
                        id="resultadoLevantamento"
                        name="resultadoLevantamento"
                        value={formData.resultadoLevantamento}
                        onChange={handleInputChange}
                        placeholder="Descreva o resultado do levantamento"
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="compatibilidadeQuantidades">7.3. Compatibilidade entre quantidades e demanda</Label>
                      <Textarea
                        id="compatibilidadeQuantidades"
                        name="compatibilidadeQuantidades"
                        value={formData.compatibilidadeQuantidades}
                        onChange={handleInputChange}
                        placeholder="Analise a compatibilidade"
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="memoriaCalculo">7.4. Memória de Cálculo</Label>
                      <Textarea
                        id="memoriaCalculo"
                        name="memoriaCalculo"
                        value={formData.memoriaCalculo}
                        onChange={handleInputChange}
                        placeholder="Descreva a memória de cálculo"
                        rows={3}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* 9. Justificativa Parcelamento */}
                <Card id="parcelamento">
                  <CardHeader>
                    <CardTitle className="text-xl">9. Justificativa para o Parcelamento ou não da Solução</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="viabilidadeTecnicaDivisao">9.1. É tecnicamente viável dividir a solução?</Label>
                      <Textarea
                        id="viabilidadeTecnicaDivisao"
                        name="viabilidadeTecnicaDivisao"
                        value={formData.viabilidadeTecnicaDivisao}
                        onChange={handleInputChange}
                        placeholder="Analise a viabilidade técnica"
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="viabilidadeEconomicaDivisao">9.2. É economicamente viável dividir a solução?</Label>
                      <Textarea
                        id="viabilidadeEconomicaDivisao"
                        name="viabilidadeEconomicaDivisao"
                        value={formData.viabilidadeEconomicaDivisao}
                        onChange={handleInputChange}
                        placeholder="Analise a viabilidade econômica"
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="perdaEscalaDivisao">9.3. Não há perda de escala ao dividir a solução?</Label>
                      <Textarea
                        id="perdaEscalaDivisao"
                        name="perdaEscalaDivisao"
                        value={formData.perdaEscalaDivisao}
                        onChange={handleInputChange}
                        placeholder="Analise a perda de escala"
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="aproveitamentoMercadoDivisao">9.4. Há o melhor aproveitamento do mercado e ampliação da competitividade ao dividir a solução?</Label>
                      <Textarea
                        id="aproveitamentoMercadoDivisao"
                        name="aproveitamentoMercadoDivisao"
                        value={formData.aproveitamentoMercadoDivisao}
                        onChange={handleInputChange}
                        placeholder="Analise o aproveitamento do mercado"
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="conclusaoParcelamento">9.5. Conclusão sobre o parcelamento ou não da solução</Label>
                      <Textarea
                        id="conclusaoParcelamento"
                        name="conclusaoParcelamento"
                        value={formData.conclusaoParcelamento}
                        onChange={handleInputChange}
                        placeholder="Conclua sobre o parcelamento"
                        rows={3}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* 10. Contratações Correlatas */}
                <Card id="correlatas">
                  <CardHeader>
                    <CardTitle className="text-xl">10. Contratações Correlatas e/ou Interdependentes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="contratacoesCorrelatas">Descrição das contratações correlatas e/ou interdependentes</Label>
                      <Textarea
                        id="contratacoesCorrelatas"
                        name="contratacoesCorrelatas"
                        value={formData.contratacoesCorrelatas}
                        onChange={handleInputChange}
                        placeholder="Descreva as contratações correlatas"
                        rows={4}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* 11. Alinhamento Planejamento */}
                <Card id="alinhamento">
                  <CardHeader>
                    <CardTitle className="text-xl">11. Alinhamento entre a Contratação e o Planejamento</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="perspectivaProcessos">11.1. A qual Perspectiva de Processos a aquisição está alinhada?</Label>
                      <Textarea
                        id="perspectivaProcessos"
                        name="perspectivaProcessos"
                        value={formData.perspectivaProcessos}
                        onChange={handleInputChange}
                        placeholder="Informe a perspectiva de processos"
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="identificadorDespesa">11.2. A qual Identificador de Despesa está vinculada a aquisição?</Label>
                      <Textarea
                        id="identificadorDespesa"
                        name="identificadorDespesa"
                        value={formData.identificadorDespesa}
                        onChange={handleInputChange}
                        placeholder="Informe o identificador de despesa"
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="alinhamentoPDL">11.3. Alinhamento ao Plano Diretor de Logística Sustentável</Label>
                      <Textarea
                        id="alinhamentoPDL"
                        name="alinhamentoPDL"
                        value={formData.alinhamentoPDL}
                        onChange={handleInputChange}
                        placeholder="Descreva o alinhamento ao PDL"
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="alinhamentoNormas">11.4. Alinhamento as Normas Internas e de Órgãos Externos</Label>
                      <Textarea
                        id="alinhamentoNormas"
                        name="alinhamentoNormas"
                        value={formData.alinhamentoNormas}
                        onChange={handleInputChange}
                        placeholder="Descreva o alinhamento às normas"
                        rows={3}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* 12. Benefícios */}
                <Card id="beneficios">
                  <CardHeader>
                    <CardTitle className="text-xl">12. Benefícios a serem Alcançados com a Contratação</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="beneficiosContratacao">Descrição dos benefícios esperados</Label>
                      <Textarea
                        id="beneficiosContratacao"
                        name="beneficiosContratacao"
                        value={formData.beneficiosContratacao}
                        onChange={handleInputChange}
                        placeholder="Descreva os benefícios esperados"
                        rows={4}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* 13. Providências */}
                <Card id="providencias">
                  <CardHeader>
                    <CardTitle className="text-xl">13. Providências a serem Adotadas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="providenciasAdotar">Descrição das providências necessárias</Label>
                      <Textarea
                        id="providenciasAdotar"
                        name="providenciasAdotar"
                        value={formData.providenciasAdotar}
                        onChange={handleInputChange}
                        placeholder="Descreva as providências necessárias"
                        rows={4}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* 14. Impactos Ambientais */}
                <Card id="ambientais">
                  <CardHeader>
                    <CardTitle className="text-xl">14. Possíveis Impactos Ambientais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="impactosAmbientais">Descrição dos possíveis impactos ambientais</Label>
                      <Textarea
                        id="impactosAmbientais"
                        name="impactosAmbientais"
                        value={formData.impactosAmbientais}
                        onChange={handleInputChange}
                        placeholder="Descreva os possíveis impactos ambientais"
                        rows={4}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* 15. Declaração de Viabilidade */}
                <Card id="viabilidade">
                  <CardHeader>
                    <CardTitle className="text-xl">15. Declaração de Viabilidade</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="justificativaViabilidade">15.1. Justificativa da Viabilidade</Label>
                      <Textarea
                        id="justificativaViabilidade"
                        name="justificativaViabilidade"
                        value={formData.justificativaViabilidade}
                        onChange={handleInputChange}
                        placeholder="Descreva a justificativa da viabilidade"
                        rows={4}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDFD;