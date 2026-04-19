'use client';

import { Bookmark, BookmarkCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Trend } from '@/lib/mock-data';
import Link from 'next/link';

interface TrendCardProps {
  trend: Trend;
  categoryId: string;
}

const getCategoryColor = (category: string) => {
  const colors: { [key: string]: string } = {
    Tech: 'bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-300',
    Finance: 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-300',
    Student: 'bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-300',
    Hot: 'bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-300',
    Memeable:
      'bg-purple-100 text-purple-900 dark:bg-purple-900/30 dark:text-purple-300',
    Stable: 'bg-gray-100 text-gray-900 dark:bg-gray-900/30 dark:text-gray-300',
  };
  return colors[category] || colors['Stable'];
};

const getTrendStatusIcon = (category: string) => {
  return '';
};

export function TrendCard({
  trend,
  categoryId,
}: TrendCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  const handleN8nWebhook = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const payload = {
      trend: trend.title,
      category: trend.category,
      score: trend.score,
      summary: trend.summary,
      timestamp: new Date().toISOString(),
    };
    // Trigger n8n webhook (replace with your actual webhook URL)
    fetch('YOUR_N8N_WEBHOOK_URL', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {
      console.log('Webhook triggered:', payload);
    });
  };

  return (
    <Link href={`/trend/${categoryId}/${trend.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        className="group relative overflow-hidden rounded-xl border border-border bg-card cursor-pointer transition-all hover:border-primary hover:shadow-lg"
      >
        {/* Fixed Image Section */}
        <div className="relative h-40 md:h-48 overflow-hidden bg-muted">
          <img
            src={trend.image}
            alt={trend.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400"%3E%3Crect fill="%23e5e7eb" width="800" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="20" fill="%236b7280" text-anchor="middle" dy=".3em"%3EImage not available%3C/text%3E%3C/svg%3E';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-0 group-hover:opacity-40 transition-opacity" />
        </div>

        <div className="absolute top-3 right-3 z-20 flex gap-2">
          <button
            onClick={handleN8nWebhook}
            className="p-2 rounded-full bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-accent transition-colors hover:bg-background"
            title="Trigger n8n workflow"
          >
            <Zap className="h-5 w-5" />
          </button>
          <button
            onClick={handleBookmark}
            className="p-2 rounded-full bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-accent transition-colors hover:bg-background"
          >
            {isBookmarked ? (
              <BookmarkCheck className="h-5 w-5" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="relative z-10 p-4 md:p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getCategoryColor(trend.category)}`}>
              {trend.category}
            </span>
          </div>

          <h3 className="text-base md:text-lg font-bold text-foreground line-clamp-2 mb-3">
            {trend.title}
          </h3>

          <div className="mb-4">
            <p className="text-xs md:text-sm text-foreground/80 line-clamp-2">
              {trend.summary}
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-border">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="flex items-center gap-1 text-xs md:text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {trend.score.toLocaleString()}
                </span>
                <span>mentions</span>
              </div>
              <span className="text-xs text-muted-foreground hidden md:inline">{trend.timeAgo} ago</span>
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">
              {trend.source}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
