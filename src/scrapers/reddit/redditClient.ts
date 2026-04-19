/**
 * Reddit Public API Client
 * Fetches trending posts and data from Reddit's public JSON API
 * No authentication needed - uses public endpoints
 */

interface RedditPost {
  id: string;
  title: string;
  selftext: string;
  score: number;
  num_comments: number;
  upvote_ratio: number;
  created_utc: number;
  url: string;
  subreddit: string;
  thumbnail?: string;
  preview?: {
    images: Array<{
      source: {
        url: string;
      };
    }>;
  };
}

interface RedditApiResponse {
  data: {
    children: Array<{
      data: RedditPost;
    }>;
  };
}

// 2s delay between requests to respect Reddit's rate limits
const RATE_LIMIT_DELAY = 2000;

export class RedditClient {
  private baseUrl = 'https://www.reddit.com';
  private userAgent = 'unek-trends-scraper/1.0 (educational trending dashboard)';
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
   * Fetch trending posts from r/popular
   * Returns top 25 posts
   */
  async getPopularPosts(): Promise<RedditPost[]> {
    await this.respectRateLimit();

    try {
      const url = `${this.baseUrl}/r/popular.json?limit=25`;
      const response = await fetch(url, {
        headers: { 'User-Agent': this.userAgent },
      });

      if (!response.ok) {
        throw new Error(`Reddit API error: ${response.status} ${response.statusText}`);
      }

      const data = (await response.json()) as RedditApiResponse;
      return data.data.children.map((child) => child.data);
    } catch (error) {
      console.error('[Reddit] Error fetching popular posts:', error);
      return [];
    }
  }

  /**
   * Fetch trending subreddits from r/trendingsubreddits
   * Returns top posts about trending subreddits
   */
  async getTrendingSubreddits(): Promise<RedditPost[]> {
    await this.respectRateLimit();

    try {
      const url = `${this.baseUrl}/r/trendingsubreddits.json?limit=25`;
      const response = await fetch(url, {
        headers: { 'User-Agent': this.userAgent },
      });

      if (!response.ok) {
        throw new Error(`Reddit API error: ${response.status} ${response.statusText}`);
      }

      const data = (await response.json()) as RedditApiResponse;
      return data.data.children.map((child) => child.data);
    } catch (error) {
      console.error('[Reddit] Error fetching trending subreddits:', error);
      return [];
    }
  }

  /**
   * Fetch from a specific subreddit
   */
  async getSubredditPosts(subreddit: string, sort: 'hot' | 'top' = 'hot'): Promise<RedditPost[]> {
    await this.respectRateLimit();

    try {
      const url = `${this.baseUrl}/r/${subreddit}/${sort}.json?limit=25&t=day`;
      const response = await fetch(url, {
        headers: { 'User-Agent': this.userAgent },
      });

      if (!response.ok) {
        throw new Error(`Reddit API error: ${response.status} ${response.statusText}`);
      }

      const data = (await response.json()) as RedditApiResponse;
      return data.data.children.map((child) => child.data);
    } catch (error) {
      console.error(`[Reddit] Error fetching posts from r/${subreddit}:`, error);
      return [];
    }
  }

  /**
   * Extract image URL from Reddit post
   */
  getImageUrl(post: RedditPost): string | null {
    // Try preview image first
    if (post.preview?.images?.[0]?.source?.url) {
      return post.preview.images[0].source.url;
    }

    // Fall back to thumbnail
    if (post.thumbnail && post.thumbnail !== 'self' && post.thumbnail !== 'default') {
      return post.thumbnail;
    }

    // Try URL directly if it's an image
    if (post.url && (post.url.includes('.jpg') || post.url.includes('.png') || post.url.includes('.gif'))) {
      return post.url;
    }

    return null;
  }
}

export const redditClient = new RedditClient();
