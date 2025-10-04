import { PreferencesStorage, defaultPreferences } from '../storage';
import type { UserPreferences } from '@/types/article';

describe('PreferencesStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('save', () => {
    it('should save preferences to localStorage', () => {
      const preferences: UserPreferences = {
        sources: ['newsapi', 'guardian'],
        categories: ['technology', 'science'],
        authors: [],
      };

      PreferencesStorage.save(preferences);

      const stored = localStorage.getItem('news_aggregator_preferences');
      expect(stored).toBeTruthy();
      expect(JSON.parse(stored!)).toEqual(preferences);
    });

    it('should handle errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const mockStorage = jest.spyOn(Storage.prototype, 'setItem');
      mockStorage.mockImplementation(() => {
        throw new Error('Storage error');
      });

      PreferencesStorage.save(defaultPreferences);

      expect(consoleSpy).toHaveBeenCalled();

      mockStorage.mockRestore();
      consoleSpy.mockRestore();
    });
  });

  describe('load', () => {
    it('should load preferences from localStorage', () => {
      const preferences: UserPreferences = {
        sources: ['nytimes'],
        categories: ['business'],
        authors: ['John Doe'],
      };

      localStorage.setItem('news_aggregator_preferences', JSON.stringify(preferences));

      const loaded = PreferencesStorage.load();

      expect(loaded).toEqual(preferences);
    });

    it('should return default preferences when nothing is stored', () => {
      const loaded = PreferencesStorage.load();

      expect(loaded).toEqual(defaultPreferences);
    });

    it('should return default preferences on parse error', () => {
      localStorage.setItem('news_aggregator_preferences', 'invalid json');

      const loaded = PreferencesStorage.load();

      expect(loaded).toEqual(defaultPreferences);
    });
  });

  describe('clear', () => {
    it('should clear preferences from localStorage', () => {
      localStorage.setItem('news_aggregator_preferences', JSON.stringify(defaultPreferences));

      PreferencesStorage.clear();

      expect(localStorage.getItem('news_aggregator_preferences')).toBeNull();
    });
  });
});
