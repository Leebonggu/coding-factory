"use client";

import Link from "next/link";
import { useState } from "react";
import { Zap, Github, Twitter, Linkedin, ArrowRight } from "lucide-react";

const footerNav = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Changelog", href: "/changelog" },
      { label: "Roadmap", href: "/roadmap" },
    ],
  },
  {
    heading: "Developers",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "API Reference", href: "/docs/api" },
      { label: "Open Source", href: "https://github.com" },
      { label: "Status", href: "/status" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Security", href: "/security" },
    ],
  },
];

const socialLinks = [
  { label: "GitHub", href: "https://github.com", icon: Github },
  { label: "Twitter", href: "https://twitter.com", icon: Twitter },
  { label: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
];

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const currentYear = new Date().getFullYear();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <footer className={className}>
      {/* Newsletter banner */}
      <div className="bg-[hsl(var(--factory-primary))]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-lg font-semibold text-[hsl(var(--factory-primary-foreground))]">
                Stay in the loop
              </h3>
              <p className="mt-1 text-sm text-[hsl(var(--factory-primary-foreground))]/80">
                Get product updates, tutorials, and industry insights delivered to your inbox.
              </p>
            </div>
            {submitted ? (
              <p className="text-sm font-medium text-[hsl(var(--factory-primary-foreground))]">
                Thanks for subscribing! We'll be in touch soon.
              </p>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex w-full max-w-sm items-center gap-2"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="h-10 flex-1 min-w-0 rounded-[var(--factory-radius)] border-0 bg-[hsl(var(--factory-primary-foreground))]/10 px-3 text-sm text-[hsl(var(--factory-primary-foreground))] placeholder-[hsl(var(--factory-primary-foreground))]/50 outline-none ring-1 ring-[hsl(var(--factory-primary-foreground))]/20 transition focus:ring-[hsl(var(--factory-primary-foreground))]/60"
                />
                <button
                  type="submit"
                  className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-[var(--factory-radius)] bg-[hsl(var(--factory-primary-foreground))] px-4 text-sm font-semibold text-[hsl(var(--factory-primary))] transition-opacity hover:opacity-90"
                >
                  Subscribe
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="border-t border-[hsl(var(--factory-border))] bg-[hsl(var(--factory-muted))]/40">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
            {/* Brand column */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--factory-primary))]">
                  <Zap className="h-4 w-4 text-[hsl(var(--factory-primary-foreground))]" />
                </div>
                <span className="font-bold text-[hsl(var(--factory-foreground))]">Acme Inc.</span>
              </Link>
              <p className="mt-4 text-sm leading-relaxed text-[hsl(var(--factory-muted-foreground))]">
                Build faster. Ship smarter. The platform developers choose to turn ideas into products.
              </p>
              <div className="mt-5 flex gap-3">
                {socialLinks.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-md border border-[hsl(var(--factory-border))] text-[hsl(var(--factory-muted-foreground))] transition-colors hover:border-[hsl(var(--factory-primary))] hover:text-[hsl(var(--factory-primary))]"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Nav columns */}
            {footerNav.map((section) => (
              <div key={section.heading}>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--factory-foreground))]">
                  {section.heading}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-[hsl(var(--factory-muted-foreground))] transition-colors hover:text-[hsl(var(--factory-foreground))]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[hsl(var(--factory-border))] pt-8 sm:flex-row">
            <p className="text-sm text-[hsl(var(--factory-muted-foreground))]">
              &copy; {currentYear} Acme Inc. All rights reserved.
            </p>
            <p className="text-sm text-[hsl(var(--factory-muted-foreground))]">
              Built with{" "}
              <a
                href="https://nextjs.org"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[hsl(var(--factory-foreground))] hover:underline"
              >
                Next.js
              </a>{" "}
              &amp;{" "}
              <a
                href="https://tailwindcss.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[hsl(var(--factory-foreground))] hover:underline"
              >
                Tailwind CSS
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
