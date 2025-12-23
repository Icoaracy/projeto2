import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormField } from "./FormField";
import { Plus, Trash2, Copy, CheckCircle2 } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";

interface Alternative {
  id: string;
  descricao: string;
  pontosPositivos: string;
  pontosNegativos: string;
}

interface AlternativeSelectorProps {
  alternatives: Alternative[];
  onChange: (alternatives: Alternative[]) => void;
  maxAlternatives?: number;
}

export const AlternativeSelector = ({ 
  alternatives, 
  onChange, 
  maxAlternatives = 3 
}: AlternativeSelectorProps) => {
  const [activeTab, setActiveTab] = useState("0");

  const addAlternative = () => {
    if (alternatives.length >= maxAlternatives) {
      showError(`Máximo de ${maxAlternatives} alternativas permitido`);
      return;
    }

    const newAlternative: Alternative = {
      id: Date.now().toString(),
      descricao: "",
      pontosPositivos: "",
      pontosNegativos: ""
    };

    const newAlternatives = [...alternatives, newAlternative];
    onChange(newAlternatives);
    setActiveTab((newAlternatives.length - 1).toString());
    showSuccess("Alternativa adicionada!");
  };

  const removeAlternative = (id: string) => {
    if (alternatives.length <= 1) {
      showError("É necessário manter pelo menos uma alternativa");
      return;
    }

    const newAlternatives = alternatives.filter(alt => alt.id !== id);
    onChange(newAlternatives);
    
    // Adjust active tab if necessary
    const currentIndex = parseInt(activeTab);
    if (currentIndex >= newAlternatives.length) {
      setActiveTab((newAlternatives.length - 1).toString());
    }
    
    showSuccess("Alternativa removida!");
  };

  const duplicateAlternative = (alternative: Alternative) => {
    if (alternatives.length >= maxAlternatives) {
      showError(`Máximo de ${maxAlternatives} alternativas permitido`);
      return;
    }

    const duplicatedAlternative: Alternative = {
      ...alternative,
      id: Date.now().toString(),
      descricao: alternative.descricao + " (cópia)"
    };

    const newAlternatives = [...alternatives, duplicatedAlternative];
    onChange(newAlternatives);
    setActiveTab((newAlternatives.length - 1).toString());
    showSuccess("Alternativa duplicada!");
  };

  const updateAlternative = (id: string, field: keyof Alternative, value: string) => {
    const newAlternatives = alternatives.map(alt => 
      alt.id === id ? { ...alt, [field]: value } : alt
    );
    onChange(newAlternatives);
  };

  const getAlternativeStatus = (alternative: Alternative) => {
    const hasDescription = alternative.descricao.trim().length > 0;
    const hasPositives = alternative.pontosPositivos.trim().length > 0;
    const hasNegatives = alternative.pontosNegativos.trim().length > 0;

    if (hasDescription && hasPositives && hasNegatives) {
      return { complete: true, label: "Completa", variant: "default" as const };
    } else if (hasDescription) {
      return { complete: false, label: "Parcial", variant: "secondary" as const };
    } else {
      return { complete: false, label: "Vazia", variant: "outline" as const };
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Alternativas de Solução</CardTitle>
            <CardDescription>
              Analise e compare diferentes alternativas para a contratação
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {alternatives.length}/{maxAlternatives}
            </Badge>
            <Button
              onClick={addAlternative}
              size="sm"
              disabled={alternatives.length >= maxAlternatives}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Adicionar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            {alternatives.map((alternative, index) => {
              const status = getAlternativeStatus(alternative);
              return (
                <TabsTrigger 
                  key={alternative.id} 
                  value={index.toString()}
                  className="flex items-center gap-2"
                >
                  <span>Alternativa {index + 1}</span>
                  {status.complete && (
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {alternatives.map((alternative, index) => (
            <TabsContent key={alternative.id} value={index.toString()}>
              <div className="space-y-4">
                {/* Alternative Header */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">Alternativa {index + 1}</h3>
                    <Badge variant={getAlternativeStatus(alternative).variant}>
                      {getAlternativeStatus(alternative).label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => duplicateAlternative(alternative)}
                      className="flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      Duplicar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeAlternative(alternative.id)}
                      disabled={alternatives.length <= 1}
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Remover
                    </Button>
                  </div>
                </div>

                {/* Alternative Fields */}
                <div className="grid gap-4">
                  <FormField
                    id={`alternativa-${index}-descricao`}
                    label="Descrição da Alternativa"
                    value={alternative.descricao}
                    onChange={(value) => updateAlternative(alternative.id, 'descricao', value)}
                    type="textarea"
                    placeholder="Descreva detalhadamente esta alternativa de solução..."
                    required
                    showCharacterCount
                    maxLength={2000}
                    showTextImprovement
                    context="alternativa de contratação licitatória"
                  />

                  <FormField
                    id={`alternativa-${index}-positivos`}
                    label="Pontos Positivos"
                    value={alternative.pontosPositivos}
                    onChange={(value) => updateAlternative(alternative.id, 'pontosPositivos', value)}
                    type="textarea"
                    placeholder="Liste as vantagens e benefícios desta alternativa..."
                    showCharacterCount
                    maxLength={1000}
                    showTextImprovement
                    context="vantagens de solução licitatória"
                  />

                  <FormField
                    id={`alternativa-${index}-negativos`}
                    label="Pontos Negativos"
                    value={alternative.pontosNegativos}
                    onChange={(value) => updateAlternative(alternative.id, 'pontosNegativos', value)}
                    type="textarea"
                    placeholder="Liste as desvantagens e riscos desta alternativa..."
                    showCharacterCount
                    maxLength={1000}
                    showTextImprovement
                    context="riscos e desvantagens de solução licitatória"
                  />
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};