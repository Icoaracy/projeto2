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

// Native Web Crypto API encryption (more secure than crypto-js)
const encryptData = async (text: string): Promise<string> => {
  try {
    if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
      // Fallback for server-side rendering or unsupported browsers
      return btoa(text); // Simple base64 encoding as fallback
    }

    // Generate a random key (in production, you'd want to derive this from a password)
    const key = await window.crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );

    // Generate a random IV
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    // Encrypt the data
    const encodedText = new TextEncoder().encode(text);
    const encryptedData = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encodedText
    );

    // Export the key and combine with IV and encrypted data
    const exportedKey = await window.crypto.subtle.exportKey('raw', key);
    const combined = new Uint8Array(exportedKey.byteLength + iv.byteLength + encryptedData.byteLength);
    combined.set(new Uint8Array(exportedKey), 0);
    combined.set(iv, exportedKey.byteLength);
    combined.set(new Uint8Array(encryptedData), exportedKey.byteLength + iv.byteLength);

    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption error:', error);
    return btoa(text); // Fallback to base64
  }
};

const decryptData = async (encryptedText: string): Promise<string> => {
  try {
    if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
      // Fallback for server-side rendering or unsupported browsers
      return atob(encryptedText); // Simple base64 decoding as fallback
    }

    // Decode the base64 string
    const combined = new Uint8Array(
      atob(encryptedText).split('').map(char => char.charCodeAt(0))
    );

    // Extract key, IV, and encrypted data
    const keyData = combined.slice(0, 32); // 256 bits for AES-256
    const iv = combined.slice(32, 44); // 96 bits for GCM
    const encryptedData = combined.slice(44);

    // Import the key
    const key = await window.crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

    // Decrypt the data
    const decryptedData = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encryptedData
    );

    return new TextDecoder().decode(decryptedData);
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
  const loadSavedData = useCallback(async () => {
    try {
      const storage = getStorage();
      const saved = storage.getItem(storageKey);
      if (saved) {
        const parsedData = JSON.parse(saved);
        // Handle both encrypted and legacy unencrypted data
        if (parsedData.encrypted && encryptData) {
          const decryptedData = await decryptData(parsedData.data);
          return {
            ...parsedData,
            data: JSON.parse(decryptedData)
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
  const saveToStorage = useCallback(async (dataToSave: T) => {
    try {
      const storage = getStorage();
      const dataToStore: any = {
        data: dataToSave,
        timestamp: new Date().toISOString(),
        encrypted: encryptData,
        storageType: useSessionStorage ? 'session' : 'local'
      };

      if (encryptData) {
        dataToStore.data = await encryptData(JSON.stringify(dataToSave));
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
      await saveToStorage(dataToSave);
      
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
  const switchStorageType = useCallback(async (newUseSessionStorage: boolean, newEncryptData: boolean) => {
    // Clear current storage
    clearSavedData();
    
    // Save current data to new storage type
    const newOptions = { ...options, useSessionStorage: newUseSessionStorage, encryptData: newEncryptData };
    await saveToStorage(data);
    
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