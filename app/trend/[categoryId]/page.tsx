'use client';

import { useMemo } from 'react';
import { use } from 'react';
import { Navbar } from '@/components/navbar';
import { TrendGrid } from '@/components/trend-grid';
import { mockTrends } from '@/lib/mock-data';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORIES = [
  'Global',
  'Nepal',
  'Hot',
  'Memeable',
  'Tech',
  'Finance',
  'Student',
];

interface CategoryPageProps {
  params: Promise<{
    categoryId: string;
  }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { categoryId } = use(params);
  const categoryName = categoryId.charAt(0).toUpperCase() + categoryId.slice(1);

  const filteredTrends = useMemo(() => {
    return mockTrends.filter((trend) => {
      if (categoryId === 'global') {
        return true;
    }
      if (categoryId === 'memeable') {
        return trend.memeability >= 7;
      }
      return trend.category.toLowerCase() === categoryId;
    });
  }, [categoryId]);

  const isValidCategory = CATEGORIES.some(
    (cat) => cat.toLowerCase() === categoryId,
  );

  if (!isValidCategory) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar selectedCategory={categoryName} />
        <main className="container mx-auto px-3 py-4 md:px-4 md:py-8">
          <div className="flex flex-col items-center justify-center min-h-96 text-center">
            <div className="text-5xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Category not found
            </h2>
            <p className="text-muted-foreground mb-6">
              The category "{categoryName}" does not exist.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar selectedCategory={categoryName} />

      <main className="container mx-auto px-3 py-4 md:px-4 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 md:mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4 font-medium text-sm md:text-base">
            <ArrowLeft className="h-4 w-4" />
            Back to Categories
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {categoryName} Trends
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Showing {filteredTrends.length} trend{filteredTrends.length !== 1 ? 's' : ''} in {categoryName}
          </p>
        </motion.div>

        <TrendGrid trends={filteredTrends} categoryId={categoryId} />
      </main>
    </div>
  );
}
