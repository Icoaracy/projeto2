import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Circle } from 'lucide-react';

interface FormSection {
  id: string;
  title: string;
  isCompleted: boolean;
}

interface FormProgressProps {
  sections: FormSection[];
  currentSection: string;
  onSectionClick?: (sectionId: string) => void;
}

export const FormProgress = ({ sections, currentSection, onSectionClick }: FormProgressProps) => {
  const completedCount = sections.filter(s => s.isCompleted).length;
  const progressPercentage = (completedCount / sections.length) * 100;

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Progresso do Formulário</CardTitle>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>{completedCount} de {sections.length} seções concluídas</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {sections.map((section) => (
          <div
            key={section.id}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
              currentSection === section.id 
                ? 'bg-blue-50 border border-blue-200' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onSectionClick?.(section.id)}
          >
            {section.isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400" />
            )}
            <span className={`text-sm ${
              section.isCompleted ? 'text-gray-700' : 'text-gray-500'
            }`}>
              {section.title}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};