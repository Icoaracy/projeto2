import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, AlertTriangle } from "lucide-react";

interface FormSectionProps {
  id: string;
  title: string;
  description?: string;
  isCompleted?: boolean;
  hasErrors?: boolean;
  hasWarnings?: boolean;
  children: ReactNode;
  className?: string;
}

export const FormSection = ({ 
  id, 
  title, 
  description, 
  isCompleted = false, 
  hasErrors = false, 
  hasWarnings = false,
  children,
  className = ""
}: FormSectionProps) => {
  const getStatusIcon = () => {
    if (hasErrors) {
      return <AlertTriangle className="w-5 h-5 text-red-600" />;
    }
    if (hasWarnings) {
      return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    }
    if (isCompleted) {
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    }
    return <Circle className="w-5 h-5 text-gray-400" />;
  };

  const getStatusBadge = () => {
    if (hasErrors) {
      return <Badge variant="destructive">Com erros</Badge>;
    }
    if (hasWarnings) {
      return <Badge variant="secondary">Com avisos</Badge>;
    }
    if (isCompleted) {
      return <Badge className="bg-green-100 text-green-800">Completo</Badge>;
    }
    return <Badge variant="outline">Pendente</Badge>;
  };

  const getBorderColor = () => {
    if (hasErrors) return "border-red-200";
    if (hasWarnings) return "border-yellow-200";
    if (isCompleted) return "border-green-200";
    return "border-gray-200";
  };

  return (
    <Card 
      id={id}
      className={`transition-all duration-200 ${getBorderColor()} ${className}`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {getStatusIcon()}
            <div className="space-y-1">
              <CardTitle className="text-xl">{title}</CardTitle>
              {description && (
                <CardDescription className="text-base">
                  {description}
                </CardDescription>
              )}
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );
};