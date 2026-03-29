export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "";

/**
 * Returns the inline GTM script content to be placed in <head>.
 * Initialise dataLayer and load GTM asynchronously.
 */
export function getGtmScript(): string {
  return `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');
`.trim();
}

/**
 * Returns the GTM noscript iframe src for placement inside <body>.
 */
export function getGtmNoScript(): string {
  return `https://www.googletagmanager.com/ns.html?id=${GTM_ID}`;
}

/**
 * Push an arbitrary object onto window.dataLayer.
 * No-ops if dataLayer or GTM_ID are unavailable.
 */
export function pushToDataLayer(data: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  if (!GTM_ID) return;

  (window as unknown as Record<string, unknown[]>)["dataLayer"] =
    (window as unknown as Record<string, unknown[]>)["dataLayer"] ?? [];

  (window as unknown as { dataLayer: unknown[] })["dataLayer"].push(data);
}
