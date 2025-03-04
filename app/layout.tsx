import type { Metadata } from "next";
import { inter, roboto } from "./fonts";
import "./globals.css";
import Navigation from "./components/Navigation";
import { GoogleAnalytics } from '@next/third-parties/google'
import { GA_MEASUREMENT_ID } from './utils/analytics';

export const metadata: Metadata = {
  title: "PDF Note Space Extender",
  description: "A simple tool for adding note space to PDFs, making learning and work easier",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use inter font with roboto as fallback
  const fontClass = inter.className;
  
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          /* Ensure bottom section is always visible */
          .bottom-section-placeholder {
            position: fixed; /* Changed from absolute to fixed for better behavior when zoomed out */
            top: 370px; /* Default position - will be covered by actual content */
            left: 50%;
            transform: translateX(-50%); /* Center the element */
            width: 100%;
            max-width: 1560px; /* Match the max-width of the main container */
            height: 950px; /* Match minGreenSectionHeight */
            background-color: #c7edd4; /* Original green color for the preview section */
            z-index: 0;
          }
          
          /* Fallback font styles */
          @font-face {
            font-family: 'System Font';
            src: local(-apple-system), local(BlinkMacSystemFont), local(Segoe UI),
                 local(Roboto), local(Helvetica Neue), local(Arial);
            font-display: swap;
          }
        `}} />
        <script dangerouslySetInnerHTML={{ __html: `
          // Font loading fallback
          (function() {
            try {
              document.fonts.ready.then(function() {
                if (!document.fonts.check('1em Inter')) {
                  document.documentElement.classList.add('font-fallback');
                }
              });
            } catch (e) {
              document.documentElement.classList.add('font-fallback');
            }
          })();
        `}} />
      </head>
      <body className={fontClass} suppressHydrationWarning>
        <Navigation />
        <div className="bottom-section-placeholder"></div>
        {children}
        <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
      </body>
    </html>
  );
}
