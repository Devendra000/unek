/**
 * Category Mapper
 * Maps Reddit subreddits and keywords to our app categories
 */

export type CategoryType = 'Tech' | 'Finance' | 'Hot' | 'Memeable' | 'Student' | 'Global' | 'Nepal';

interface CategoryMapping {
  keywords: string[];
  category: CategoryType;
}

const CATEGORY_MAPPINGS: CategoryMapping[] = [
  {
    category: 'Tech',
    keywords: [
      'technology',
      'programming',
      'coding',
      'software',
      'hardware',
      'ai',
      'machine learning',
      'web',
      'app',
      'startup',
      'tech',
      'computer',
      'python',
      'javascript',
      'react',
      'node',
      'database',
      'devops',
      'cloud',
    ],
  },
  {
    category: 'Finance',
    keywords: [
      'crypto',
      'bitcoin',
      'ethereum',
      'stock',
      'trading',
      'finance',
      'investment',
      'economy',
      'business',
      'money',
      'defi',
      'nft',
      'forex',
      'passive income',
    ],
  },
  {
    category: 'Memeable',
    keywords: [
      'meme',
      'funny',
      'humor',
      'joke',
      'viral',
      'hilarious',
      'trending',
      'cringe',
      'lol',
      'silly',
      'memes',
      'comedy',
      'entertainment',
    ],
  },
  {
    category: 'Student',
    keywords: [
      'student',
      'college',
      'university',
      'education',
      'school',
      'exam',
      'homework',
      'study',
      'learning',
      'grad',
      'professor',
      'campus',
      'dorm',
    ],
  },
  {
    category: 'Hot',
    keywords: [
      'trending',
      'viral',
      'popular',
      'news',
      'breaking',
      'hot',
      'top',
      'upvotes',
      'discussion',
      'everyone talking about',
    ],
  },
  {
    category: 'Global',
    keywords: [
      'world',
      'international',
      'global',
      'worldwide',
      'news',
      'current events',
      'politics',
      'society',
      'culture',
    ],
  },
  {
    category: 'Nepal',
    keywords: ['nepal', 'kathmandu', 'nepali', 'nepalese', 'south asia'],
  },
];

/**
 * Determine category from post title and subreddit
 */
export function categorizePost(title: string, subreddit: string): CategoryType {
  const searchText = `${title} ${subreddit}`.toLowerCase();

  for (const mapping of CATEGORY_MAPPINGS) {
    for (const keyword of mapping.keywords) {
      if (searchText.includes(keyword)) {
        return mapping.category;
      }
    }
  }

  // Default to Hot if no match
  return 'Hot';
}

/**
 * Calculate memeability score (1-10)
 * Based on upvote ratio and comment count
 */
export function calculateMemeability(upvoteRatio: number, commentCount: number): number {
  // Normalize comment count (assuming max ~10k comments is a peak)
  const commentScore = Math.min(commentCount / 1000, 10);

  // Upvote ratio closer to 1.0 means more people agree = more shareable
  const upvoteScore = upvoteRatio * 10;

  // Weighted average
  const score = commentScore * 0.4 + upvoteScore * 0.6;

  // Cap between 1-10
  return Math.max(1, Math.min(10, Math.round(score)));
}
