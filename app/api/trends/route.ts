import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { TrendingTopic, Category, Source, TrendTag, Tag } from '@prisma/client';

const CATEGORIES = ['Global', 'Nepal', 'Hot', 'Memeable', 'Tech', 'Finance', 'Student'];

export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get('category');
    const skip = parseInt(request.nextUrl.searchParams.get('skip') || '0');
    const take = parseInt(request.nextUrl.searchParams.get('take') || '12');

    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    const isValidCategory = CATEGORIES.some((cat) => cat.toLowerCase() === category);
    if (!isValidCategory) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    type TrendWithRelations = TrendingTopic & {
      category: Category;
      source: Source;
      tags: (TrendTag & { tag: Tag })[];
    };
    
    let trends: TrendWithRelations[] = [];

    if (category === 'global') {
      trends = await prisma.trendingTopic.findMany({
        skip,
        take: take + 1, // Fetch one extra to know if there's more
        orderBy: { score: 'desc' },
        include: {
          category: true,
          source: true,
          tags: { include: { tag: true } },
        },
      });
    } else if (category === 'hot') {
      trends = await prisma.trendingTopic.findMany({
        skip,
        take: take + 1,
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
      const categoryRecord = await prisma.category.findUnique({
        where: { slug: category },
      });

      if (categoryRecord) {
        trends = await prisma.trendingTopic.findMany({
          where: { categoryId: categoryRecord.id },
          skip,
          take: take + 1,
          orderBy: { score: 'desc' },
          include: {
            category: true,
            source: true,
            tags: { include: { tag: true } },
          },
        });
      }
    }

    const hasMore = trends.length > take;
    const displayTrends = trends.slice(0, take);

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
