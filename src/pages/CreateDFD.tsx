import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, FileText, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "@/utils/toast";
import jsPDF from "jspdf";

const CreateDFD = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // 1. Informações Básicas
    numeroProcesso: "",
    
    // 2. Descrição da Necessidade
    objetoAquisicao: "",
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
    valorTotalEstimativa: "",
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

  const generatePDFContent = () => {
    let content = "";
    
    // Helper function to add section
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
      { label: "1.1. Número do Processo Administrativo:", value: formData.numeroProcesso }
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
      { label: "8.1. Valor Total da Estimativa:", value: formData.valorTotalEstimativa },
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

  const saveAsPDF = async () => {
    if (!formData.numeroProcesso.trim()) {
      showError("Por favor, informe o número do processo antes de salvar.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate PDF content
      const content = generatePDFContent();
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Set font
      pdf.setFont("helvetica");
      pdf.setFontSize(10);

      // Add content to PDF
      const lines = pdf.splitTextToSize(content, 180);
      let y = 20;
      
      lines.forEach((line: string) => {
        if (y > 270) {
          pdf.addPage();
          y = 20;
        }
        pdf.text(line, 15, y);
        y += 5;
      });

      // Generate filename
      const processNumber = formData.numeroProcesso.replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `DFD_${processNumber}.pdf`;

      // Save PDF
      pdf.save(filename);
      
      showSuccess(`PDF "${filename}" salvo com sucesso!`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      showError("Erro ao gerar PDF. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <section className="py-8 px-4 border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/create-artifact")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Diagrama de Fluxo de Dados (DFD)</h1>
              <p className="text-gray-600">Formulário completo para análise de fluxo de dados do processo licitatório</p>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={(e) => { e.preventDefault(); saveAsPDF(); }} className="space-y-8">
            {/* 1. Informações Básicas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">1. Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="numeroProcesso">1.1. Número do Processo Administrativo</Label>
                  <Input
                    id="numeroProcesso"
                    name="numeroProcesso"
                    value={formData.numeroProcesso}
                    onChange={handleInputChange}
                    placeholder="Informe o número do processo"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* 2. Descrição da Necessidade */}
            <Card>
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
                    placeholder="Descreva o objeto da aquisição"
                    rows={3}
                    required
                  />
                </div>
                
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
            <Card>
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

            {/* 4. Descrição dos Requisitos da Contratação */}
            <Card>
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
                
                <div className="space-y-4">
                  <Label>4.4. Dos Requisitos</Label>
                  
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
                    <Label>4.4.2. Específicos</Label>
                    
                    <div className="space-y-2 pl-4">
                      <div className="space-y-2">
                        <Label htmlFor="niveisQualidade">4.4.2.1. Os níveis de qualidade do serviço ou produto</Label>
                        <Textarea
                          id="niveisQualidade"
                          value={formData.requisitosEspecificos.niveisQualidade}
                          onChange={(e) => handleNestedInputChange('requisitosEspecificos', 'niveisQualidade', e.target.value)}
                          placeholder="Descreva os níveis de qualidade"
                          rows={2}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="legislacaoPertinente">4.4.2.2. A Legislação pertinente</Label>
                        <Textarea
                          id="legislacaoPertinente"
                          value={formData.requisitosEspecificos.legislacaoPertinente}
                          onChange={(e) => handleNestedInputChange('requisitosEspecificos', 'legislacaoPertinente', e.target.value)}
                          placeholder="Descreva a legislação pertinente"
                          rows={2}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="normasTecnicas">4.4.2.3. As normas técnicas</Label>
                        <Textarea
                          id="normasTecnicas"
                          value={formData.requisitosEspecificos.normasTecnicas}
                          onChange={(e) => handleNestedInputChange('requisitosEspecificos', 'normasTecnicas', e.target.value)}
                          placeholder="Descreva as normas técnicas"
                          rows={2}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="requisitosTemporais">4.4.2.4. Os requisitos temporais</Label>
                        <Textarea
                          id="requisitosTemporais"
                          value={formData.requisitosEspecificos.requisitosTemporais}
                          onChange={(e) => handleNestedInputChange('requisitosEspecificos', 'requisitosTemporais', e.target.value)}
                          placeholder="Descreva os requisitos temporais"
                          rows={2}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="requisitosGarantia">4.4.2.5. Os requisitos de garantia e assistência técnica</Label>
                        <Textarea
                          id="requisitosGarantia"
                          value={formData.requisitosEspecificos.requisitosGarantia}
                          onChange={(e) => handleNestedInputChange('requisitosEspecificos', 'requisitosGarantia', e.target.value)}
                          placeholder="Descreva os requisitos de garantia e assistência técnica"
                          rows={2}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="fornecimentoAssociado">4.4.2.6. A necessidade de contratação do fornecimento associado ao serviço</Label>
                        <Textarea
                          id="fornecimentoAssociado"
                          value={formData.requisitosEspecificos.fornecimentoAssociado}
                          onChange={(e) => handleNestedInputChange('requisitosEspecificos', 'fornecimentoAssociado', e.target.value)}
                          placeholder="Descreva a necessidade de fornecimento associado"
                          rows={2}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="criteriosSustentabilidade">4.5. Critérios e práticas de sustentabilidade</Label>
                  <Textarea
                    id="criteriosSustentabilidade"
                    name="criteriosSustentabilidade"
                    value={formData.criteriosSustentabilidade}
                    onChange={handleInputChange}
                    placeholder="Descreva os critérios e práticas de sustentabilidade"
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
                    placeholder="Descreva a avaliação da duração inicial do contrato"
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
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">5. Levantamento de Mercado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Alternativa 1 */}
                <div className="space-y-4">
                  <Label>5.1. Alternativa 01</Label>
                  <div className="space-y-2 pl-4">
                    <div className="space-y-2">
                      <Label htmlFor="alt1Descricao">5.1.1. Descrição</Label>
                      <Textarea
                        id="alt1Descricao"
                        value={formData.alternativa1.descricao}
                        onChange={(e) => handleNestedInputChange('alternativa1', 'descricao', e.target.value)}
                        placeholder="Descreva a alternativa 1"
                        rows={2}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="alt1Positivos">5.1.2. Pontos Positivos</Label>
                      <Textarea
                        id="alt1Positivos"
                        value={formData.alternativa1.pontosPositivos}
                        onChange={(e) => handleNestedInputChange('alternativa1', 'pontosPositivos', e.target.value)}
                        placeholder="Descreva os pontos positivos"
                        rows={2}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="alt1Negativos">5.1.3. Pontos Negativos</Label>
                      <Textarea
                        id="alt1Negativos"
                        value={formData.alternativa1.pontosNegativos}
                        onChange={(e) => handleNestedInputChange('alternativa1', 'pontosNegativos', e.target.value)}
                        placeholder="Descreva os pontos negativos"
                        rows={2}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                {/* Alternativa 2 */}
                <div className="space-y-4">
                  <Label>5.2. Alternativa 02</Label>
                  <div className="space-y-2 pl-4">
                    <div className="space-y-2">
                      <Label htmlFor="alt2Descricao">5.2.1. Descrição</Label>
                      <Textarea
                        id="alt2Descricao"
                        value={formData.alternativa2.descricao}
                        onChange={(e) => handleNestedInputChange('alternativa2', 'descricao', e.target.value)}
                        placeholder="Descreva a alternativa 2"
                        rows={2}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="alt2Positivos">5.2.2. Pontos Positivos</Label>
                      <Textarea
                        id="alt2Positivos"
                        value={formData.alternativa2.pontosPositivos}
                        onChange={(e) => handleNestedInputChange('alternativa2', 'pontosPositivos', e.target.value)}
                        placeholder="Descreva os pontos positivos"
                        rows={2}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="alt2Negativos">5.2.3. Pontos Negativos</Label>
                      <Textarea
                        id="alt2Negativos"
                        value={formData.alternativa2.pontosNegativos}
                        onChange={(e) => handleNestedInputChange('alternativa2', 'pontosNegativos', e.target.value)}
                        placeholder="Descreva os pontos negativos"
                        rows={2}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                {/* Alternativa 3 */}
                <div className="space-y-4">
                  <Label>5.3. Alternativa 03</Label>
                  <div className="space-y-2 pl-4">
                    <div className="space-y-2">
                      <Label htmlFor="alt3Descricao">5.3.1. Descrição</Label>
                      <Textarea
                        id="alt3Descricao"
                        value={formData.alternativa3.descricao}
                        onChange={(e) => handleNestedInputChange('alternativa3', 'descricao', e.target.value)}
                        placeholder="Descreva a alternativa 3"
                        rows={2}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="alt3Positivos">5.3.2. Pontos Positivos</Label>
                      <Textarea
                        id="alt3Positivos"
                        value={formData.alternativa3.pontosPositivos}
                        onChange={(e) => handleNestedInputChange('alternativa3', 'pontosPositivos', e.target.value)}
                        placeholder="Descreva os pontos positivos"
                        rows={2}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="alt3Negativos">5.3.3. Pontos Negativos</Label>
                      <Textarea
                        id="alt3Negativos"
                        value={formData.alternativa3.pontosNegativos}
                        onChange={(e) => handleNestedInputChange('alternativa3', 'pontosNegativos', e.target.value)}
                        placeholder="Descreva os pontos negativos"
                        rows={2}
                        required
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
                    placeholder="Descreva a justificativa da alternativa escolhida"
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

            {/* 6. Descrição da solução como um todo */}
            <Card>
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

            {/* 7. Estimativa das Quantidades */}
            <Card>
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
                    placeholder="Descreva o método de levantamento"
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
                    placeholder="Descreva a compatibilidade"
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

            {/* 8. Estimativa do Valor */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">8. Estimativa do Valor da Contratação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="valorTotalEstimativa">8.1. Valor Total da Estimativa</Label>
                  <Input
                    id="valorTotalEstimativa"
                    name="valorTotalEstimativa"
                    value={formData.valorTotalEstimativa}
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

            {/* 9. Justificativa Parcelamento */}
            <Card>
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
                    placeholder="Conclusão final sobre o parcelamento"
                    rows={3}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* 10. Contratações Correlatas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">10. Contratações Correlatas e/ou Interdependentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contratacoesCorrelatas">Descreva as contratações correlatas e/ou interdependentes</Label>
                  <Textarea
                    id="contratacoesCorrelatas"
                    name="contratacoesCorrelatas"
                    value={formData.contratacoesCorrelatas}
                    onChange={handleInputChange}
                    placeholder="Descreva as contratações correlatas"
                    rows={3}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* 11. Alinhamento Planejamento */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">11. Alinhamento entre a Contratação e o Planejamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="perspectivaProcessos">11.1. A qual Perspectiva de Processos a aquisição está alinhada?</Label>
                  <Input
                    id="perspectivaProcessos"
                    name="perspectivaProcessos"
                    value={formData.perspectivaProcessos}
                    onChange={handleInputChange}
                    placeholder="Informe a perspectiva de processos"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="identificadorDespesa">11.2. A qual Identificador de Despesa está vinculada a aquisição?</Label>
                  <Input
                    id="identificadorDespesa"
                    name="identificadorDespesa"
                    value={formData.identificadorDespesa}
                    onChange={handleInputChange}
                    placeholder="Informe o identificador de despesa"
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
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">12. Benefícios a serem alcançados com a contratação?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="beneficiosContratacao">Descreva os benefícios esperados</Label>
                  <Textarea
                    id="beneficiosContratacao"
                    name="beneficiosContratacao"
                    value={formData.beneficiosContratacao}
                    onChange={handleInputChange}
                    placeholder="Descreva os benefícios a serem alcançados"
                    rows={3}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* 13. Providências */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">13. Providências a serem Adotadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="providenciasAdotar">Descreva as providências necessárias</Label>
                  <Textarea
                    id="providenciasAdotar"
                    name="providenciasAdotar"
                    value={formData.providenciasAdotar}
                    onChange={handleInputChange}
                    placeholder="Descreva as providências a serem adotadas"
                    rows={3}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* 14. Impactos Ambientais */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">14. Possíveis Impactos Ambientais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="impactosAmbientais">Descreva os possíveis impactos ambientais</Label>
                  <Textarea
                    id="impactosAmbientais"
                    name="impactosAmbientais"
                    value={formData.impactosAmbientais}
                    onChange={handleInputChange}
                    placeholder="Descreva os possíveis impactos ambientais"
                    rows={3}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* 15. Declaração de Viabilidade */}
            <Card>
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
                    rows={3}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* 16. Equipe de Planejamento */}
            <Card>
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
                disabled={isSubmitting}
              >
                <Download className="w-5 h-5 mr-2" />
                {isSubmitting ? "Gerando PDF..." : "Salvar DFD"}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default CreateDFD;