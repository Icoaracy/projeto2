import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormProgress } from "@/components/FormProgress";
import { KeyboardShortcutsHelp } from "@/components/KeyboardShortcutsHelp";
import { FormTemplates } from "@/components/FormTemplates";
import { DataManager } from "@/components/DataManager";
import { FormValidationSummary } from "@/components/FormValidationSummary";
import { useAutoSave } from "@/hooks/use-auto-save";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { validateForm, getFieldValidationIssues } from "@/lib/form-validation";
import { generateAdvancedPDF } from "@/lib/pdf-generator";
import { showSuccess, showError, showInfo } from "@/utils/toast";
import { useNavigate } from "react-router-dom";
import { Save, FileText, Download, Upload, CheckCircle2, AlertTriangle, Info } from "lucide-react";

// Utility functions
export const formatProcessNumber = (numero: string): string => {
  if (!numero || numero.length !== 17) return numero;
  
  const ano = numero.substring(0, 4);
  const justica = numero.substring(4, 6);
  const tribunal = numero.substring(6, 9);
  const vara = numero.substring(9, 13);
  const sequencial = numero.substring(13, 17);
  
  return `${ano}-${justica}.${tribunal}.${vara}.${sequencial}`;
};

export const validateProcessNumber = (numero: string): boolean => {
  if (!numero || numero.length !== 17 || !/^\d{17}$/.test(numero)) {
    return false;
  }
  
  // Simplified validation - in production, implement proper CNJ validation
  const ano = parseInt(numero.substring(0, 4));
  const currentYear = new Date().getFullYear();
  
  return ano >= 1900 && ano <= currentYear + 1;
};

const CreateDFD = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    numeroProcesso: "",
    objetoAquisicao: "",
    origemNecessidade: "",
    localAplicacao: "",
    fundamentoLegal: "",
    areaRequisitante: "",
    requisitante: "",
    opcaoExecucaoIndireta: "",
    opcaoRegimeExecucao: "",
    essencialidadeObjeto: "",
    requisitosGerais: "",
    criteriosSustentabilidade: "",
    descricaoSolucao: "",
    metodoLevantamentoQuantidades: "",
    resultadoLevantamento: "",
    compatibilidadeQuantidades: "",
    memoriaCalculo: "",
    valorTotalEstimacao: "",
    metodosLevantamentoPrecos: "",
    precosDentroMercado: "",
    conclusaoParcelamento: "",
    perspectivaProcessos: "",
    identificadorDespesa: "",
    alinhamentoPDL: "",
    beneficiosContratacao: "",
    providenciasAdotar: "",
    impactosAmbientais: "",
    justificativaViabilidade: "",
    equipePlanejamento: "",
    alternativa1: { descricao: "", pontosPositivos: "", pontosNegativos: "" },
    alternativa2: { descricao: "", pontosPositivos: "", pontosNegativos: "" },
    alternativa3: { descricao: "", pontosPositivos: "", pontosNegativos: "" }
  });

  const [currentSection, setCurrentSection] = useState("basic-info");
  const [validationIssues, setValidationIssues] = useState<any[]>([]);

  const autoSave = useAutoSave(formData, {
    interval: 30,
    storageKey: 'dfd-form-data'
  });

  // Form sections for progress tracking
  const sections = [
    { id: "basic-info", title: "Informações Básicas", isCompleted: false },
    { id: "necessidade", title: "Origem da Necessidade", isCompleted: false },
    { id: "solucao", title: "Descrição da Solução", isCompleted: false },
    { id: "estimativa", title: "Estimativa de Custos", isCompleted: false },
    { id: "alternativas", title: "Alternativas", isCompleted: false },
    { id: "conclusao", title: "Conclusão", isCompleted: false }
  ];

  // Keyboard shortcuts
  const shortcuts = [
    {
      keys: ['Ctrl', 'S'],
      handler: () => autoSave.forceSave(),
      description: 'Salvar formulário'
    },
    {
      keys: ['Ctrl', 'P'],
      handler: () => handleGeneratePDF(),
      description: 'Gerar PDF'
    },
    {
      keys: ['Ctrl', 'E'],
      handler: () => handleExportData(),
      description: 'Exportar dados'
    },
    {
      keys: ['Ctrl', 'I'],
      handler: () => handleImportData(),
      description: 'Importar dados'
    }
  ];

  useKeyboardShortcuts(shortcuts);

  // Update sections completion status
  useEffect(() => {
    const updatedSections = sections.map(section => ({
      ...section,
      isCompleted: isSectionCompleted(section.id)
    }));
    sections.splice(0, sections.length, ...updatedSections);
  }, [formData]);

  const isSectionCompleted = (sectionId: string): boolean => {
    switch (sectionId) {
      case "basic-info":
        return formData.numeroProcesso && formData.objetoAquisicao && formData.areaRequisitante;
      case "necessidade":
        return formData.origemNecessidade && formData.localAplicacao;
      case "solucao":
        return formData.descricaoSolucao && formData.requisitosGerais;
      case "estimativa":
        return formData.valorTotalEstimacao && formData.memoriaCalculo;
      case "alternativas":
        return formData.alternativa1.descricao || formData.alternativa2.descricao || formData.alternativa3.descricao;
      case "conclusao":
        return formData.justificativaViabilidade && formData.beneficiosContratacao;
      default:
        return false;
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAlternativaChange = (alternativa: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [`alternativa${alternativa}`]: {
        ...prev[`alternativa${alternativa}` as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleGeneratePDF = () => {
    try {
      const validation = validateForm(formData);
      if (!validation.isValid) {
        const issues = getFieldValidationIssues(validation);
        setValidationIssues(issues);
        showError("Por favor, corrija os erros antes de gerar o PDF");
        return;
      }

      const content = {
        "Informações Básicas": `Número do Processo: ${formatProcessNumber(formData.numeroProcesso)}\nObjeto: ${formData.objetoAquisicao}`,
        "Origem da Necessidade": formData.origemNecessidade,
        "Descrição da Solução": formData.descricaoSolucao,
        "Estimativa de Custos": `Valor: ${formData.valorTotalEstimacao}\nMemória: ${formData.memoriaCalculo}`,
        "Justificativa": formData.justificativaViabilidade
      };

      generateAdvancedPDF(content, formData);
      showSuccess("PDF gerado com sucesso!");
    } catch (error) {
      showError("Erro ao gerar PDF");
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
      showSuccess("Dados exportados com sucesso!");
    } catch (error) {
      showError("Erro ao exportar dados");
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
            showSuccess("Dados importados com sucesso!");
          } catch (error) {
            showError("Erro ao importar arquivo");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleLoadData = (data: any) => {
    setFormData(data);
  };

  const handleClearData = () => {
    setFormData({
      numeroProcesso: "",
      objetoAquisicao: "",
      origemNecessidade: "",
      localAplicacao: "",
      fundamentoLegal: "",
      areaRequisitante: "",
      requisitante: "",
      opcaoExecucaoIndireta: "",
      opcaoRegimeExecucao: "",
      essencialidadeObjeto: "",
      requisitosGerais: "",
      criteriosSustentabilidade: "",
      descricaoSolucao: "",
      metodoLevantamentoQuantidades: "",
      resultadoLevantamento: "",
      compatibilidadeQuantidades: "",
      memoriaCalculo: "",
      valorTotalEstimacao: "",
      metodosLevantamentoPrecos: "",
      precosDentroMercado: "",
      conclusaoParcelamento: "",
      perspectivaProcessos: "",
      identificadorDespesa: "",
      alinhamentoPDL: "",
      beneficiosContratacao: "",
      providenciasAdotar: "",
      impactosAmbientais: "",
      justificativaViabilidade: "",
      equipePlanejamento: "",
      alternativa1: { descricao: "", pontosPositivos: "", pontosNegativos: "" },
      alternativa2: { descricao: "", pontosPositivos: "", pontosNegativos: "" },
      alternativa3: { descricao: "", pontosPositivos: "", pontosNegativos: "" }
    });
  };

  const handleApplyTemplate = (template: any) => {
    setFormData(template.data);
    showSuccess("Template aplicado com sucesso!");
  };

  const handleValidateForm = () => {
    const validation = validateForm(formData);
    const issues = getFieldValidationIssues(validation);
    setValidationIssues(issues);
    
    if (validation.isValid) {
      showSuccess("Formulário validado com sucesso!");
    } else {
      showError("Foram encontrados erros no formulário");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Criar Diagrama de Fluxo de Dados</h1>
          <div className="flex gap-2">
            <KeyboardShortcutsHelp shortcuts={shortcuts} />
            <FormTemplates onApplyTemplate={handleApplyTemplate} />
            <DataManager 
              formData={formData} 
              onLoadData={handleLoadData}
              onClearData={handleClearData}
              autoSave={autoSave}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <FormProgress 
              sections={sections} 
              currentSection={currentSection}
              onSectionClick={setCurrentSection}
            />
          </div>

          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>Preencha os dados essenciais do processo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="numeroProcesso">Número do Processo</Label>
                  <Input
                    id="numeroProcesso"
                    value={formData.numeroProcesso}
                    onChange={(e) => handleInputChange('numeroProcesso', e.target.value)}
                    placeholder="00000000000000000"
                    maxLength={17}
                  />
                </div>

                <div>
                  <Label htmlFor="objetoAquisicao">Objeto da Aquisição</Label>
                  <Textarea
                    id="objetoAquisicao"
                    value={formData.objetoAquisicao}
                    onChange={(e) => handleInputChange('objetoAquisicao', e.target.value)}
                    placeholder="Descreva o objeto da aquisição"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="areaRequisitante">Área Requisitante</Label>
                  <Input
                    id="areaRequisitante"
                    value={formData.areaRequisitante}
                    onChange={(e) => handleInputChange('areaRequisitante', e.target.value)}
                    placeholder="Nome da área requisitante"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleValidateForm}>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Validar Formulário
                  </Button>
                  <Button onClick={handleGeneratePDF} variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Gerar PDF
                  </Button>
                  <Button onClick={autoSave.forceSave} variant="outline">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                </div>

                {validationIssues.length > 0 && (
                  <FormValidationSummary 
                    issues={validationIssues}
                    onFieldClick={(fieldId) => console.log('Navigate to field:', fieldId)}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDFD;