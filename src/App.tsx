import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { AppProvider, useApp } from '@/context/AppContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Sidebar } from '@/components/Sidebar';
import { Toast } from '@/components/Toast';
import { Upload } from '@/components/Upload';
import { DocumentLibrary } from '@/components/DocumentLibrary';
import { QAInterface } from '@/components/QAInterface';
import { History } from '@/components/History';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

const AppContent: React.FC = () => {
  const { theme } = useApp();
  const navigate = useNavigate();

  // Apply dark mode class to html element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Global keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'u',
      metaKey: true,
      ctrlKey: true,
      callback: () => navigate('/'),
    },
    {
      key: 'f',
      metaKey: true,
      ctrlKey: true,
      callback: () => {
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        } else {
          navigate('/history');
        }
      },
    },
    {
      key: 'Escape',
      callback: () => {
        const inputs = document.querySelectorAll('input, textarea') as NodeListOf<HTMLInputElement | HTMLTextAreaElement>;
        inputs.forEach(input => {
          input.value = '';
          input.dispatchEvent(new Event('input', { bubbles: true }));
        });
      },
    },
  ]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Upload />} />
          <Route path="/documents" element={<DocumentLibrary />} />
          <Route path="/qa" element={<QAInterface />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </main>
      <Toast />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
