import { render, screen } from '@testing-library/react';
import { ArticleCard } from '../ArticleCard';
import type { Article } from '@/types/article';

describe('ArticleCard', () => {
  const mockArticle: Article = {
    id: 'test-123',
    title: 'Test Article Title',
    description: 'Test article description',
    content: 'Test content',
    url: 'https://example.com/article',
    imageUrl: 'https://example.com/image.jpg',
    publishedAt: '2024-01-15T12:00:00Z',
    author: 'John Doe',
    source: 'newsapi',
    category: 'technology',
  };

  it('should render article title', () => {
    render(<ArticleCard article={mockArticle} />);

    expect(screen.getByText('Test Article Title')).toBeInTheDocument();
  });

  it('should render article description', () => {
    render(<ArticleCard article={mockArticle} />);

    expect(screen.getByText('Test article description')).toBeInTheDocument();
  });

  it('should render article author', () => {
    render(<ArticleCard article={mockArticle} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should render article source', () => {
    render(<ArticleCard article={mockArticle} />);

    expect(screen.getByText('NewsAPI')).toBeInTheDocument();
  });

  it('should render read more link with correct URL', () => {
    render(<ArticleCard article={mockArticle} />);

    const link = screen.getByRole('link', { name: /read more/i });
    expect(link).toHaveAttribute('href', 'https://example.com/article');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('should render Unknown Author when author is null', () => {
    const articleWithoutAuthor = { ...mockArticle, author: null };
    render(<ArticleCard article={articleWithoutAuthor} />);

    expect(screen.getByText('Unknown Author')).toBeInTheDocument();
  });

  it('should render image when imageUrl is provided', () => {
    const { container } = render(<ArticleCard article={mockArticle} />);

    const image = container.querySelector('img[alt="Test Article Title"]');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('should not render image container when imageUrl is null', () => {
    const articleWithoutImage = { ...mockArticle, imageUrl: null };
    const { container } = render(<ArticleCard article={articleWithoutImage} />);

    const image = container.querySelector('img');
    expect(image).not.toBeInTheDocument();
  });
});
