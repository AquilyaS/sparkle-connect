import React, { createContext, useState, useCallback, useEffect } from 'react';
import type { ToastMessage } from '../types';
import { get, set, KEYS, generateId } from '../utils/storage';

interface AppContextType {
  toast: ToastMessage | null;
  favorites: string[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  toggleFavorite: (cleanerId: string) => void;
  isFavorite: (cleanerId: string) => boolean;
}

export const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const saved = get<string[]>(KEYS.favorites);
    if (saved) setFavorites(saved);
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = generateId();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast(prev => (prev?.id === id ? null : prev));
    }, 3500);
  }, []);

  const toggleFavorite = useCallback((cleanerId: string) => {
    setFavorites(prev => {
      const next = prev.includes(cleanerId)
        ? prev.filter(id => id !== cleanerId)
        : [...prev, cleanerId];
      set(KEYS.favorites, next);
      return next;
    });
  }, []);

  const isFavorite = useCallback((cleanerId: string) => favorites.includes(cleanerId), [favorites]);

  return (
    <AppContext.Provider value={{ toast, favorites, showToast, toggleFavorite, isFavorite }}>
      {children}
    </AppContext.Provider>
  );
}
