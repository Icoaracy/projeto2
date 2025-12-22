// Update the DataManager component to show storage security information
// Find the statistics section and add storage info:

<div className="flex justify-between items-center">
  <span className="text-sm text-gray-600">Tipo de Armazenamento:</span>
  <Badge variant="outline">
    {autoSave.storageType === 'sessionStorage' ? 'Sessão' : 'Local'}
    {autoSave.isEncrypted && ' 🔒'}
  </Badge>
</div>

// Also update the export dialog to include security info
<CardDescription>
  Salve seus dados em um arquivo JSON para backup ou compartilhamento. 
  {autoSave.isEncrypted && ' Os dados no navegador estão criptografados.'}
</CardDescription>