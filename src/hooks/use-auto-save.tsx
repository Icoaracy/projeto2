import { useState, useEffect, useCallback, useRef } from 'react';
import { showSuccess, showInfo } from '@/utils/toast';

interface AutoSaveOptions {
  interval?: number; // em segundos
  debounceTime?: number; // em milissegundos
  onSave?: (data: any) => Promise<void>;
  storageKey?: string;
  useSessionStorage?: boolean; // New option to use sessionStorage instead of localStorage
  encryptData?: boolean; // New option to encrypt data
}

// Simple client-side encryption (for demonstration - in production, use a proper crypto library)
const simpleEncrypt = (text: string): string => {
  try {
    return btoa(encodeURIComponent(text));
  } catch {
    return text;
  }
};

const simpleDecrypt = (text: string): string => {
  try {
    return decodeURIComponent(atob(text));
  } catch {
    return text;
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
    useSessionStorage = true, // Default to sessionStorage for better security
    encryptData = true // Default to encryption
  } = options;

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const intervalRef = useRef<NodeJS.Timeout>();
  const previousDataRef = useRef<T>(data);

  // Choose storage method based on options
  const getStorage = () => useSessionStorage ? sessionStorage : localStorage;
  
  // Carregar dados salvos do storage
  const loadSavedData = useCallback(() => {
    try {
      const storage = getStorage();
      const saved = storage.getItem(storageKey);
      if (saved) {
        const parsedData = JSON.parse(saved);
        // Decrypt if encryption was used
        if (encryptData && parsedData.encrypted) {
          parsedData.data = JSON.parse(simpleDecrypt(parsedData.data));
        }
        return parsedData;
      }
    } catch (error) {
      console.error('Erro ao carregar dados salvos:', error);
    }
    return null;
  }, [storageKey, useSessionStorage, encryptData]);

  // Salvar dados no storage
  const saveToStorage = useCallback((dataToSave: T) => {
    try {
      const storage = getStorage();
      const dataToStore = {
        data: dataToSave,
        timestamp: new Date().toISOString(),
        encrypted: encryptData
      };
      
      // Encrypt if option is enabled
      if (encryptData) {
        dataToStore.data = simpleEncrypt(JSON.stringify(dataToSave));
      }
      
      storage.setItem(storageKey, JSON.stringify(dataToStore));
    } catch (error) {
      console.error('Erro ao salvar no storage:', error);
    }
  }, [storageKey, useSessionStorage, encryptData]);

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
        showInfo(`Dados salvos automaticamente no ${storageType}storage`);
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
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
      showSuccess('Dados salvos removidos com sucesso');
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
    }
  }, [storageKey, useSessionStorage]);

  return {
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    forceSave,
    clearSavedData,
    loadSavedData,
    storageType: useSessionStorage ? 'sessionStorage' : 'localStorage',
    isEncrypted: encryptData
  };
};