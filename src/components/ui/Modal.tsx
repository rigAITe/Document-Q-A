import React from 'react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon?: string;
  children?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  isLoading?: boolean;
  variant?: 'default' | 'danger';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  icon,
  children,
  confirmLabel,
  cancelLabel = 'Cancel',
  onConfirm,
  isLoading = false,
  variant = 'default',
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (): void => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="card p-6 max-w-md w-full shadow-2xl animate-slide-up"
      >
        <div className={`text-center ${children ? 'mb-4' : 'mb-5'}`}>
          {icon && <div className="text-5xl mb-4">{icon}</div>}
          <h3 className={`text-xl font-semibold text-gray-900 dark:text-gray-100 ${description ? 'mb-2' : ''}`}>
            {title}
          </h3>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {children && <div className="mb-5">{children}</div>}

        {(confirmLabel || cancelLabel) && (
          <div className="flex gap-3 justify-center">
            <Button variant="secondary" onClick={onClose} disabled={isLoading}>
              {cancelLabel}
            </Button>
            {confirmLabel && onConfirm && (
              <Button
                variant={variant === 'danger' ? 'danger' : 'primary'}
                onClick={onConfirm}
                isLoading={isLoading}
                className="min-w-[100px]"
              >
                {confirmLabel}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
