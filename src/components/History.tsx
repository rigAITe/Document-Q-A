import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { useDebounce } from '@/hooks/useDebounce';
import { PageContainer, PageHeader, EmptyState, Button, QACard, SearchInput } from './ui';

export const History: React.FC = () => {
  const { qaHistory, documents, searchQAHistory, exportQAHistory } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearch = useDebounce(searchQuery, 300);

  const filteredHistory = useMemo(() => {
    return searchQAHistory(debouncedSearch);
  }, [debouncedSearch, searchQAHistory]);

  const getDocumentName = (documentId: string): string => {
    const doc = documents.find((d) => d.id === documentId);
    return doc ? doc.name : 'Unknown Document';
  };

  const subtitle =
    qaHistory.length === 0
      ? 'No Q&A history yet'
      : `${qaHistory.length} question${qaHistory.length !== 1 ? 's' : ''} asked across all documents`;

  const renderExportButton = (): React.ReactNode => {
    if (qaHistory.length === 0) return null;

    return (
      <Button variant="secondary" icon="📥" onClick={exportQAHistory}>
        Export History
      </Button>
    );
  };

  const renderContent = (): React.ReactNode => {
    if (qaHistory.length === 0) {
      return (
        <EmptyState
          icon="📝"
          title="No history yet"
          description="Start asking questions to build your Q&A history"
          size="lg"
        />
      );
    }

    if (filteredHistory.length === 0) {
      return (
        <EmptyState
          icon="🔍"
          title="No results found"
          description="Try a different search term"
          size="md"
        />
      );
    }

    return (
      <div className="flex flex-col gap-5">
        {filteredHistory.map((qa) => (
          <QACard
            key={qa.id}
            qa={qa}
            documentName={getDocumentName(qa.documentId)}
            showDocumentTag
          />
        ))}
      </div>
    );
  };

  return (
    <PageContainer>
      <PageHeader title="Q&A History" subtitle={subtitle} action={renderExportButton()} />

      {qaHistory.length > 0 && (
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search questions and answers... (⌘/Ctrl + F)"
          resultsCount={filteredHistory.length}
          showResultsCount={!!debouncedSearch}
        />
      )}

      {renderContent()}
    </PageContainer>
  );
};
