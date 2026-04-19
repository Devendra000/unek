/**
 * Scraper Initialization
 * Initialize all scrapers on server startup
 *
 * This module should be imported in your main layout or server component
 * to ensure scrapers start when the Next.js server boots
 */

import { initializeScrapers } from '@/src/scrapers';

let initialized = false;

export async function initScrapersIfNeeded() {
  if (initialized) return;
  initialized = true;

  try {
    console.log('[Init] Initializing scrapers...');
    await initializeScrapers();
  } catch (error) {
    console.error('[Init] Failed to initialize scrapers:', error);
    // Don't throw - let the app continue even if scrapers fail
  }
}
