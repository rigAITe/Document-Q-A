import { Component, ReactNode, ErrorInfo } from 'react';
import { logger } from '@/utils/logger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div 
          role="alert"
          aria-live="assertive"
          className="flex flex-col items-center justify-center h-screen p-5 text-center bg-gray-50 dark:bg-gray-900"
        >
          <h1 className="text-red-500 text-2xl font-bold mb-5">Something went wrong</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-5">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary btn-md"
            aria-label="Reload the application"
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
