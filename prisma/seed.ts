import { prisma } from '../lib/prisma';

// These slugs must stay in sync with categoryMapper.ts
const CATEGORIES = [
  // --- mapper-required ---
  { name: 'Tech',          slug: 'tech',          description: 'Technology, AI, and software trends' },
  { name: 'Finance',       slug: 'finance',        description: 'Finance, stocks, and cryptocurrency' },
  { name: 'Politics',      slug: 'politics',       description: 'Political news and global affairs' },
  { name: 'Sports',        slug: 'sports',         description: 'Sports, leagues, and athletes' },
  { name: 'Entertainment', slug: 'entertainment',  description: 'Movies, music, TV, and celebrities' },
  { name: 'Science',       slug: 'science',        description: 'Science, space, and research' },
  { name: 'Health',        slug: 'health',         description: 'Health, fitness, and mental wellness' },
  { name: 'Gaming',        slug: 'gaming',         description: 'Video games and esports' },
  { name: 'Memeable',      slug: 'memeable',       description: 'Trending memes and viral content' },
  { name: 'Student',       slug: 'student',        description: 'Trends relevant to students' },
  { name: 'General',       slug: 'general',        description: 'General and uncategorized trends' },

  // --- custom / regional ---
  { name: 'Hot',           slug: 'hot',            description: 'Currently trending hot topics' },
  { name: 'Global',        slug: 'global',         description: 'Global trending stories' },
  { name: 'Nepal',         slug: 'nepal',          description: 'Trends and news from Nepal' },
];

const SOURCES = [
  // Social platforms
  {
    name: 'Reddit',
    slug: 'reddit',
    sourceType: 'SOCIAL_PLATFORM' as const,
    baseUrl: 'https://www.reddit.com',
    country: 'US',
  },
  {
    name: 'Google Trends',
    slug: 'google-trends',
    sourceType: 'SOCIAL_PLATFORM' as const,
    baseUrl: 'https://trends.google.com',
    country: 'US',
  },
  {
    name: 'Twitter/X',
    slug: 'twitter-x',
    sourceType: 'SOCIAL_PLATFORM' as const,
    baseUrl: 'https://x.com',
    country: 'US',
  },

  // International news outlets
  {
    name: 'BBC',
    slug: 'bbc',
    sourceType: 'NEWS_OUTLET' as const,
    baseUrl: 'https://www.bbc.com',
    country: 'GB',
  },
  {
    name: 'Reuters',
    slug: 'reuters',
    sourceType: 'NEWS_OUTLET' as const,
    baseUrl: 'https://www.reuters.com',
    country: 'GB',
  },
  {
    name: 'Al Jazeera',
    slug: 'al-jazeera',
    sourceType: 'NEWS_OUTLET' as const,
    baseUrl: 'https://www.aljazeera.com',
    country: 'QA',
  },

  // Nepal news outlets
  {
    name: 'Ekantipur',
    slug: 'ekantipur',
    sourceType: 'NEWS_OUTLET' as const,
    baseUrl: 'https://ekantipur.com',
    country: 'NP',
  },
  {
    name: 'OnlineKhabar',
    slug: 'onlinekhabar',
    sourceType: 'NEWS_OUTLET' as const,
    baseUrl: 'https://www.onlinekhabar.com',
    country: 'NP',
  },
  {
    name: 'Kathmandu Post',
    slug: 'kathmandu-post',
    sourceType: 'NEWS_OUTLET' as const,
    baseUrl: 'https://kathmandupost.com',
    country: 'NP',
  },
  {
    name: 'Nepal News',
    slug: 'nepal-news',
    sourceType: 'NEWS_OUTLET' as const,
    baseUrl: 'https://nepalnews.com',
    country: 'NP',
  },
];

const TAGS = [
  // Tech
  'AI', 'Technology', 'Cybersecurity', 'Open Source', 'Startup',
  // Finance
  'Crypto', 'Stocks', 'Bitcoin', 'Economy',
  // Culture
  'Meme', 'Viral', 'Gaming', 'Music', 'Film',
  // News
  'Breaking News', 'Politics', 'Climate', 'Science',
  // Social
  'Social Media', 'Reddit', 'Twitter',
  // Nepal
  'Nepal', 'Kathmandu',
];

async function main() {
  console.log('🌱 Seeding database...');

  // Categories
  console.log('  Creating categories...');
  for (const category of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, description: category.description },
      create: category,
    });
  }
  console.log(`  ✓ ${CATEGORIES.length} categories`);

  // Sources
  console.log('  Creating sources...');
  for (const source of SOURCES) {
    await prisma.source.upsert({
      where: { slug: source.slug },
      update: { name: source.name, baseUrl: source.baseUrl, country: source.country },
      create: source,
    });
  }
  console.log(`  ✓ ${SOURCES.length} sources`);

  // Tags
  console.log('  Creating tags...');
  for (const tag of TAGS) {
    const slug = tag.toLowerCase().replace(/\s+/g, '-');
    await prisma.tag.upsert({
      where: { name: tag },
      update: {},
      create: { name: tag, slug },
    });
  }
  console.log(`  ✓ ${TAGS.length} tags`);

  console.log('\n✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
