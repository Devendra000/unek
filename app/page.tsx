'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { TrendGrid } from '@/components/trend-grid';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { mockTrends } from '@/lib/mock-data';
import { fuzzySearch, fuzzySearchWithPositions } from '@/lib/fuzzy-search';

const CATEGORIES = [
  { name: 'Global', description: 'Worldwide trending topics' },
  { name: 'Nepal', description: 'Trends in Nepal' },
  { name: 'Hot', description: 'Hottest trends right now' },
  { name: 'Memeable', description: 'Most memeable content' },
  { name: 'Tech', description: 'Technology trends' },
  { name: 'Finance', description: 'Finance & markets' },
  { name: 'Student', description: 'Student trends' },
];

export default function Home() {
  const [trendsToShow, setTrendsToShow] = useState(12);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMatches, setSearchMatches] = useState<{ [key: string]: { [key: string]: number[] } }>({});
  const scrollTargetRef = useRef<HTMLDivElement>(null);

  // Pre-sort trends once
  const sortedTrends = useMemo(() => {
    return [...mockTrends].sort((a, b) => b.score - a.score);
  }, []);

  const displayedTrends = useMemo(() => {
    if (!searchQuery.trim()) return sortedTrends.slice(0, trendsToShow);
    
    const filtered = fuzzySearch(searchQuery, sortedTrends, [
      'title',
      'summary',
      'category',
    ]);
    return filtered.slice(0, trendsToShow);
  }, [sortedTrends, trendsToShow, searchQuery]);

  // Smooth scroll effect
  useEffect(() => {
    if (shouldScroll && scrollTargetRef.current) {
      setTimeout(() => {
        scrollTargetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setShouldScroll(false);
      }, 50);
    }
  }, [shouldScroll]);

  const handleExploreMore = () => {
    setTrendsToShow((prev) => prev + 3);
    setShouldScroll(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar 
        searchValue={searchQuery}
        onSearchChange={(value) => {
          setSearchQuery(value.trim());
          setTrendsToShow(12);
        }}
      />

      <main className="container mx-auto px-3 py-4 md:px-4 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 md:mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Browse Trends by Category
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Select a category to explore trending topics and discover what's happening
          </p>
        </motion.div>

        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16"
        >
          {CATEGORIES.map((category, index) => (
            <Link key={category.name} href={`/trend/${category.name.toLowerCase()}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.15 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="relative overflow-hidden rounded-xl border border-border bg-card p-6 md:p-8 cursor-pointer transition-all duration-150 hover:border-primary hover:shadow-lg h-full"
              >
                <div className="flex flex-col gap-4">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                      {category.name}
                    </h2>
                    <p className="text-sm md:text-base text-foreground/80">
                      {category.description}
                    </p>
                  </div>
                  <div className="text-xs md:text-sm text-primary font-semibold mt-auto">
                    Explore →
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Top Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 md:mb-16 trends-container"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Trending Now'}
          </h2>
          {displayedTrends.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No trends found matching your search.</p>
            </div>
          )}
          {displayedTrends.length > 0 && (
            <TrendGrid 
              trends={displayedTrends} 
              categoryId="global"
              searchQuery={searchQuery}
            />
          )}
          
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
    </div>
  );
}
