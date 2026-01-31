import React from 'react';

type ProgressStatus = 'pending' | 'uploading' | 'completed' | 'error';

interface ProgressBarProps {
  progress: number;
  status: ProgressStatus;
  label?: string;
  error?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  status,
  label,
  error,
}) => {
  const getStatusLabel = (): string => {
    if (label) return label;
    switch (status) {
      case 'uploading':
        return '⏳ Uploading...';
      case 'completed':
        return '✓ Completed';
      case 'error':
        return '✕ Failed';
      default:
        return 'Pending';
    }
  };

  const getBarColorClass = (): string => {
    switch (status) {
      case 'error':
        return 'bg-red-500';
      case 'completed':
        return 'bg-green-500';
      default:
        return 'bg-primary-500';
    }
  };

  return (
    <div className="card p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {getStatusLabel()}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">{progress}%</span>
      </div>
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${getBarColorClass()}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </div>
  );
};
