import { newsAPIService } from './api/newsapi.service';
import { guardianService } from './api/guardian.service';
import { nyTimesService } from './api/nytimes.service';
import { ArticleAdapter } from './adapters/article.adapter';
import type { Article, ArticleFilters, NewsSource } from '@/types/article';

/**
 * Unified news service that aggregates articles from multiple sources
 */
export class NewsService {
  private static instance: NewsService;

  private constructor() {}

  public static getInstance(): NewsService {
    if (!NewsService.instance) {
      NewsService.instance = new NewsService();
    }
    return NewsService.instance;
  }

  /**
   * Fetches articles from specified sources
   */
  async fetchArticles(
    sources: NewsSource[] = ['newsapi', 'guardian', 'nytimes'],
    filters: ArticleFilters = {}
  ): Promise<Article[]> {
    const promises = sources.map(source =>
      this.fetchFromSource(source, filters).catch(error => {
        console.error(`Error fetching from ${source}:`, error);
        return [];
      })
    );

    const results = await Promise.all(promises);
    const articles = results.flat();

    // Sort by date, newest first
    return articles.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  /**
   * Fetches articles from a specific source
   */
  private async fetchFromSource(
    source: NewsSource,
    filters: ArticleFilters
  ): Promise<Article[]> {
    switch (source) {
      case 'newsapi': {
        const response = filters.query
          ? await newsAPIService.searchEverything(filters)
          : await newsAPIService.getTopHeadlines(filters);
        return ArticleAdapter.adaptMany(response.articles, 'newsapi');
      }

      case 'guardian': {
        const response = await guardianService.searchContent(filters);
        return ArticleAdapter.adaptMany(response.response.results, 'guardian');
      }

      case 'nytimes': {
        const response = await nyTimesService.searchArticles(filters);
        return ArticleAdapter.adaptMany(response.response.docs, 'nytimes');
      }

      default:
        return [];
    }
  }

  /**
   * Filters articles based on user preferences
   */
  filterArticles(articles: Article[], filters: ArticleFilters): Article[] {
    return articles.filter(article => {
      // Filter by query
      if (filters.query) {
        const query = filters.query.toLowerCase();
        const matchesQuery =
          article.title.toLowerCase().includes(query) ||
          article.description.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }

      // Filter by sources
      if (filters.sources && filters.sources.length > 0) {
        if (!filters.sources.includes(article.source)) return false;
      }

      // Filter by categories
      if (filters.categories && filters.categories.length > 0) {
        if (!filters.categories.includes(article.category as any)) return false;
      }

      // Filter by author
      if (filters.author) {
        if (!article.author?.toLowerCase().includes(filters.author.toLowerCase())) {
          return false;
        }
      }

      // Filter by date range
      if (filters.dateFrom) {
        const articleDate = new Date(article.publishedAt);
        const fromDate = new Date(filters.dateFrom);
        if (articleDate < fromDate) return false;
      }

      if (filters.dateTo) {
        const articleDate = new Date(article.publishedAt);
        const toDate = new Date(filters.dateTo);
        if (articleDate > toDate) return false;
      }

      return true;
    });
  }
}

export const newsService = NewsService.getInstance();
