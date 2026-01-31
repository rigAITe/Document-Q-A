import React from 'react';
import { Button } from '@/components/ui';
import { MAX_QUESTION_LENGTH } from '@/config/constants';

interface QuestionInputFormProps {
  value: string;
  isAsking: boolean;
  isUsingRealApi: boolean;
  characterCount: number;
  characterCountClass: string;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const QuestionInputForm: React.FC<QuestionInputFormProps> = ({
  value,
  isAsking,
  isUsingRealApi,
  characterCount,
  characterCountClass,
  textareaRef,
  onChange,
  onKeyDown,
  onSubmit,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="fixed bottom-0 left-0 right-0 lg:left-72 z-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-t border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-10 py-3"
    >
      <div className="max-w-5xl mx-auto">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask a question about the document..."
            disabled={isAsking}
            rows={2}
            className="w-full p-3 pb-12 border border-gray-200 dark:border-gray-700 rounded-xl outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm resize-none"
          />
          <div className="absolute bottom-3 right-3">
            <button
              type="submit"
              aria-label="Send"
              disabled={!value.trim() || isAsking || !isUsingRealApi}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                !value.trim() || isAsking || !isUsingRealApi
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-primary-500 text-white hover:bg-primary-600'
              }`}
            >
              {isAsking ? (
                <span className="animate-pulse">⏳</span>
              ) : (
                <span>➤</span>
              )}
            </button>
          </div>
        </div>
        <div className="mt-2 text-xs font-medium text-gray-500 dark:text-gray-400">
          <span className={characterCountClass}>
            {characterCount} / {MAX_QUESTION_LENGTH}
          </span>
        </div>
      </div>
    </form>
  );
};
