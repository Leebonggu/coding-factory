"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Search, ChevronRight, User, Settings, LogOut } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

function useBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  return segments.map((segment, index) => ({
    label: segment.charAt(0).toUpperCase() + segment.slice(1),
    href: "/" + segments.slice(0, index + 1).join("/"),
    isLast: index === segments.length - 1,
  }));
}

export function DashboardTopbar() {
  const breadcrumbs = useBreadcrumbs();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[hsl(var(--factory-border))] bg-[hsl(var(--factory-background))] px-4 sm:px-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.href} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight className="h-3.5 w-3.5 text-[hsl(var(--factory-muted-foreground))]" />
              )}
              {crumb.isLast ? (
                <span className="font-medium text-[hsl(var(--factory-foreground))]">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-[hsl(var(--factory-muted-foreground))] transition-colors hover:text-[hsl(var(--factory-foreground))]"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button
          type="button"
          className="flex h-9 items-center gap-2 rounded-[var(--factory-radius)] border border-[hsl(var(--factory-border))] bg-[hsl(var(--factory-muted))]/50 px-3 text-sm text-[hsl(var(--factory-muted-foreground))] transition-colors hover:bg-[hsl(var(--factory-muted))] hover:text-[hsl(var(--factory-foreground))] sm:w-52"
        >
          <Search className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="ml-auto hidden rounded border border-[hsl(var(--factory-border))] px-1.5 py-0.5 text-xs sm:inline">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-[var(--factory-radius)] border border-[hsl(var(--factory-border))] text-[hsl(var(--factory-muted-foreground))] transition-colors hover:bg-[hsl(var(--factory-muted))] hover:text-[hsl(var(--factory-foreground))]"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[hsl(var(--factory-primary))]" />
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setUserMenuOpen((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[hsl(var(--factory-primary))] text-[hsl(var(--factory-primary-foreground))] text-sm font-semibold transition-opacity hover:opacity-90"
            aria-label="User menu"
          >
            JD
          </button>

          {userMenuOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setUserMenuOpen(false)}
              />
              {/* Dropdown */}
              <div className="absolute right-0 z-20 mt-2 w-56 rounded-[var(--factory-radius)] border border-[hsl(var(--factory-border))] bg-[hsl(var(--factory-background))] shadow-lg">
                <div className="border-b border-[hsl(var(--factory-border))] px-4 py-3">
                  <p className="text-sm font-medium text-[hsl(var(--factory-foreground))]">
                    Jane Doe
                  </p>
                  <p className="truncate text-xs text-[hsl(var(--factory-muted-foreground))]">
                    jane@example.com
                  </p>
                </div>
                <div className="py-1">
                  {[
                    { label: "Profile", href: "/dashboard/profile", icon: User },
                    { label: "Settings", href: "/dashboard/settings", icon: Settings },
                  ].map(({ label, href, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[hsl(var(--factory-foreground))] hover:bg-[hsl(var(--factory-muted))]"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Icon className="h-4 w-4 text-[hsl(var(--factory-muted-foreground))]" />
                      {label}
                    </Link>
                  ))}
                </div>
                <div className="border-t border-[hsl(var(--factory-border))] py-1">
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-[hsl(var(--factory-foreground))] hover:bg-[hsl(var(--factory-muted))]"
                  >
                    <LogOut className="h-4 w-4 text-[hsl(var(--factory-muted-foreground))]" />
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
