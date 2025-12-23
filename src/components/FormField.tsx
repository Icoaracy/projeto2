import { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info, CheckCircle2, Wand2 } from "lucide-react";
import { TextImprovementAssistant } from "./TextImprovementAssistant";

interface FormFieldProps {
  id: string;
  label: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'textarea' | 'number' | 'email';
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  disabled?: boolean;
  error?: string;
  warning?: string;
  info?: string;
  showCharacterCount?: boolean;
  showTextImprovement?: boolean;
  context?: string;
  className?: string;
}

export const FormField = ({
  id,
  label,
  description,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  maxLength,
  disabled = false,
  error,
  warning,
  info,
  showCharacterCount = false,
  showTextImprovement = false,
  context,
  className = ""
}: FormFieldProps) => {
  const handleTextImproved = (improvedText: string) => {
    onChange(improvedText);
  };

  const renderInput = () => {
    const commonProps = {
      id,
      value,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
        onChange(e.target.value),
      placeholder,
      maxLength,
      disabled,
      className: error ? "border-red-500" : warning ? "border-yellow-500" : ""
    };

    if (type === 'textarea') {
      return (
        <Textarea
          {...commonProps}
          rows={4}
        />
      );
    }

    return (
      <Input
        {...commonProps}
        type={type}
      />
    );
  };

  const getStatusIcon = () => {
    if (error) {
      return <AlertTriangle className="w-4 h-4 text-red-600" />;
    }
    if (warning) {
      return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    }
    if (info) {
      return <Info className="w-4 h-4 text-blue-600" />;
    }
    if (value && value.trim() && !error && !warning) {
      return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    }
    return null;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label and Status */}
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          {showTextImprovement && (
            <TextImprovementAssistant
              originalText={value}
              context={context}
              onTextImproved={handleTextImproved}
            />
          )}
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="text-xs text-gray-600">{description}</p>
      )}

      {/* Input */}
      {renderInput()}

      {/* Character Count */}
      {showCharacterCount && maxLength && (
        <div className="flex justify-between items-center">
          <div></div>
          <span className={`text-xs ${
            value.length > maxLength * 0.9 ? 'text-red-600' : 'text-gray-500'
          }`}>
            {value.length}/{maxLength} caracteres
          </span>
        </div>
      )}

      {/* Messages */}
      {(error || warning || info) && (
        <Alert className={`py-2 ${
          error ? 'bg-red-50 border-red-200' :
          warning ? 'bg-yellow-50 border-yellow-200' :
          'bg-blue-50 border-blue-200'
        }`}>
          {error && <AlertTriangle className="h-4 w-4 text-red-600" />}
          {warning && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
          {info && <Info className="h-4 w-4 text-blue-600" />}
          <AlertDescription className={`text-sm ${
            error ? 'text-red-800' :
            warning ? 'text-yellow-800' :
            'text-blue-800'
          }`}>
            {error || warning || info}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};