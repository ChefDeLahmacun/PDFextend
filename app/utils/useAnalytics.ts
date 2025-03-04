import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackEvent } from './analytics';

export const useAnalytics = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page views
  useEffect(() => {
    if (pathname) {
      // Include search parameters if they exist
      const url = searchParams?.size 
        ? `${pathname}?${searchParams}`
        : pathname;
        
      // This is automatically tracked by the GoogleAnalytics component,
      // but we're adding it here for completeness
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'page_view', {
          page_path: url,
        });
      }
    }
  }, [pathname, searchParams]);

  // Return the trackEvent function for custom event tracking
  return { trackEvent };
}; 