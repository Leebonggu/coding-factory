"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "/docs" },
  { label: "Blog", href: "/blog" },
];

export function MarketingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[hsl(var(--factory-border))] bg-[hsl(var(--factory-background))]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-[hsl(var(--factory-foreground))]"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--factory-primary))]">
            <Zap className="h-4 w-4 text-[hsl(var(--factory-primary-foreground))]" />
          </div>
          <span className="text-lg font-bold tracking-tight">Acme Inc.</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[hsl(var(--factory-muted-foreground))] transition-colors hover:text-[hsl(var(--factory-foreground))]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="text-sm font-medium text-[hsl(var(--factory-muted-foreground))] transition-colors hover:text-[hsl(var(--factory-foreground))]"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-9 items-center justify-center rounded-[var(--factory-radius)] bg-[hsl(var(--factory-primary))] px-4 text-sm font-medium text-[hsl(var(--factory-primary-foreground))] shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--factory-ring))]"
          >
            Get started free
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-[hsl(var(--factory-muted-foreground))] hover:bg-[hsl(var(--factory-muted))] hover:text-[hsl(var(--factory-foreground))] md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "border-t border-[hsl(var(--factory-border))] md:hidden",
          mobileOpen ? "block" : "hidden"
        )}
      >
        <div className="space-y-1 px-4 py-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-md px-3 py-2 text-sm font-medium text-[hsl(var(--factory-muted-foreground))] hover:bg-[hsl(var(--factory-muted))] hover:text-[hsl(var(--factory-foreground))]"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 flex flex-col gap-2 border-t border-[hsl(var(--factory-border))] pt-3">
            <Link
              href="/login"
              className="block rounded-md px-3 py-2 text-sm font-medium text-[hsl(var(--factory-muted-foreground))] hover:bg-[hsl(var(--factory-muted))] hover:text-[hsl(var(--factory-foreground))]"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-9 items-center justify-center rounded-[var(--factory-radius)] bg-[hsl(var(--factory-primary))] px-4 text-sm font-medium text-[hsl(var(--factory-primary-foreground))]"
            >
              Get started free
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
