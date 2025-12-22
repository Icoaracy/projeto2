import { useState, useEffect, useCallback, useRef } from 'react';
import { showSuccess, showInfo, showError } from '@/utils/toast';

interface AutoSaveOptions {
  interval?: number; // em segundos
  debounceTime?: number; // em milissegundos
  onSave?: (data: any) => Promise<void>;
  storageKey?: string;
  useSessionStorage?: boolean; // New option for sessionStorage
  encryptData?: boolean; // New option for encryption
}

// Simple client-side encryption (for demonstration - use proper crypto in production)
const simpleEncrypt = (text: string): string => {
  try {
    // This is a simple XOR cipher for demonstration
    // In production, use proper encryption libraries like crypto-js
    const key = 'dfd-secure-key-2024';
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(result);
  } catch (error) {
    console.error('Encryption error:', error);
    return text; // Fallback to unencrypted
  }
};

const simpleDecrypt = (encryptedText: string): string => {
  try {
    const key = 'dfd-secure-key-2024';
    const text = atob(encryptedText);
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  } catch (error) {
    console.error('Decryption error:', error);
    return encryptedText; // Fallback to original text
  }
};

export const useAutoSave = <T extends Record<string, any>>(
  data: T,
  options: AutoSaveOptions = {}
) => {
  const {
    interval = 30, // 30 segundos
    debounceTime = 2000, // 2 segundos
    onSave,
    storageKey = 'dfd-form-data',
    useSessionStorage = false, // Default to localStorage for backward compatibility
    encryptData = false // Default to no encryption for backward compatibility
  } = options;

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [storageWarning, setStorageWarning] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const intervalRef = useRef<NodeJS.Timeout>();
  const previousDataRef = useRef<T>(data);

  // Choose storage method based on options
  const getStorage = () => useSessionStorage ? sessionStorage : localStorage;

  // Load saved data from storage
  const loadSavedData = useCallback(() => {
    try {
      const storage = getStorage();
      const saved = storage.getItem(storageKey);
      if (saved) {
        const parsedData = JSON.parse(saved);
        // Handle both encrypted and legacy unencrypted data
        if (parsedData.encrypted && encryptData) {
          return {
            ...parsedData,
            data: JSON.parse(simpleDecrypt(parsedData.data))
          };
        } else if (!parsedData.encrypted) {
          return parsedData;
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados salvos:', error);
      showError('Erro ao carregar dados salvos');
    }
    return null;
  }, [storageKey, useSessionStorage, encryptData]);

  // Save data to storage
  const saveToStorage = useCallback((dataToSave: T) => {
    try {
      const storage = getStorage();
      const dataToStore: any = {
        data: dataToSave,
        timestamp: new Date().toISOString(),
        encrypted: encryptData,
        storageType: useSessionStorage ? 'session' : 'local'
      };

      if (encryptData) {
        dataToStore.data = simpleEncrypt(JSON.stringify(dataToSave));
      }

      storage.setItem(storageKey, JSON.stringify(dataToStore));

      // Show warning if using localStorage
      if (!useSessionStorage && !storageWarning) {
        setStorageWarning(true);
        showInfo('Seus dados estão sendo salvos no navegador. Em computadores compartilhados, considere usar o modo de sessão.');
      }
    } catch (error) {
      console.error('Erro ao salvar no storage:', error);
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        showError('Espaço de armazenamento insuficiente. Considere limpar dados antigos.');
      } else {
        showError('Erro ao salvar dados localmente');
      }
    }
  }, [storageKey, useSessionStorage, encryptData, storageWarning]);

  // Função de salvamento
  const save = useCallback(async (dataToSave: T = data) => {
    if (isSaving) return;

    setIsSaving(true);
    
    try {
      // Salvar no storage primeiro
      saveToStorage(dataToSave);
      
      // Se houver função de salvamento customizada
      if (onSave) {
        await onSave(dataToSave);
      }
      
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      
      // Mostrar notificação apenas se não for salvamento automático silencioso
      if (timeoutRef.current) {
        const storageType = useSessionStorage ? 'sessão' : 'local';
        showInfo(`Dados salvos automaticamente no armazenamento ${storageType}`);
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      showError('Erro ao salvar dados');
    } finally {
      setIsSaving(false);
    }
  }, [data, isSaving, onSave, saveToStorage, useSessionStorage]);

  // Debounced save
  const debouncedSave = useCallback((newData: T) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      save(newData);
    }, debounceTime);
  }, [save, debounceTime]);

  // Detectar mudanças nos dados
  useEffect(() => {
    const hasChanges = JSON.stringify(data) !== JSON.stringify(previousDataRef.current);
    
    if (hasChanges) {
      setHasUnsavedChanges(true);
      debouncedSave(data);
      previousDataRef.current = data;
    }
  }, [data, debouncedSave]);

  // Auto-save periódico
  useEffect(() => {
    if (interval > 0) {
      intervalRef.current = setInterval(() => {
        if (hasUnsavedChanges && !isSaving) {
          save();
        }
      }, interval * 1000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [interval, hasUnsavedChanges, isSaving, save]);

  // Limpar timeout ao desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Salvar forçado
  const forceSave = useCallback(() => {
    return save();
  }, [save]);

  // Limpar dados salvos
  const clearSavedData = useCallback(() => {
    try {
      const storage = getStorage();
      storage.removeItem(storageKey);
      setHasUnsavedChanges(false);
      setLastSaved(null);
      setStorageWarning(false);
      showSuccess('Dados salvos removidos com sucesso');
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      showError('Erro ao limpar dados');
    }
  }, [storageKey, useSessionStorage]);

  // Switch storage type
  const switchStorageType = useCallback((newUseSessionStorage: boolean, newEncryptData: boolean) => {
    // Clear current storage
    clearSavedData();
    
    // Save current data to new storage type
    const newOptions = { ...options, useSessionStorage: newUseSessionStorage, encryptData: newEncryptData };
    saveToStorage(data);
    
    showSuccess(`Alterado para armazenamento ${newUseSessionStorage ? 'de sessão' : 'local'}${newEncryptData ? ' com criptografia' : ''}`);
  }, [clearSavedData, saveToStorage, data, options]);

  return {
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    forceSave,
    clearSavedData,
    loadSavedData,
    switchStorageType,
    storageWarning,
    currentStorageType: useSessionStorage ? 'session' : 'local',
    isEncrypted: encryptData
  };
};