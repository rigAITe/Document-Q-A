import React from 'react';

interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  hoverable?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
}

const paddingClasses = {
  sm: 'p-2.5 sm:p-3',
  md: 'p-4 sm:p-5',
  lg: 'p-5 sm:p-6',
};

export const Card: React.FC<CardProps> = ({
  children,
  onClick,
  hoverable = false,
  padding = 'md',
  className = '',
}) => {
  const hoverClass = hoverable || onClick ? 'card-hover cursor-pointer' : '';

  return (
    <div
      onClick={onClick}
      className={`card ${paddingClasses[padding]} ${hoverClass} ${className}`}
    >
      {children}
    </div>
  );
};
