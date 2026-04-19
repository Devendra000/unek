import { Twitter } from "lucide-react";

export interface Trend {
  id: string;
  title: string;
  score: number;
  category: string;
  timeAgo: string;
  summary: string;
  memeability: number;
  source: 'Reddit' | 'Google Trends' | 'Twitter/X' | 'News';
  memeIdeas: string[];
  fullDescription: string;
  link: string;
  image: string;
}

export const mockTrends: Trend[] = [
  {
    id: '1',
    title: 'AI Generated Content Debate',
    score: 9850,
    category: 'Tech',
    timeAgo: '2h',
    summary: 'New discussion about copyright and AI-generated art spreads across platforms.',
    memeability: 8,
    source: 'Reddit',
    memeIdeas: [
      'Drake meme: "AI generating art" vs "Artists complaining"',
      'Distracted Boyfriend: Copyright Law ignoring AI',
    ],
    fullDescription:
      'A heated debate has erupted on social media regarding the rights and ethics of AI-generated content. Artists and creators are questioning the legal implications of training models on their work without permission.',
    link: 'https://reddit.com',
    image: 'https://images.unsplash.com/photo-1677442d019cecf8d7b8388e197646556?w=800&h=400&fit=crop',
  },
  {
    id: '2',
    title: 'Elon Tweets About X Evolution',
    score: 8920,
    category: 'Tech',
    timeAgo: '1h',
    summary: 'Latest updates on X platform features spark community discussion.',
    memeability: 7,
    source: 'Twitter/X',
    memeIdeas: [
      'Expanding Brain: Features X users actually wanted',
      'Loss meme format but it\'s X features',
    ],
    fullDescription:
      'Elon Musk has announced several new features coming to X platform that aim to improve user experience and engagement. The community is buzzing with mixed reactions.',
    link: 'https://x.com',
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&h=400&fit=crop',
  },
  {
    id: '3',
    title: 'New Meme Format Goes Viral',
    score: 8450,
    category: 'Memeable',
    timeAgo: '3h',
    summary: 'The "Awkward Monkey Puppet" format explodes with creative variations.',
    memeability: 9,
    source: 'Reddit',
    memeIdeas: [
      'Use for awkward moments in daily life',
      'Tech support scenarios',
    ],
    fullDescription:
      'A new meme format featuring an awkward monkey puppet has taken over social media. Content creators are finding countless ways to repurpose the template.',
    link: 'https://reddit.com/r/memes',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=400&fit=crop',
  },
  {
    id: '4',
    title: 'College Students Struggling',
    score: 7890,
    category: 'Student',
    timeAgo: '45m',
    summary: 'Post-exam stress and burnout discussions dominate student subreddits.',
    memeability: 8,
    source: 'Reddit',
    memeIdeas: [
      'Tired eyes meme template',
      'Procrastination vs deadline sprint',
    ],
    fullDescription:
      'As midterms and finals approach, students across platforms are sharing their struggles with workload and mental health. Support communities are providing resources and solidarity.',
    link: 'https://reddit.com/r/college',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop',
  },
  {
    id: '5',
    title: 'Crypto Market Volatility',
    score: 7650,
    category: 'Finance',
    timeAgo: '30m',
    summary: 'Bitcoin and altcoins experience significant price swings today.',
    memeability: 6,
    source: 'Google Trends',
    memeIdeas: [
      'Rollercoaster meme but it\'s crypto prices',
      'Loss porn appreciation posts',
    ],
    fullDescription:
      'The cryptocurrency market is experiencing notable volatility as major coins swing in price. Traders and investors are analyzing the factors contributing to these movements.',
    link: 'https://coinmarketcap.com',
    image: 'https://images.unsplash.com/photo-1518546305927-30bfcecbec0f?w=800&h=400&fit=crop',
  },
  {
    id: '6',
    title: 'Gaming Community Unites',
    score: 7420,
    category: 'Hot',
    timeAgo: '1h',
    summary: 'Popular game franchise announces surprise collaboration announcement.',
    memeability: 7,
    source: 'Reddit',
    memeIdeas: [
      'Hype meme templates',
      'Crossover format mockups',
    ],
    fullDescription:
      'A beloved gaming franchise has teased an exciting collaboration that has gamers speculating about possibilities. The announcement has generated massive engagement across gaming communities.',
    link: 'https://reddit.com/r/gaming',
    image: 'https://images.unsplash.com/photo-1538654635062-d8bee4f67546?w=800&h=400&fit=crop',
  },
  {
    id: '7',
    title: 'Workplace Remote Policy Changes',
    score: 7100,
    category: 'Tech',
    timeAgo: '2h',
    summary: 'Major tech companies reversing return-to-office mandates.',
    memeability: 7,
    source: 'Google Trends',
    memeIdeas: [
      'Working from bed meme comeback',
      'Commute traffic vs home office',
    ],
    fullDescription:
      'In a surprising turn, several major technology companies are reconsidering their strict return-to-office policies. Employees are celebrating the flexibility wins.',
    link: 'https://news.ycombinator.com',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
  },
  {
    id: '8',
    title: 'Fashion Trend Alert',
    score: 6890,
    category: 'Stable',
    timeAgo: '4h',
    summary: 'Y2K fashion revival hits mainstream retail stores.',
    memeability: 6,
    source: 'Google Trends',
    memeIdeas: [
      '2000s fashion vs modern take',
      'Fashion history repeats meme',
    ],
    fullDescription:
      'Y2K fashion aesthetics are making a major comeback in mainstream retail. Designers and brands are capitalizing on the nostalgic trend.',
    link: 'https://vogue.com',
    image: 'https://images.unsplash.com/photo-1529148482759-b649efde3579?w=800&h=400&fit=crop',
  },
];
