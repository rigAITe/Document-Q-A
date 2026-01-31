import { useEffect } from 'react';

export const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  onOutside: () => void,
  isActive = true
): void => {
  useEffect(() => {
    if (!isActive) return;

    const handler = (event: MouseEvent): void => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onOutside();
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [ref, onOutside, isActive]);
};
