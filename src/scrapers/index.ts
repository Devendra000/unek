/**
 * Scrapers Index
 * Entry point that boots all scraper jobs
 */

import { startRedditScraperJob, stopRedditScraperJob, getRedditJobStatus } from './reddit/redditJob';

/**
 * Initialize all scrapers
 * Call this once on server startup
 */
export async function initializeScrapers() {
  try {
    console.log('\n📊 Initializing Scrapers...\n');

    // Start Reddit scraper
    await startRedditScraperJob();

    // Add more scrapers here as needed
    // await startTwitterScraperJob();
    // await startGoogleTrendsScraperJob();

    console.log('\n✅ All scrapers initialized\n');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize scrapers:', error);
    throw error;
  }
}

/**
 * Shutdown all scrapers
 * Call this on server shutdown
 */
export async function shutdownScrapers() {
  try {
    console.log('\n🛑 Shutting down scrapers...\n');

    stopRedditScraperJob();
    // Add more cleanup here as needed

    console.log('✅ All scrapers shut down\n');
  } catch (error) {
    console.error('❌ Error during scraper shutdown:', error);
  }
}

/**
 * Get status of all scrapers
 */
export function getScrapersStatus() {
  return {
    reddit: getRedditJobStatus(),
    timestamp: new Date().toISOString(),
  };
}
