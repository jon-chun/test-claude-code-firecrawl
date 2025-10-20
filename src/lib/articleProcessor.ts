/**
 * Article processor for structuring comprehensive article data
 */

import { formatDatetimeISO } from './datetime';

// Raw article item from search APIs
interface RawArticleItem {
  url: string;
  title?: string;
  description?: string;
  markdown?: string;
  summary?: string;
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
}

export interface ArticleMetadata {
  date?: string;
  author?: string;
  publication?: string;
  url: string;
  length?: number;
  wordCount?: number;
  siteName?: string;
  description?: string;
  favicon?: string;
  language?: string;
  ogImage?: string;
  cachedAt?: string;
  contentSource: 'firecrawl-markdown' | 'firecrawl-summary' | 'brave-snippet';
}

export interface ProcessedArticle {
  title: string;
  url: string;
  text: string;
  metadata: ArticleMetadata;
}

export interface ArticleDataFile {
  searchQuery: string;
  searchEngine: 'brave' | 'firecrawl';
  timestamp: string;
  articleCount: number;
  articles: ProcessedArticle[];
}

/**
 * Extracts text content from article data
 * Priority: markdown > summary > description
 */
function extractArticleText(item: RawArticleItem): { text: string; source: ArticleMetadata['contentSource'] } {
  // Check for Firecrawl markdown (full content)
  if (item.markdown && item.markdown.trim().length > 0) {
    return {
      text: item.markdown,
      source: 'firecrawl-markdown'
    };
  }

  // Check for Firecrawl summary
  if (item.summary && item.summary.trim().length > 0) {
    return {
      text: item.summary,
      source: 'firecrawl-summary'
    };
  }

  // Fall back to description (Brave or Firecrawl)
  if (item.description && item.description.trim().length > 0) {
    return {
      text: item.description,
      source: 'brave-snippet'
    };
  }

  // Last resort
  return {
    text: 'No content available',
    source: 'brave-snippet'
  };
}

/**
 * Calculates word count from text
 */
function calculateWordCount(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Processes raw search results into comprehensive article data structure
 */
export function processArticles(
  rawResults: RawArticleItem[],
  searchQuery: string,
  searchEngine: 'brave' | 'firecrawl'
): ArticleDataFile {
  const timestamp = formatDatetimeISO();

  const articles: ProcessedArticle[] = rawResults.map((item) => {
    const { text, source } = extractArticleText(item);
    const wordCount = calculateWordCount(text);

    const metadata: ArticleMetadata = {
      url: item.url,
      description: item.description || item.metadata?.description || '',
      siteName: item.metadata?.site_name || item.metadata?.ogSiteName || '',
      favicon: item.metadata?.favicon || '',
      language: item.metadata?.language || '',
      ogImage: item.metadata?.ogImage || '',
      cachedAt: item.metadata?.cachedAt || '',
      contentSource: source,
      length: text.length,
      wordCount: wordCount,
    };

    // Try to extract publication name
    if (metadata.siteName) {
      metadata.publication = metadata.siteName;
    }

    return {
      title: item.title || item.metadata?.title || 'Untitled',
      url: item.url,
      text: text,
      metadata: metadata,
    };
  });

  return {
    searchQuery,
    searchEngine,
    timestamp,
    articleCount: articles.length,
    articles,
  };
}
