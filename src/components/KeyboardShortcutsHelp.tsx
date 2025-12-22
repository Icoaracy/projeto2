import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Keyboard, Command } from 'lucide-react';

interface Shortcut {
  keys: string[];
  description: string;
}

interface KeyboardShortcutsHelpProps {
  shortcuts: Shortcut[];
}

export const KeyboardShortcutsHelp = ({ shortcuts }: KeyboardShortcutsHelpProps) => {
  const [open, setOpen] = useState(false);

  const formatKeys = (keys: string[]) => {
    return keys.map(key => {
      if (key === 'Ctrl' || key === 'Cmd') {
        return <Command key={key} className="w-4 h-4" />;
      }
      return (
        <kbd key={key} className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded">
          {key}
        </kbd>
      );
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Keyboard className="w-4 h-4" />
          Atalhos
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Atalhos de Teclado</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
              <span className="text-sm text-gray-700">{shortcut.description}</span>
              <div className="flex items-center gap-1">
                {formatKeys(shortcut.keys)}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-gray-500">
            Dica: Use Ctrl+S para salvar rapidamente seu trabalho.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};