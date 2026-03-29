import Link from "next/link";
import { Zap, Github, Twitter, Linkedin } from "lucide-react";

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

export function MarketingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[hsl(var(--factory-border))] bg-[hsl(var(--factory-muted))]/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* Top section */}
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
            {/* Social icons */}
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
    </footer>
  );
}
