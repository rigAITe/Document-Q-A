import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { QAPair } from '@/types';

interface ChatMessageListProps {
  messages: QAPair[];
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages }) => {
  return (
    <div className="flex flex-col gap-4">
      {messages.map((qa) => (
        <div key={qa.id} className="flex flex-col gap-3">
          <div className="flex justify-end">
            <div className="max-w-[85%] sm:max-w-[70%] bg-primary-500 text-white rounded-2xl px-4 py-3">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{qa.question}</p>
              <div className="mt-1 text-[10px] text-primary-100">
                You · {new Date(qa.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
          <div className="flex justify-start">
            <div className="max-w-[85%] sm:max-w-[70%] bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl px-3 sm:px-4 py-3 border border-gray-200 dark:border-gray-700">
              <div className="markdown text-sm leading-relaxed">
                <ReactMarkdown>{qa.answer}</ReactMarkdown>
              </div>
              <div className="mt-1 text-[10px] text-gray-500 dark:text-gray-400">
                AI · {new Date(qa.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
