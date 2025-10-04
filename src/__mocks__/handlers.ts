import { http, HttpResponse } from 'msw';

export const handlers = [
  // NewsAPI mock
  http.get('https://newsapi.org/v2/top-headlines', () => {
    return HttpResponse.json({
      status: 'ok',
      totalResults: 2,
      articles: [
        {
          source: { id: 'test-source', name: 'Test Source' },
          author: 'Test Author',
          title: 'Test NewsAPI Article',
          description: 'Test description from NewsAPI',
          url: 'https://example.com/newsapi-article',
          urlToImage: 'https://example.com/newsapi-image.jpg',
          publishedAt: '2024-01-01T00:00:00Z',
          content: 'Test content from NewsAPI',
        },
      ],
    });
  }),

  http.get('https://newsapi.org/v2/everything', () => {
    return HttpResponse.json({
      status: 'ok',
      totalResults: 1,
      articles: [
        {
          source: { id: 'test-source', name: 'Test Source' },
          author: 'Test Author',
          title: 'Test NewsAPI Search Result',
          description: 'Test search description',
          url: 'https://example.com/newsapi-search',
          urlToImage: 'https://example.com/newsapi-search.jpg',
          publishedAt: '2024-01-02T00:00:00Z',
          content: 'Test search content',
        },
      ],
    });
  }),

  // Guardian API mock
  http.get('https://content.guardianapis.com/search', () => {
    return HttpResponse.json({
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
            id: 'guardian-123',
            type: 'article',
            sectionId: 'technology',
            sectionName: 'Technology',
            webPublicationDate: '2024-01-01T00:00:00Z',
            webTitle: 'Test Guardian Article',
            webUrl: 'https://guardian.com/article',
            apiUrl: 'https://api.guardian.com/article',
            fields: {
              headline: 'Test Guardian Headline',
              trailText: 'Test Guardian trail text',
              thumbnail: 'https://guardian.com/image.jpg',
              bodyText: 'Test Guardian body text',
              byline: 'Guardian Author',
            },
          },
        ],
      },
    });
  }),

  // NY Times API mock
  http.get('https://api.nytimes.com/svc/search/v2/articlesearch.json', () => {
    return HttpResponse.json({
      status: 'OK',
      copyright: 'Copyright (c) 2024 The New York Times Company',
      response: {
        docs: [
          {
            _id: 'nyt-789',
            abstract: 'Test NY Times abstract',
            web_url: 'https://nytimes.com/article',
            snippet: 'Test snippet',
            lead_paragraph: 'Test lead paragraph',
            source: 'The New York Times',
            headline: {
              main: 'Test NY Times Headline',
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
              original: 'By NY Times Author',
              person: [],
              organization: null,
            },
            type_of_material: 'News',
            word_count: 500,
            uri: 'nyt://article/789',
            multimedia: [
              {
                url: 'images/nyt-article.jpg',
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
          },
        ],
        meta: {
          hits: 1,
          offset: 0,
          time: 10,
        },
      },
    });
  }),
];
