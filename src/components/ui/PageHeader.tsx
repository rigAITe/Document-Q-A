import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, action }) => {
  return (
    <div className="flex justify-between items-start mb-8">
      <div>
        <h2 className={`text-3xl font-bold text-gray-900 dark:text-gray-100 ${subtitle ? 'mb-3' : ''}`}>
          {title}
        </h2>
        {subtitle && (
          <p className="text-base text-gray-500 dark:text-gray-400">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};
