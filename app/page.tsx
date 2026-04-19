'use client';

import { useMemo } from 'react';
import { Navbar } from '@/components/navbar';
import { TrendGrid } from '@/components/trend-grid';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { mockTrends } from '@/lib/mock-data';

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
  const categoryTrends = useMemo(() => {
    const trends: { [key: string]: typeof mockTrends } = {};
    
    CATEGORIES.forEach((category) => {
      const categoryId = category.name.toLowerCase();
      trends[categoryId] = mockTrends
        .filter((trend) => {
          if (categoryId === 'global') {
            return true;
          }
          if (categoryId === 'memeable') {
            return trend.memeability >= 7;
          }
          return trend.category.toLowerCase() === categoryId;
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
    });
    
    return trends;
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

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
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="relative overflow-hidden rounded-xl border border-border bg-card p-6 md:p-8 cursor-pointer transition-all hover:border-primary hover:shadow-lg h-full"
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

        {/* Top Trends by Category */}
        {CATEGORIES.map((category, index) => (
          <motion.div
            key={`trends-${category.name}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="mb-12 md:mb-16"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                  Top Trends in {category.name}
                </h2>
                <p className="text-sm md:text-base text-muted-foreground">
                  {categoryTrends[category.name.toLowerCase()]?.length || 0} trends available
                </p>
              </div>
              <Link href={`/trend/${category.name.toLowerCase()}`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 md:px-6 py-2 md:py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-sm md:text-base"
                >
                  View All
                </motion.button>
              </Link>
            </div>
            
            <TrendGrid 
              trends={categoryTrends[category.name.toLowerCase()] || []} 
              categoryId={category.name.toLowerCase()}
            />
          </motion.div>
        ))}
      </main>
    </div>
  );
}
