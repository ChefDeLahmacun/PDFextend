import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "PDF Note Space Extender",
  description: "A tool to extend PDF note space directly in your browser",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
            height: 100vh;
            background-color: #c7edd4;
            z-index: 0;
          }
        `}} />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <Navigation />
        <div className="green-section-placeholder"></div>
        {children}
      </body>
    </html>
  );
}
