'use client';

import { Navbar } from '@/components/navbar';
import { TrendCard } from '@/components/trend-card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';
import type { TrendingTopic } from '@prisma/client';
import type { Trend } from '@/lib/types';

interface ClientSourcePageProps {
  sourceId: string;
  sourceName: string;
  sources: { name: string; value: string }[];
  categories: string[];
  initialTrends: (TrendingTopic & { category: { name: string; slug: string } })[];
}

export default function ClientSourcePage({ 
  sourceId, 
  sourceName, 
  sources,
  categories,
  initialTrends 
}: ClientSourcePageProps) {
  const [displayedTrends, setDisplayedTrends] = useState<(TrendingTopic & { category: { name: string; slug: string } })[]>(initialTrends);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialTrends.length === 12);

  const handleLoadMore = useCallback(async () => {
    setIsLoadingMore(true);
    try {
      const response = await fetch(`/api/source/${sourceId}/trends?skip=${displayedTrends.length}`);
      const data = await response.json();
      
      if (data.trends && data.trends.length > 0) {
        setDisplayedTrends(prev => {
          const existingIds = new Set(prev.map(t => t.id));
          const newTrends = data.trends.filter((t: any) => !existingIds.has(t.id));
          return [...prev, ...newTrends];
        });
        setHasMore(data.trends.length === 12);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load more trends:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [sourceId, displayedTrends.length]);

  // Convert TrendingTopic to Trend format for TrendCard
  const formatTrend = (topic: TrendingTopic & { category: { name: string; slug: string } }): Trend => ({
    id: topic.id,
    title: topic.title,
    score: topic.score,
    category: topic.category.name,
    summary: topic.summary,
    fullDescription: topic.fullDescription || undefined,
    memeability: topic.memeability || 0,
    source: sourceName,
    image: topic.imageUrl || '/placeholder-image.png',
    link: topic.link || '',
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar 
        sources={sources}
        selectedSource={sourceId}
        categories={categories}
      />

      <main className="container mx-auto px-3 py-4 md:px-4 md:py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4 font-medium text-sm md:text-base">
            <ArrowLeft className="h-4 w-4" />
            Back to Sources
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {sourceName}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            All trending topics
          </p>
        </motion.div>

        {/* Trends Grid */}
        {displayedTrends.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {displayedTrends.map((trend) => (
                <TrendCard 
                  key={trend.id} 
                  trend={formatTrend(trend)} 
                  categoryId={trend.category.slug}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center">
                <Button 
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  size="lg"
                  variant="outline"
                >
                  {isLoadingMore ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Loading more...
                    </>
                  ) : (
                    'Load More'
                  )}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground text-lg">No trends available for this source yet.</p>
          </div>
        )}

        {/* Categories Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.length > 0 ? (
              categories.map((category) => (
                <Link key={category} href={`/source/${sourceId}/${category.toLowerCase()}`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-6 rounded-xl border border-border hover:border-primary bg-card hover:bg-card/80 transition-all cursor-pointer"
                  >
                    <h3 className="text-xl font-bold text-foreground mb-2">{category}</h3>
                    <p className="text-sm text-muted-foreground">
                      Browse {sourceName} trends in {category}
                    </p>
                  </motion.div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground text-lg">No categories available for this source yet.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
