"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "cookie-consent";

type ConsentValue = "all" | "necessary" | null;

function getStoredConsent(): ConsentValue {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(STORAGE_KEY);
  if (value === "all" || value === "necessary") return value;
  return null;
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    if (!stored) {
      setVisible(true);
    }
  }, []);

  function handleAcceptAll() {
    localStorage.setItem(STORAGE_KEY, "all");
    setVisible(false);
    // Allow analytics scripts to fire
    window.dispatchEvent(new CustomEvent("cookie-consent", { detail: "all" }));
  }

  function handleNecessaryOnly() {
    localStorage.setItem(STORAGE_KEY, "necessary");
    setVisible(false);
    window.dispatchEvent(
      new CustomEvent("cookie-consent", { detail: "necessary" })
    );
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie consent"
      aria-describedby="cookie-consent-description"
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "flex items-center justify-between gap-4 flex-wrap",
        "px-4 py-3 sm:px-6 sm:py-4",
        "border-t border-[hsl(var(--factory-border,220_13%_91%))]",
        "bg-[hsl(var(--factory-background,0_0%_100%))]",
        "shadow-[0_-2px_12px_rgba(0,0,0,0.06)]"
      )}
    >
      <p
        id="cookie-consent-description"
        className="flex-1 text-sm text-[hsl(var(--factory-muted-foreground,220_9%_46%))] min-w-[200px]"
      >
        We use cookies to improve your experience. You can choose which cookies
        to allow.{" "}
        <a
          href="/privacy"
          className="underline underline-offset-2 hover:text-[hsl(var(--factory-primary,221_83%_53%))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--factory-primary,221_83%_53%))] rounded-sm transition-colors"
        >
          Privacy policy
        </a>
      </p>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={handleNecessaryOnly}
          aria-label="Accept necessary cookies only"
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium",
            "border border-[hsl(var(--factory-border,220_13%_91%))]",
            "text-[hsl(var(--factory-foreground,222_47%_11%))]",
            "bg-transparent",
            "hover:bg-[hsl(var(--factory-muted,220_14%_96%))]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--factory-primary,221_83%_53%))]",
            "transition-colors"
          )}
        >
          Necessary only
        </button>

        <button
          type="button"
          onClick={handleAcceptAll}
          aria-label="Accept all cookies"
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium",
            "bg-[hsl(var(--factory-primary,221_83%_53%))]",
            "text-[hsl(var(--factory-primary-foreground,0_0%_100%))]",
            "hover:opacity-90",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--factory-primary,221_83%_53%))] focus-visible:ring-offset-2",
            "transition-opacity"
          )}
        >
          Accept all
        </button>
      </div>
    </div>
  );
}
