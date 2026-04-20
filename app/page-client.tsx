'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { TrendGrid } from '@/components/trend-grid';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { fuzzySearch } from '@/lib/fuzzy-search';

interface Trend {
  id: string;
  title: string;
  category: string;
  categorySlug: string;
  summary: string;
  score: number;
  memeability: number;
  image: string;
  link: string;
  source: string;
  tags: string[];
}

interface Source {
  name: string;
  value: string;
}

export default function ClientTrendPage({
  initialTrends,
  sources,
}: {
  initialTrends: Trend[];
  sources: Source[];
}) {
  const [trendsToShow, setTrendsToShow] = useState(12);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollTargetRef = useRef<HTMLDivElement>(null);
  const trendsContainerRef = useRef<HTMLDivElement>(null);

  // Pre-sort trends once
  const sortedTrends = useMemo(() => {
    return [...initialTrends].sort((a, b) => b.score - a.score);
  }, [initialTrends]);

  const displayedTrends = useMemo(() => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return sortedTrends.slice(0, trendsToShow);

    const filtered = fuzzySearch(trimmedQuery, sortedTrends, ['title', 'summary', 'category']);
    return filtered.slice(0, trendsToShow);
  }, [sortedTrends, trendsToShow, searchQuery]);

  // Smooth scroll effect
  useEffect(() => {
    if (shouldScroll && scrollTargetRef.current) {
      setTimeout(() => {
        scrollTargetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [shouldScroll]);

  // Scroll to trends when search query changes
  useEffect(() => {
    if (searchQuery.trim() && trendsContainerRef.current) {
      setTimeout(() => {
        trendsContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [searchQuery]);

  const handleExploreMore = () => {
    setTrendsToShow((prev) => prev + 3);
    setShouldScroll(true);
  };

  return (
    <>
      <Navbar
        sources={sources}
        searchValue={searchQuery}
        onSearchChange={(value) => {
          setSearchQuery(value);
          setTrendsToShow(12);
        }}
      />

      <main className="container mx-auto px-3 py-4 md:px-4 md:py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Browse Trends by Source</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Select a source to explore trending topics and discover what&apos;s happening
          </p>
        </motion.div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
          {sources.map((source, index) => (
            <Link key={source.value} href={`/source/${source.value}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.15 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="relative overflow-hidden rounded-xl border border-border bg-card p-6 md:p-8 cursor-pointer transition-all duration-150 hover:border-primary hover:shadow-lg h-full"
              >
                <div className="flex flex-col gap-4">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">{source.name}</h2>
                    <p className="text-sm md:text-base text-foreground/80">Browse trends from {source.name}</p>
                  </div>
                  <div className="text-xs md:text-sm text-primary font-semibold mt-auto">Explore →</div>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Top Trends */}
        <motion.div ref={trendsContainerRef} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 md:mb-16 trends-container">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
            {searchQuery.trim() ? `Search Results for "${searchQuery}"` : 'Trending Now'}
          </h2>
          {displayedTrends.length === 0 && searchQuery.trim() && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No trends found matching your search.</p>
            </div>
          )}
          {displayedTrends.length === 0 && !searchQuery.trim() && initialTrends.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No trends available yet. Check back soon!</p>
            </div>
          )}
          {displayedTrends.length > 0 && <TrendGrid trends={displayedTrends} categoryId="global" searchQuery={searchQuery} />}

          {trendsToShow < sortedTrends.length && displayedTrends.length > 0 && (
            <div ref={scrollTargetRef} className="flex justify-center mt-8 md:mt-12">
              <motion.button
                onClick={handleExploreMore}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="px-8 md:px-10 py-3 md:py-4 rounded-lg border-2 border-primary text-primary hover:bg-primary/10 transition-colors duration-150 font-semibold text-sm md:text-base"
              >
                Load More Trends
              </motion.button>
            </div>
          )}
        </motion.div>
      </main>
    </>
  );
}
