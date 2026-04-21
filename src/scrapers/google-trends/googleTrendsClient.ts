/**
 * Google Trends API Client
 * Fetches trending searches from Google Trends RSS Feed
 */

interface GoogleTrend {
  title: string;
  query: string;
  formattedTraffic?: string;
  exploreLink?: string;
  relatedQueries?: Array<{
    query: string;
    exploreLink: string;
  }>;
}

// Rate limit: 1 request per 2 seconds
const RATE_LIMIT_DELAY = 2000;

export class GoogleTrendsClient {
  private lastRequestTime = 0;

  /**
   * Enforce rate limiting
   */
  private async respectRateLimit() {
    const timeSinceLastRequest = Date.now() - this.lastRequestTime;
    if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
      await new Promise((resolve) =>
        setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest)
      );
    }
    this.lastRequestTime = Date.now();
  }

  /**
   * Parse RSS feed XML to extract trends
   */
  private parseRSSFeed(xml: string): GoogleTrend[] {
    const trends: GoogleTrend[] = [];
    
    // Extract all <item> tags
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null) {
      const itemContent = match[1];
      
      // Extract title
      const titleMatch = itemContent.match(/<title[^>]*>([^<]+)<\/title>/);
      if (!titleMatch) continue;
      
      const title = titleMatch[1];
      
      // Extract link
      const linkMatch = itemContent.match(/<link>([^<]+)<\/link>/);
      const link = linkMatch ? linkMatch[1] : '';
      
      // Extract description
      const descMatch = itemContent.match(/<description[^>]*>([^<]*)<\/description>/);
      const description = descMatch ? descMatch[1] : '';

      trends.push({
        title: title.trim(),
        query: title.toLowerCase().replace(/\s+/g, '-'),
        formattedTraffic: description.trim() || undefined,
        exploreLink: link,
      });
    }

    return trends;
  }

  /**
   * Fetch daily trending searches by region using RSS feed
   */
  async getDailyTrends(region: string = 'US'): Promise<GoogleTrend[]> {
    await this.respectRateLimit();

    try {
      const url = `https://trends.google.com/trending/rss?geo=${region}`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      });

      if (!response.ok) {
        throw new Error(`Google Trends API error: ${response.status} ${response.statusText}`);
      }

      const xml = await response.text();
      return this.parseRSSFeed(xml);
    } catch (error) {
      console.error('[Google Trends] Error fetching daily trends:', error);
      return [];
    }
  }

  /**
   * Fetch real-time trending searches by region
   */
  async getRealTimeTrends(region: string = 'US'): Promise<GoogleTrend[]> {
    // For now, use daily trends as fallback
    // Real-time endpoint may require different handling
    return this.getDailyTrends(region);
  }

  /**
   * Fetch trending searches for a specific category
   * Categories: all, news, entertainment, sports, technology, business, science, health
   */
  async getCategoryTrends(category: string = 'all', region: string = 'US'): Promise<GoogleTrend[]> {
    await this.respectRateLimit();

    try {
      let url = `https://trends.google.com/trending/rss?geo=${region}`;
      
      // Add category parameter if not 'all'
      if (category !== 'all') {
        url += `&cat=${category}`;
      }

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      });

      if (!response.ok) {
        throw new Error(`Google Trends API error: ${response.status} ${response.statusText}`);
      }

      const xml = await response.text();
      return this.parseRSSFeed(xml);
    } catch (error) {
      console.error('[Google Trends] Error fetching category trends:', error);
      return [];
    }
  }
}

// Export singleton instance
export const googleTrendsClient = new GoogleTrendsClient();
