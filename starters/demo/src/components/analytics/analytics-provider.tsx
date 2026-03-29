"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

import { trackPageView } from "@/lib/analytics";
import { GTM_ID, getGtmScript, getGtmNoScript } from "@/lib/gtm";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const pathname = usePathname();

  // Track page views on route change
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;
    trackPageView(pathname);
  }, [pathname]);

  return (
    <>
      {/* GA4 */}
      {GA_MEASUREMENT_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script
            id="ga4-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
              `,
            }}
          />
        </>
      )}

      {/* GTM */}
      {GTM_ID && (
        <>
          <Script
            id="gtm-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: getGtmScript() }}
          />
          {/* GTM noscript fallback — ideally rendered inside <body> via layout */}
          <noscript>
            <iframe
              src={getGtmNoScript()}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        </>
      )}

      {children}
    </>
  );
}
