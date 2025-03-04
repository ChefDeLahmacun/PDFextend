import type { Metadata } from "next";
import { inter, roboto } from "./fonts";
import "./globals.css";
// Import Fontsource CSS files
import '@fontsource/inter/100.css';
import '@fontsource/inter/200.css';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import '@fontsource/inter/900.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
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
  // Combine font variables
  const fontVariables = `${inter.variable} ${roboto.variable}`;
  
  return (
    <html lang="en" className={fontVariables}>
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
          // Font loading detection
          document.documentElement.classList.add('font-loading');
          
          // Mark fonts as loaded after a short delay
          setTimeout(function() {
            document.documentElement.classList.remove('font-loading');
            document.documentElement.classList.add('fonts-loaded');
          }, 100);
          
          // Font loading fallback
          (function() {
            try {
              document.fonts.ready.then(function() {
                document.documentElement.classList.remove('font-loading');
                document.documentElement.classList.add('fonts-loaded');
              });
            } catch (e) {
              // If document.fonts is not supported, we already have the timeout above
              console.warn('Font loading API not supported');
            }
          })();
        `}} />
      </head>
      <body suppressHydrationWarning>
        <Navigation />
        <div className="bottom-section-placeholder"></div>
        {children}
        <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
      </body>
    </html>
  );
}
