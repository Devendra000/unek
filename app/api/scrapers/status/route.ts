/**
 * Scraper Status & Management API
 * GET: Get current scraper status
 * POST: Trigger manual scrape
 */

import { NextRequest, NextResponse } from 'next/server';
import { getScrapersStatus } from '@/src/scrapers';
import { scrapeRedditTrends } from '@/src/scrapers/reddit/redditScraper';
import { scrapeGoogleTrends } from '@/src/scrapers/google-trends/googleTrendsScraper';

export async function GET() {
  try {
    const status = getScrapersStatus();
    return NextResponse.json(status, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get scraper status', details: error },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'scrape-reddit') {
      const result = await scrapeRedditTrends();
      return NextResponse.json(
        { message: 'Reddit scrape completed', result },
        { status: 200 }
      );
    }

    if (action === 'scrape-google-trends') {
      const result = await scrapeGoogleTrends();
      return NextResponse.json(
        { message: 'Google Trends scrape completed', result },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Unknown action', action },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process scraper request', details: error },
      { status: 500 }
    );
  }
}
