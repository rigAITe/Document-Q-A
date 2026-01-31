import React, { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from 'react';
import type { Document, QAPair, Theme, UploadProgress, ToastMessage } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { mockApi } from '@/utils/mockApi';
import { askOpenAI } from '@/utils/openaiApi';
import { extractTextFromFile } from '@/utils/documentExtractor';
import {
  DEFAULT_TOAST_DURATION,
  ERROR_TOAST_DURATION,
  UPLOAD_PROGRESS_CLEAR_DELAY,
  UPLOAD_PROGRESS_INCREMENT,
  UPLOAD_PROGRESS_INTERVAL,
  UPLOAD_PROGRESS_MAX,
} from '@/config/constants';

interface AppContextType {
  documents: Document[];
  qaHistory: QAPair[];
  theme: Theme;
  selectedDocumentId: string | null;
  uploadProgress: UploadProgress[];
  toasts: ToastMessage[];
  apiKey: string | null;
  isUsingRealApi: boolean;
  
  addDocument: (document: Document) => void;
  removeDocument: (documentId: string) => Promise<void>;
  selectDocument: (documentId: string | null) => void;
  
  addQAPair: (qaPair: QAPair) => void;
  askQuestion: (documentId: string, question: string) => Promise<void>;
  
  toggleTheme: () => void;
  
  uploadDocument: (file: File) => Promise<void>;
  
  showToast: (type: ToastMessage['type'], message: string, duration?: number) => void;
  removeToast: (id: string) => void;
  
  setApiKey: (key: string | null) => void;
  
  exportQAHistory: () => void;
  searchQAHistory: (query: string) => QAPair[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [documents, setDocuments] = useLocalStorage<Document[]>('documents', []);
  const [qaHistory, setQAHistory] = useLocalStorage<QAPair[]>('qaHistory', []);
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'light');
  const [apiKey, setApiKeyStorage] = useLocalStorage<string | null>('openai_api_key', null);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  const isUsingRealApi = Boolean(apiKey);
  
  // Refs for cleanup and stable references
  const uploadIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const toastTimeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (uploadIntervalRef.current) {
        clearInterval(uploadIntervalRef.current);
      }
      toastTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
      toastTimeoutsRef.current.clear();
    };
  }, []);

  // Toast functions (defined first as they're used by other callbacks)
  
  const removeToast = useCallback((id: string) => {
    // Clear the timeout if it exists
    const existingTimeout = toastTimeoutsRef.current.get(id);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
      toastTimeoutsRef.current.delete(id);
    }
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback((type: ToastMessage['type'], message: string, duration = DEFAULT_TOAST_DURATION) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const toast: ToastMessage = { id, type, message, duration };
    
    setToasts(prev => [...prev, toast]);

    if (duration > 0) {
      const timeoutId = setTimeout(() => {
        toastTimeoutsRef.current.delete(id);
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
      toastTimeoutsRef.current.set(id, timeoutId);
    }
  }, []);

  // ============================================
  // Document functions
  // ============================================

  const addDocument = useCallback((document: Document) => {
    setDocuments(prev => [...prev, document]);
  }, [setDocuments]);

  const removeDocument = useCallback(async (documentId: string) => {
    try {
      await mockApi.deleteDocument(documentId);
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      setQAHistory(prev => prev.filter(qa => qa.documentId !== documentId));
      if (selectedDocumentId === documentId) {
        setSelectedDocumentId(null);
      }
      showToast('success', 'Document deleted successfully');
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Failed to delete document');
      throw error;
    }
  }, [setDocuments, setQAHistory, selectedDocumentId, showToast]);

  const selectDocument = useCallback((documentId: string | null) => {
    setSelectedDocumentId(documentId);
  }, []);

  // Q&A functions

  const addQAPair = useCallback((qaPair: QAPair) => {
    setQAHistory(prev => [qaPair, ...prev]);
  }, [setQAHistory]);

  const askQuestion = useCallback(async (documentId: string, question: string) => {
    try {
      let qaPair: QAPair;
      
      if (!apiKey) {
        throw new Error('OpenAI API key is required to ask questions.');
      }

      // Use real OpenAI API
      const document = documents.find(d => d.id === documentId);
      if (!document) {
        throw new Error('Document not found');
      }
      const trimmedContent = document.content.trim();
      if (!trimmedContent) {
        throw new Error(
          'No extractable text found in this document. Try a TXT/MD/CSV file or convert to DOCX/PDF with selectable text.'
        );
      }
      qaPair = await askOpenAI(apiKey, trimmedContent, document.name, question, documentId);
      
      addQAPair(qaPair);
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Failed to get answer');
      throw error;
    }
  }, [addQAPair, showToast, apiKey, documents]);
  
  const setApiKey = useCallback((key: string | null) => {
    setApiKeyStorage(key);
  }, [setApiKeyStorage]);

  const searchQAHistory = useCallback((query: string): QAPair[] => {
    if (!query.trim()) return qaHistory;
    
    const lowerQuery = query.toLowerCase();
    return qaHistory.filter(qa => 
      qa.question.toLowerCase().includes(lowerQuery) ||
      qa.answer.toLowerCase().includes(lowerQuery)
    );
  }, [qaHistory]);

  const exportQAHistory = useCallback(() => {
    const dataStr = JSON.stringify(qaHistory, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `qa-history-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('success', 'Q&A history exported successfully');
  }, [qaHistory, showToast]);

  // Theme functions

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, [setTheme]);

  // Upload functions

  const uploadDocument = useCallback(async (file: File) => {
    const tempId = `temp-${Date.now()}`;
    
    setUploadProgress(prev => [...prev, {
      documentId: tempId,
      progress: 0,
      status: 'uploading',
    }]);

    // Store interval in ref for cleanup
    uploadIntervalRef.current = setInterval(() => {
      setUploadProgress(prev => prev.map(up => 
        up.documentId === tempId && up.progress < UPLOAD_PROGRESS_MAX
          ? { ...up, progress: up.progress + UPLOAD_PROGRESS_INCREMENT }
          : up
      ));
    }, UPLOAD_PROGRESS_INTERVAL);

    try {
      const extractedText = await extractTextFromFile(file);
      if (!extractedText) {
        throw new Error(
          'No extractable text found in this document. Try a TXT/MD/CSV file or convert to DOCX/PDF with selectable text.'
        );
      }

      const document = await mockApi.uploadDocument(file, extractedText);
      
      if (uploadIntervalRef.current) {
        clearInterval(uploadIntervalRef.current);
        uploadIntervalRef.current = null;
      }
      
      setUploadProgress(prev => prev.map(up => 
        up.documentId === tempId
          ? { ...up, progress: 100, status: 'completed' }
          : up
      ));

      setTimeout(() => {
        setUploadProgress(prev => prev.filter(up => up.documentId !== tempId));
      }, UPLOAD_PROGRESS_CLEAR_DELAY);

      addDocument(document);
      showToast('success', `${file.name} uploaded successfully`);
    } catch (error) {
      if (uploadIntervalRef.current) {
        clearInterval(uploadIntervalRef.current);
        uploadIntervalRef.current = null;
      }
      
      setUploadProgress(prev => prev.map(up => 
        up.documentId === tempId
          ? { ...up, status: 'error', error: error instanceof Error ? error.message : 'Upload failed' }
          : up
      ));

      setTimeout(() => {
        setUploadProgress(prev => prev.filter(up => up.documentId !== tempId));
      }, ERROR_TOAST_DURATION);

      showToast('error', error instanceof Error ? error.message : 'Upload failed');
      throw error;
    }
  }, [addDocument, showToast]);

  // Context value

  const value: AppContextType = {
    documents,
    qaHistory,
    theme,
    selectedDocumentId,
    uploadProgress,
    toasts,
    apiKey,
    isUsingRealApi,
    addDocument,
    removeDocument,
    selectDocument,
    addQAPair,
    askQuestion,
    toggleTheme,
    uploadDocument,
    showToast,
    removeToast,
    setApiKey,
    exportQAHistory,
    searchQAHistory,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
