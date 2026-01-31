import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { PageContainer, PageHeader, EmptyState } from './ui';
import { sanitizeDisplayString } from '@/utils/sanitize';
import { DocumentSelector, ChatMessageList, QuestionInputForm } from './qa';
import { useClickOutside } from '@/hooks/useClickOutside';
import { MAX_QUESTION_LENGTH } from '@/config/constants';
import { logger } from '@/utils/logger';

export const QAInterface: React.FC = () => {
  const { documents, selectedDocumentId, selectDocument, askQuestion, qaHistory, showToast, isUsingRealApi } =
    useApp();
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isDocMenuOpen, setIsDocMenuOpen] = useState(false);
  const docMenuRef = useRef<HTMLDivElement>(null);

  const selectedDocument = documents.find((doc) => doc.id === selectedDocumentId);
  const documentQA = qaHistory.filter((qa) => qa.documentId === selectedDocumentId);
  const orderedQA = useMemo(() => [...documentQA].reverse(), [documentQA]);

  useEffect(() => {
    if (!selectedDocumentId && documents.length > 0) {
      selectDocument(documents[0].id);
    }
  }, [selectedDocumentId, documents, selectDocument]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [orderedQA.length, isAsking]);

  useClickOutside(docMenuRef, () => setIsDocMenuOpen(false), isDocMenuOpen);

  const handleQuestionValueChange = (value: string): void => {
    if (value.length <= MAX_QUESTION_LENGTH) {
      setQuestion(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!isUsingRealApi) {
      showToast('warning', 'OpenAI API key required. Please add your key in API Settings.');
      return;
    }

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

    const selectedName = selectedDocument?.name || 'Select a document';

    return (
      <DocumentSelector
        documents={documents}
        selectedDocumentId={selectedDocumentId}
        selectedName={selectedName}
        isOpen={isDocMenuOpen}
        onToggle={() => setIsDocMenuOpen(prev => !prev)}
        onSelect={(id) => {
          selectDocument(id);
          setIsDocMenuOpen(false);
        }}
        menuRef={docMenuRef}
      />
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
      <div className="flex flex-col h-full min-h-0">
        <div className="flex items-center justify-between mb-4">
          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 truncate">
              {sanitizeDisplayString(selectedDocument?.name ?? '')}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isUsingRealApi ? 'AI mode: OpenAI' : 'AI mode: Disabled'}
            </p>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
            ⌘/Ctrl + Enter to send
          </div>
        </div>

        {!isUsingRealApi && (
          <div className="mb-4 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-3 text-sm text-amber-700 dark:text-amber-300">
            OpenAI API key required. Add your key in <strong>API Settings</strong> to enable chat.
          </div>
        )}

        <div className="flex-1 min-h-0 overflow-y-auto pr-1 scrollbar-thin rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 px-3 sm:px-4 py-4 pb-28">
          {orderedQA.length === 0 ? (
            <EmptyState
              icon="💬"
              title="Start the conversation"
              description="Ask your first question about the document."
              size="sm"
            />
          ) : (
            <>
              <ChatMessageList messages={orderedQA} />
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <QuestionInputForm
          value={question}
          isAsking={isAsking}
          isUsingRealApi={isUsingRealApi}
          characterCount={characterCount}
          characterCountClass={characterCountClass}
          textareaRef={textareaRef}
          onChange={handleQuestionValueChange}
          onKeyDown={handleKeyDown}
          onSubmit={handleSubmit}
        />
      </div>
    );
  };

  return (
    <PageContainer className="pt-2 sm:pt-4 lg:pt-10">
      <div className="flex flex-col min-h-[calc(100dvh-140px)] pb-28">
        <div className="hidden lg:block mb-6">
          <PageHeader
            title="Ask Questions"
            subtitle="Select a document and ask questions about its content"
          />
        </div>

        <div className="mb-6">
          {renderDocumentSelect()}
        </div>

        <div className="flex-1 min-h-0">
          {renderContent()}
        </div>
      </div>
    </PageContainer>
  );
};
