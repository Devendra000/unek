import { Navbar } from '@/components/navbar';
import { TrendDetail } from '@/components/trend-detail';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getTrendById } from '@/lib/db';
import type { TrendingTopic, Category, Source, TrendTag, Tag } from '@prisma/client';

interface CardDetailPageProps {
  params: Promise<{
    categoryId: string;
    cardId: string;
  }>;
}

export default async function CardDetailPage({ params }: CardDetailPageProps) {
  const { categoryId, cardId } = await params;
  
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
  
  // Fetch trend from database
  type TrendWithRelations = TrendingTopic & {
    category: Category;
    source: Source;
    tags: (TrendTag & { tag: Tag })[];
  };
  
  const dbTrend = await getTrendById(cardId) as TrendWithRelations | null;
  
  // Map source to valid Trend type
  const mapSource = (sourceName: string): 'Reddit' | 'Google Trends' | 'Twitter/X' | 'News' => {
    const sourceMap: Record<string, 'Reddit' | 'Google Trends' | 'Twitter/X' | 'News'> = {
      'Reddit': 'Reddit',
      'Google Trends': 'Google Trends',
      'Twitter/X': 'Twitter/X',
      'X': 'Twitter/X',
      'News': 'News',
    };
    return sourceMap[sourceName] || 'News';
  };

  // Transform database trend to match UI format
  const trend = dbTrend ? {
    id: dbTrend.id,
    title: dbTrend.title,
    category: dbTrend.category.name,
    categorySlug: dbTrend.category.slug,
    summary: dbTrend.summary,
    score: dbTrend.score,
    memeability: dbTrend.memeability || 5,
    image: dbTrend.imageUrl || 'https://picsum.photos/800/400?random=1',
    link: dbTrend.link || '#',
    source: mapSource(dbTrend.source.name),
    tags: dbTrend.tags.map((t: TrendTag & { tag: Tag }) => t.tag.name),
    fullDescription: dbTrend.fullDescription || dbTrend.summary,
    timeAgo: 'recently',
    memeIdeas: [],
  } : null;
  
  // Fetch category details
  const categoryData = await prisma.category.findUnique({
    where: { slug: categoryId },
  });

  const categoryName = categoryData?.name || 'Trend';

  if (!trend) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar sources={sources} />
        <main className="container mx-auto px-3 py-4 md:px-4 md:py-8">
          <div className="flex flex-col items-center justify-center min-h-96 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Trend not found
            </h2>
            <p className="text-muted-foreground mb-6">
              The trend you're looking for doesn't exist.
            </p>
            <Link
              href={`/trend/${categoryId}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to {categoryName}
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar sources={sources} />

      <main className="container mx-auto px-3 py-4 md:px-4 md:py-8">
        <TrendDetail trend={trend} categoryId={categoryId} />
      </main>
    </div>
  );
}
