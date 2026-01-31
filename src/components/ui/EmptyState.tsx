import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: { container: 'py-8 px-5', icon: 'text-4xl', title: 'text-base' },
  md: { container: 'py-10 px-5', icon: 'text-5xl', title: 'text-lg' },
  lg: { container: 'py-16 px-5', icon: 'text-6xl', title: 'text-xl' },
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  size = 'md',
}) => {
  const styles = sizeClasses[size];

  return (
    <div className={`card text-center ${styles.container}`}>
      <div className={`${styles.icon} mb-4`}>{icon}</div>
      <h3 className={`${styles.title} font-semibold text-gray-900 dark:text-gray-100 mb-2`}>
        {title}
      </h3>
      <p className={`text-sm text-gray-500 dark:text-gray-400 ${actionLabel ? 'mb-6' : ''}`}>
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
