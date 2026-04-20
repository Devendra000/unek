export interface Trend {
  id: string;
  title: string;
  score: number;
  category: string;
  categorySlug?: string;
  summary: string;
  fullDescription?: string;
  memeability: number;
  source: string;
  image: string;
  link: string;
  tags?: string[];
  timeAgo?: string;
}
