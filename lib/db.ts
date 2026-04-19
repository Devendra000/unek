import { prisma } from './prisma';

// ============================================================
// TRENDS
// ============================================================

export async function getTrends(limit = 12, skip = 0) {
  return prisma.trendingTopic.findMany({
    take: limit,
    skip,
    orderBy: { score: 'desc' },
    include: {
      category: true,
      source: true,
      tags: { include: { tag: true } },
    },
  });
}

export async function getTrendsByCategory(categoryId: string, limit = 12, skip = 0) {
  return prisma.trendingTopic.findMany({
    where: { categoryId },
    take: limit,
    skip,
    orderBy: { score: 'desc' },
    include: {
      category: true,
      source: true,
      tags: { include: { tag: true } },
    },
  });
}

export async function getTrendById(id: string) {
  return prisma.trendingTopic.findUnique({
    where: { id },
    include: {
      category: true,
      source: true,
      tags: { include: { tag: true } },
      favorites: true,
    },
  });
}

export async function searchTrends(query: string, limit = 20) {
  return prisma.trendingTopic.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { summary: { contains: query, mode: 'insensitive' } },
        { tags: { some: { tag: { name: { contains: query, mode: 'insensitive' } } } } },
      ],
    },
    take: limit,
    orderBy: { score: 'desc' },
    include: {
      category: true,
      source: true,
      tags: { include: { tag: true } },
    },
  });
}

// ============================================================
// CATEGORIES
// ============================================================

export async function getCategories() {
  return prisma.category.findMany({
    include: { trendingTopics: { take: 1 } },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
  });
}

// ============================================================
// SOURCES
// ============================================================

export async function getSources() {
  return prisma.source.findMany({
    where: { isActive: true },
  });
}

// ============================================================
// USERS & FAVORITES
// ============================================================

export async function getOrCreateUser(email: string, username: string) {
  return prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, username },
  });
}

export async function addFavorite(userId: string, contentType: 'NEWS' | 'TREND', contentId: string) {
  if (contentType === 'TREND') {
    return prisma.favorite.upsert({
      where: {
        userId_trendingTopicId: {
          userId,
          trendingTopicId: contentId,
        },
      },
      update: {},
      create: {
        userId,
        trendingTopicId: contentId,
        contentType: 'TREND',
      },
    });
  } else {
    return prisma.favorite.upsert({
      where: {
        userId_newsArticleId: {
          userId,
          newsArticleId: contentId,
        },
      },
      update: {},
      create: {
        userId,
        newsArticleId: contentId,
        contentType: 'NEWS',
      },
    });
  }
}

export async function removeFavorite(userId: string, contentType: 'NEWS' | 'TREND', contentId: string) {
  if (contentType === 'TREND') {
    return prisma.favorite.delete({
      where: {
        userId_trendingTopicId: {
          userId,
          trendingTopicId: contentId,
        },
      },
    });
  } else {
    return prisma.favorite.delete({
      where: {
        userId_newsArticleId: {
          userId,
          newsArticleId: contentId,
        },
      },
    });
  }
}

export async function getUserFavorites(userId: string) {
  return prisma.favorite.findMany({
    where: { userId },
    include: {
      newsArticle: true,
      trendingTopic: true,
    },
  });
}

export async function isFavorited(userId: string, contentType: 'NEWS' | 'TREND', contentId: string) {
  if (contentType === 'TREND') {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_trendingTopicId: {
          userId,
          trendingTopicId: contentId,
        },
      },
    });
    return !!favorite;
  } else {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_newsArticleId: {
          userId,
          newsArticleId: contentId,
        },
      },
    });
    return !!favorite;
  }
}
