import type { Document, QAPair } from '@/types';

const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

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
    await delay(1500 + Math.random() * 1000);
    
    // Simulate random failures (10% chance)
    if (Math.random() < 0.1) {
      throw new Error('Upload failed: Network error');
    }

    const document: Document = {
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date(),
      content: await file.text(),
    };

    return document;
  },

  askQuestion: async (documentId: string, question: string): Promise<QAPair> => {
    // Simulate AI processing time
    await delay(800 + Math.random() * 1200);

    // Simulate random failures (5% chance)
    if (Math.random() < 0.05) {
      throw new Error('Failed to process question: AI service temporarily unavailable');
    }

    const randomAnswer = mockAnswers[Math.floor(Math.random() * mockAnswers.length)]
      .replace('{section}', `${Math.floor(Math.random() * 10) + 1}`)
      .replace('{chapter}', `${Math.floor(Math.random() * 5) + 1}`);

    const qaPair: QAPair = {
      id: `qa-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      documentId,
      question,
      answer: randomAnswer,
      timestamp: new Date(),
    };

    return qaPair;
  },

  deleteDocument: async (_documentId: string): Promise<void> => {
    await delay(300);
    
    if (Math.random() < 0.05) {
      throw new Error('Failed to delete document');
    }
  },
};
