// Update the auto-save hook usage in CreateDFD.tsx
// Find this line:
const autoSave = useAutoSave(formData, {
  interval: 30,
  debounceTime: 2000,
  storageKey: 'dfd-form-data'
});

// And replace it with:
const autoSave = useAutoSave(formData, {
  interval: 30,
  debounceTime: 2000,
  storageKey: 'dfd-form-data',
  useSessionStorage: true, // Use sessionStorage for better security
  encryptData: true // Encrypt data at rest
});

// Also add a security warning in the header section
// Find the header section and add this after the status bar:

{/* Security Warning */}
<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
  <div className="flex items-center gap-2 text-yellow-800">
    <AlertTriangle className="w-4 h-4" />
    <div className="text-sm">
      <strong>Segurança de Dados:</strong> Seus dados estão sendo salvos automaticamente no {autoSave.storageType} 
      {autoSave.isEncrypted && ' com criptografia'}. 
      {autoSave.storageType === 'localStorage' && 
        ' Em computadores compartilhados, use a opção "Limpar Formulário" ao finalizar.'}
    </div>
  </div>
</div>