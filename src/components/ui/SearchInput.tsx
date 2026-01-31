import React from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  resultsCount?: number;
  showResultsCount?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  resultsCount,
  showResultsCount = false,
}) => {
  return (
    <div className="mb-8 relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input pr-11"
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none">
        🔍
      </div>
      {showResultsCount && value && resultsCount !== undefined && (
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Found {resultsCount} result{resultsCount !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};
