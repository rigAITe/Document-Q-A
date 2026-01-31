import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { PageContainer, PageHeader, EmptyState, Button, QACard } from './ui';
import { logger } from '@/utils/logger';

const MAX_QUESTION_LENGTH = 500;

export const QAInterface: React.FC = () => {
  const { documents, selectedDocumentId, selectDocument, askQuestion, qaHistory, showToast } =
    useApp();
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const selectedDocument = documents.find((doc) => doc.id === selectedDocumentId);
  const documentQA = qaHistory.filter((qa) => qa.documentId === selectedDocumentId);

  useEffect(() => {
    if (!selectedDocumentId && documents.length > 0) {
      selectDocument(documents[0].id);
    }
  }, [selectedDocumentId, documents, selectDocument]);

  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const value = e.target.value;
    if (value.length <= MAX_QUESTION_LENGTH) {
      setQuestion(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!question.trim()) {
      showToast('warning', 'Please enter a question');
      return;
    }

    if (!selectedDocumentId) {
      showToast('warning', 'Please select a document first');
      return;
    }

    setIsAsking(true);
    try {
      await askQuestion(selectedDocumentId, question.trim());
      setQuestion('');
      textareaRef.current?.focus();
    } catch (error) {
      logger.error('Failed to ask question:', error);
    } finally {
      setIsAsking(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e);
    }
  };

  const characterCount = question.length;
  const characterCountClass =
    characterCount > MAX_QUESTION_LENGTH * 0.9
      ? 'text-red-500'
      : characterCount > MAX_QUESTION_LENGTH * 0.7
      ? 'text-amber-500'
      : 'text-gray-500 dark:text-gray-400';

  const renderDocumentSelect = (): React.ReactNode => {
    if (documents.length === 0) return null;

    return (
      <select
        value={selectedDocumentId || ''}
        onChange={(e) => selectDocument(e.target.value || null)}
        className="input cursor-pointer"
      >
        <option value="">Select a document...</option>
        {documents.map((doc) => (
          <option key={doc.id} value={doc.id}>
            {doc.name}
          </option>
        ))}
      </select>
    );
  };

  const renderContent = (): React.ReactNode => {
    if (documents.length === 0) {
      return (
        <EmptyState
          icon="📚"
          title="No documents available"
          description="Upload documents first to start asking questions"
          size="lg"
        />
      );
    }

    if (!selectedDocumentId) {
      return (
        <EmptyState
          icon="👆"
          title="Select a document"
          description="Choose a document from the dropdown to start asking questions"
          size="lg"
        />
      );
    }

    return (
      <>
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="card p-4">
            <textarea
              ref={textareaRef}
              value={question}
              onChange={handleQuestionChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about the document..."
              disabled={isAsking}
              className="w-full min-h-[100px] p-0 border-none outline-none bg-transparent text-gray-900 dark:text-gray-100 text-base resize-y font-sans"
            />
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <span className={`text-sm font-medium ${characterCountClass}`}>
                {characterCount} / {MAX_QUESTION_LENGTH}
              </span>
              <div className="flex gap-3 items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ⌘/Ctrl + Enter to submit
                </span>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!question.trim() || isAsking}
                  isLoading={isAsking}
                  icon={isAsking ? undefined : '💬'}
                >
                  {isAsking ? 'Asking...' : 'Ask Question'}
                </Button>
              </div>
            </div>
          </div>
        </form>

        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-5">
            Q&A History for "{selectedDocument?.name}"
          </h3>

          {documentQA.length === 0 ? (
            <EmptyState
              icon="💭"
              title="No questions asked yet"
              description="Start by asking a question above."
              size="sm"
            />
          ) : (
            <div className="flex flex-col gap-5">
              {documentQA.map((qa) => (
                <QACard key={qa.id} qa={qa} />
              ))}
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <PageContainer>
      <div className="mb-8">
        <PageHeader
          title="Ask Questions"
          subtitle="Select a document and ask questions about its content"
        />
        {renderDocumentSelect()}
      </div>
      {renderContent()}
    </PageContainer>
  );
};
