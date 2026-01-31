import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, action }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6 sm:mb-8">
      <div className="min-w-0 flex-1">
        <h2 className={`text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 ${subtitle ? 'mb-2 sm:mb-3' : ''}`}>
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
