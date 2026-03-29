"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Settings,
  FileText,
  Bell,
  ChevronLeft,
  ChevronRight,
  Zap,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Users", href: "/dashboard/users", icon: Users },
  { label: "Reports", href: "/dashboard/reports", icon: FileText },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
];

const bottomItems = [
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "relative flex h-full flex-col border-r border-[hsl(var(--factory-border))] bg-[hsl(var(--factory-background))] transition-all duration-200",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-[hsl(var(--factory-border))] px-4",
          collapsed ? "justify-center" : "justify-between"
        )}
      >
        <Link href="/dashboard" className="flex items-center gap-2 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--factory-primary))]">
            <Zap className="h-4 w-4 text-[hsl(var(--factory-primary-foreground))]" />
          </div>
          {!collapsed && (
            <span className="truncate font-bold text-[hsl(var(--factory-foreground))]">
              Acme Inc.
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-[var(--factory-radius)] px-3 py-2 text-sm font-medium transition-colors",
                    collapsed && "justify-center px-2",
                    isActive
                      ? "bg-[hsl(var(--factory-primary))] text-[hsl(var(--factory-primary-foreground))]"
                      : "text-[hsl(var(--factory-muted-foreground))] hover:bg-[hsl(var(--factory-muted))] hover:text-[hsl(var(--factory-foreground))]"
                  )}
                  title={collapsed ? label : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom items */}
      <div className="border-t border-[hsl(var(--factory-border))] py-4">
        <ul className="space-y-1 px-2">
          {bottomItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-[var(--factory-radius)] px-3 py-2 text-sm font-medium transition-colors",
                    collapsed && "justify-center px-2",
                    isActive
                      ? "bg-[hsl(var(--factory-primary))] text-[hsl(var(--factory-primary-foreground))]"
                      : "text-[hsl(var(--factory-muted-foreground))] hover:bg-[hsl(var(--factory-muted))] hover:text-[hsl(var(--factory-foreground))]"
                  )}
                  title={collapsed ? label : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{label}</span>}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              className={cn(
                "flex w-full items-center gap-3 rounded-[var(--factory-radius)] px-3 py-2 text-sm font-medium text-[hsl(var(--factory-muted-foreground))] transition-colors hover:bg-[hsl(var(--factory-muted))] hover:text-[hsl(var(--factory-foreground))]",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? "Sign out" : undefined}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {!collapsed && <span>Sign out</span>}
            </button>
          </li>
        </ul>
      </div>

      {/* Collapse toggle */}
      <button
        type="button"
        onClick={() => setCollapsed((prev) => !prev)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-[hsl(var(--factory-border))] bg-[hsl(var(--factory-background))] text-[hsl(var(--factory-muted-foreground))] shadow-sm transition-colors hover:text-[hsl(var(--factory-foreground))]"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </button>
    </aside>
  );
}
