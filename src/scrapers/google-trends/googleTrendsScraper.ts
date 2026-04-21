/**
 * Google Trends Scraper
 * Transforms Google Trends data into TrendingTopic database records
 */

import { prisma } from '@/lib/prisma';
import { googleTrendsClient } from './googleTrendsClient';
import { categorizeGoogleTrend, calculateGoogleTrendsMemeability } from './categoryMapper';

/**
 * Generate external ID for upsert deduplication
 */
function generateExternalId(query: string): string {
  return `googletrends_${query.toLowerCase().replace(/\s+/g, '_')}`;
}

/**
 * Fetch and scrape trends from Google Trends into database
 */
export async function scrapeGoogleTrends() {
  try {
    console.log('[Scraper] Starting Google Trends scraping...');

    // Ensure Google Trends source exists
    const googleTrendsSource = await prisma.source.upsert({
      where: { slug: 'google-trends' },
      update: {},
      create: {
        name: 'Google Trends',
        slug: 'google-trends',
        sourceType: 'SOCIAL_PLATFORM',
        baseUrl: 'https://trends.google.com',
        country: 'US',
        isActive: true,
      },
    });

    console.log('[Scraper] Google Trends source ready:', googleTrendsSource.id);

    // Fetch trends from multiple sources
    const [dailyTrends, realTimeTrends] = await Promise.all([
      googleTrendsClient.getDailyTrends('US'),
      googleTrendsClient.getRealTimeTrends('US'),
    ]);

    // Combine and deduplicate by title
    const allTrends = [...dailyTrends, ...realTimeTrends];
    const uniqueTrends = Array.from(new Map(allTrends.map((t) => [t.title, t])).values());

    console.log(`[Scraper] Fetched ${uniqueTrends.length} unique trends from Google Trends`);

    // Upsert trends into database
    let upsertCount = 0;
    for (const trend of uniqueTrends) {
      try {
        const externalId = generateExternalId(trend.title);
        const category = categorizeGoogleTrend(trend.title);
        const memeability = calculateGoogleTrendsMemeability(trend.formattedTraffic);

        // Get category ID
        const categoryRecord = await prisma.category.findUnique({
          where: { slug: category.toLowerCase() },
        });

        if (!categoryRecord) {
          console.warn(`[Scraper] Category not found: ${category}`);
          continue;
        }

        // Parse traffic number for score
        const trafficStr = trend.formattedTraffic || '';
        let score = 5;
        if (trafficStr.includes('m+')) score = 10;
        else if (trafficStr.includes('k+')) score = 8;
        else if (trafficStr.includes('+')) {
          const match = trafficStr.match(/\+(\d+)/);
          if (match) {
            const increase = parseInt(match[1]);
            score = Math.min(Math.floor(increase / 100), 10);
          }
        }

        // Generate unique link for Google Trends
        const trendLink = `https://trends.google.com/trends/explore?q=${encodeURIComponent(trend.title)}`;

        // Upsert trend
        const upserted = await prisma.trendingTopic.upsert({
          where: { link: trendLink },
          update: {
            score,
            memeability,
            fetchedAt: new Date(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours for Google Trends
          },
          create: {
            title: trend.title,
            summary: `Trending on Google: ${trend.title}. Traffic: ${trend.formattedTraffic || 'N/A'}`,
            fullDescription: trend.relatedQueries
              ? `Related searches: ${trend.relatedQueries.map((rq) => rq.query).join(', ')}`
              : `Trending search term on Google Trends`,
            link: trendLink,
            imageUrl: undefined,
            score,
            memeability,
            trendSource: 'GOOGLE_TRENDS',
            memeIdeas: [],
            platformData: {
              googleTrendsQuery: trend.query,
              formattedTraffic: trend.formattedTraffic,
              relatedQueries: trend.relatedQueries?.map((rq) => rq.query) || [],
              exploreLink: trend.exploreLink,
            },
            sourceId: googleTrendsSource.id,
            categoryId: categoryRecord.id,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
          },
        });

        upsertCount++;
        console.log(`[Scraper] ✓ Upserted: ${trend.title}`);
      } catch (error) {
        console.error(`[Scraper] Failed to upsert trend "${trend.title}":`, error);
        continue;
      }
    }

    console.log(`[Scraper] Completed: ${upsertCount}/${uniqueTrends.length} trends upserted`);
    return { success: true, upsertCount, totalTrends: uniqueTrends.length };
  } catch (error) {
    console.error('[Scraper] Fatal error during Google Trends scraping:', error);
    throw error;
  }
}
