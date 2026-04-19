'use client';

import { use } from 'react';
import { Navbar } from '@/components/navbar';
import { TrendDetail } from '@/components/trend-detail';
import { mockTrends } from '@/lib/mock-data';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface CardDetailPageProps {
  params: Promise<{
    categoryId: string;
    cardId: string;
  }>;
}

export default function CardDetailPage({ params }: CardDetailPageProps) {
  const { categoryId, cardId } = use(params);
  const trend = mockTrends.find((t) => t.id === cardId);
  const categoryName =
    categoryId.charAt(0).toUpperCase() + categoryId.slice(1);

  if (!trend) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar selectedCategory={categoryName} />
        <main className="container mx-auto px-3 py-4 md:px-4 md:py-8">
          <div className="flex flex-col items-center justify-center min-h-96 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Trend not found
            </h2>
            <p className="text-muted-foreground mb-6">
              The trend you're looking for doesn't exist.
            </p>
            <Link
              href={`/trend/${categoryId}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to {categoryName}
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
        <TrendDetail trend={trend} categoryId={categoryId} />
      </main>
    </div>
  );
}
