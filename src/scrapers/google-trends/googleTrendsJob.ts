/**
 * Google Trends Scraper Cron Job
 * Runs the Google Trends scraper on a schedule
 */

import cron from 'node-cron';
import { scrapeGoogleTrends } from './googleTrendsScraper';

// Store job reference for cleanup
let googleTrendsJob: cron.ScheduledTask | null = null;

/**
 * Start the Google Trends scraper job
 * Runs every 4 hours (Google Trends updates daily)
 */
export async function startGoogleTrendsScraperJob() {
  try {
    console.log('[Job] Starting Google Trends scraper job...');

    // Run immediately on startup
    console.log('[Job] Running initial Google Trends scrape...');
    await scrapeGoogleTrends();

    // Schedule to run every 4 hours (6 times daily)
    // Cron format: minute hour day month dayOfWeek
    googleTrendsJob = cron.schedule('0 */4 * * *', async () => {
      try {
        console.log('[Job] Running scheduled Google Trends scrape...');
        await scrapeGoogleTrends();
      } catch (error) {
        console.error('[Job] Error in scheduled Google Trends scrape:', error);
      }
    });

    console.log('[Job] ✓ Google Trends scraper job started (runs every 4 hours)');
    return true;
  } catch (error) {
    console.error('[Job] Failed to start Google Trends scraper job:', error);
    throw error;
  }
}

/**
 * Stop the Google Trends scraper job
 */
export function stopGoogleTrendsScraperJob() {
  if (googleTrendsJob) {
    googleTrendsJob.stop();
    googleTrendsJob = null;
    console.log('[Job] ✓ Google Trends scraper job stopped');
  }
}

/**
 * Get job status
 */
export function getGoogleTrendsJobStatus() {
  return {
    isRunning: googleTrendsJob ? !googleTrendsJob.status() : false,
    nextRun: googleTrendsJob ? 'Every 4 hours' : 'Not running',
  };
}
