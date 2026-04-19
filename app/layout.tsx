import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { initScrapersIfNeeded } from '@/lib/initScrapers'

// Initialize scrapers on server startup
initScrapersIfNeeded().catch((error) => {
  console.error('[Layout] Failed to initialize scrapers:', error)
})

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'unEK - All the trends, one place',
  description: 'Discover trending topics from Reddit and Google Trends. Get instant meme ideas and stay ahead of viral moments.',
  icons: {
    icon: [
      {
        url: '/logo.webp',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/logo.webp',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/logo.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/logo.webp',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
