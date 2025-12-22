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