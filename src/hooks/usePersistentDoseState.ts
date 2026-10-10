import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export function usePersistentDoseState<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;

    try {
      const stored = window.localStorage.getItem(key);
      return stored ? { ...initialValue, ...JSON.parse(stored) } : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Private browsing or storage restrictions should not block calculation.
    }
  }, [key, value]);

  return [value, setValue];
}

