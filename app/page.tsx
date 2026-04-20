import { getTrends } from '@/lib/db';
import { prisma } from '@/lib/prisma';
import ClientTrendPage from './page-client';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  // Fetch unique sources from database
  const dbSources = await prisma.source.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  });

  const sources = dbSources.map((source) => ({
    name: source.name,
    value: source.slug,
    sourceType: source.sourceType,
  }));

  // Fetch trends from database
  const dbTrends = await getTrends(50); // Fetch more for client-side pagination

  // Transform database trends to match UI format
  const trends = dbTrends.map((trend) => ({
    id: trend.id,
    title: trend.title,
    category: trend.category.name,
    categorySlug: trend.category.slug,
    summary: trend.summary,
    fullDescription: trend.fullDescription || trend.summary,
    score: trend.score,
    memeability: trend.memeability || 5,
    image: trend.imageUrl || 'https://picsum.photos/800/400?random=1',
    link: trend.link || '#',
    source: trend.source.name,
    tags: trend.tags.map((t) => t.tag.name),
    timeAgo: new Date(trend.createdAt).toLocaleString(),
  }));

  return (
    <div className="min-h-screen bg-background">
      <ClientTrendPage initialTrends={trends} sources={sources} />
    </div>
  );
}
