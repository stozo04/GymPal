
import { UserData } from "../types";

// A robust LocalStorage wrapper that mimics the Firestore behavior from the user's provided code.
// This allows the app to function immediately without backend configuration.

const STORAGE_KEY = 'gympal_data_v3';

export const storageService = {
  getUserData: (): UserData | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error("Storage read error", e);
      return null;
    }
  },

  saveUserData: (data: Partial<UserData>): void => {
    try {
      const current = storageService.getUserData() || {};
      const merged = { ...current, ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } catch (e) {
      console.error("Storage write error", e);
    }
  },

  // Mimic Firestore 'onSnapshot'
  subscribe: (callback: (data: UserData | null) => void) => {
    // Initial call
    callback(storageService.getUserData());

    // Listen for storage events (cross-tab sync)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        callback(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }
};
