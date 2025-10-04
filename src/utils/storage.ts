import type { UserPreferences } from '@/types/article';

const PREFERENCES_KEY = 'news_aggregator_preferences';

/**
 * Default user preferences
 */
export const defaultPreferences: UserPreferences = {
  sources: ['newsapi', 'guardian', 'nytimes'],
  categories: [],
  authors: [],
};

/**
 * Storage utility for user preferences
 */
export class PreferencesStorage {
  /**
   * Saves user preferences to localStorage
   */
  static save(preferences: UserPreferences): void {
    try {
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  /**
   * Loads user preferences from localStorage
   */
  static load(): UserPreferences {
    try {
      const stored = localStorage.getItem(PREFERENCES_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
    return defaultPreferences;
  }

  /**
   * Clears user preferences
   */
  static clear(): void {
    try {
      localStorage.removeItem(PREFERENCES_KEY);
    } catch (error) {
      console.error('Failed to clear preferences:', error);
    }
  }
}
