import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { AppProvider, useApp } from '@/context/AppContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Sidebar, MobileHeader } from '@/components/Sidebar';
import { Toast } from '@/components/Toast';
import { Upload } from '@/components/Upload';
import { DocumentLibrary } from '@/components/DocumentLibrary';
import { QAInterface } from '@/components/QAInterface';
import { History } from '@/components/History';
import { Settings } from '@/components/Settings';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

const AppContent: React.FC = () => {
  const { theme } = useApp();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Apply dark mode class to html element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  // Callbacks for keyboard shortcuts (memoized to prevent recreation)
  const handleUploadShortcut = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleSearchShortcut = useCallback(() => {
    const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    } else {
      navigate('/history');
    }
  }, [navigate]);

  const handleEscapeShortcut = useCallback(() => {
    // Close mobile menu if open
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
      return;
    }
    // Only clear the currently focused input, not all inputs
    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement) {
      activeElement.value = '';
      activeElement.dispatchEvent(new Event('input', { bubbles: true }));
      activeElement.blur();
    }
  }, [isSidebarOpen]);

  // Memoize keyboard shortcuts to prevent effect re-runs
  const shortcuts = useMemo(() => [
    {
      key: 'u',
      metaKey: true,
      ctrlKey: true,
      callback: handleUploadShortcut,
    },
    {
      key: 'f',
      metaKey: true,
      ctrlKey: true,
      callback: handleSearchShortcut,
    },
    {
      key: 'Escape',
      callback: handleEscapeShortcut,
    },
  ], [handleUploadShortcut, handleSearchShortcut, handleEscapeShortcut]);

  useKeyboardShortcuts(shortcuts);

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      {/* Mobile header */}
      <MobileHeader onMenuClick={() => setIsSidebarOpen(true)} />
      
      {/* Sidebar - hidden on mobile, shown via hamburger */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={closeSidebar} 
        onSettingsClick={() => setIsSettingsOpen(true)}
      />
      
      {/* Main content - adjusted for mobile header */}
      <main className="flex-1 overflow-auto pt-14 lg:pt-0">
        <Routes>
          <Route path="/" element={<Upload />} />
          <Route path="/documents" element={<DocumentLibrary />} />
          <Route path="/qa" element={<QAInterface />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </main>
      
      {/* Modals */}
      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
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
