import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { PageContainer, PageHeader, Card, EmptyState, Modal, Button } from './ui';
import { sanitizeDisplayString } from '@/utils/sanitize';
import { logger } from '@/utils/logger';
import type { Document } from '@/types';
import { formatFileSize, formatDate } from '@/utils/formatters';

export const DocumentLibrary: React.FC = () => {
  const { documents, removeDocument, selectDocument } = useApp();
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);

  const handleDeleteClick = (doc: Document, e: React.MouseEvent): void => {
    e.stopPropagation();
    setDocumentToDelete(doc);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (!documentToDelete) return;

    setDeletingId(documentToDelete.id);
    try {
      await removeDocument(documentToDelete.id);
      setDocumentToDelete(null);
    } catch (error) {
      logger.error('Failed to delete document:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCancelDelete = (): void => {
    if (!deletingId) {
      setDocumentToDelete(null);
    }
  };

  const handleDocumentClick = (doc: Document): void => {
    selectDocument(doc.id);
    navigate('/qa');
  };

  const subtitle =
    documents.length === 0
      ? 'No documents uploaded yet. Start by uploading some documents.'
      : `You have ${documents.length} document${documents.length !== 1 ? 's' : ''} in your library.`;

  const qaAction =
    documents.length > 0 ? (
      <Button variant="primary" onClick={() => navigate('/qa')}>
        Ask Questions →
      </Button>
    ) : null;

  return (
    <PageContainer>
      <PageHeader title="Document Library" subtitle={subtitle} action={qaAction} />

      {documents.length === 0 ? (
        <EmptyState
          icon="📭"
          title="No documents yet"
          description="Upload your first document to get started"
          actionLabel="Upload Document"
          onAction={() => navigate('/')}
          size="lg"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {documents.map((doc) => (
            <Card
              key={doc.id}
              onClick={() => handleDocumentClick(doc)}
              hoverable
              className="animate-fade-in"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">📄</div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleDeleteClick(doc, e)}
                >
                  Delete
                </Button>
              </div>

              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2 truncate">
                {sanitizeDisplayString(doc.name)}
              </h3>

              <div className="flex flex-col gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <span>📊</span>
                  <span>{formatFileSize(doc.size)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📅</span>
                  <span>{formatDate(doc.uploadDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🏷️</span>
                  <span className="truncate">{doc.type || 'text/plain'}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={documentToDelete !== null}
        onClose={handleCancelDelete}
        icon="🗑️"
        title="Delete Document?"
        description={`Are you sure you want to delete "${documentToDelete ? sanitizeDisplayString(documentToDelete.name) : ''}"? This will also remove all Q&A history for this document.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        isLoading={deletingId !== null}
        variant="danger"
      />
    </PageContainer>
  );
};
