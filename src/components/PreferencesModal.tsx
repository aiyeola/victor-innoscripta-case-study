import { useState, useEffect } from 'react';
import type { UserPreferences, NewsSource, Category } from '@/types/article';
import { NEWS_SOURCES, CATEGORIES } from '@/types/article';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onSave: (preferences: UserPreferences) => void;
}

export function PreferencesModal({
  isOpen,
  onClose,
  preferences,
  onSave,
}: PreferencesModalProps) {
  const [localPreferences, setLocalPreferences] = useState<UserPreferences>(preferences);

  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  const toggleSource = (source: NewsSource) => {
    const newSources = localPreferences.sources.includes(source)
      ? localPreferences.sources.filter((s) => s !== source)
      : [...localPreferences.sources, source];
    setLocalPreferences({ ...localPreferences, sources: newSources });
  };

  const toggleCategory = (category: Category) => {
    const newCategories = localPreferences.categories.includes(category)
      ? localPreferences.categories.filter((c) => c !== category)
      : [...localPreferences.categories, category];
    setLocalPreferences({ ...localPreferences, categories: newCategories });
  };

  const handleSave = () => {
    onSave(localPreferences);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Personalize Your Feed</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close preferences"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Preferred Sources */}
          <div>
            <h3 className="text-lg font-medium mb-3">Preferred Sources</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Select which news sources you want to see articles from
            </p>
            <div className="space-y-3">
              {Object.entries(NEWS_SOURCES).map(([key, label]) => (
                <label
                  key={key}
                  className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={localPreferences.sources.includes(key as NewsSource)}
                    onChange={() => toggleSource(key as NewsSource)}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="font-medium">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Preferred Categories */}
          <div>
            <h3 className="text-lg font-medium mb-3">Preferred Categories</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Choose topics you're interested in (optional)
            </p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                    localPreferences.categories.includes(category)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-accent transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
