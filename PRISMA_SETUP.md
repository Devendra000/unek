# Prisma 7 Database Setup Guide

## Prerequisites

Make sure your PostgreSQL Docker container is running:

```bash
docker-compose up -d postgres
```

## Installation

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   The `.env.local` file is already configured with your Docker PostgreSQL connection.

3. **Generate Prisma Client:**
   ```bash
   pnpm prisma:generate
   ```

## Database Setup

### Step 1: Create migrations
```bash
pnpm prisma:migrate
```

When prompted, give it a name like `init` for the first migration.

### Step 2: Seed the database
```bash
pnpm prisma:seed
```

This will populate:
- Categories (Tech, Finance, Hot, Memeable, Student, Global, Nepal)
- Sources (Reddit, Google Trends, Twitter/X, BBC)
- Tags (AI, Meme, Viral, Gaming, etc.)

### Step 3: Verify with Prisma Studio
```bash
pnpm prisma:studio
```

This opens a visual database browser at `http://localhost:5555`

## Usage in Your App

### Import database functions:
```typescript
import { getTrends, getTrendById, searchTrends } from '@/lib/db';
import { prisma } from '@/lib/prisma';
```

### Examples:

**Get all trends:**
```typescript
const trends = await getTrends(12);
```

**Get trends by category:**
```typescript
const techTrends = await getTrendsByCategory(categoryId);
```

**Search trends:**
```typescript
const results = await searchTrends('AI');
```

**Get a single trend:**
```typescript
const trend = await getTrendById(trendId);
```

## Integration with Mock Data

To migrate from mock data to database:

1. Keep your current mock data in `lib/mock-data.ts`
2. Create a migration script to insert mock data as `TrendingTopic` records
3. Update your components to use `getTrends()` instead of importing mock data

Example:
```typescript
// Before
import { mockTrends } from '@/lib/mock-data';

// After
const trends = await getTrends(12);
```

## Prisma Commands

- `pnpm prisma:generate` - Generate Prisma Client
- `pnpm prisma:migrate` - Create and apply migrations
- `pnpm prisma:migrate:prod` - Run migrations in production
- `pnpm prisma:studio` - Open visual database browser
- `pnpm prisma:seed` - Run seed script

## Schema Location

The database schema is at `database/schema.prisma`

Key models:
- `TrendingTopic` - Individual trends/viral content
- `NewsArticle` - News articles
- `Category` - Content categories
- `Source` - Content sources (Reddit, Google Trends, etc.)
- `User` - User accounts
- `Favorite` - User favorites
- `Tag` - Content tags

## Troubleshooting

**Migration failed?**
```bash
pnpm prisma migrate resolve --rolled-back <migration_name>
```

**Database connection error?**
Check your Docker container is running:
```bash
docker ps
```

Make sure `.env.local` has the correct DATABASE_URL

**Clear database and start fresh?**
⚠️ WARNING: This deletes all data!
```bash
pnpm prisma migrate reset
```

## Next Steps

1. Run: `pnpm install`
2. Run: `pnpm prisma:migrate`
3. Run: `pnpm prisma:seed`
4. Run: `pnpm prisma:studio` (optional, to verify)
5. Update your components to use `lib/db.ts` functions
