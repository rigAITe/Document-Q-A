import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

export const Sidebar: React.FC = () => {
  const { theme, toggleTheme, documents } = useApp();

  const getLinkClass = (isActive: boolean): string => {
    const base = 'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm';
    if (isActive) {
      return `${base} bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold`;
    }
    return `${base} text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800`;
  };

  return (
    <aside className="w-72 h-screen bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col p-5">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
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
          onClick={toggleTheme}
          className="flex items-center gap-3 px-4 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-gray-100 text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <div className="text-xs text-gray-500 dark:text-gray-400 px-4 space-y-1">
          <div>⌘/Ctrl + U: Upload</div>
          <div>⌘/Ctrl + F: Search</div>
          <div>Esc: Clear</div>
        </div>
      </div>
    </aside>
  );
};
