'use client';

import { ArrowLeft, Bookmark, BookmarkCheck, Zap, Lightbulb, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import type { Trend } from '@/lib/types';
import Link from 'next/link';
import { getImageFallbackUrl } from '@/components/image-fallback';

interface TrendDetailProps {
  trend: Trend;
  categoryId: string;
}

export function TrendDetail({
  trend,
  categoryId,
}: TrendDetailProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [imageError, setImageError] = useState(false);

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
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg md:text-xl font-bold text-foreground">Key Insights</h2>
          </div>
          <ul className="space-y-3">
            <li className="flex gap-3 items-start text-sm md:text-base text-foreground/80 p-3 md:p-4 rounded-lg bg-background border border-border hover:border-primary/50 transition-colors">
              <span className="text-primary font-bold flex-shrink-0 mt-0.5">•</span>
              <span>Gaining significant traction across social media platforms with active user engagement</span>
            </li>
            <li className="flex gap-3 items-start text-sm md:text-base text-foreground/80 p-3 md:p-4 rounded-lg bg-background border border-border hover:border-primary/50 transition-colors">
              <span className="text-primary font-bold flex-shrink-0 mt-0.5">•</span>
              <span>Strong momentum shows potential for continued growth in the coming hours</span>
            </li>
            <li className="flex gap-3 items-start text-sm md:text-base text-foreground/80 p-3 md:p-4 rounded-lg bg-background border border-border hover:border-primary/50 transition-colors">
              <span className="text-primary font-bold flex-shrink-0 mt-0.5">•</span>
              <span>More creators are actively engaging with and amplifying this topic</span>
            </li>
          </ul>
        </div>

        <div className="border-t border-border pt-4 md:pt-6 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <FileText className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg md:text-xl font-bold text-foreground">Overview</h2>
          </div>
          <div className="space-y-4">
            {/* Image */}
            {trend.image && !imageError ? (
              <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden border border-border/50 shadow-lg hover:shadow-xl transition-shadow bg-muted">
                <img
                  src={trend.image}
                  alt={trend.title}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : null}
            
            {/* Fallback message if image fails */}
            {imageError && (
              <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden border border-border/50 shadow-lg bg-muted flex items-center justify-center">
                <img
                  src={getImageFallbackUrl()}
                  alt="Image not available"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            
            {/* Main content */}
            <div className="p-5 md:p-6 rounded-xl bg-gradient-to-br from-blue-500/5 via-background to-background border border-blue-500/20 hover:border-blue-500/40 transition-colors overflow-hidden">
              <p className="text-sm md:text-base text-foreground leading-relaxed break-words whitespace-pre-wrap tracking-wide">
                {trend.fullDescription || trend.summary}
              </p>
            </div>
            
            {/* Summary */}
            {trend.summary && trend.fullDescription !== trend.summary && (
              <div className="p-5 md:p-6 rounded-xl bg-gradient-to-br from-primary/5 via-background to-background border border-primary/20 hover:border-primary/40 transition-colors overflow-hidden">
                <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span>
                  <span className="truncate">Quick Summary</span>
                </h3>
                <p className="text-sm md:text-base text-foreground/85 leading-relaxed break-words">
                  {trend.summary}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
