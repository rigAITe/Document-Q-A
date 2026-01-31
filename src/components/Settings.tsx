import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Modal, Button } from './ui';
import { validateApiKey } from '@/utils/openaiApi';
import { maskApiKey } from '@/utils/formatters';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const { apiKey, setApiKey, showToast } = useApp();
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [isValidating, setIsValidating] = useState(false);
  const [showKey, setShowKey] = useState(false);

  // Sync input with stored key when modal opens
  useEffect(() => {
    if (isOpen) {
      setInputKey(apiKey || '');
    }
  }, [isOpen, apiKey]);

  const normalizedInput = inputKey.trim();
  const normalizedStored = (apiKey || '').trim();
  const hasChanges = normalizedInput !== normalizedStored;
  const canSave = hasChanges && normalizedInput.length > 0 && !isValidating;

  const handleSave = async (): Promise<void> => {
    const trimmedKey = normalizedInput;
    
    if (!trimmedKey) {
      // Allow clearing the API key
      setApiKey(null);
      showToast('info', 'API key cleared. AI chat disabled.');
      onClose();
      return;
    }

    // Validate the API key
    setIsValidating(true);
    try {
      const isValid = await validateApiKey(trimmedKey);
      
      if (isValid) {
        setApiKey(trimmedKey);
        showToast('success', 'API key saved successfully!');
        onClose();
      } else {
        showToast('error', 'Invalid API key. Please check and try again.');
      }
    } catch (error) {
      showToast('error', 'Failed to validate API key. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleClear = (): void => {
    setInputKey('');
    setApiKey(null);
    showToast('info', 'API key cleared. AI chat disabled.');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="API Settings"
      icon="⚙️"
      cancelLabel=""
    >
      <div className="space-y-4">
        <div>
          <label 
            htmlFor="api-key" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            OpenAI API Key
          </label>
          <div className="relative">
            <input
              id="api-key"
              type={showKey ? 'text' : 'password'}
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="sk-..."
              className="input pr-20"
              disabled={isValidating}
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {showKey ? 'Hide' : 'Show'}
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Your API key is stored locally and never sent to our servers.
          </p>
        </div>

        {apiKey && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400 overflow-hidden">
              <span className="shrink-0">✓</span>
              <span className="truncate max-w-full">
                API key configured: {maskApiKey(apiKey)}
              </span>
            </div>
          </div>
        )}

        {!apiKey && (
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400">
              <span>⚠️</span>
              <span>No API key set. AI chat is disabled.</span>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p>
            <strong>How to get an API key:</strong>
          </p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Go to <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">OpenAI Platform</a></li>
            <li>Create an account or sign in</li>
            <li>Navigate to API Keys section</li>
            <li>Create a new secret key</li>
          </ol>
        </div>

        <div className="flex gap-3 pt-2">
          {apiKey && (
            <Button variant="ghost" onClick={handleClear} disabled={isValidating}>
              Clear Key
            </Button>
          )}
          <div className="flex-1" />
          <Button variant="secondary" onClick={onClose} disabled={isValidating}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSave} 
            isLoading={isValidating}
            disabled={!canSave}
          >
            {isValidating ? 'Validating...' : 'Save'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
