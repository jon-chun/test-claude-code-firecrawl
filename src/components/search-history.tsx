"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, ExternalLink } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface SearchHistoryItem {
  query: string;
  datetime: string; // ISO string
  filename: string;
  articleCount: number;
  searchEngine: 'brave' | 'firecrawl';
}

const STORAGE_KEY = 'ai-news-hub-search-history';
const MAX_HISTORY = parseInt(process.env.NEXT_PUBLIC_SEARCH_HISTORY_MAX || '20');

interface SearchHistoryProps {
  onNewSearch?: (item: SearchHistoryItem) => void;
}

export function SearchHistory({ onNewSearch }: SearchHistoryProps) {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setHistory(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  }, []);

  // Listen for new searches (called from parent)
  useEffect(() => {
    if (onNewSearch) {
      // This effect is just for prop change detection
    }
  }, [onNewSearch]);

  const handleItemClick = (filename: string) => {
    window.open(`/api/articles/${filename}`, '_blank', 'noopener,noreferrer');
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return '';
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) {
        return 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    } catch {
      return '';
    }
  };

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Search History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No searches yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Search History
        </CardTitle>
        <CardDescription className="text-xs">
          Last {Math.min(history.length, MAX_HISTORY)} searches
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="px-4 pb-4 space-y-2">
            {history.slice(0, MAX_HISTORY).map((item, index) => (
              <button
                key={`${item.filename}-${index}`}
                onClick={() => handleItemClick(item.filename)}
                className="w-full text-left p-3 rounded-lg border hover:bg-accent hover:border-accent-foreground transition-colors group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {item.query}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span>{formatDate(item.datetime)}</span>
                      <span>•</span>
                      <span>{formatTime(item.datetime)}</span>
                      <span>•</span>
                      <span>{item.articleCount} articles</span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground flex-shrink-0" />
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// Utility function to add item to history (exported for use in page)
export function addToSearchHistory(item: SearchHistoryItem): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    let history: SearchHistoryItem[] = stored ? JSON.parse(stored) : [];

    // Add new item to beginning
    history.unshift(item);

    // Keep only MAX_HISTORY items
    history = history.slice(0, MAX_HISTORY);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));

    // Dispatch custom event to trigger re-render
    window.dispatchEvent(new CustomEvent('searchHistoryUpdated'));
  } catch (error) {
    console.error('Error saving to search history:', error);
  }
}
