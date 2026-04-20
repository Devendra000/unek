import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { TrendingTopic, Category } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { sourceId: string } }
) {
  try {
    const { sourceId } = params;
    const skip = parseInt(request.nextUrl.searchParams.get('skip') || '0');
    const take = 12;

    // Fetch trends for the given source
    const trends = await prisma.trendingTopic.findMany({
      where: {
        source: {
          slug: sourceId,
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take,
    });

    return NextResponse.json({ trends });
  } catch (error) {
    console.error('Error fetching trends:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trends' },
      { status: 500 }
    );
  }
}
