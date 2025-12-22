import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Wand2, Copy, Check, RefreshCw, AlertTriangle } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { aiService } from "@/lib/ai-service";
import { useSecurity } from "@/hooks/use-security";

interface AITextImproverProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  context?: string;
  maxLength?: number;
  disabled?: boolean;
}

export const AITextImprover = ({ 
  value, 
  onChange, 
  placeholder, 
  label, 
  context = "licitação",
  maxLength = 2000,
  disabled = false
}: AITextImproverProps) => {
  const [isImproving, setIsImproving] = useState(false);
  const [improvedText, setImprovedText] = useState("");
  const [showImproved, setShowImproved] = useState(false);
  const [copied, setCopied] = useState(false);
  const { canMakeRequest } = useSecurity();

  const handleImproveText = async () => {
    if (!value.trim()) {
      showError("Por favor, escreva um texto antes de solicitar melhoria.");
      return;
    }

    if (!canMakeRequest()) {
      showError("Limite de requisições excedido. Por favor, aguarde antes de tentar novamente.");
      return;
    }

    setIsImproving(true);
    setShowImproved(false);

    try {
      const response = await aiService.improveText({
        text: value,
        context: context
      });

      if (response.success && response.improvedText) {
        setImprovedText(response.improvedText);
        setShowImproved(true);
        showSuccess("Texto melhorado com sucesso!");
      } else {
        showError(response.error || "Falha ao melhorar texto");
      }
    } catch (error) {
      showError("Erro ao processar solicitação. Tente novamente.");
    } finally {
      setIsImproving(false);
    }
  };

  const handleAcceptImproved = () => {
    onChange(improvedText);
    setShowImproved(false);
    showSuccess("Texto atualizado!");
  };

  const handleCopyImproved = async () => {
    try {
      await navigator.clipboard.writeText(improvedText);
      setCopied(true);
      showSuccess("Texto copiado!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      showError("Falha ao copiar texto");
    }
  };

  const handleRejectImproved = () => {
    setShowImproved(false);
    setImprovedText("");
  };

  return (
    <div className="space-y-4">
      {/* Original Text Input */}
      <div className="space-y-2">
        {label && <label className="text-sm font-medium">{label}</label>}
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          maxLength={maxLength}
          disabled={disabled || isImproving}
          className="resize-none"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {value.length}/{maxLength} caracteres
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleImproveText}
            disabled={!value.trim() || isImproving || !canMakeRequest()}
            className="flex items-center gap-2"
          >
            <Wand2 className="w-4 h-4" />
            {isImproving ? "Melhorando..." : "Melhorar com IA"}
          </Button>
        </div>
      </div>

      {/* Improved Text Display */}
      {showImproved && improvedText && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-green-600" />
                <CardTitle className="text-lg text-green-800">Texto Melhorado</CardTitle>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  Sugestão de IA
                </Badge>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRejectImproved}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </Button>
            </div>
            <CardDescription className="text-green-700">
              Revise o texto melhorado abaixo. Você pode aceitar, copiar ou rejeitar a sugestão.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                {improvedText}
              </pre>
            </div>
            
            <Separator />
            
            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={handleAcceptImproved}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <Check className="w-4 h-4" />
                Aceitar
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleCopyImproved}
                className="flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copiado!" : "Copiar"}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleImproveImproved}
                disabled={isImproving}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Tentar Novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rate Limit Warning */}
      {!canMakeRequest() && (
        <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-yellow-600" />
          <span className="text-sm text-yellow-700">
            Limite de requisições atingido. Aguarde um momento antes de tentar novamente.
          </span>
        </div>
      )}
    </div>
  );
};