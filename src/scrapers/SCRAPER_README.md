# Reddit Scraper Infrastructure

Complete automated scraping system for fetching trending data from Reddit into your database.

## Architecture

```
src/
├── scrapers/
│   ├── index.ts                 # Entry point - bootstraps all jobs
│   └── reddit/
│       ├── redditClient.ts      # Raw fetch wrapper for Reddit API
│       ├── categoryMapper.ts    # Keyword → category mapping logic
│       ├── redditScraper.ts     # Transforms posts into TrendingTopic upserts
│       └── redditJob.ts         # node-cron scheduled job
│
├── lib/
│   ├── prisma.ts                # Singleton Prisma client
│   └── initScrapers.ts          # Server startup initialization
│
└── app/api/scrapers/
    └── status/route.ts          # GET/POST API for scraper management
```

## Key Features

### 1. **Automatic Deduplication**
- Uses `externalId` pattern (e.g., `reddit_post123`) for upsert
- Re-runs never duplicate rows
- Existing trends are updated (score, memeability) instead of recreated

### 2. **Multi-Source Data Fetching**
- `/r/popular.json` - Top 25 posts across Reddit
- `/r/trendingsubreddits.json` - Trending subreddit discussion
- Smart URL deduplication via `link` unique constraint

### 3. **Smart Categorization**
- Keyword-based mapping (title + subreddit → category)
- Fallback to "Hot" category if no match
- 7 categories: Tech, Finance, Hot, Memeable, Student, Global, Nepal

### 4. **Memeability Scoring (1-10)**
- Formula: `0.4 × commentScore + 0.6 × upvoteScore`
- Comment ratio: `min(commentCount / 1000, 10)`
- Upvote ratio: `upvoteRatio × 10`
- Result: Capped between 1-10

### 5. **Data Expiration**
- `expiresAt` set to 48 hours from fetch time
- Trends are ephemeral - old data cleaned up automatically
- Perfect for time-sensitive viral content

### 6. **Rate Limiting**
- 2-second delay between Reddit API requests
- Respectful of public API rate limits
- No authentication needed (uses public endpoints)

## Usage

### Automatic (On Server Start)
```typescript
// Already initialized in app/layout.tsx
initScrapersIfNeeded() // Called on app startup
```

Scrapers run automatically:
- **First run**: Immediate on server start
- **Recurring**: Every 30 minutes

### Manual Trigger via API

```bash
# Get status
curl http://localhost:3000/api/scrapers/status

# Trigger Reddit scrape
curl -X POST http://localhost:3000/api/scrapers/status \
  -H "Content-Type: application/json" \
  -d '{"action": "scrape-reddit"}'
```

### Programmatically

```typescript
import { scrapeRedditTrends } from '@/src/scrapers/reddit/redditScraper';

// Manual scrape
const result = await scrapeRedditTrends();
console.log(`Upserted ${result.upsertCount} trends`);
```

## Data Flow

### 1. Fetch
```
Reddit Public API
    ↓
redditClient.getPopularPosts()
redditClient.getTrendingSubreddits()
    ↓
Array<RedditPost>
```

### 2. Transform
```
For each RedditPost:
  - Generate externalId: "reddit_{post.id}"
  - Categorize: categorizePost(title, subreddit)
  - Score memeability: calculateMemeability(upvote_ratio, comments)
  - Extract image: redditClient.getImageUrl(post)
  - Calculate expiration: now + 48h
```

### 3. Upsert to Database
```
UPSERT TrendingTopic WHERE link = "{reddit_url}"
  ↓
If exists: UPDATE score, memeability, fetchedAt
If new: CREATE full record with all fields
```

## Database Schema Integration

Required fields in `TrendingTopic` model:

```prisma
model TrendingTopic {
  // Unique identifier from Reddit
  link        String    @unique
  
  // Content
  title       String
  summary     String
  fullDescription String
  imageUrl    String?
  
  // Scoring & engagement
  score       Int
  memeability Int // 1-10
  
  // Metadata
  trendSource TrendSource // REDDIT enum
  platformData Json        // Stores: redditPostId, subreddit, upvoteRatio, etc.
  
  // Expiration (cron can clean up expired trends)
  expiresAt   DateTime
  fetchedAt   DateTime
  
  // Relations
  sourceId    Int
  categoryId  Int
  source      Source      @relation(fields: [sourceId], references: [id])
  category    Category    @relation(fields: [categoryId], references: [id])
}
```

## Configuration

### Schedule
Edit `redditJob.ts` cron pattern:
```typescript
// Current: every 30 minutes
cron.schedule('*/30 * * * *', async () => { ... })

// Examples:
// Every hour:     '0 * * * *'
// Every 6 hours:  '0 */6 * * *'
// Daily at 8am:   '0 8 * * *'
```

### Rate Limiting
Edit `redditClient.ts`:
```typescript
const RATE_LIMIT_DELAY = 2000; // milliseconds between requests
```

### Data Expiration
Edit `redditScraper.ts`:
```typescript
expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000) // Change 48 to desired hours
```

### Category Mappings
Edit `categoryMapper.ts` - add/remove keywords from `CATEGORY_MAPPINGS`

## Performance

- **Request Time**: ~8-12 seconds for full run (2 API calls + 50 upserts)
- **Memory**: Minimal (streaming upserts, not batch)
- **Database**: Indexed queries on `link`, `sourceId`, `categoryId`

## Extending for Other Sources

### Add Google Trends Scraper

1. Create `src/scrapers/googletrends/googleTrendsClient.ts`
2. Create `src/scrapers/googletrends/googleTrendsScraper.ts`
3. Create `src/scrapers/googletrends/googleTrendsJob.ts`
4. Add to `src/scrapers/index.ts`:

```typescript
import { startGoogleTrendsScraperJob } from './googletrends/googleTrendsJob';

export async function initializeScrapers() {
  await startRedditScraperJob();
  await startGoogleTrendsScraperJob(); // ← New
}
```

## Debugging

### Enable Verbose Logging
```typescript
// In redditScraper.ts
console.log('[Scraper] Raw posts:', allPosts.map(p => p.title));
```

### Check Database
```bash
pnpm prisma studio
# View TrendingTopic table in Prisma Studio
```

### Manual API Test
```bash
curl -s http://localhost:3000/api/scrapers/status | jq .
```

### Check Job Status
```typescript
import { getRedditJobStatus } from '@/src/scrapers/reddit/redditJob';

console.log(getRedditJobStatus());
// { isRunning: true, nextRun: 'Every 30 minutes' }
```

## Troubleshooting

### Scrapers not running on startup
- Check `app/layout.tsx` imports `initScrapersIfNeeded`
- Check console for `[Init] Initializing scrapers...` message
- Ensure `node-cron` is installed: `pnpm install node-cron`

### Rate limit errors from Reddit
- Increase `RATE_LIMIT_DELAY` in `redditClient.ts`
- Current: 2s between requests (60+ requests/min limit)

### Category mapping missing
- Check post title/subreddit has keywords matching `categoryMapper.ts`
- Default fallback is "Hot" category

### Database connection failing
- Verify PostgreSQL is running: `docker ps` (if using Docker)
- Check `.env.local` has valid `DATABASE_URL`
- Run `pnpm prisma studio` to test connection

### Duplicate trends appearing
- Should not happen with upsert logic
- If it does: Check `link` field is truly unique per post
- Run: `SELECT DISTINCT link FROM "TrendingTopic" LIMIT 5` to inspect

## Performance Optimization

### Reduce API Calls
```typescript
// Current: fetches 2 endpoints
const [popularPosts, trendingPosts] = await Promise.all([...])

// Faster: fetch only popular
const popularPosts = await redditClient.getPopularPosts();
```

### Batch Upserts
```typescript
// Current: sequential upserts
for (const post of allPosts) {
  await prisma.trendingTopic.upsert(...)
}

// Faster: Promise.all batches
await Promise.all(allPosts.map(post => prisma.trendingTopic.upsert(...)))
```

### Selective Updates
```typescript
// Only update if score increased significantly
if (post.score > existingTrend.score * 1.5) {
  // update
}
```

## License

Part of unEK trending dashboard project.
