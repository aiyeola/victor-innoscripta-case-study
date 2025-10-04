import {
  adaptNewsAPIArticle,
  adaptGuardianArticle,
  adaptNYTimesArticle,
  ArticleAdapter,
} from '../adapters/article.adapter';
import type { NewsAPIArticle, GuardianArticle, NYTimesArticle } from '@/types/article';

describe('Article Adapters', () => {
  describe('adaptNewsAPIArticle', () => {
    it('should adapt NewsAPI article to unified format', () => {
      const newsAPIArticle: NewsAPIArticle = {
        source: { id: 'test-source', name: 'Test Source' },
        author: 'John Doe',
        title: 'Test Article',
        description: 'Test description',
        url: 'https://example.com/article',
        urlToImage: 'https://example.com/image.jpg',
        publishedAt: '2024-01-01T00:00:00Z',
        content: 'Test content',
      };

      const adapted = adaptNewsAPIArticle(newsAPIArticle);

      expect(adapted).toEqual({
        id: 'newsapi-https://example.com/article',
        title: 'Test Article',
        description: 'Test description',
        content: 'Test content',
        url: 'https://example.com/article',
        imageUrl: 'https://example.com/image.jpg',
        publishedAt: '2024-01-01T00:00:00Z',
        author: 'John Doe',
        source: 'newsapi',
        category: 'general',
      });
    });

    it('should handle missing optional fields', () => {
      const newsAPIArticle: NewsAPIArticle = {
        source: { id: null, name: 'Test Source' },
        author: null,
        title: 'Test Article',
        description: '',
        url: 'https://example.com/article',
        urlToImage: null,
        publishedAt: '2024-01-01T00:00:00Z',
        content: '',
      };

      const adapted = adaptNewsAPIArticle(newsAPIArticle);

      expect(adapted.author).toBeNull();
      expect(adapted.imageUrl).toBeNull();
      expect(adapted.description).toBe('');
    });
  });

  describe('adaptGuardianArticle', () => {
    it('should adapt Guardian article to unified format', () => {
      const guardianArticle: GuardianArticle = {
        id: 'guardian-123',
        type: 'article',
        sectionId: 'technology',
        sectionName: 'Technology',
        webPublicationDate: '2024-01-01T00:00:00Z',
        webTitle: 'Test Article',
        webUrl: 'https://guardian.com/article',
        apiUrl: 'https://api.guardian.com/article',
        fields: {
          headline: 'Test Headline',
          trailText: 'Test trail text',
          thumbnail: 'https://guardian.com/image.jpg',
          bodyText: 'Test body text',
          byline: 'Jane Smith',
        },
      };

      const adapted = adaptGuardianArticle(guardianArticle);

      expect(adapted).toEqual({
        id: 'guardian-123',
        title: 'Test Headline',
        description: 'Test trail text',
        content: 'Test body text',
        url: 'https://guardian.com/article',
        imageUrl: 'https://guardian.com/image.jpg',
        publishedAt: '2024-01-01T00:00:00Z',
        author: 'Jane Smith',
        source: 'guardian',
        category: 'technology',
      });
    });

    it('should fallback to webTitle when fields are missing', () => {
      const guardianArticle: GuardianArticle = {
        id: 'guardian-456',
        type: 'article',
        sectionId: 'news',
        sectionName: 'News',
        webPublicationDate: '2024-01-01T00:00:00Z',
        webTitle: 'Fallback Title',
        webUrl: 'https://guardian.com/article',
        apiUrl: 'https://api.guardian.com/article',
      };

      const adapted = adaptGuardianArticle(guardianArticle);

      expect(adapted.title).toBe('Fallback Title');
      expect(adapted.description).toBe('');
      expect(adapted.author).toBeNull();
    });
  });

  describe('adaptNYTimesArticle', () => {
    it('should adapt NY Times article to unified format', () => {
      const nytArticle: NYTimesArticle = {
        _id: 'nyt-789',
        abstract: 'Test abstract',
        web_url: 'https://nytimes.com/article',
        snippet: 'Test snippet',
        lead_paragraph: 'Test lead paragraph',
        source: 'The New York Times',
        headline: {
          main: 'Test Headline',
          kicker: null,
          content_kicker: null,
          print_headline: null,
          name: null,
          seo: null,
          sub: null,
        },
        pub_date: '2024-01-01T00:00:00Z',
        document_type: 'article',
        news_desk: 'Technology',
        section_name: 'Technology',
        byline: {
          original: 'By Alice Johnson',
          person: [],
          organization: null,
        },
        type_of_material: 'News',
        word_count: 500,
        uri: 'nyt://article/789',
        multimedia: [
          {
            url: 'images/article/image.jpg',
            format: 'Large',
            height: 400,
            width: 600,
            type: 'image',
            subtype: 'photo',
            caption: 'Test caption',
            copyright: 'Test copyright',
          },
        ],
        keywords: [],
      };

      const adapted = adaptNYTimesArticle(nytArticle);

      expect(adapted).toEqual({
        id: 'nyt-789',
        title: 'Test Headline',
        description: 'Test abstract',
        content: 'Test lead paragraph',
        url: 'https://nytimes.com/article',
        imageUrl: 'https://www.nytimes.com/images/article/image.jpg',
        publishedAt: '2024-01-01T00:00:00Z',
        author: 'By Alice Johnson',
        source: 'nytimes',
        category: 'technology',
      });
    });
  });

  describe('ArticleAdapter', () => {
    it('should route to correct adapter based on source', () => {
      const newsAPIArticle = {
        source: { id: 'test', name: 'Test' },
        author: 'Test Author',
        title: 'Test',
        description: 'Test',
        url: 'https://test.com',
        urlToImage: null,
        publishedAt: '2024-01-01T00:00:00Z',
        content: 'Test',
      };

      const adapted = ArticleAdapter.adapt(newsAPIArticle, 'newsapi');

      expect(adapted.source).toBe('newsapi');
    });

    it('should throw error for unknown source', () => {
      expect(() => ArticleAdapter.adapt({}, 'unknown')).toThrow('Unknown source: unknown');
    });

    it('should adapt multiple articles', () => {
      const articles = [
        {
          source: { id: 'test', name: 'Test' },
          author: 'Test',
          title: 'Article 1',
          description: 'Test',
          url: 'https://test.com/1',
          urlToImage: null,
          publishedAt: '2024-01-01T00:00:00Z',
          content: 'Test',
        },
        {
          source: { id: 'test', name: 'Test' },
          author: 'Test',
          title: 'Article 2',
          description: 'Test',
          url: 'https://test.com/2',
          urlToImage: null,
          publishedAt: '2024-01-01T00:00:00Z',
          content: 'Test',
        },
      ];

      const adapted = ArticleAdapter.adaptMany(articles, 'newsapi');

      expect(adapted).toHaveLength(2);
      expect(adapted[0].title).toBe('Article 1');
      expect(adapted[1].title).toBe('Article 2');
    });
  });
});
