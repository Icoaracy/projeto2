import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Upload, Download, FileJson, AlertTriangle, CheckCircle2, Shield, Clock, Database } from "lucide-react";
import { showSuccess, showError, showInfo } from "@/utils/toast";

interface DataManagerProps {
  formData: any;
  onLoadData: (data: any) => void;
  onClearData: () => void;
  autoSave: any; // Pass the autoSave hook to access its methods
}

export const DataManager = ({ formData, onLoadData, onClearData, autoSave }: DataManagerProps) => {
  const [open, setOpen] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportToJSON = () => {
    try {
      const dataToExport = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        formData: formData,
        exportInfo: {
          storageType: autoSave.currentStorageType,
          encrypted: autoSave.isEncrypted,
          exportedBy: 'DFD Platform'
        }
      };

      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
        type: 'application/json'
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dfd-dados-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showSuccess('Dados exportados com sucesso!');
    } catch (error) {
      showError('Erro ao exportar dados');
    }
  };

  const importFromJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/json') {
      setImportStatus('error');
      setImportMessage('Por favor, selecione um arquivo JSON válido.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);

        // Validate structure
        if (!importedData.formData) {
          throw new Error('Arquivo não contém dados de formulário válidos.');
        }

        if (!importedData.version) {
          showInfo('Atenção: Arquivo sem versão identificada. Tentando importar assim mesmo.');
        }

        onLoadData(importedData.formData);
        setImportStatus('success');
        setImportMessage('Dados importados com sucesso!');
        showSuccess('Dados importados com sucesso!');

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        setTimeout(() => {
          setImportStatus('idle');
          setImportMessage('');
        }, 3000);
      } catch (error) {
        setImportStatus('error');
        setImportMessage('Erro ao ler o arquivo. Verifique se é um arquivo JSON válido.');
        showError('Erro ao importar dados');
      }
    };

    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (confirm('Tem certeza que deseja limpar todos os dados do formulário? Esta ação não pode ser desfeita.')) {
      onClearData();
      showSuccess('Dados do formulário limpos com sucesso!');
      setOpen(false);
    }
  };

  const handleStorageTypeChange = (useSessionStorage: boolean, encryptData: boolean) => {
    autoSave.switchStorageType(useSessionStorage, encryptData);
  };

  const getFormDataStats = () => {
    const filledFields = Object.values(formData).filter(value => {
      if (typeof value === 'string') return value.trim() !== '';
      if (typeof value === 'object') {
        return Object.values(value).some(v => typeof v === 'string' && v.trim() !== '');
      }
      return false;
    }).length;

    const totalFields = Object.keys(formData).length;
    const completionPercentage = Math.round((filledFields / totalFields) * 100);

    return { filledFields, totalFields, completionPercentage };
  };

  const stats = getFormDataStats();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <FileJson className="w-4 h-4" />
          Gerenciar Dados
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar Dados do Formulário</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Security Settings */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-lg">Configurações de Segurança</CardTitle>
              </div>
              <CardDescription>
                Configure como seus dados são armazenados para maior segurança
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="session-storage" className="text-sm font-medium">
                    Usar Armazenamento de Sessão
                  </Label>
                  <p className="text-xs text-gray-500">
                    Dados são limpos ao fechar o navegador (mais seguro para computadores compartilhados)
                  </p>
                </div>
                <Switch
                  id="session-storage"
                  checked={autoSave.currentStorageType === 'session'}
                  onCheckedChange={(checked) => handleStorageTypeChange(checked, autoSave.isEncrypted)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="encrypt-data" className="text-sm font-medium">
                    Criptografar Dados
                  </Label>
                  <p className="text-xs text-gray-500">
                    Criptografa dados antes de armazenar (proteção adicional)
                  </p>
                </div>
                <Switch
                  id="encrypt-data"
                  checked={autoSave.isEncrypted}
                  onCheckedChange={(checked) => handleStorageTypeChange(autoSave.currentStorageType === 'session', checked)}
                />
              </div>

              {autoSave.storageWarning && (
                <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">Atenção de Segurança</p>
                    <p>Seus dados estão sendo salvos no armazenamento local do navegador. Em computadores compartilhados, considere usar o armazenamento de sessão.</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Database className="w-4 h-4 text-blue-600" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Configuração Atual</p>
                  <p>Armazenamento: {autoSave.currentStorageType === 'session' ? 'Sessão' : 'Local'} | 
                     Criptografia: {autoSave.isEncrypted ? 'Ativada' : 'Desativada'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Estatísticas do Formulário</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Campos preenchidos:</span>
                <Badge variant="secondary">{stats.filledFields}/{stats.totalFields}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Progresso:</span>
                <Badge className={stats.completionPercentage >= 80 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                  {stats.completionPercentage}%
                </Badge>
              </div>
              {autoSave.lastSaved && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Último salvamento:</span>
                  <span className="text-sm text-gray-800">
                    {autoSave.lastSaved.toLocaleString('pt-BR')}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Export */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Exportar Dados</CardTitle>
              <CardDescription>
                Salve seus dados em um arquivo JSON para backup ou compartilhamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={exportToJSON}
                className="w-full flex items-center gap-2"
                variant="outline"
              >
                <Download className="w-4 h-4" />
                Exportar como JSON
              </Button>
            </CardContent>
          </Card>

          {/* Import */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Importar Dados</CardTitle>
              <CardDescription>
                Carregue dados previamente salvos de um arquivo JSON
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={importFromJSON}
                className="hidden"
                id="file-import"
              />
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center gap-2"
                variant="outline"
              >
                <Upload className="w-4 h-4" />
                Importar do JSON
              </Button>
              
              {importStatus !== 'idle' && (
                <div className={`flex items-center gap-2 p-3 rounded-lg ${
                  importStatus === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                  {importStatus === 'success' ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <AlertTriangle className="w-4 h-4" />
                  )}
                  <span className="text-sm">{importMessage}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Clear Data */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Limpar Dados</CardTitle>
              <CardDescription>
                Remova todos os dados do formulário atual
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleClearData}
                className="w-full flex items-center gap-2"
                variant="destructive"
              >
                <AlertTriangle className="w-4 h-4" />
                Limpar Formulário
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};