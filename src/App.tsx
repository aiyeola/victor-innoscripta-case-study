import { useState, useMemo } from 'react';
import { usePreferences } from './context/PreferencesContext';
import { useArticles } from './hooks/useArticles';
import { newsService } from './services/news.service';
import { SearchBar } from './components/SearchBar';
import { FilterPanel } from './components/FilterPanel';
import { ArticleCard } from './components/ArticleCard';
import { PreferencesModal } from './components/PreferencesModal';
import { ArticleGridSkeleton } from './components/LoadingState';
import { EmptyState, ErrorState } from './components/EmptyState';
import type { ArticleFilters } from './types/article';

function App() {
  const { preferences, updatePreferences } = usePreferences();
  const [filters, setFilters] = useState<ArticleFilters>({});
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  // Fetch articles using preferences
  const { data: articles, isLoading, error, refetch } = useArticles(
    preferences.sources,
    filters
  );

  // Apply client-side filtering based on preferences
  const filteredArticles = useMemo(() => {
    if (!articles) return [];

    let filtered = articles;

    // Filter by preferred categories if set
    if (preferences.categories.length > 0) {
      filtered = filtered.filter(article =>
        preferences.categories.includes(article.category as any)
      );
    }

    // Apply any additional filters
    return newsService.filterArticles(filtered, filters);
  }, [articles, preferences.categories, filters]);

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, query: query || undefined }));
  };

  const handleFiltersChange = (newFilters: ArticleFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">News Aggregator</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Stay informed with news from multiple sources
              </p>
            </div>
            <button
              onClick={() => setIsPreferencesOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Preferences
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <FilterPanel
              onFiltersChange={handleFiltersChange}
              initialFilters={filters}
            />
          </aside>

          {/* Articles Grid */}
          <div className="flex-1">
            {isLoading && <ArticleGridSkeleton />}

            {error && (
              <ErrorState
                error={error instanceof Error ? error.message : 'Failed to load articles'}
                onRetry={() => refetch()}
              />
            )}

            {!isLoading && !error && filteredArticles.length === 0 && (
              <EmptyState
                title="No articles found"
                description="Try adjusting your filters or search query to find more articles."
                action={{
                  label: 'Clear Filters',
                  onClick: () => setFilters({}),
                }}
              />
            )}

            {!isLoading && !error && filteredArticles.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm text-muted-foreground">
                    Found {filteredArticles.length} articles
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Preferences Modal */}
      <PreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        preferences={preferences}
        onSave={updatePreferences}
      />
    </div>
  );
}

export default App;
