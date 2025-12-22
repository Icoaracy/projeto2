import { useState, useEffect, useCallback, useRef } from 'react';
import { showSuccess, showInfo } from '@/utils/toast';

interface AutoSaveOptions {
  interval?: number; // em segundos
  debounceTime?: number; // em milissegundos
  onSave?: (data: any) => Promise<void>;
  storageKey?: string;
}

export const useAutoSave = <T extends Record<string, any>>(
  data: T,
  options: AutoSaveOptions = {}
) => {
  const {
    interval = 30, // 30 segundos
    debounceTime = 2000, // 2 segundos
    onSave,
    storageKey = 'dfd-form-data'
  } = options;

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const intervalRef = useRef<NodeJS.Timeout>();
  const previousDataRef = useRef<T>(data);

  // Carregar dados salvos do localStorage
  const loadSavedData = useCallback(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Erro ao carregar dados salvos:', error);
    }
    return null;
  }, [storageKey]);

  // Salvar dados no localStorage
  const saveToStorage = useCallback((dataToSave: T) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        data: dataToSave,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  }, [storageKey]);

  // Função de salvamento
  const save = useCallback(async (dataToSave: T = data) => {
    if (isSaving) return;

    setIsSaving(true);
    
    try {
      // Salvar no localStorage primeiro
      saveToStorage(dataToSave);
      
      // Se houver função de salvamento customizada
      if (onSave) {
        await onSave(dataToSave);
      }
      
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      
      // Mostrar notificação apenas se não for salvamento automático silencioso
      if (timeoutRef.current) {
        showInfo('Dados salvos automaticamente');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setIsSaving(false);
    }
  }, [data, isSaving, onSave, saveToStorage]);

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
      localStorage.removeItem(storageKey);
      setHasUnsavedChanges(false);
      setLastSaved(null);
      showSuccess('Dados salvos removidos com sucesso');
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
    }
  }, [storageKey]);

  return {
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    forceSave,
    clearSavedData,
    loadSavedData
  };
};