/**
 * Reddit Scraper
 * Transforms Reddit posts into TrendingTopic database records
 */

import { prisma } from '@/lib/prisma';
import { redditClient } from './redditClient';
import { categorizePost, calculateMemeability } from './categoryMapper';

/**
 * Generate external ID for upsert deduplication
 */
function generateExternalId(redditPostId: string): string {
  return `reddit_${redditPostId}`;
}

/**
 * Fetch and scrape posts from Reddit into database
 */
export async function scrapeRedditTrends() {
  try {
    console.log('[Scraper] Starting Reddit scraping...');

    // Ensure Reddit source exists
    const redditSource = await prisma.source.upsert({
      where: { slug: 'reddit' },
      update: {},
      create: {
        name: 'Reddit',
        slug: 'reddit',
        sourceType: 'SOCIAL_PLATFORM',
        baseUrl: 'https://reddit.com',
        country: 'US',
        isActive: true,
      },
    });

    console.log('[Scraper] Reddit source ready:', redditSource.id);

    // Fetch posts from multiple sources
    const [popularPosts, trendingPosts] = await Promise.all([
      redditClient.getPopularPosts(),
      redditClient.getTrendingSubreddits(),
    ]);

    const allPosts = [...popularPosts, ...trendingPosts];
    console.log(`[Scraper] Fetched ${allPosts.length} posts from Reddit`);

    // Upsert posts into database
    let upsertCount = 0;
    for (const post of allPosts) {
      try {
        const externalId = generateExternalId(post.id);
        const imageUrl = redditClient.getImageUrl(post);
        const category = categorizePost(post.title, post.subreddit);
        const memeability = calculateMemeability(post.upvote_ratio, post.num_comments);

        // Get category ID
        const categoryRecord = await prisma.category.findUnique({
          where: { slug: category.toLowerCase() },
        });

        if (!categoryRecord) {
          console.warn(`[Scraper] Category not found: ${category}`);
          continue;
        }

        // Upsert trend
        const trend = await prisma.trendingTopic.upsert({
          where: { link: post.url }, // Unique by Reddit post URL
          update: {
            score: post.score,
            memeability,
            fetchedAt: new Date(),
            // Keep expiresAt if already set, otherwise set to 48h from now
            expiresAt: {
              set: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours
            },
          },
          create: {
            title: post.title,
            summary: post.selftext.substring(0, 500) || `Discussion in r/${post.subreddit}`,
            fullDescription: post.selftext,
            link: post.url,
            imageUrl: imageUrl || undefined,
            score: post.score,
            memeability,
            trendSource: 'REDDIT',
            memeIdeas: [],
            platformData: {
              redditPostId: post.id,
              subreddit: post.subreddit,
              upvoteRatio: post.upvote_ratio,
              commentCount: post.num_comments,
              createdAt: new Date(post.created_utc * 1000).toISOString(),
            },
            sourceId: redditSource.id,
            categoryId: categoryRecord.id,
            expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours
          },
        });

        upsertCount++;
        console.log(`[Scraper] ✓ Upserted: ${post.title.substring(0, 50)}...`);
      } catch (error) {
        console.error(`[Scraper] Failed to upsert post ${post.id}:`, error);
        continue;
      }
    }

    console.log(`[Scraper] Completed: ${upsertCount}/${allPosts.length} trends upserted`);
    return { success: true, upsertCount, totalPosts: allPosts.length };
  } catch (error) {
    console.error('[Scraper] Fatal error during Reddit scraping:', error);
    throw error;
  }
}
