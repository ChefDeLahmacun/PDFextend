import { Inter } from 'next/font/google'
import localFont from 'next/font/local'

// Configure Inter font with optional fallback
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', 'Arial', 'sans-serif'],
  preload: true,
  // Adjust for SSL certificate issues
  adjustFontFallback: true,
  variable: '--font-inter',
})

// Optional: Configure a local fallback font if Google Fonts fails
export const interLocal = localFont({
  src: [
    {
      path: '../public/fonts/Inter-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Inter-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/Inter-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-inter-local',
}) 