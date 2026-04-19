import { prisma } from '../lib/prisma';

const CATEGORIES = [
  { name: 'Tech', slug: 'tech', description: 'Technology and Software trends' },
  { name: 'Finance', slug: 'finance', description: 'Finance and Cryptocurrency trends' },
  { name: 'Hot', slug: 'hot', description: 'Trending Hot topics' },
  { name: 'Memeable', slug: 'memeable', description: 'Trending memes and viral content' },
  { name: 'Student', slug: 'student', description: 'Trends relevant to students' },
  { name: 'Global', slug: 'global', description: 'Global trends' },
  { name: 'Nepal', slug: 'nepal', description: 'Trends from Nepal' },
];

const SOURCES = [
  {
    name: 'Reddit',
    slug: 'reddit',
    sourceType: 'SOCIAL_PLATFORM' as const,
    baseUrl: 'https://reddit.com',
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
  {
    name: 'BBC',
    slug: 'bbc',
    sourceType: 'NEWS_OUTLET' as const,
    baseUrl: 'https://bbc.com',
    country: 'GB',
  },
];

const TAGS = ['AI', 'Meme', 'Viral', 'Gaming', 'News', 'Technology', 'Crypto', 'Social Media'];

async function main() {
  console.log('🌱 Seeding database...');

  // Create categories
  console.log('Creating categories...');
  for (const category of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  // Create sources
  console.log('Creating sources...');
  for (const source of SOURCES) {
    await prisma.source.upsert({
      where: { slug: source.slug },
      update: {},
      create: source,
    });
  }

  // Create tags
  console.log('Creating tags...');
  for (const tag of TAGS) {
    await prisma.tag.upsert({
      where: { slug: tag.toLowerCase() },
      update: {},
      create: {
        name: tag,
        slug: tag.toLowerCase(),
      },
    });
  }

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
