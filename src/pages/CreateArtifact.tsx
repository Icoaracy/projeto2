import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Target, Users, Shield, TrendingUp, Clock, CheckCircle, List } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateArtifact = () => {
  const navigate = useNavigate();

  const artifacts = [
    {
      id: "dfd",
      title: "DFD",
      description: "Diagrama de Fluxo de Dados",
      icon: <FileText className="w-8 h-8" />,
      color: "bg-blue-100 text-blue-600 hover:bg-blue-200"
    },
    {
      id: "iep",
      title: "IEP", 
      description: "Indicadores de Eficiência e Performance",
      icon: <Target className="w-8 h-8" />,
      color: "bg-green-100 text-green-600 hover:bg-green-200"
    },
    {
      id: "etp",
      title: "ETP",
      description: "Estrutura Técnica do Projeto",
      icon: <Users className="w-8 h-8" />,
      color: "bg-purple-100 text-purple-600 hover:bg-purple-200"
    },
    {
      id: "ipm",
      title: "IPM",
      description: "Indicadores de Performance de Mercado",
      icon: <TrendingUp className="w-8 h-8" />,
      color: "bg-orange-100 text-orange-600 hover:bg-orange-200"
    },
    {
      id: "ara",
      title: "ARA",
      description: "Análise de Riscos e Ameaças",
      icon: <Shield className="w-8 h-8" />,
      color: "bg-red-100 text-red-600 hover:bg-red-200"
    },
    {
      id: "tr",
      title: "TR",
      description: "Termo de Referência",
      icon: <Clock className="w-8 h-8" />,
      color: "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
    },
    {
      id: "ad",
      title: "AD",
      description: "Análise de Demanda",
      icon: <CheckCircle className="w-8 h-8" />,
      color: "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
    },
    {
      id: "edt",
      title: "EDT",
      description: "Estrutura Detalhada do Trabalho",
      icon: <List className="w-8 h-8" />,
      color: "bg-pink-100 text-pink-600 hover:bg-pink-200"
    }
  ];

  const handleArtifactClick = (artifactId: string) => {
    // TODO: Navigate to specific artifact creation page
    console.log(`Creating artifact: ${artifactId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <section className="py-12 px-4 border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Criação de Artefatos
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Selecione o tipo de artefato que deseja criar para sua licitação. 
            Cada artefato é projetado para atender requisitos específicos do processo licitatório.
          </p>
        </div>
      </section>

      {/* Artifacts Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {artifacts.map((artifact) => (
              <Card 
                key={artifact.id}
                className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-0 shadow-md"
                onClick={() => handleArtifactClick(artifact.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${artifact.color}`}>
                    {artifact.icon}
                  </div>
                  <CardTitle className="text-2xl font-bold">{artifact.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600">
                    {artifact.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-12 px-4 bg-blue-50 border-y border-blue-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">
            Precisa de Ajuda?
          </h2>
          <p className="text-blue-700 mb-6">
            Nossa equipe está disponível para ajudar você a escolher o artefato ideal 
            para sua necessidade específica de licitação.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Falar com Especialista
          </Button>
        </div>
      </section>
    </div>
  );
};

export default CreateArtifact;