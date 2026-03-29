import Link from "next/link";
import { Check, Minus, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingPlan {
  name: string;
  description: string;
  price: { monthly: string; annual: string };
  cta: { label: string; href: string };
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

const plans: PricingPlan[] = [
  {
    name: "Starter",
    description: "Perfect for side projects and early-stage startups.",
    price: { monthly: "$0", annual: "$0" },
    cta: { label: "Get started free", href: "/signup" },
    features: [
      "Up to 3 projects",
      "5 GB storage",
      "Community support",
      "Basic analytics",
      "API access",
    ],
  },
  {
    name: "Pro",
    description: "For growing teams that need more power and flexibility.",
    price: { monthly: "$29", annual: "$24" },
    cta: { label: "Start free trial", href: "/signup?plan=pro" },
    highlighted: true,
    badge: "Most popular",
    features: [
      "Unlimited projects",
      "50 GB storage",
      "Priority email support",
      "Advanced analytics",
      "API access",
      "Custom domains",
      "Team collaboration",
      "Audit logs",
    ],
  },
  {
    name: "Enterprise",
    description: "For large organizations with advanced security and compliance needs.",
    price: { monthly: "$99", annual: "$82" },
    cta: { label: "Contact sales", href: "/contact" },
    features: [
      "Unlimited projects",
      "500 GB storage",
      "Dedicated support + SLA",
      "Advanced analytics",
      "API access",
      "Custom domains",
      "Team collaboration",
      "Audit logs",
      "SSO / SAML",
      "Custom contracts",
    ],
  },
];

interface PricingTableProps {
  className?: string;
}

export function PricingTable({ className }: PricingTableProps) {
  return (
    <section
      className={cn(
        "bg-[hsl(var(--factory-background))] py-20 sm:py-28",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--factory-border))] bg-[hsl(var(--factory-muted))]/60 px-4 py-1.5">
            <Zap className="h-3.5 w-3.5 text-[hsl(var(--factory-primary))]" />
            <span className="text-xs font-medium text-[hsl(var(--factory-foreground))]">
              Simple, transparent pricing
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[hsl(var(--factory-foreground))] sm:text-4xl">
            Plans that scale with you
          </h2>
          <p className="mt-4 text-base text-[hsl(var(--factory-muted-foreground))] sm:text-lg">
            Start free, upgrade when you need more. No hidden fees, no surprises.
          </p>
        </div>

        {/* Plans grid */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-2xl border p-8 shadow-sm transition-shadow hover:shadow-md",
                plan.highlighted
                  ? "border-[hsl(var(--factory-primary))] bg-[hsl(var(--factory-primary))] text-[hsl(var(--factory-primary-foreground))] shadow-lg shadow-[hsl(var(--factory-primary))]/20"
                  : "border-[hsl(var(--factory-border))] bg-[hsl(var(--factory-background))]"
              )}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-[hsl(var(--factory-foreground))] px-3 py-1 text-xs font-semibold text-[hsl(var(--factory-background))]">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan header */}
              <div>
                <h3
                  className={cn(
                    "text-lg font-semibold",
                    plan.highlighted
                      ? "text-[hsl(var(--factory-primary-foreground))]"
                      : "text-[hsl(var(--factory-foreground))]"
                  )}
                >
                  {plan.name}
                </h3>
                <p
                  className={cn(
                    "mt-2 text-sm leading-relaxed",
                    plan.highlighted
                      ? "text-[hsl(var(--factory-primary-foreground))]/80"
                      : "text-[hsl(var(--factory-muted-foreground))]"
                  )}
                >
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="mt-6">
                <div className="flex items-end gap-1">
                  <span
                    className={cn(
                      "text-4xl font-bold tracking-tight",
                      plan.highlighted
                        ? "text-[hsl(var(--factory-primary-foreground))]"
                        : "text-[hsl(var(--factory-foreground))]"
                    )}
                  >
                    {plan.price.monthly}
                  </span>
                  {plan.price.monthly !== "$0" && (
                    <span
                      className={cn(
                        "mb-1 text-sm",
                        plan.highlighted
                          ? "text-[hsl(var(--factory-primary-foreground))]/70"
                          : "text-[hsl(var(--factory-muted-foreground))]"
                      )}
                    >
                      / month
                    </span>
                  )}
                </div>
                {plan.price.monthly !== "$0" && (
                  <p
                    className={cn(
                      "mt-1 text-xs",
                      plan.highlighted
                        ? "text-[hsl(var(--factory-primary-foreground))]/70"
                        : "text-[hsl(var(--factory-muted-foreground))]"
                    )}
                  >
                    {plan.price.annual}/mo billed annually
                  </p>
                )}
              </div>

              {/* CTA */}
              <div className="mt-8">
                <Link
                  href={plan.cta.href}
                  className={cn(
                    "flex h-10 w-full items-center justify-center rounded-[var(--factory-radius)] text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    plan.highlighted
                      ? "bg-[hsl(var(--factory-primary-foreground))] text-[hsl(var(--factory-primary))] hover:opacity-90 focus-visible:ring-[hsl(var(--factory-primary-foreground))]"
                      : "bg-[hsl(var(--factory-primary))] text-[hsl(var(--factory-primary-foreground))] hover:opacity-90 focus-visible:ring-[hsl(var(--factory-ring))]"
                  )}
                >
                  {plan.cta.label}
                </Link>
              </div>

              {/* Divider */}
              <div
                className={cn(
                  "my-8 border-t",
                  plan.highlighted
                    ? "border-[hsl(var(--factory-primary-foreground))]/20"
                    : "border-[hsl(var(--factory-border))]"
                )}
              />

              {/* Features */}
              <ul className="flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check
                      className={cn(
                        "h-4 w-4 shrink-0",
                        plan.highlighted
                          ? "text-[hsl(var(--factory-primary-foreground))]"
                          : "text-[hsl(var(--factory-primary))]"
                      )}
                    />
                    <span
                      className={cn(
                        "text-sm",
                        plan.highlighted
                          ? "text-[hsl(var(--factory-primary-foreground))]/90"
                          : "text-[hsl(var(--factory-foreground))]"
                      )}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-10 text-center text-sm text-[hsl(var(--factory-muted-foreground))]">
          All plans include a 14-day free trial. No credit card required.{" "}
          <Link
            href="/docs/pricing"
            className="font-medium text-[hsl(var(--factory-foreground))] underline-offset-4 hover:underline"
          >
            Compare all features
          </Link>
        </p>
      </div>
    </section>
  );
}
