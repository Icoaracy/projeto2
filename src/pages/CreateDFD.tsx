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

  // Add preview dialog component
  const PreviewDialog = () => {
    if (!showPreview) return null;
    
    const previewContent = generatePDFContent();
    
    return (
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Visualização do DFD</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">DIAGRAMA DE FLUXO DE DADOS (DFD)</h3>
              <div className="text-sm text-gray-600 mb-4">
                <p>Número do Processo: {formatProcessNumber(formData.numeroProcesso)}</p>
                <p>Data de Geração: {new Date().toLocaleDateString('pt-BR')}</p>
              </div>
              <div className="whitespace-pre-wrap text-sm font-mono bg-white p-4 rounded border">
                {previewContent}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Fechar
              </Button>
              <Button onClick={handleSaveAsPDF}>
                Gerar PDF
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

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
                autoSave={autoSave}
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
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2"
              >
                <EyeOff className="w-4 h-4" />
                Preview
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

      {/* Preview Dialog */}
      <PreviewDialog />
    </div>
  );