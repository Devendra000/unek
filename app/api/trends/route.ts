import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { TrendingTopic, Category, Source, TrendTag, Tag } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const source = request.nextUrl.searchParams.get('source');
    const category = request.nextUrl.searchParams.get('category');
    const skip = parseInt(request.nextUrl.searchParams.get('skip') || '0');
    const take = parseInt(request.nextUrl.searchParams.get('take') || '12');

    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    type TrendWithRelations = TrendingTopic & {
      category: Category;
      source: Source;
      tags: (TrendTag & { tag: Tag })[];
    };
    
    // Build where clause
    const where: { sourceId?: string; categoryId?: string } = {};

    if (source) {
      const dbSource = await prisma.source.findUnique({
        where: { slug: source },
      });
      if (!dbSource) {
        return NextResponse.json({ error: 'Invalid source' }, { status: 400 });
      }
      where.sourceId = dbSource.id;
    }

    const dbCategory = await prisma.category.findUnique({
      where: { slug: category },
    });

    if (!dbCategory) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    where.categoryId = dbCategory.id;

    // Fetch trends
    const trends: TrendWithRelations[] = await prisma.trendingTopic.findMany({
      where,
      skip,
      take: take + 1,
      orderBy: { score: 'desc' },
      include: {
        category: true,
        source: true,
        tags: { include: { tag: true } },
      },
    });

    const hasMore = trends.length > take;
    const displayTrends = trends.slice(0, take);

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

    return NextResponse.json({
      trends: transformedTrends,
      hasMore,
    });
  } catch (error) {
    console.error('Error fetching trends:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trends' },
      { status: 500 }
    );
  }
}
