import { getCategories } from '@/lib/db';
import { prisma } from '@/lib/prisma';
import ClientCategoryPage from './page-client';
import type { TrendingTopic, Category, Source, TrendTag, Tag } from '@prisma/client';

export const revalidate = 60;

const CATEGORIES = ['Global', 'Nepal', 'Hot', 'Memeable', 'Tech', 'Finance', 'Student'];

interface CategoryPageProps {
  params: Promise<{
    categoryId: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categoryId } = await params;
  const categoryName = categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
  const isValidCategory = CATEGORIES.some((cat) => cat.toLowerCase() === categoryId);

  if (!isValidCategory) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <main className="container mx-auto px-3 py-4 md:px-4 md:py-8">
          <div className="flex flex-col items-center justify-center min-h-96 text-center">
            <div className="text-5xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Category not found</h2>
            <p className="text-muted-foreground mb-6">The category "{categoryName}" does not exist.</p>
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

  // Fetch category and trends from database
  let categoryRecord = null;
  type TrendWithRelations = TrendingTopic & {
    category: Category;
    source: Source;
    tags: (TrendTag & { tag: Tag })[];
  };
  let trends: TrendWithRelations[] = [];

  if (categoryId === 'global') {
    // Global shows all trends
    trends = await prisma.trendingTopic.findMany({
      take: 13,
      orderBy: { score: 'desc' },
      include: {
        category: true,
        source: true,
        tags: { include: { tag: true } },
      },
    });
  } else if (categoryId === 'hot') {
    // Hot shows the hottest trends across all categories
    trends = await prisma.trendingTopic.findMany({
      take: 13,
      orderBy: [
        { score: 'desc' },
        { memeability: 'desc' },
      ],
      include: {
        category: true,
        source: true,
        tags: { include: { tag: true } },
      },
    });
  } else {
    // Specific category
    categoryRecord = await prisma.category.findUnique({
      where: { slug: categoryId },
    });

    if (categoryRecord) {
      trends = await prisma.trendingTopic.findMany({
        where: { categoryId: categoryRecord.id },
        take: 13,
        orderBy: { score: 'desc' },
        include: {
          category: true,
          source: true,
          tags: { include: { tag: true } },
        },
      });
    }
  }

  // Transform database trends to match UI format
  const hasMore = trends.length > 12;
  const displayTrends = trends.slice(0, 12);
  
  const transformedTrends = displayTrends.map((trend: TrendWithRelations) => ({
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
    tags: trend.tags.map((t: TrendTag & { tag: Tag }) => t.tag.name),
  }));

  return <ClientCategoryPage sources={sources} categoryId={categoryId} categoryName={categoryName} initialTrends={transformedTrends} hasMore={hasMore} />;
}
