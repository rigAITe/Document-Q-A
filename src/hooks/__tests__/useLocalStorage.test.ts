import { renderHook } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with default value', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('should update localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    const [, setValue] = result.current;
    setValue('updated');

    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('updated'));
  });

  it('should retrieve value from localStorage on mount', () => {
    localStorage.setItem('test-key', JSON.stringify('stored'));
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('stored');
  });

  it('should handle complex objects', () => {
    const { result } = renderHook(() => 
      useLocalStorage('test-object', { name: 'test', count: 0 })
    );
    
    const [, setValue] = result.current;
    setValue({ name: 'updated', count: 5 });

    const stored = JSON.parse(localStorage.getItem('test-object') || '{}');
    expect(stored).toEqual({ name: 'updated', count: 5 });
  });
});
