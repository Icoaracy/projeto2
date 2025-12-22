import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye, Copy } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";

interface FormTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  data: any;
  isDefault?: boolean;
}

interface FormTemplatesProps {
  onApplyTemplate: (template: FormTemplate) => void;
  currentData?: any;
}

const defaultTemplates: FormTemplate[] = [
  {
    id: 'servicos-ti',
    name: 'Serviços de TI',
    description: 'Template para contratação de serviços de tecnologia da informação',
    category: 'TI',
    isDefault: true,
    data: {
      objetoAquisicao: 'Contratação de empresa especializada em prestação de serviços de tecnologia da informação, incluindo desenvolvimento, manutenção e suporte de sistemas.',
      origemNecessidade: 'Necessidade identificada durante análise de capacidade técnica interna e demanda crescente por soluções digitais.',
      localAplicacao: 'Departamento de Tecnologia da Informação e unidades administrativas.',
      fundamentoLegal: 'Lei nº 14.133/2021 - Lei de Licitações e Contratos Administrativos.',
      areaRequisitante: 'Departamento de Tecnologia da Informação',
      opcaoExecucaoIndireta: 'A execução indireta justifica-se pela especialização técnica requerida e pela ausência de capacidade interna para atender à demanda.',
      opcaoRegimeExecucao: 'Regime de execução contínua, considerando a natureza contínua dos serviços de TI.',
      essencialidadeObjeto: 'Os serviços são essenciais para manutenção das operações digitais e modernização dos processos administrativos.',
      requisitosGerais: 'Empresa com comprovada experiência em serviços de TI, equipe técnica qualificada e certificações relevantes.',
      criteriosSustentabilidade: 'Preferência para soluções que otimizem consumo de energia e utilizem práticas de TI verde.',
      descricaoSolucao: 'Solução integrada de serviços de TI abrangendo desenvolvimento, manutenção, suporte técnico e consultoria especializada.',
      metodoLevantamentoQuantidades: 'Análise histórica de demandas e projeção baseada em plano de expansão digital.',
      resultadoLevantamento: 'Estimativa de 1.680 horas/mês de serviços especializados.',
      compatibilidadeQuantidades: 'Quantidades compatíveis com a demanda atual e projeções de crescimento.',
      memoriaCalculo: 'Cálculo baseado em histórico dos últimos 12 meses, acrescido de 20% para contingências.',
      valorTotalEstimacao: 'R$ 480.000,00 (anual)',
      metodosLevantamentoPrecos: 'Pesquisa de mercado com 3 fornecedores, tabela SINAPI e contratos similares.',
      precosDentroMercado: 'Preços dentro da margem de mercado, conforme análise comparativa.',
      conclusaoParcelamento: 'Não há viabilidade técnica ou econômica no parcelamento da solução.',
      perspectivaProcessos: 'Perspectiva de Processos: Operações e Suporte a Serviços.',
      identificadorDespesa: 'ID-2024-TI-001',
      alinhamentoPDL: 'Alinhado ao PDL através da otimização de recursos e redução de impacto ambiental.',
      beneficiosContratacao: 'Modernização dos processos, aumento da eficiência operacional e redução de custos a longo prazo.',
      providenciasAdotar: 'Preparação de edital, definição de critérios técnicos e estruturação do contrato.',
      impactosAmbientais: 'Redução de consumo de papel através de digitalização de processos.',
      justificativaViabilidade: 'Contratação economicamente viável, com retorno garantido através de ganhos de eficiência.',
      equipePlanejamento: 'Equipe composta por analistas de TI, gestores de contratos e especialistas em licitações.'
    }
  },
  {
    id: 'consultoria',
    name: 'Consultoria Especializada',
    description: 'Template para contratação de serviços de consultoria',
    category: 'Consultoria',
    data: {
      objetoAquisicao: 'Prestação de serviços de consultoria especializada em análise e otimização de processos organizacionais.',
      origemNecessidade: 'Identificada necessidade de especialização técnica para reestruturação de processos internos.',
      localAplicacao: 'Todas as unidades administrativas da organização.',
      fundamentoLegal: 'Lei nº 14.133/2021 e Decreto regulamentador.',
      areaRequisitante: 'Departamento de Planejamento Estratégico',
      opcaoExecucaoIndireta: 'Execução indireta necessária devido à especialização requerida e objetividade da análise.',
      opcaoRegimeExecucao: 'Regime por escopo, com entregas definidas em fases.',
      essencialidadeObjeto: 'Essencial para modernização administrativa e alcance de metas estratégicas.',
      requisitosGerais: 'Consultores com experiência comprovada em reestruturação organizacional e certificações relevantes.',
      criteriosSustentabilidade: 'Preferência para metodologias que reduzam desperdícios e otimizem recursos.',
      descricaoSolucao: 'Consultoria completa abrangendo diagnóstico, planejamento, implementação e acompanhamento de melhorias.',
      metodoLevantamentoQuantidades: 'Análise de escopo baseada em complexidade organizacional e número de unidades.',
      resultadoLevantamento: 'Estimativa de 480 horas de consultoria especializada.',
      compatibilidadeQuantidades: 'Quantidades adequadas ao escopo definido e objetivos pretendidos.',
      memoriaCalculo: 'Cálculo baseado em metodologia padrão de consultoria e complexidade identificada.',
      valorTotalEstimacao: 'R$ 240.000,00',
      metodosLevantamentoPrecos: 'Tabela CBIC, pesquisa com 5 consultorias e contratos similares.',
      precosDentroMercado: 'Valores compatíveis com praticas de mercado para consultoria especializada.',
      conclusaoParcelamento: 'Solução não parcelável devido à necessidade de abordagem integrada.',
      perspectivaProcessos: 'Perspectiva de Processos: Planejamento e Estratégia.',
      identificadorDespesa: 'ID-2024-CONS-001',
      alinhamentoPDL: 'Contribui para sustentabilidade através da otimização de processos e recursos.',
      beneficiosContratacao: 'Melhoria da eficiência organizacional, redução de custos e alcance de metas estratégicas.',
      providenciasAdotar: 'Definição de escopo detalhado, seleção de consultoria e estruturação de acompanhamento.',
      impactosAmbientais: 'Redução de consumo através de otimização de processos e digitalização.',
      justificativaViabilidade: 'Relação custo-benefício favorável com retorno garantido em eficiência.',
      equipePlanejamento: 'Equipe multidisciplinar com especialistas em gestão, finanças e processos.'
    }
  },
  {
    id: 'equipamentos',
    name: 'Equipamentos de Informática',
    description: 'Template para aquisição de equipamentos de TI',
    category: 'Equipamentos',
    data: {
      objetoAquisicao: 'Aquisição de equipamentos de informática para renovação do parque tecnológico.',
      origemNecessidade: 'Obsolescência dos equipamentos atuais e necessidade de modernização tecnológica.',
      localAplicacao: 'Todos os setores da organização.',
      fundamentoLegal: 'Lei nº 14.133/2021 e normativas de aquisição de bens.',
      areaRequisitante: 'Departamento de Tecnologia da Informação',
      opcaoExecucaoIndireta: 'Aquisição de bens no mercado, conforme padrões estabelecidos.',
      opcaoRegimeExecucao: 'Execução por fornecimento único, com garantia e suporte técnico.',
      essencialidadeObjeto: 'Equipamentos essenciais para operacionalização das atividades administrativas.',
      requisitosGerais: 'Equipamentos novos, com garantia mínima de 12 meses e especificações técnicas compatíveis.',
      criteriosSustentabilidade: 'Preferência para equipamentos com selo de eficiência energética e certificações ambientais.',
      descricaoSolucao: 'Fornecimento de computadores, monitores e periféricos com configurações padronizadas.',
      metodoLevantamentoQuantidades: 'Levantamento baseado no número de funcionários e necessidades operacionais.',
      resultadoLevantamento: '50 computadores, 50 monitores e 50 conjuntos de periféricos.',
      compatibilidadeQuantidades: 'Quantidades compatíveis com o quadro funcional e necessidades identificadas.',
      memoriaCalculo: 'Cálculo baseado em inventário atual e projeção de expansão.',
      valorTotalEstimacao: 'R$ 150.000,00',
      metodosLevantamentoPrecos: 'Pesquisa em 3 fornecedores, tabela de preços de referência e contratos anteriores.',
      precosDentroMercado: 'Preços dentro da média de mercado para equipamentos com as especificações requeridas.',
      conclusaoParcelamento: 'Não há vantagem no parcelamento devido à necessidade de padronização.',
      perspectivaProcessos: 'Perspectiva de Processos: Operações e Infraestrutura.',
      identificadorDespesa: 'ID-2024-EQ-001',
      alinhamentoPDL: 'Equipamentos com eficiência energética e menor impacto ambiental.',
      beneficiosContratacao: 'Modernização tecnológica, aumento da produtividade e redução de custos de manutenção.',
      providenciasAdotar: 'Especificação técnica detalhada, pesquisa de mercado e definição de critérios de avaliação.',
      impactosAmbientais: 'Redução de consumo energético e descarte adequado dos equipamentos obsoletos.',
      justificativaViabilidade: 'Investimento necessário para manutenção da operacionalidade e modernização.',
      equipePlanejamento: 'Equipe técnica de TI, gestores de compras e especialistas em especificações.'
    }
  }
];

export const FormTemplates = ({ onApplyTemplate, currentData }: FormTemplatesProps) => {
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(null);
  const [templates] = useState<FormTemplate[]>(defaultTemplates);

  const handleApplyTemplate = (template: FormTemplate) => {
    try {
      onApplyTemplate(template);
      showSuccess(`Template "${template.name}" aplicado com sucesso!`);
      setOpen(false);
    } catch (error) {
      showError('Erro ao aplicar template');
    }
  };

  const handlePreviewTemplate = (template: FormTemplate) => {
    setSelectedTemplate(template);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'TI': return 'bg-blue-100 text-blue-800';
      case 'Consultoria': return 'bg-purple-100 text-purple-800';
      case 'Equipamentos': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Usar Template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Templates de Formulário</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      {template.isDefault && (
                        <Badge variant="secondary">Padrão</Badge>
                      )}
                    </div>
                    <Badge className={getCategoryColor(template.category)}>
                      {template.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreviewTemplate(template)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      Visualizar
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApplyTemplate(template)}
                      className="flex items-center gap-1"
                    >
                      <Copy className="w-4 h-4" />
                      Aplicar
                    </Button>
                  </div>
                </div>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Preview Dialog */}
        {selectedTemplate && (
          <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Visualizar Template: {selectedTemplate.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Objeto da Aquisição:</h4>
                  <p className="text-sm text-gray-700">{selectedTemplate.data.objetoAquisicao}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Origem da Necessidade:</h4>
                  <p className="text-sm text-gray-700">{selectedTemplate.data.origemNecessidade}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Descrição da Solução:</h4>
                  <p className="text-sm text-gray-700">{selectedTemplate.data.descricaoSolucao}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Valor Estimado:</h4>
                  <p className="text-sm text-gray-700">{selectedTemplate.data.valorTotalEstimacao}</p>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                    Fechar
                  </Button>
                  <Button onClick={() => {
                    handleApplyTemplate(selectedTemplate);
                    setSelectedTemplate(null);
                  }}>
                    Aplicar Template
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
};