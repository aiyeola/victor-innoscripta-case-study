// Mock implementations for API services to avoid import.meta issues in tests

const mockNewsAPIService = {
    getTopHeadlines: jest.fn().mockResolvedValue({
      status: 'ok',
      totalResults: 1,
      articles: [
        {
          source: { id: 'test-newsapi', name: 'Test NewsAPI Source' },
          author: 'Test Author',
          title: 'Test NewsAPI Article',
          description: 'This is a test article from NewsAPI',
          url: 'https://example.com/newsapi-article',
          urlToImage: 'https://example.com/image.jpg',
          publishedAt: new Date().toISOString(),
          content: 'Test content for NewsAPI article',
        },
      ],
    }),
    searchEverything: jest.fn().mockResolvedValue({
      status: 'ok',
      totalResults: 1,
      articles: [
        {
          source: { id: 'test-newsapi', name: 'Test NewsAPI Source' },
          author: 'Test Author',
          title: 'Test NewsAPI Article',
          description: 'This is a test article from NewsAPI',
          url: 'https://example.com/newsapi-article',
          urlToImage: 'https://example.com/image.jpg',
          publishedAt: new Date().toISOString(),
          content: 'Test content for NewsAPI article',
        },
      ],
    }),
};

const mockGuardianService = {
    searchContent: jest.fn().mockResolvedValue({
      response: {
        status: 'ok',
        userTier: 'developer',
        total: 1,
        startIndex: 1,
        pageSize: 20,
        currentPage: 1,
        pages: 1,
        orderBy: 'newest',
        results: [
          {
            id: 'test-guardian-1',
            type: 'article',
            sectionId: 'world',
            sectionName: 'World news',
            webPublicationDate: new Date().toISOString(),
            webTitle: 'Test Guardian Headline',
            webUrl: 'https://example.com/guardian-article',
            apiUrl: 'https://content.guardianapis.com/test-guardian-1',
            fields: {
              headline: 'Test Guardian Headline',
              trailText: 'This is a test article from The Guardian',
              thumbnail: 'https://example.com/guardian-thumb.jpg',
              bodyText: 'Test content for Guardian article',
              byline: 'Guardian Test Author',
            },
            isHosted: false,
            pillarId: 'pillar/news',
            pillarName: 'News',
          },
        ],
      },
    }),
};

const mockNYTimesService = {
    searchArticles: jest.fn().mockResolvedValue({
      status: 'OK',
      copyright: 'Copyright (c) 2024 The New York Times Company. All Rights Reserved.',
      response: {
        docs: [
          {
            abstract: 'This is a test article from NY Times',
            web_url: 'https://example.com/nytimes-article',
            snippet: 'Test snippet',
            lead_paragraph: 'Test lead paragraph',
            source: 'The New York Times',
            multimedia: [
              {
                url: 'images/test.jpg',
                format: 'Large Thumbnail',
                height: 150,
                width: 150,
                type: 'image',
                subtype: 'photo',
                caption: 'Test caption',
                copyright: 'Test copyright',
              },
            ],
            headline: {
              main: 'Test NY Times Headline',
              kicker: null,
              content_kicker: null,
              print_headline: 'Test NY Times Headline',
              name: null,
              seo: null,
              sub: null,
            },
            keywords: [],
            pub_date: new Date().toISOString(),
            document_type: 'article',
            news_desk: 'Test',
            section_name: 'World',
            byline: {
              original: 'By NY Times Test Author',
              person: [
                {
                  firstname: 'Test',
                  middlename: null,
                  lastname: 'Author',
                  qualifier: null,
                  title: null,
                  role: 'reported',
                  organization: '',
                  rank: 1,
                },
              ],
              organization: null,
            },
            type_of_material: 'News',
            _id: 'test-nytimes-1',
            word_count: 100,
            uri: 'nyt://article/test-nytimes-1',
          },
        ],
        meta: {
          hits: 1,
          offset: 0,
          time: 20,
        },
      },
    }),
};

// Export as both named exports and module.exports for different import styles
module.exports = {
  newsAPIService: mockNewsAPIService,
  guardianService: mockGuardianService,
  nyTimesService: mockNYTimesService,
};

exports.newsAPIService = mockNewsAPIService;
exports.guardianService = mockGuardianService;
exports.nyTimesService = mockNYTimesService;
