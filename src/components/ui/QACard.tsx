import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { sanitizeDisplayString } from '@/utils/sanitize';
import type { QAPair } from '@/types';

interface QACardProps {
  qa: QAPair;
  documentName?: string;
  showDocumentTag?: boolean;
}

export const QACard: React.FC<QACardProps> = ({
  qa,
  documentName,
  showDocumentTag = false,
}) => {
  return (
    <div className="card p-4 sm:p-5">
      {showDocumentTag && documentName && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs font-semibold text-primary-600 dark:text-primary-400 truncate max-w-full sm:max-w-[60%]">
            📄 {documentName ? sanitizeDisplayString(documentName) : ''}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">
            {new Date(qa.timestamp).toLocaleString()}
          </span>
        </div>
      )}

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg sm:text-xl">❓</span>
          {!showDocumentTag && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(qa.timestamp).toLocaleString()}
            </span>
          )}
          {showDocumentTag && (
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              Question
            </span>
          )}
        </div>
        <p className={`text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 leading-relaxed ${showDocumentTag ? 'sm:ml-7' : ''}`}>
          {qa.question}
        </p>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg sm:text-xl">💡</span>
          <span className={`text-sm font-semibold ${showDocumentTag ? 'text-gray-500 dark:text-gray-400' : 'text-primary-600 dark:text-primary-400'}`}>
            Answer
          </span>
        </div>
        <div className={`text-sm text-gray-900 dark:text-gray-100 leading-relaxed p-3 sm:p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 ${showDocumentTag ? 'sm:ml-7' : ''}`}>
          <div className="markdown">
            <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{qa.answer}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};
