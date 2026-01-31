import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Document, QAPair, Theme, UploadProgress, ToastMessage } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { mockApi } from '@/utils/mockApi';

interface AppContextType {
  documents: Document[];
  qaHistory: QAPair[];
  theme: Theme;
  selectedDocumentId: string | null;
  uploadProgress: UploadProgress[];
  toasts: ToastMessage[];
  
  addDocument: (document: Document) => void;
  removeDocument: (documentId: string) => Promise<void>;
  selectDocument: (documentId: string | null) => void;
  
  addQAPair: (qaPair: QAPair) => void;
  askQuestion: (documentId: string, question: string) => Promise<void>;
  
  toggleTheme: () => void;
  
  uploadDocument: (file: File) => Promise<void>;
  
  showToast: (type: ToastMessage['type'], message: string, duration?: number) => void;
  removeToast: (id: string) => void;
  
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
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

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
  }, [setDocuments, setQAHistory, selectedDocumentId]);

  const selectDocument = useCallback((documentId: string | null) => {
    setSelectedDocumentId(documentId);
  }, []);

  const addQAPair = useCallback((qaPair: QAPair) => {
    setQAHistory(prev => [qaPair, ...prev]);
  }, [setQAHistory]);

  const askQuestion = useCallback(async (documentId: string, question: string) => {
    try {
      const qaPair = await mockApi.askQuestion(documentId, question);
      addQAPair(qaPair);
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Failed to get answer');
      throw error;
    }
  }, [addQAPair]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, [setTheme]);

  const uploadDocument = useCallback(async (file: File) => {
    const tempId = `temp-${Date.now()}`;
    
    setUploadProgress(prev => [...prev, {
      documentId: tempId,
      progress: 0,
      status: 'uploading',
    }]);

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => prev.map(up => 
        up.documentId === tempId && up.progress < 90
          ? { ...up, progress: up.progress + 10 }
          : up
      ));
    }, 200);

    try {
      const document = await mockApi.uploadDocument(file);
      
      clearInterval(progressInterval);
      setUploadProgress(prev => prev.map(up => 
        up.documentId === tempId
          ? { ...up, progress: 100, status: 'completed' }
          : up
      ));

      setTimeout(() => {
        setUploadProgress(prev => prev.filter(up => up.documentId !== tempId));
      }, 1000);

      addDocument(document);
      showToast('success', `${file.name} uploaded successfully`);
    } catch (error) {
      clearInterval(progressInterval);
      setUploadProgress(prev => prev.map(up => 
        up.documentId === tempId
          ? { ...up, status: 'error', error: error instanceof Error ? error.message : 'Upload failed' }
          : up
      ));

      setTimeout(() => {
        setUploadProgress(prev => prev.filter(up => up.documentId !== tempId));
      }, 3000);

      showToast('error', error instanceof Error ? error.message : 'Upload failed');
      throw error;
    }
  }, [addDocument]);

  const showToast = useCallback((type: ToastMessage['type'], message: string, duration = 5000) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const toast: ToastMessage = { id, type, message, duration };
    
    setToasts(prev => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

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

  const searchQAHistory = useCallback((query: string): QAPair[] => {
    if (!query.trim()) return qaHistory;
    
    const lowerQuery = query.toLowerCase();
    return qaHistory.filter(qa => 
      qa.question.toLowerCase().includes(lowerQuery) ||
      qa.answer.toLowerCase().includes(lowerQuery)
    );
  }, [qaHistory]);

  const value: AppContextType = {
    documents,
    qaHistory,
    theme,
    selectedDocumentId,
    uploadProgress,
    toasts,
    addDocument,
    removeDocument,
    selectDocument,
    addQAPair,
    askQuestion,
    toggleTheme,
    uploadDocument,
    showToast,
    removeToast,
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
