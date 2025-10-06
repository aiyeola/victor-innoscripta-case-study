# News Aggregator

A modern, responsive news aggregation application built with React, TypeScript, and Vite. This application fetches and displays news articles from multiple sources including NewsAPI, The Guardian, and The New York Times.

## Features

### Core Functionality

- **Article Search & Filtering**: Search articles by keyword and filter by date, category, and source
- **Personalized News Feed**: Customize your feed by selecting preferred sources, categories, and authors
- **Mobile-Responsive Design**: Optimized for viewing on all device sizes
- **Multiple News Sources**: Aggregates news from NewsAPI, The Guardian, and The New York Times

### Technical Features

- **TypeScript**: Fully typed for better developer experience and code quality
- **React Query**: Efficient data fetching with caching and background updates
- **TailwindCSS v4**: Modern utility-first CSS framework with custom theming
- **Error Boundaries**: Graceful error handling with fallback UI
- **Loading States**: Skeleton loaders and loading indicators for better UX
- **Debounced Search**: Optimized search with debouncing to reduce API calls
- **LocalStorage Persistence**: User preferences saved locally
- **Comprehensive Testing**: Unit and integration tests with Jest and React Testing Library
- **Docker Support**: Containerized application for easy deployment

## Prerequisites

- Node.js 22.x or higher
- npm 10.x or higher
- Docker (optional, for containerized deployment)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd victor-innoscripta-case-study
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

The application requires API keys for the news sources. A `.env` file is already provided with the following variables:

```env
VITE_NEWS_API_KEY=your_newsapi_key
VITE_GUARDIAN_API_KEY=your_guardian_key
VITE_NEW_YORK_TIMES_API_KEY=your_nytimes_key
```

**Note**: The provided API keys are for development purposes. For production use, obtain your own API keys from:

- [NewsAPI](https://newsapi.org/)
- [The Guardian](https://open-platform.theguardian.com/)
- [The New York Times](https://developer.nytimes.com/)

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

### 6. Preview Production Build

```bash
npm run preview
```

## Running with Docker

### Prerequisites

Make sure you have a `.env` file in the project root with your API keys. You can copy the example file:

```bash
cp .env.example .env
```

Then edit `.env` and add your actual API keys:

```env
VITE_NEWS_API_KEY=your_newsapi_key_here
VITE_GUARDIAN_API_KEY=your_guardian_api_key_here
VITE_NEW_YORK_TIMES_API_KEY=your_nytimes_api_key_here
```

### Build and Run with Docker Compose

The `docker-compose.yml` file is configured to automatically read environment variables from your `.env` file:

```bash
docker-compose up --build
```

The application will be available at `http://localhost:3000`

### Build Docker Image Manually

If you prefer to build the Docker image manually, you need to pass the environment variables as build arguments:

```bash
docker build \
  --build-arg VITE_NEWS_API_KEY=your_newsapi_key \
  --build-arg VITE_GUARDIAN_API_KEY=your_guardian_key \
  --build-arg VITE_NEW_YORK_TIMES_API_KEY=your_nytimes_key \
  -t news-aggregator .
```

Or you can source them from your `.env` file:

```bash
export $(cat .env | xargs) && docker build \
  --build-arg VITE_NEWS_API_KEY=$VITE_NEWS_API_KEY \
  --build-arg VITE_GUARDIAN_API_KEY=$VITE_GUARDIAN_API_KEY \
  --build-arg VITE_NEW_YORK_TIMES_API_KEY=$VITE_NEW_YORK_TIMES_API_KEY \
  -t news-aggregator .
```

### Run Docker Container

```bash
docker run -p 3000:80 news-aggregator
```

### Stop Docker Compose

```bash
docker-compose down
```

## Testing

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Generate Coverage Report

```bash
npm run test:coverage
```

## Project Structure

```
src/
├── components/          # React components
│   ├── ArticleCard.tsx
│   ├── SearchBar.tsx
│   ├── FilterPanel.tsx
│   ├── LoadingState.tsx
│   ├── ErrorBoundary.tsx
│   ├── PreferencesModal.tsx
│   └── EmptyState.tsx
├── context/            # React context providers
│   └── PreferencesContext.tsx
├── hooks/              # Custom React hooks
│   └── useArticles.ts
├── services/           # API services and adapters
│   ├── api/
│   │   ├── newsapi.service.ts
│   │   ├── guardian.service.ts
│   │   └── nytimes.service.ts
│   ├── adapters/
│   │   └── article.adapter.ts
│   └── news.service.ts
├── types/              # TypeScript type definitions
│   └── article.ts
├── utils/              # Utility functions
│   ├── debounce.ts
│   └── storage.ts
├── __mocks__/          # Mock data for testing
│   ├── handlers.ts
│   └── server.ts
├── __tests__/          # Integration tests
└── App.tsx             # Main application component
```

## Architecture & Design Patterns

### SOLID Principles

- **Single Responsibility**: Each component and service has a single, well-defined purpose
- **Open/Closed**: Services are open for extension but closed for modification (e.g., ArticleAdapter)
- **Liskov Substitution**: All news sources implement the same interface through the adapter pattern
- **Interface Segregation**: Small, focused interfaces for different concerns
- **Dependency Inversion**: Components depend on abstractions (interfaces) rather than concrete implementations

### Design Patterns

- **Adapter Pattern**: Normalizes data from different API sources into a unified format
- **Singleton Pattern**: Service instances are created once and reused
- **Provider Pattern**: React Context for global state management
- **Factory Pattern**: ArticleAdapter.adapt() routes to appropriate adapter

### Best Practices

- **DRY (Don't Repeat Yourself)**: Shared logic extracted into reusable functions and components
- **KISS (Keep It Simple, Stupid)**: Simple, straightforward implementations without over-engineering
- **Error Handling**: Comprehensive error boundaries and try-catch blocks
- **Type Safety**: Full TypeScript coverage with strict mode enabled
- **Code Organization**: Clear separation of concerns with logical folder structure
- **Testing**: High test coverage with unit and integration tests

## Key Features Implementation

### Search & Filtering

The search functionality uses debouncing to minimize API calls. Filters can be applied for:

- Date range (from/to)
- News sources (NewsAPI, Guardian, NY Times)
- Categories (business, entertainment, general, health, science, sports, technology)

### Personalized Feed

Users can customize their news feed by:

1. Clicking the "Preferences" button
2. Selecting preferred news sources
3. Choosing categories of interest
4. Preferences are automatically saved to localStorage

### Error Handling

The application includes multiple layers of error handling:

- **Error Boundaries**: Catch React component errors
- **Try-Catch Blocks**: Handle API errors gracefully
- **Fallback UI**: Display user-friendly error messages
- **Retry Logic**: Automatic retry for failed requests

### Loading States

Loading states are implemented throughout:

- Skeleton loaders for article cards
- Loading spinners for actions
- Shimmer effects for smooth transitions

## API Integration

### NewsAPI

- Endpoint: `https://newsapi.org/v2/`
- Features: Top headlines, everything search
- Rate Limit: 100 requests/day (developer tier)

### The Guardian

- Endpoint: `https://content.guardianapis.com/`
- Features: Content search with fields
- Rate Limit: 500 requests/day (developer tier)

### The New York Times

- Endpoint: `https://api.nytimes.com/svc/`
- Features: Article search, top stories
- Rate Limit: 500 requests/day (developer tier)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimization

- Code splitting and lazy loading
- Image lazy loading
- Debounced search input
- React Query caching (5-minute stale time)
- Production build optimization with Vite
- Gzip compression in production
- Static asset caching

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## License

This project is developed as a take-home challenge for Innoscripta AG.

## Contact

For questions or support, please reach out to the development team.
