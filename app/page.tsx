import { getTrends } from '@/lib/db';
import ClientTrendPage from './page-client';

export const revalidate = 60; // Revalidate every 60 seconds

const CATEGORIES = [
  { name: 'Global', description: 'Worldwide trending topics' },
  { name: 'Nepal', description: 'Trends in Nepal' },
  { name: 'Hot', description: 'Hottest trends right now' },
  { name: 'Memeable', description: 'Most memeable content' },
  { name: 'Tech', description: 'Technology trends' },
  { name: 'Finance', description: 'Finance & markets' },
  { name: 'Student', description: 'Student trends' },
];

export default async function Home() {
  // Fetch trends from database
  const dbTrends = await getTrends(50); // Fetch more for client-side pagination

  // Transform database trends to match UI format
  const trends = dbTrends.map((trend) => ({
    id: trend.id,
    title: trend.title,
    category: trend.category.name,
    categorySlug: trend.category.slug,
    summary: trend.summary,
    score: trend.score,
    memeability: trend.memeability || 5,
    imageUrl: trend.imageUrl || 'https://picsum.photos/800/400?random=1',
    link: trend.link || '#',
    source: trend.source.name,
    tags: trend.tags.map((t) => t.tag.name),
  }));

  return (
    <div className="min-h-screen bg-background">
      <ClientTrendPage initialTrends={trends} categories={CATEGORIES} />
    </div>
  );
}
