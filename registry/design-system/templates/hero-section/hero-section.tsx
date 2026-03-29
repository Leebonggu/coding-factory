import Link from "next/link";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  badge?: string;
  headline?: string;
  subtext?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  className?: string;
}

export function HeroSection({
  badge = "Introducing v2.0 — Now with AI features",
  headline = "Build products your\ncustomers will love",
  subtext = "Stop wrestling with boilerplate. Our platform gives your team the tools, templates, and infrastructure to ship exceptional products at speed — without cutting corners.",
  primaryCta = { label: "Start building for free", href: "/signup" },
  secondaryCta = { label: "View documentation", href: "/docs" },
  className,
}: HeroSectionProps) {
  const headlineLines = headline.split("\n");

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-[hsl(var(--factory-background))]",
        className
      )}
    >
      {/* Background decoration */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-[hsl(var(--factory-primary))]/5 blur-3xl" />
        <div className="absolute right-0 top-1/4 h-72 w-72 rounded-full bg-[hsl(var(--factory-accent))]/30 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          {badge && (
            <div className="mb-6 flex items-center gap-2 rounded-full border border-[hsl(var(--factory-border))] bg-[hsl(var(--factory-muted))]/60 px-4 py-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[hsl(var(--factory-primary))]" />
              <span className="text-xs font-medium text-[hsl(var(--factory-foreground))]">
                {badge}
              </span>
            </div>
          )}

          {/* Headline */}
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-[hsl(var(--factory-foreground))] sm:text-5xl lg:text-6xl xl:text-7xl">
            {headlineLines.map((line, i) => (
              <span key={i} className={i > 0 ? "block text-[hsl(var(--factory-primary))]" : "block"}>
                {line}
              </span>
            ))}
          </h1>

          {/* Subtext */}
          {subtext && (
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[hsl(var(--factory-muted-foreground))] sm:text-lg">
              {subtext}
            </p>
          )}

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            {primaryCta && (
              <Link
                href={primaryCta.href}
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-[var(--factory-radius)] bg-[hsl(var(--factory-primary))] px-6 text-sm font-semibold text-[hsl(var(--factory-primary-foreground))] shadow-sm transition-all hover:opacity-90 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--factory-ring))] focus-visible:ring-offset-2"
              >
                {primaryCta.label}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[var(--factory-radius)] border border-[hsl(var(--factory-border))] bg-[hsl(var(--factory-background))] px-6 text-sm font-semibold text-[hsl(var(--factory-foreground))] transition-colors hover:bg-[hsl(var(--factory-muted))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--factory-ring))] focus-visible:ring-offset-2"
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>

          {/* Social proof */}
          <div className="mt-12 flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
            <div className="flex -space-x-2">
              {["A", "B", "C", "D", "E"].map((initial) => (
                <div
                  key={initial}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[hsl(var(--factory-background))] bg-[hsl(var(--factory-muted))] text-xs font-medium text-[hsl(var(--factory-foreground))]"
                >
                  {initial}
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center sm:items-start">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-[hsl(var(--factory-primary))] text-[hsl(var(--factory-primary))]"
                  />
                ))}
              </div>
              <p className="text-xs text-[hsl(var(--factory-muted-foreground))]">
                Trusted by{" "}
                <span className="font-semibold text-[hsl(var(--factory-foreground))]">
                  2,000+
                </span>{" "}
                developers
              </p>
            </div>
          </div>

          {/* Illustration placeholder */}
          <div className="mt-16 w-full max-w-5xl overflow-hidden rounded-xl border border-[hsl(var(--factory-border))] shadow-2xl shadow-[hsl(var(--factory-primary))]/10">
            <div className="flex items-center gap-1.5 border-b border-[hsl(var(--factory-border))] bg-[hsl(var(--factory-muted))]/50 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
              <div className="mx-3 flex-1 rounded-full bg-[hsl(var(--factory-border))] py-1 px-3 text-xs text-[hsl(var(--factory-muted-foreground))]">
                app.example.com/dashboard
              </div>
            </div>
            <div className="flex aspect-[16/9] max-h-96 items-center justify-center bg-gradient-to-br from-[hsl(var(--factory-muted))] to-[hsl(var(--factory-background))] p-8">
              <div className="grid w-full max-w-2xl grid-cols-3 gap-4">
                {[
                  { label: "Total Revenue", value: "$128,430", change: "+12.5%" },
                  { label: "Active Users", value: "24,521", change: "+8.2%" },
                  { label: "Conversion", value: "3.6%", change: "+1.1%" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-lg border border-[hsl(var(--factory-border))] bg-[hsl(var(--factory-background))] p-4 shadow-sm"
                  >
                    <p className="text-xs text-[hsl(var(--factory-muted-foreground))]">
                      {stat.label}
                    </p>
                    <p className="mt-1 text-xl font-bold text-[hsl(var(--factory-foreground))]">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs font-medium text-emerald-600">
                      {stat.change}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
