import axios, { AxiosError } from 'axios';
import type { NewsAPIArticle, ArticleFilters } from '@/types/article';

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

export interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: NewsAPIArticle[];
}

export class NewsAPIService {
  private static instance: NewsAPIService;
  private axiosInstance;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: BASE_URL,
      params: {
        apiKey: API_KEY,
      },
    });
  }

  public static getInstance(): NewsAPIService {
    if (!NewsAPIService.instance) {
      NewsAPIService.instance = new NewsAPIService();
    }
    return NewsAPIService.instance;
  }

  async getTopHeadlines(
    filters: ArticleFilters = {}
  ): Promise<NewsAPIResponse> {
    try {
      const params: Record<string, any> = {
        country: 'us',
        pageSize: 20,
      };

      if (filters.query) {
        params.q = filters.query;
      }

      if (filters.categories && filters.categories.length > 0) {
        params.category = filters.categories[0]; // NewsAPI only supports one category
      }

      const response = await this.axiosInstance.get<NewsAPIResponse>(
        '/top-headlines',
        { params }
      );

      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async searchEverything(
    filters: ArticleFilters = {}
  ): Promise<NewsAPIResponse> {
    try {
      const params: Record<string, any> = {
        language: 'en',
        pageSize: 20,
        sortBy: 'publishedAt',
      };

      if (filters.query) {
        params.q = filters.query;
      }

      if (filters.dateFrom) {
        params.from = filters.dateFrom;
      }

      if (filters.dateTo) {
        params.to = filters.dateTo;
      }

      const response = await this.axiosInstance.get<NewsAPIResponse>(
        '/everything',
        { params }
      );

      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private handleError(error: unknown): void {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error('NewsAPI Error:', {
        status: axiosError.response?.status,
        message: axiosError.response?.data?.message || axiosError.message,
      });
    } else {
      console.error('NewsAPI Unknown Error:', error);
    }
  }
}

export const newsAPIService = NewsAPIService.getInstance();
