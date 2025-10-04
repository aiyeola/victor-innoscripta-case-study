import { useQuery } from '@tanstack/react-query';
import { newsService } from '@/services/news.service';
import type { ArticleFilters, NewsSource } from '@/types/article';

export function useArticles(sources: NewsSource[], filters: ArticleFilters = {}) {
  return useQuery({
    queryKey: ['articles', sources, filters],
    queryFn: () => newsService.fetchArticles(sources, filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
}
