declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

export type GaEventName =
  | "click"
  | "signup"
  | "login"
  | "logout"
  | "purchase"
  | "add_to_cart"
  | "remove_from_cart"
  | "begin_checkout"
  | "search"
  | "share"
  | "view_item"
  | "view_item_list"
  | "select_item"
  | "page_view"
  | "form_submit"
  | "file_download"
  | "video_start"
  | "video_complete"
  | "scroll"
  | "exception"
  | (string & {});

/**
 * Send a custom event to GA4 via gtag.
 * No-ops if gtag is not available on window.
 */
export function trackEvent(
  eventName: GaEventName,
  params?: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;

  window.gtag("event", eventName, params);
}

/**
 * Send a page_view event to GA4.
 * Typically called on route changes.
 */
export function trackPageView(url: string): void {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!measurementId) return;

  trackEvent("page_view", {
    page_path: url,
    send_to: measurementId,
  });
}
