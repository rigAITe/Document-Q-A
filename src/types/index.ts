export interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
  content: string;
}

export interface QAPair {
  id: string;
  documentId: string;
  question: string;
  answer: string;
  timestamp: Date;
}

export interface UploadProgress {
  documentId: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export type Theme = 'light' | 'dark';

export interface AppState {
  documents: Document[];
  qaHistory: QAPair[];
  theme: Theme;
  selectedDocumentId: string | null;
}
