import { useState, useCallback } from 'react';

// ISO date string pattern for reviving dates from JSON
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;

/**
 * Reviver function for JSON.parse that converts ISO date strings back to Date objects
 */
function dateReviver(_key: string, value: unknown): unknown {
  if (typeof value === 'string' && ISO_DATE_REGEX.test(value)) {
    const date = new Date(value);
    // Only return Date if it's valid
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  return value;
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        return JSON.parse(item, dateReviver) as T;
      }
      return initialValue;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[useLocalStorage] Error loading "${key}" from localStorage:`, error);
      }
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((prev: T) => T)): void => {
    try {
      setStoredValue(prevValue => {
        const valueToStore = value instanceof Function ? value(prevValue) : value;
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        return valueToStore;
      });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[useLocalStorage] Error saving "${key}" to localStorage:`, error);
      }
    }
  }, [key]);

  return [storedValue, setValue];
}
