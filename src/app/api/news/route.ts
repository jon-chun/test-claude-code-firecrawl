import { NextRequest, NextResponse } from 'next/server';

// Configuration
const SEARCH_API = (process.env.SEARCH_API || 'brave') as 'brave' | 'firecrawl';
const BRAVE_API_KEY = process.env.BRAVE_API_KEY;
const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;

const BRAVE_API_URL = 'https://api.search.brave.com/res/v1/web/search';
const FIRECRAWL_API_URL = 'https://api.firecrawl.dev/v2/search';

interface NewsItem {
  url: string;
  title: string;
  description: string;
  position: number;
  metadata: {
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

interface BraveSearchResult {
  url: string;
  title: string;
  description?: string;
  profile?: {
    name?: string;
    img?: string;
  };
}

async function searchWithBrave(query: string, limit: number): Promise<NewsItem[]> {
  if (!BRAVE_API_KEY) {
    throw new Error('BRAVE_API_KEY is not configured');
  }

  const params = new URLSearchParams({
    q: query,
    count: String(limit),
    freshness: 'pw', // past week
    text_decorations: 'false',
  });

  const response = await fetch(`${BRAVE_API_URL}?${params}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Accept-Encoding': 'gzip',
      'X-Subscription-Token': BRAVE_API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`Brave API error: ${response.status}`);
  }

  const data = await response.json();

  // Transform Brave results to our NewsItem format
  const webResults: NewsItem[] = (data.web?.results || []).map((result: BraveSearchResult, index: number) => ({
    url: result.url,
    title: result.title,
    description: result.description || '',
    position: index + 1,
    metadata: {
      title: result.title,
      description: result.description,
      favicon: result.profile?.img,
      site_name: result.profile?.name,
    },
  }));

  return webResults;
}

async function searchWithFirecrawl(query: string, limit: number): Promise<NewsItem[]> {
  if (!FIRECRAWL_API_KEY) {
    throw new Error('FIRECRAWL_API_KEY is not configured');
  }

  const payload = {
    query: query,
    sources: ["web", "news"],
    categories: [],
    tbs: "qdr:w",
    limit: limit,
    scrapeOptions: {
      onlyMainContent: false,
      maxAge: 172800000,
      parsers: ["pdf"],
      formats: ["summary"]
    }
  };

  const response = await fetch(FIRECRAWL_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Firecrawl API error: ${response.status}`);
  }

  const data = await response.json();

  // Extract the web results from the response
  // Firecrawl returns data nested under data.data.web
  const webResults = data.data?.web || [];

  return webResults;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const query = body.query || "top AI news stories";
    const limit = body.limit || 10;

    console.log(`Using search API: ${SEARCH_API}`);

    let webResults: NewsItem[];

    if (SEARCH_API === 'brave') {
      webResults = await searchWithBrave(query, limit);
    } else {
      webResults = await searchWithFirecrawl(query, limit);
    }

    console.log('Extracted web results:', webResults.length, 'items');

    // Return the data in the expected format
    return NextResponse.json({
      success: true,
      web: webResults,
      searchEngine: SEARCH_API
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch news',
        searchEngine: SEARCH_API
      },
      { status: 500 }
    );
  }
}