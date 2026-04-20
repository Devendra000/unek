'use client';

import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface NavbarProps {
  selectedSource?: string;
  selectedCategory?: string;
  sources: { name: string; value: string; sourceType?: string }[];
  categories?: string[];
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export function Navbar({ selectedSource, selectedCategory, sources = [], categories = [], searchValue = '', onSearchChange }: NavbarProps) {
  // Ensure sources is always an array
  const sourcesList = Array.isArray(sources) ? sources : [];
  const categoriesList = Array.isArray(categories) ? categories : [];

  // Group sources by type
  const groupedSources = sourcesList.reduce((acc, source) => {
    const type = source.sourceType || 'Other';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(source);
    return acc;
  }, {} as Record<string, typeof sourcesList>);

  // Sort source types for consistent display
  const sourceTypes = Object.keys(groupedSources).sort();
  
  // Find which source type contains the selected source
  const selectedSourceType = selectedSource 
    ? sourceTypes.find(type => groupedSources[type].some(s => s.value === selectedSource))
    : null;
  
  // Track expanded source type - only one can be open at a time
  const [expandedSourceType, setExpandedSourceType] = useState<string | null>(selectedSourceType);

  // Keep expanded source type in sync with selected source (prevents navbar flicker on navigation)
  useEffect(() => {
    if (selectedSourceType) {
      setExpandedSourceType(selectedSourceType);
    }
  }, [selectedSourceType]);

  const toggleSourceType = (type: string) => {
    setExpandedSourceType(expandedSourceType === type ? null : type);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        {/* Header row */}
        <div className="flex items-center gap-2 mb-3 md:gap-4 md:mb-3">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity">
            <Image
              src="/logo-footer.webp"
              alt="unEK"
              width={40}
              height={40}
              className="h-10 w-auto"
              priority
              loading="eager"
            />
            <h1 className="hidden md:block text-lg md:text-xl font-bold text-foreground">
              <span className="text-orange-600 dark:text-orange-400">un</span>
              <span className="text-blue-600 dark:text-blue-400">EK</span>
            </h1>
          </Link>

          <div className="flex-1 min-w-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground flex-shrink-0" />
              <input
                type="text"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 pl-9 text-sm md:text-base text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Source Types - Only one can be selected */}
        {sourcesList.length > 0 && (
          <div className="mb-3">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
              {sourceTypes.map((sourceType) => (
                <button
                  key={sourceType}
                  onClick={() => toggleSourceType(sourceType)}
                  className={`whitespace-nowrap rounded-full px-4 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-semibold transition-all duration-150 flex-shrink-0 inline-flex items-center gap-1 ${
                    expandedSourceType === sourceType
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                      : 'bg-muted text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {sourceType === 'SOCIAL_PLATFORM' && 'Social Platforms'}
                  {sourceType === 'NEWS_OUTLET' && 'News Outlets'}
                  {sourceType !== 'SOCIAL_PLATFORM' && sourceType !== 'NEWS_OUTLET' && sourceType}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Expanded Sources - Show only when that source type is selected */}
        {sourcesList.length > 0 && expandedSourceType && (
          <motion.div
            key={`sources-${expandedSourceType}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden mb-3"
          >
            <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 pb-2">
              {groupedSources[expandedSourceType].map((source) => (
                <Link
                  key={source.value}
                  href={`/source/${source.value}`}
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.12 }}
                    className={`whitespace-nowrap rounded-full px-4 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-semibold transition-all duration-150 flex-shrink-0 ${
                      selectedSource === source.value
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                        : 'bg-muted text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {source.name}
                  </motion.button>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* Categories row - Only show when source is selected */}
        {selectedSource && categoriesList.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Categories</p>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
              {categoriesList.map((category) => (
                <Link
                  key={category}
                  href={`/source/${selectedSource}/${category.toLowerCase()}`}
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.12 }}
                    className={`whitespace-nowrap rounded-full px-4 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-semibold transition-all duration-150 flex-shrink-0 ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                        : 'bg-muted text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {category}
                  </motion.button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
