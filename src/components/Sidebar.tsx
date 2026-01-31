import React, { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSettingsClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose, onSettingsClick }) => {
  const { theme, toggleTheme, documents, isUsingRealApi } = useApp();
  const location = useLocation();
  const previousPathRef = useRef(location.pathname);

  // Close sidebar on route change (mobile) - only on actual navigation, not initial mount
  useEffect(() => {
    if (previousPathRef.current !== location.pathname) {
      previousPathRef.current = location.pathname;
      if (onClose) {
        onClose();
      }
    }
  }, [location.pathname, onClose]);

  const getLinkClass = (isActive: boolean): string => {
    const base = 'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm min-h-[44px]';
    if (isActive) {
      return `${base} bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold`;
    }
    return `${base} text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800`;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 h-[100dvh] bg-gray-50 dark:bg-gray-800 
          border-r border-gray-200 dark:border-gray-700 
          flex flex-col p-5 pb-safe overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 lg:hidden"
          aria-label="Close menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-8">
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Document Q&A
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            AI-Powered Assistant
          </p>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          <NavLink to="/" className={({ isActive }) => getLinkClass(isActive)}>
            <span>📤</span>
            <span>Upload</span>
          </NavLink>
          <NavLink to="/documents" className={({ isActive }) => getLinkClass(isActive)}>
            <span>📚</span>
            <span>Documents</span>
            {documents.length > 0 && (
              <span className="ml-auto bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl px-2 py-0.5 text-xs font-semibold">
                {documents.length}
              </span>
            )}
          </NavLink>
          <NavLink to="/qa" className={({ isActive }) => getLinkClass(isActive)}>
            <span>💬</span>
            <span>Q&A</span>
          </NavLink>
          <NavLink to="/history" className={({ isActive }) => getLinkClass(isActive)}>
            <span>📋</span>
            <span>History</span>
          </NavLink>
        </nav>

        <div className="pt-5 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-3">
          <button
            onClick={onSettingsClick}
            className="flex items-center gap-2 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 min-h-[44px] min-w-0"
          >
            <span className="shrink-0">⚙️</span>
            <span className="truncate">API Settings</span>
            {isUsingRealApi ? (
              <span className="ml-auto text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full whitespace-nowrap">
                Connected
              </span>
            ) : (
              <span className="ml-auto text-xs px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full whitespace-nowrap">
                Required
              </span>
            )}
          </button>
          
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-4 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-gray-100 text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 min-h-[44px]"
          >
            <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <div className="text-xs text-gray-500 dark:text-gray-400 px-4 space-y-1 hidden lg:block">
            <div>⌘/Ctrl + U: Upload</div>
            <div>⌘/Ctrl + F: Search</div>
            <div>Esc: Clear</div>
          </div>
        </div>
      </aside>
    </>
  );
};

// Mobile header with hamburger menu
export const MobileHeader: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 z-30 lg:hidden">
      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label="Open menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
        Document Q&A
      </h1>
      <div className="w-10" /> {/* Spacer for centering */}
    </header>
  );
};
