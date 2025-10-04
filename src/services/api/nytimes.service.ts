import axios, { AxiosError } from 'axios';
import type { NYTimesArticle, ArticleFilters } from '@/types/article';

const API_KEY = import.meta.env.VITE_NEW_YORK_TIMES_API_KEY;
const BASE_URL = 'https://api.nytimes.com/svc';

export interface NYTimesResponse {
  status: string;
  copyright: string;
  response: {
    docs: NYTimesArticle[];
    meta: {
      hits: number;
      offset: number;
      time: number;
    };
  };
}

export class NYTimesService {
  private static instance: NYTimesService;
  private axiosInstance;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: BASE_URL,
      params: {
        'api-key': API_KEY,
      },
    });
  }

  public static getInstance(): NYTimesService {
    if (!NYTimesService.instance) {
      NYTimesService.instance = new NYTimesService();
    }
    return NYTimesService.instance;
  }

  async searchArticles(filters: ArticleFilters = {}): Promise<NYTimesResponse> {
    try {
      const params: Record<string, any> = {
        sort: 'newest',
      };

      if (filters.query) {
        params.q = filters.query;
      }

      if (filters.dateFrom) {
        params.begin_date = filters.dateFrom.replace(/-/g, '');
      }

      if (filters.dateTo) {
        params.end_date = filters.dateTo.replace(/-/g, '');
      }

      if (filters.categories && filters.categories.length > 0) {
        params.fq = `section_name:("${filters.categories.join('" OR "')}")`;
      }

      const response = await this.axiosInstance.get<NYTimesResponse>(
        '/search/v2/articlesearch.json',
        { params }
      );

      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async getTopStories(section: string = 'home'): Promise<any> {
    try {
      const response = await this.axiosInstance.get(
        `/topstories/v2/${section}.json`
      );

      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private handleError(error: unknown): void {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string; fault?: any }>;
      console.error('NY Times API Error:', {
        status: axiosError.response?.status,
        message:
          axiosError.response?.data?.message ||
          axiosError.response?.data?.fault?.faultstring ||
          axiosError.message,
      });
    } else {
      console.error('NY Times API Unknown Error:', error);
    }
  }
}

export const nyTimesService = NYTimesService.getInstance();
