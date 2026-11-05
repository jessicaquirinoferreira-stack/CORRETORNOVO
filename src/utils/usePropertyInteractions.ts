import { useState, useEffect, useCallback } from 'react';
import { Property } from '../types';

const FAVORITES_STORAGE_KEY = 'dp_favorites_ids';

export function usePropertyFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = useCallback((propertyId: string) => {
    setFavoriteIds((prev) => {
      const exists = prev.includes(propertyId);
      const updated = exists ? prev.filter((id) => id !== propertyId) : [...prev, propertyId];
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // quota safe
      }
      return updated;
    });
  }, []);

  const isFavorite = useCallback(
    (propertyId: string) => favoriteIds.includes(propertyId),
    [favoriteIds]
  );

  return { favoriteIds, toggleFavorite, isFavorite };
}
