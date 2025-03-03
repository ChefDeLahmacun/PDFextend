import { Inter, Roboto } from 'next/font/google'

// Configure the font with subsets and display settings
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: false, // Don't preload to avoid SSL issues
  fallback: [
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif'
  ],
})

// Backup font in case Inter fails to load
export const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  fallback: ['system-ui', 'Arial', 'sans-serif'],
}) 