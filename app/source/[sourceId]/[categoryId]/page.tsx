import { prisma } from '@/lib/prisma';
import ClientCategoryPage from './page-client';
import type { TrendingTopic, Category, Source, TrendTag, Tag } from '@prisma/client';

interface SourceCategoryPageProps {
  params: Promise<{
    sourceId: string;
    categoryId: string;
  }>;
}

export default async function SourceCategoryPage({ params }: SourceCategoryPageProps) {
  const { sourceId, categoryId } = await params;
  
  // Fetch source and category from database
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
          </div>
        </main>
      </div>
    );
  }

  const dbCategory = await prisma.category.findUnique({
    where: { slug: categoryId },
  });

  if (!dbCategory) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <main className="container mx-auto px-3 py-4 md:px-4 md:py-8">
          <div className="flex flex-col items-center justify-center min-h-96 text-center">
            <div className="text-5xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Category not found</h2>
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

  // Fetch all categories for this source
  const sourceCategories = await prisma.trendingTopic.findMany({
    where: { sourceId: dbSource.id },
    include: { category: true },
    distinct: ['categoryId'],
  });

  const uniqueCategories = Array.from(
    new Map(sourceCategories.map(t => [t.category.id, t.category])).values()
  );

  // Fetch trends for this source + category
  type TrendWithRelations = TrendingTopic & {
    category: Category;
    source: Source;
    tags: (TrendTag & { tag: Tag })[];
  };

  let trends: TrendWithRelations[] = [];

  trends = await prisma.trendingTopic.findMany({
    where: {
      sourceId: dbSource.id,
      categoryId: dbCategory.id,
    },
    take: 13,
    orderBy: { score: 'desc' },
    include: {
      category: true,
      source: true,
      tags: { include: { tag: true } },
    },
  });

  const hasMore = trends.length > 12;
  const displayTrends = trends.slice(0, 12);

  const transformedTrends = displayTrends.map((trend: TrendWithRelations) => ({
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
    tags: trend.tags.map((t: TrendTag & { tag: Tag }) => t.tag.name),
    timeAgo: new Date(trend.createdAt).toLocaleString(),
  }));

  return (
    <ClientCategoryPage 
      sourceId={sourceId}
      sourceName={dbSource.name}
      sources={sources}
      categoryId={categoryId}
      categoryName={dbCategory.name}
      categories={uniqueCategories.map(c => c.name)}
      initialTrends={transformedTrends}
      hasMore={hasMore}
    />
  );
}
