'use client';

import { ArrowLeft, Bookmark, BookmarkCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Trend } from '@/lib/mock-data';
import Link from 'next/link';

interface TrendDetailProps {
  trend: Trend;
  categoryId: string;
}

export function TrendDetail({
  trend,
  categoryId,
}: TrendDetailProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleN8nWebhook = () => {
    const payload = {
      trend: trend.title,
      category: trend.category,
      score: trend.score,
      summary: trend.summary,
      fullDescription: trend.fullDescription,
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl mx-auto"
    >
      <Link href={`/trend/${categoryId}`}>
        <button className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4 md:mb-6 font-medium text-sm md:text-base">
          <ArrowLeft className="h-4 w-4" />
          Back to {categoryId.charAt(0).toUpperCase() + categoryId.slice(1)}
        </button>
      </Link>

      <div className="rounded-xl border border-border bg-card p-4 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-6 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
              <span className="px-3 md:px-4 py-1 md:py-2 rounded-full bg-primary text-primary-foreground font-semibold text-xs md:text-sm">
                {trend.category}
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2">
              {trend.title}
            </h1>
            <div className="flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground">
              <span>{trend.timeAgo} ago</span>
              <span className="hidden md:inline">•</span>
              <a
                href={trend.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors underline"
              >
                <span className="md:hidden">via </span>
                <span className="hidden md:inline">Source: </span>
                {trend.source}
              </a>
              <span className="hidden md:inline">•</span>
              <span className="font-semibold text-foreground">
                {trend.score.toLocaleString()} mentions
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleN8nWebhook}
              className="flex-shrink-0 p-2 md:p-3 rounded-lg border border-border hover:bg-muted transition-colors"
              title="Trigger n8n workflow"
            >
              <Zap className="h-6 w-6 text-muted-foreground hover:text-accent transition-colors" />
            </button>
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className="flex-shrink-0 p-2 md:p-3 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              {isBookmarked ? (
                <BookmarkCheck className="h-6 w-6 text-accent" />
              ) : (
                <Bookmark className="h-6 w-6 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>

        <div className="border-t border-border pt-4 md:pt-6 mb-6">
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-3">Overview</h2>
          <p className="text-sm md:text-base text-foreground/80 leading-relaxed">
            {trend.fullDescription}
          </p>
        </div>

        <div className="border-t border-border pt-4 md:pt-6 mb-6">
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-4">Key Insights</h2>
          <div className="space-y-2 md:space-y-3">
            <p className="text-sm md:text-base text-foreground/80 p-3 md:p-4 rounded-lg bg-background border border-border">
              This trend is gaining significant traction across social media
              platforms. Users are actively discussing and sharing content related
              to this topic.
            </p>
            <p className="text-sm md:text-base text-foreground/80 p-3 md:p-4 rounded-lg bg-background border border-border">
              The momentum shows potential for continued growth in the coming hours
              as more creators engage with the topic.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
