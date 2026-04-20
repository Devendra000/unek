import { prisma } from '@/lib/prisma';
import ClientSourcePage from './page-client';
import type { Category } from '@prisma/client';

interface SourcePageProps {
  params: Promise<{
    sourceId: string;
  }>;
}

export default async function SourcePage({ params }: SourcePageProps) {
  const { sourceId } = await params;
  
  // Fetch the source from database
  const dbSource = await prisma.source.findUnique({
    where: { slug: sourceId },
  });

  if (!dbSource) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <main className="container mx-auto px-3 py-4 md:px-4 md:py-8">
          <div className="flex flex-col items-center justify-center min-h-96 text-center">
            <div className="text-5xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Source not found</h2>
            <p className="text-muted-foreground mb-6">The source you're looking for doesn't exist.</p>
          </div>
        </main>
      </div>
    );
  }

  // Fetch all sources
  const allDbSources = await prisma.source.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  });

  const sources = allDbSources.map((source) => ({
    name: source.name,
    value: source.slug,
    sourceType: source.sourceType,
  }));

  // Fetch categories for this source
  const categories = await prisma.trendingTopic.findMany({
    where: { sourceId: dbSource.id },
    include: { category: true },
    distinct: ['categoryId'],
  });

  const uniqueCategories = Array.from(
    new Map(categories.map(t => [t.category.id, t.category])).values()
  );

  // Fetch first 12 trending topics from any category
  const initialTrends = await prisma.trendingTopic.findMany({
    where: { sourceId: dbSource.id },
    include: { category: true },
    orderBy: [{ score: 'desc' }, { fetchedAt: 'desc' }],
    take: 12,
  });

  return (
    <ClientSourcePage 
      sourceId={sourceId}
      sourceName={dbSource.name}
      sources={sources}
      categories={uniqueCategories.map(c => c.name)}
      initialTrends={initialTrends}
    />
  );
}
