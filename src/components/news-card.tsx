import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Clock, Globe } from "lucide-react";
import Image from "next/image";

interface NewsItem {
  url: string;
  title: string;
  description: string;
  position: number;
  metadata?: {
    title?: string;
    description?: string;
    ogImage?: string;
    favicon?: string;
    language?: string;
    site_name?: string;
    ogSiteName?: string;
    cachedAt?: string;
  };
  summary?: string;
}

interface NewsCardProps {
  news: NewsItem;
}

export function NewsCard({ news }: NewsCardProps) {
  // Safely access metadata with fallbacks
  const metadata = news.metadata || {};
  const siteName = metadata.ogSiteName || metadata.site_name || (() => {
    try {
      return new URL(news.url).hostname;
    } catch {
      return 'Unknown Source';
    }
  })();
  const favicon = metadata.favicon;
  const image = metadata.ogImage;
  const summary = news.summary || news.description;

  // Extract date from cachedAt if available
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return null;
    }
  };

  const formattedDate = formatDate(metadata.cachedAt);

  // Validate image URL
  const isValidImageUrl = (url: string) => {
    try {
      // Allow base64 images
      if (url.startsWith('data:image/')) {
        return true;
      }
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch {
      return false;
    }
  };

  const validImage = image && isValidImageUrl(image);

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex-1">
        {validImage && (
          <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden">
            <Image
              src={image}
              alt={news.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant="secondary" className="text-xs">
            #{news.position}
          </Badge>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {favicon && (
              <Image
                src={favicon}
                alt={siteName}
                width={16}
                height={16}
                className="rounded"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            )}
            <span className="truncate max-w-24">{siteName}</span>
          </div>
        </div>

        <CardTitle className="text-lg leading-tight line-clamp-2">
          {news.title}
        </CardTitle>

        <CardDescription className="text-sm line-clamp-3 mt-2">
          {summary}
        </CardDescription>

        <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
          {formattedDate && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{formattedDate}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Globe className="w-3 h-3" />
            <span>{metadata.language || 'en'}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <a
          href={news.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          Read more
          <ExternalLink className="w-3 h-3" />
        </a>
      </CardContent>
    </Card>
  );
}