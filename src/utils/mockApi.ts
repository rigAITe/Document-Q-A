import type { Document, QAPair } from '@/types';

// API timing constants (in milliseconds)
const UPLOAD_BASE_DELAY = 1500;
const UPLOAD_RANDOM_DELAY = 1000;
const QUESTION_BASE_DELAY = 800;
const QUESTION_RANDOM_DELAY = 1200;
const DELETE_DELAY = 300;

// Error rate constants (0-1)
const UPLOAD_ERROR_RATE = 0.1;    // 10% chance
const QUESTION_ERROR_RATE = 0.05; // 5% chance
const DELETE_ERROR_RATE = 0.05;   // 5% chance

// ID generation constants
const ID_RANDOM_LENGTH = 9;
const ID_RADIX = 36;
const ID_START_INDEX = 2;

const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generates a unique ID with prefix
 */
const generateId = (prefix: string): string => {
  const randomPart = Math.random()
    .toString(ID_RADIX)
    .substring(ID_START_INDEX, ID_START_INDEX + ID_RANDOM_LENGTH);
  return `${prefix}-${Date.now()}-${randomPart}`;
};

const mockAnswers = [
  "Based on the document analysis, this information appears in section {section}. The key points include detailed explanations of the main concepts.",
  "According to the uploaded document, the answer involves multiple factors. Let me break this down for you in detail.",
  "The document provides comprehensive information about this topic. Here's what I found after analyzing the content thoroughly.",
  "After reviewing the document carefully, I can confirm that this relates to the core principles discussed in chapter {chapter}.",
  "This is an excellent question. The document addresses this specifically, highlighting important considerations and best practices.",
];

export const mockApi = {
  uploadDocument: async (file: File): Promise<Document> => {
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
      content: await file.text(),
    };

    return document;
  },

  askQuestion: async (documentId: string, question: string): Promise<QAPair> => {
    // Simulate AI processing time
    await delay(QUESTION_BASE_DELAY + Math.random() * QUESTION_RANDOM_DELAY);

    // Simulate random failures
    if (Math.random() < QUESTION_ERROR_RATE) {
      throw new Error('Failed to process question: AI service temporarily unavailable');
    }

    const randomAnswer = mockAnswers[Math.floor(Math.random() * mockAnswers.length)]
      .replace('{section}', `${Math.floor(Math.random() * 10) + 1}`)
      .replace('{chapter}', `${Math.floor(Math.random() * 5) + 1}`);

    const qaPair: QAPair = {
      id: generateId('qa'),
      documentId,
      question,
      answer: randomAnswer,
      timestamp: new Date(),
    };

    return qaPair;
  },

  deleteDocument: async (_documentId: string): Promise<void> => {
    await delay(DELETE_DELAY);
    
    if (Math.random() < DELETE_ERROR_RATE) {
      throw new Error('Failed to delete document');
    }
  },
};
