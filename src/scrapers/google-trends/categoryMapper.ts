/**
 * Google Trends Category Mapper
 * Maps Google Trends topics to local categories
 */

// Keywords for category detection
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  tech: ['AI', 'ChatGPT', 'Apple', 'Google', 'Microsoft', 'Tesla', 'Tech', 'Software', 'App', 'AI', 'Meta', 'Amazon', 'iPhone', 'new phone', 'gadget', 'device', 'blockchain', 'crypto', 'web3'],
  finance: ['Stock', 'Bitcoin', 'Crypto', 'Economy', 'Market', 'Investment', 'Finance', 'Bank', 'Dollar', 'Trading', 'Forex', 'Inflation', 'Interest Rate', 'ETF', 'bonds', 'gold', 'oil', 'earnings'],
  memeable: ['viral', 'funny', 'meme', 'TikTok', 'Instagram', 'trend', 'challenge', 'doodle', 'art', 'celebrity', 'influencer', 'joke', 'gaming', 'esports', 'twitch', 'streamer'],
  student: ['exam', 'education', 'university', 'college', 'school', 'student', 'grades', 'scholarship', 'learning', 'online course', 'tutorial', 'boot camp', 'certificate'],
  global: ['world', 'international', 'country', 'global', 'peace', 'war', 'UN', 'diplomatic', 'foreign'],
  nepal: ['Nepal', 'Kathmandu', 'Nepali', 'Indian', 'South Asian', 'Himalayan'],
  hot: ['trending', 'viral', 'breaking', 'news', 'hot', 'popular'],
};

/**
 * Categorize Google Trends topic based on keywords
 */
export function categorizeGoogleTrend(title: string): string {
  const lowerTitle = title.toLowerCase();

  // Check each category's keywords
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((keyword) => lowerTitle.includes(keyword.toLowerCase()))) {
      return category;
    }
  }

  // Default to Hot if no match
  return 'hot';
}

/**
 * Calculate memeability score based on traffic and query trends
 * Google Trends: High traffic = more potential viral/meme-able
 * Score 1-10
 */
export function calculateGoogleTrendsMemeability(formattedTraffic?: string): number {
  if (!formattedTraffic) return 5;

  // Parse traffic format like "+250%" or "250K+" or "1M+"
  const trafficStr = formattedTraffic.toLowerCase();

  if (trafficStr.includes('m+')) return 10; // 1M+ traffic
  if (trafficStr.includes('+') && trafficStr.includes('k')) return 9; // 500K+ etc
  if (trafficStr.includes('+')) {
    // Parse percentage increase
    const match = trafficStr.match(/\+(\d+)/);
    if (match) {
      const increase = parseInt(match[1]);
      if (increase >= 1000) return 10;
      if (increase >= 500) return 9;
      if (increase >= 200) return 8;
      if (increase >= 100) return 7;
      if (increase >= 50) return 6;
      if (increase >= 20) return 5;
      return 4;
    }
  }

  return 5; // Default middle score
}
