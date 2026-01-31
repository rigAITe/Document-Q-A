import { renderHook, act } from '@testing-library/react';
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
    
    act(() => {
      result.current[1]('updated');
    });

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
    
    act(() => {
      result.current[1]({ name: 'updated', count: 5 });
    });

    const stored = JSON.parse(localStorage.getItem('test-object') || '{}');
    expect(stored).toEqual({ name: 'updated', count: 5 });
  });

  it('should revive date strings back to Date objects', () => {
    const testDate = new Date('2024-01-15T10:30:00.000Z');
    localStorage.setItem('test-date', JSON.stringify({ createdAt: testDate }));
    
    const { result } = renderHook(() => 
      useLocalStorage('test-date', { createdAt: new Date() })
    );
    
    expect(result.current[0].createdAt).toBeInstanceOf(Date);
    expect(result.current[0].createdAt.toISOString()).toBe('2024-01-15T10:30:00.000Z');
  });
});
