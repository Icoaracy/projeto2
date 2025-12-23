import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Wand2, Copy, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { showSuccess, showError, showInfo } from "@/utils/toast";
import { apiClient } from "@/lib/api";

interface TextImprovementAssistantProps {
  originalText: string;
  context?: string;
  onTextImproved: (improvedText: string) => void;
}

export const TextImprovementAssistant = ({ originalText, context, onTextImproved }: TextImprovementAssistantProps) => {
  const [open, setOpen] = useState(false);
  const [improvedText, setImprovedText] = useState("");
  const [isImproving, setIsImproving] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [improvementCount, setImprovementCount] = useState(0);

  const handleImproveText = async () => {
    if (!originalText.trim()) {
      showError("Por favor, forneça um texto para melhorar");
      return;
    }

    setIsImproving(true);
    setImprovedText("");

    try {
      const response = await apiClient.post('/api/improve-text', {
        text: originalText,
        context: context || ""
      });

      if (response.success && response.improvedText) {
        setImprovedText(response.improvedText);
        setImprovementCount(prev => prev + 1);
        showSuccess("Texto melhorado com sucesso!");
      } else {
        throw new Error("Falha ao melhorar texto");
      }
    } catch (error) {
      console.error('Error improving text:', error);
      showError("Erro ao melhorar texto. Por favor, tente novamente.");
    } finally {
      setIsImproving(false);
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(improvedText);
      setHasCopied(true);
      showSuccess("Texto copiado para a área de transferência!");
      
      setTimeout(() => {
        setHasCopied(false);
      }, 2000);
    } catch (error) {
      showError("Erro ao copiar texto");
    }
  };

  const handleApplyText = () => {
    if (improvedText.trim()) {
      onTextImproved(improvedText);
      showSuccess("Texto aplicado com sucesso!");
      setOpen(false);
    }
  };

  const getTextImprovements = () => {
    if (!improvedText || !originalText) return [];

    const improvements = [];
    
    // Check for capitalization improvements
    if (improvedText !== originalText) {
      improvements.push({
        type: "capitalization",
        description: "Melhoria na capitalização e formatação"
      });
    }

    // Check for length changes
    if (improvedText.length !== originalText.length) {
      improvements.push({
        type: "length",
        description: `Ajuste de comprimento (${Math.abs(improvedText.length - originalText.length)} caracteres)`
      });
    }

    // Check for context-specific improvements
    if (context && context.includes('licitação')) {
      improvements.push({
        type: "context",
        description: "Adaptação para contexto licitatório"
      });
    }

    return improvements;
  };

  const improvements = getTextImprovements();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Wand2 className="w-4 h-4" />
          Melhorar Texto
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assistente de Melhoria de Texto</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Original Text */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                Texto Original
                <Badge variant="secondary">{originalText.length} caracteres</Badge>
              </CardTitle>
              <CardDescription>
                Texto fornecido para melhoria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {originalText || "Nenhum texto fornecido"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Context Information */}
          {context && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Contexto</CardTitle>
                <CardDescription>
                  Informações de contexto para melhoria personalizada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-700">{context}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              onClick={handleImproveText}
              disabled={isImproving || !originalText.trim()}
              className="flex items-center gap-2"
            >
              {isImproving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Melhorando...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  Melhorar Texto
                </>
              )}
            </Button>
            
            {improvedText && (
              <>
                <Button 
                  variant="outline"
                  onClick={handleCopyText}
                  className="flex items-center gap-2"
                >
                  {hasCopied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copiar
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={handleApplyText}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Aplicar Texto
                </Button>
              </>
            )}
          </div>

          {/* Improved Text */}
          {improvedText && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  Texto Melhorado
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    {improvementCount > 0 ? `${improvementCount}ª melhoria` : "Novo"}
                  </Badge>
                  <Badge variant="secondary">{improvedText.length} caracteres</Badge>
                </CardTitle>
                <CardDescription>
                  Texto otimizado com inteligência artificial
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {improvedText}
                  </p>
                </div>
                
                {/* Improvements Summary */}
                {improvements.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-sm text-blue-800 mb-2">Melhorias Aplicadas:</h4>
                    <div className="space-y-1">
                      {improvements.map((improvement, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-blue-700">
                          <CheckCircle2 className="w-3 h-3" />
                          {improvement.description}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Usage Tips */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                Dicas de Uso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Forneça contexto</p>
                  <p className="text-xs text-gray-600">Informações de contexto ajudam a personalizar as melhorias</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Revise sempre</p>
                  <p className="text-xs text-gray-600">Verifique se as melhorias mantêm o sentido original</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Use com moderação</p>
                  <p className="text-xs text-gray-600">Melhorias excessivas podem alterar o estilo pessoal</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};