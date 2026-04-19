'use client';

import { Search, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface NavbarProps {
  selectedCategory?: string;
}

const CATEGORIES = [
  'Global',
  'Nepal',
  'Hot',
  'Memeable',
  'Tech',
  'Finance',
  'Student',
];

export function Navbar({ selectedCategory }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        {/* Header row */}
        <div className="flex items-center gap-2 mb-3 md:gap-4 md:mb-3">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity">
            <div className="rounded-lg bg-primary p-2">
              <Flame className="h-4 w-4 md:h-5 md:w-5 text-primary-foreground" />
            </div>
            <h1 className="text-lg md:text-xl font-bold text-foreground">unEK</h1>
          </Link>

          <div className="flex-1 min-w-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground flex-shrink-0" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded-lg border border-border bg-card px-3 py-2 pl-9 text-sm md:text-base text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Categories row */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {CATEGORIES.map((category) => (
            <Link
              key={category}
              href={`/trend/${category.toLowerCase()}`}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`whitespace-nowrap rounded-full px-4 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-semibold transition-all flex-shrink-0 ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                    : 'bg-muted text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {category}
              </motion.button>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
