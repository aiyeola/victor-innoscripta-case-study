import type {
  Article,
  NewsAPIArticle,
  GuardianArticle,
  NYTimesArticle,
} from '@/types/article';

/**
 * Adapts NewsAPI article to unified Article format
 */
export function adaptNewsAPIArticle(article: NewsAPIArticle): Article {
  return {
    id: `newsapi-${article.url}`,
    title: article.title,
    description: article.description || '',
    content: article.content || article.description || '',
    url: article.url,
    imageUrl: article.urlToImage,
    publishedAt: article.publishedAt,
    author: article.author,
    source: 'newsapi',
    category: 'general',
  };
}

/**
 * Adapts Guardian article to unified Article format
 */
export function adaptGuardianArticle(article: GuardianArticle): Article {
  return {
    id: article.id,
    title: article.fields?.headline || article.webTitle,
    description: article.fields?.trailText || '',
    content: article.fields?.bodyText || article.fields?.trailText || '',
    url: article.webUrl,
    imageUrl: article.fields?.thumbnail || null,
    publishedAt: article.webPublicationDate,
    author: article.fields?.byline || null,
    source: 'guardian',
    category: article.sectionId || 'general',
  };
}

/**
 * Adapts NY Times article to unified Article format
 */
export function adaptNYTimesArticle(article: NYTimesArticle): Article {
  const imageUrl = article.multimedia?.[0]?.url
    ? `https://www.nytimes.com/${article.multimedia[0].url}`
    : null;

  return {
    id: article._id,
    title: article.headline.main,
    description: article.abstract || article.snippet,
    content: article.lead_paragraph || article.abstract,
    url: article.web_url,
    imageUrl,
    publishedAt: article.pub_date,
    author: article.byline?.original || null,
    source: 'nytimes',
    category: article.section_name?.toLowerCase() || 'general',
  };
}

/**
 * Adapter factory that routes to appropriate adapter based on source
 */
export class ArticleAdapter {
  static adapt(article: any, source: string): Article {
    switch (source) {
      case 'newsapi':
        return adaptNewsAPIArticle(article as NewsAPIArticle);
      case 'guardian':
        return adaptGuardianArticle(article as GuardianArticle);
      case 'nytimes':
        return adaptNYTimesArticle(article as NYTimesArticle);
      default:
        throw new Error(`Unknown source: ${source}`);
    }
  }

  static adaptMany(articles: any[], source: string): Article[] {
    return articles.map(article => this.adapt(article, source));
  }
}
