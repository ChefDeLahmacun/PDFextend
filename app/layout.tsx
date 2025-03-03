import type { Metadata } from "next";
import { inter, roboto } from "./fonts";
import "./globals.css";
import Navigation from "./components/Navigation";

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
          /* Ensure green section is always visible */
          .green-section-placeholder {
            position: absolute;
            top: 370px; /* Default position - will be covered by actual content */
            left: 0;
            width: 100%;
            height: 950px; /* Match minGreenSectionHeight */
            background-color: #c7edd4;
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
        <div className="green-section-placeholder"></div>
        {children}
      </body>
    </html>
  );
}
