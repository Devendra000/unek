'use client';

import { motion } from 'framer-motion';
import { TrendCard } from './trend-card';
import type { Trend } from '@/lib/types';

interface TrendGridProps {
  trends: Trend[];
  categoryId: string;
  searchQuery?: string;
}

export function TrendGrid({
  trends,
  categoryId,
  searchQuery = '',
}: TrendGridProps) {
  if (trends.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-96 text-center"
      >
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          No trends found
        </h2>
        <p className="text-muted-foreground">
          Try adjusting your search or filters to find trending content
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm text-muted-foreground"
      >
        Showing {trends.length} trend{trends.length !== 1 ? 's' : ''}
      </motion.div>

      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {trends.map((trend, index) => (
          <motion.div
            key={trend.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.02 }}
          >
            <TrendCard
              trend={trend}
              categoryId={categoryId}
              searchQuery={searchQuery}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
