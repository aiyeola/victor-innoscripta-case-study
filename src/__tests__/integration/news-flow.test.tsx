import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PreferencesProvider } from '@/context/PreferencesContext';
import App from '@/App';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = createTestQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <PreferencesProvider>{ui}</PreferencesProvider>
    </QueryClientProvider>
  );
}

describe('News Aggregator Integration Tests', () => {
  it('should load and display articles from multiple sources', async () => {
    renderWithProviders(<App />);

    // Check that the app header is displayed
    expect(screen.getByText('News Aggregator')).toBeInTheDocument();

    // Wait for articles to load
    await waitFor(
      () => {
        expect(screen.getByText(/Test NewsAPI Article/i)).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    // Verify articles from different sources are displayed
    expect(screen.getByText(/Test Guardian Headline/i)).toBeInTheDocument();
    expect(screen.getByText(/Test NY Times Headline/i)).toBeInTheDocument();
  });

  it('should display preferences button', () => {
    renderWithProviders(<App />);

    const preferencesButton = screen.getByRole('button', { name: /preferences/i });
    expect(preferencesButton).toBeInTheDocument();
  });

  it('should display search bar', () => {
    renderWithProviders(<App />);

    const searchInput = screen.getByPlaceholderText(/search articles/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('should display filter panel', () => {
    renderWithProviders(<App />);

    const filtersButton = screen.getByText(/filters/i);
    expect(filtersButton).toBeInTheDocument();
  });
});
