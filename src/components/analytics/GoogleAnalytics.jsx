'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { useEffect } from 'react';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-MG27CK781R';

export function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page views on route change
  useEffect(() => {
    // Google Analytics
    if (GA_MEASUREMENT_ID && typeof window.gtag === 'function') {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: pathname + searchParams.toString(),
      });
    }

    // Internal tracking
    const trackPageView = async () => {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'page_view',
            page_path: pathname,
            referrer: document.referrer,
            utm_source: searchParams.get('utm_source'),
            utm_medium: searchParams.get('utm_medium'),
            utm_campaign: searchParams.get('utm_campaign'),
          }),
        });
      } catch (err) {
        console.error('Failed to track page view:', err);
      }
    };

    trackPageView();
  }, [pathname, searchParams]);

  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}
