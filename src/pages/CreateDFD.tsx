// Configuração de atalhos de teclado
  const shortcuts = [
    {
      keys: ['Ctrl', 'S'],
      handler: () => autoSave.forceSave(),
      description: 'Salvar formulário'
    },
    {
      keys: ['Ctrl', 'P'],
      handler: () => handleGeneratePDF(),
      description: 'Gerar PDF'
    },
    {
      keys: ['Ctrl', 'E'],
      handler: () => handleExportData(),
      description: 'Exportar dados'
    },
    {
      keys: ['Ctrl', 'I'],
      handler: () => handleImportData(),
      description: 'Importar dados'
    }
  ];