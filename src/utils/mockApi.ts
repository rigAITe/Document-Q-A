import type { Document } from '@/types';
import { generateId } from '@/utils/idGenerator';

// API timing constants (in milliseconds)
const UPLOAD_BASE_DELAY = 1500;
const UPLOAD_RANDOM_DELAY = 1000;
const DELETE_DELAY = 300;

// Error rate constants (0-1)
const UPLOAD_ERROR_RATE = 0.1;    // 10% chance
const DELETE_ERROR_RATE = 0.05;   // 5% chance

const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  uploadDocument: async (file: File, contentOverride?: string): Promise<Document> => {
    // Simulate upload delay
    await delay(UPLOAD_BASE_DELAY + Math.random() * UPLOAD_RANDOM_DELAY);
    
    // Simulate random failures
    if (Math.random() < UPLOAD_ERROR_RATE) {
      throw new Error('Upload failed: Network error');
    }

    const document: Document = {
      id: generateId('doc'),
      name: file.name,
      size: file.size,
      type: file.type || 'text/plain',
      uploadDate: new Date(),
      content: contentOverride ?? await file.text(),
    };

    return document;
  },

  deleteDocument: async (_documentId: string): Promise<void> => {
    await delay(DELETE_DELAY);
    
    if (Math.random() < DELETE_ERROR_RATE) {
      throw new Error('Failed to delete document');
    }
  },
};
