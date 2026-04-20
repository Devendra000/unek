'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { TrendGrid } from '@/components/trend-grid';
import { fuzzySearch } from '@/lib/fuzzy-search';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

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

interface ClientCategoryPageProps {
  sourceId: string;
  sourceName: string;
  sources: { name: string; value: string }[];
  categoryId: string;
  categoryName: string;
  categories: string[];
  initialTrends: Trend[];
  hasMore: boolean;
}

export default function ClientCategoryPage({ 
  sourceId, 
  sourceName,
  sources,
  categoryId, 
  categoryName, 
  categories,
  initialTrends, 
  hasMore: initialHasMore 
}: ClientCategoryPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [displayedTrends, setDisplayedTrends] = useState(initialTrends);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const trendsGridRef = useRef<HTMLDivElement>(null);

  const filteredTrends = useMemo(() => {
    let trends = [...displayedTrends];

    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      trends = fuzzySearch(trimmedQuery, trends, ['title', 'summary', 'category']);
    }

    return trends;
  }, [displayedTrends, searchQuery]);

  useEffect(() => {
    if (searchQuery.trim() && trendsGridRef.current) {
      setTimeout(() => {
        trendsGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [searchQuery]);

  const handleShowMore = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/trends?source=${sourceId}&category=${categoryId}&skip=${displayedTrends.length}&take=12`
      );
      const data = await response.json();
      
      if (data.trends) {
        setDisplayedTrends([...displayedTrends, ...data.trends]);
        setHasMore(data.hasMore);
      }
    } catch (error) {
      console.error('Failed to load more trends:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar 
        sources={sources}
        selectedSource={sourceId}
        selectedCategory={categoryName}
        categories={categories}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="container mx-auto px-3 py-4 md:px-4 md:py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 md:mb-8">
          <Link href={`/source/${sourceId}`} className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4 font-medium text-sm md:text-base">
            <ArrowLeft className="h-4 w-4" />
            Back to {sourceName}
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {searchQuery.trim() ? `Search Results in ${categoryName}` : `${categoryName} Trends`}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Showing {filteredTrends.length} trend{filteredTrends.length !== 1 ? 's' : ''} from {sourceName}
          </p>
        </motion.div>

        <div ref={trendsGridRef}>
          {filteredTrends.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {searchQuery.trim() ? 'No trends found matching your search.' : 'No trends available yet in this category.'}
              </p>
            </div>
          ) : (
            <>
              <TrendGrid trends={filteredTrends} categoryId={categoryId} searchQuery={searchQuery} />
              {hasMore && !searchQuery.trim() && (
                <div className="flex justify-center mt-8 md:mt-12">
                  <button
                    onClick={handleShowMore}
                    disabled={isLoading}
                    className="px-6 md:px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Show More'
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
