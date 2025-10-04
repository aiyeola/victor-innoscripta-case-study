import { useState, useMemo } from "react";
import { format } from "date-fns";
import DOMPurify from "dompurify";
import type { Article } from "@/types/article";
import { NEWS_SOURCES } from "@/types/article";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const [imageError, setImageError] = useState(false);
  const formattedDate = format(new Date(article.publishedAt), "MMM dd, yyyy");

  const showPlaceholder = !article.imageUrl || imageError;

  // Sanitize HTML content to prevent XSS attacks
  const sanitizedDescription = useMemo(() => {
    if (!article.description) return "";
    return DOMPurify.sanitize(article.description, {
      ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br"],
      ALLOWED_ATTR: ["href", "target", "rel"],
    });
  }, [article.description]);

  return (
    <article className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        {showPlaceholder ? (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <svg
              className="w-16 h-16 text-muted-foreground/30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        ) : (
          <img
            src={article.imageUrl || ""}
            alt={article.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center gap-2 text-xs mb-3">
          <span className="bg-primary/10 text-primary px-2 py-1 rounded">
            {NEWS_SOURCES[article.source]}
          </span>
          {article.category && (
            <span className="text-muted-foreground capitalize">
              {article.category}
            </span>
          )}
        </div>

        <h3 className="font-semibold text-lg line-clamp-2 text-foreground mb-3">
          {article.title}
        </h3>

        {sanitizedDescription && (
          <p
            className="text-sm text-muted-foreground line-clamp-3 mb-3"
            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
          />
        )}

        <div className="mt-auto space-y-3">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>{article.author || "Unknown Author"}</span>
            <time dateTime={article.publishedAt}>{formattedDate}</time>
          </div>

          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-primary text-primary-foreground py-2 rounded-md hover:opacity-90 transition-opacity text-sm font-medium"
          >
            Read More
          </a>
        </div>
      </div>
    </article>
  );
}
