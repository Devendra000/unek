/**
 * Reddit Scraper Cron Job
 * Runs the Reddit scraper on a schedule
 */

import cron from 'node-cron';
import { scrapeRedditTrends } from './redditScraper';

// Store job reference for cleanup
let redditJob: cron.ScheduledTask | null = null;

/**
 * Start the Reddit scraper job
 * Runs every 30 minutes
 */
export async function startRedditScraperJob() {
  try {
    console.log('[Job] Starting Reddit scraper job...');

    // Run immediately on startup
    console.log('[Job] Running initial scrape...');
    await scrapeRedditTrends();

    // Schedule to run every 30 minutes
    redditJob = cron.schedule('*/30 * * * *', async () => {
      try {
        console.log('[Job] Running scheduled Reddit scrape...');
        await scrapeRedditTrends();
      } catch (error) {
        console.error('[Job] Error in scheduled Reddit scrape:', error);
      }
    });

    console.log('[Job] ✓ Reddit scraper job started (runs every 30 minutes)');
    return true;
  } catch (error) {
    console.error('[Job] Failed to start Reddit scraper job:', error);
    throw error;
  }
}

/**
 * Stop the Reddit scraper job
 */
export function stopRedditScraperJob() {
  if (redditJob) {
    redditJob.stop();
    redditJob = null;
    console.log('[Job] ✓ Reddit scraper job stopped');
  }
}

/**
 * Get job status
 */
export function getRedditJobStatus() {
  return {
    isRunning: redditJob ? !redditJob.status() : false,
    nextRun: redditJob ? 'Every 30 minutes' : 'Not running',
  };
}
