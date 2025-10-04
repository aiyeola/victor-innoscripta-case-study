// Unified article type for the application
export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  imageUrl: string | null;
  publishedAt: string;
  author: string | null;
  source: NewsSource;
  category?: string;
}

// Supported news sources
export type NewsSource = 'newsapi' | 'guardian' | 'nytimes';

export const NEWS_SOURCES: Record<NewsSource, string> = {
  newsapi: 'NewsAPI',
  guardian: 'The Guardian',
  nytimes: 'The New York Times',
};

// Categories
export const CATEGORIES = [
  'business',
  'entertainment',
  'general',
  'health',
  'science',
  'sports',
  'technology',
] as const;

export type Category = typeof CATEGORIES[number];

// Filter types
export interface ArticleFilters {
  query?: string;
  sources?: NewsSource[];
  categories?: Category[];
  dateFrom?: string;
  dateTo?: string;
  author?: string;
}

// User preferences
export interface UserPreferences {
  sources: NewsSource[];
  categories: Category[];
  authors: string[];
}

// API response types for different sources
export interface NewsAPIArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string;
}

export interface GuardianArticle {
  id: string;
  type: string;
  sectionId: string;
  sectionName: string;
  webPublicationDate: string;
  webTitle: string;
  webUrl: string;
  apiUrl: string;
  fields?: {
    headline?: string;
    trailText?: string;
    thumbnail?: string;
    bodyText?: string;
    byline?: string;
  };
}

export interface NYTimesArticle {
  abstract: string;
  web_url: string;
  snippet: string;
  lead_paragraph: string;
  source: string;
  multimedia: Array<{
    url: string;
    format: string;
    height: number;
    width: number;
    type: string;
    subtype: string;
    caption: string;
    copyright: string;
  }>;
  headline: {
    main: string;
    kicker: string | null;
    content_kicker: string | null;
    print_headline: string | null;
    name: string | null;
    seo: string | null;
    sub: string | null;
  };
  keywords: Array<{
    name: string;
    value: string;
    rank: number;
    major: string;
  }>;
  pub_date: string;
  document_type: string;
  news_desk: string;
  section_name: string;
  byline: {
    original: string | null;
    person: Array<{
      firstname: string;
      middlename: string | null;
      lastname: string;
      qualifier: string | null;
      title: string | null;
      role: string;
      organization: string;
      rank: number;
    }>;
    organization: string | null;
  };
  type_of_material: string;
  _id: string;
  word_count: number;
  uri: string;
}
