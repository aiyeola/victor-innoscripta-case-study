import axios, { AxiosError } from 'axios';
import type { GuardianArticle, ArticleFilters } from '@/types/article';

const API_KEY = import.meta.env.VITE_GUARDIAN_API_KEY;
const BASE_URL = 'https://content.guardianapis.com';

export interface GuardianResponse {
  response: {
    status: string;
    userTier: string;
    total: number;
    startIndex: number;
    pageSize: number;
    currentPage: number;
    pages: number;
    orderBy: string;
    results: GuardianArticle[];
  };
}

export class GuardianService {
  private static instance: GuardianService;
  private axiosInstance;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: BASE_URL,
      params: {
        'api-key': API_KEY,
        'show-fields': 'headline,trailText,thumbnail,bodyText,byline',
      },
    });
  }

  public static getInstance(): GuardianService {
    if (!GuardianService.instance) {
      GuardianService.instance = new GuardianService();
    }
    return GuardianService.instance;
  }

  async searchContent(filters: ArticleFilters = {}): Promise<GuardianResponse> {
    try {
      const params: Record<string, any> = {
        'page-size': 20,
        'order-by': 'newest',
      };

      if (filters.query) {
        params.q = filters.query;
      }

      if (filters.categories && filters.categories.length > 0) {
        params.section = filters.categories.join('|');
      }

      if (filters.dateFrom) {
        params['from-date'] = filters.dateFrom;
      }

      if (filters.dateTo) {
        params['to-date'] = filters.dateTo;
      }

      const response = await this.axiosInstance.get<GuardianResponse>(
        '/search',
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
      console.error('Guardian API Error:', {
        status: axiosError.response?.status,
        message: axiosError.response?.data?.message || axiosError.message,
      });
    } else {
      console.error('Guardian API Unknown Error:', error);
    }
  }
}

export const guardianService = GuardianService.getInstance();
