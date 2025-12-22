import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';

interface ValidationIssue {
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

interface FormValidationSummaryProps {
  issues: ValidationIssue[];
  onFieldClick?: (fieldId: string) => void;
}

export const FormValidationSummary = ({ issues, onFieldClick }: FormValidationSummaryProps) => {
  const errorCount = issues.filter(i => i.severity === 'error').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;
  const infoCount = issues.filter(i => i.severity === 'info').length;

  if (issues.length === 0) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Formulário está completo e pronto para ser salvo!
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-3">
      {/* Resumo */}
      <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            {errorCount}
          </Badge>
          <span className="text-sm text-gray-600">erros</span>
        </div>
        {warningCount > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Info className="w-3 h-3" />
              {warningCount}
            </Badge>
            <span className="text-sm text-gray-600">avisos</span>
          </div>
        )}
        {infoCount > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Info className="w-3 h-3" />
              {infoCount}
            </Badge>
            <span className="text-sm text-gray-600">sugestões</span>
          </div>
        )}
      </div>

      {/* Lista de problemas */}
      <div className="space-y-2">
        {issues.map((issue, index) => (
          <Alert 
            key={index} 
            className={`cursor-pointer transition-colors hover:bg-opacity-80 ${
              issue.severity === 'error' ? 'bg-red-50 border-red-200' :
              issue.severity === 'warning' ? 'bg-yellow-50 border-yellow-200' :
              'bg-blue-50 border-blue-200'
            }`}
            onClick={() => onFieldClick?.(issue.field)}
          >
            {issue.severity === 'error' && <AlertTriangle className="h-4 w-4 text-red-600" />}
            {issue.severity === 'warning' && <Info className="h-4 w-4 text-yellow-600" />}
            {issue.severity === 'info' && <Info className="h-4 w-4 text-blue-600" />}
            <AlertDescription className={`
              ${issue.severity === 'error' ? 'text-red-800' :
                issue.severity === 'warning' ? 'text-yellow-800' :
                'text-blue-800'
              }`}>
              <strong>{issue.field}:</strong> {issue.message}
            </AlertDescription>
          </Alert>
        ))}
      </div>
    </div>
  );
};