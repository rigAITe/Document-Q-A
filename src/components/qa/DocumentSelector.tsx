import React from 'react';
import type { Document } from '@/types';
import { sanitizeDisplayString } from '@/utils/sanitize';

interface DocumentSelectorProps {
  documents: Document[];
  selectedDocumentId: string | null;
  selectedName: string;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (documentId: string) => void;
  menuRef: React.RefObject<HTMLDivElement>;
}

export const DocumentSelector: React.FC<DocumentSelectorProps> = ({
  documents,
  selectedDocumentId,
  selectedName,
  isOpen,
  onToggle,
  onSelect,
  menuRef,
}) => {
  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-left hover:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate text-gray-900 dark:text-gray-100">{sanitizeDisplayString(selectedName)}</span>
        <span className="text-gray-500">▾</span>
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute z-10 mt-2 w-full max-h-64 overflow-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl"
        >
          {documents.map((doc) => (
            <button
              key={doc.id}
              type="button"
              role="option"
              aria-selected={doc.id === selectedDocumentId}
              onClick={() => onSelect(doc.id)}
              className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${
                doc.id === selectedDocumentId
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                  : 'text-gray-700 dark:text-gray-200'
              }`}
            >
              <span className="truncate">{sanitizeDisplayString(doc.name)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
