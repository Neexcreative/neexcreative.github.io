import Link from "next/link";
import { navLinks, siteConfig, socialLinks } from "@/lib/site-config";

const socialIconPaths: Record<string, string> = {
  Instagram:
    "M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.8A3.95 3.95 0 003.8 7.75v8.5a3.95 3.95 0 003.95 3.95h8.5a3.95 3.95 0 003.95-3.95v-8.5a3.95 3.95 0 00-3.95-3.95h-8.5zm8.95 1.35a1.15 1.15 0 110 2.3 1.15 1.15 0 010-2.3zM12 7a5 5 0 110 10A5 5 0 0112 7zm0 1.8A3.2 3.2 0 1012 15.2 3.2 3.2 0 0012 8.8z",
  LinkedIn:
    "M4.98 3.5A2.48 2.48 0 115 8.46 2.48 2.48 0 014.98 3.5zM3 9h4v12H3zm7 0h3.83v1.64h.06A4.2 4.2 0 0117.67 8c4.04 0 4.79 2.66 4.79 6.12V21h-4v-6.1c0-1.45-.03-3.32-2.02-3.32-2.02 0-2.33 1.58-2.33 3.21V21h-4z",
  Behance:
    "M9.23 11.3c1.42-.7 2.12-1.82 2.12-3.4C11.35 5.4 9.44 4 6.43 4H1v16h5.58c3.16 0 5.54-1.47 5.54-4.65 0-2.26-1.13-3.56-2.89-4.05zM4.5 6.9h1.68c1.32 0 2.04.49 2.04 1.6 0 1.13-.84 1.62-2.18 1.62H4.5zm1.86 10.2H4.5v-4.1h1.91c1.56 0 2.42.66 2.42 2.02 0 1.5-1.08 2.08-2.47 2.08zM18.36 8c-3.64 0-5.83 2.45-5.83 6.1 0 3.77 2.1 6.15 5.97 6.15 2.88 0 4.9-1.35 5.42-3.85H20.8c-.38.81-1.16 1.28-2.18 1.28-1.53 0-2.52-.93-2.58-2.73H24c.22-4.08-1.98-6.95-5.64-6.95zm-2.26 4.8c.17-1.52 1.03-2.3 2.3-2.3 1.34 0 2.12.84 2.18 2.3zM16 4.5h5v1.8h-5z",
  YouTube:
    "M23.5 6.2a3 3 0 00-2.11-2.12C19.52 3.6 12 3.6 12 3.6s-7.52 0-9.39.48A3 3 0 00.5 6.2 31.3 31.3 0 000 12a31.3 31.3 0 00.5 5.8 3 3 0 002.11 2.12c1.87.48 9.39.48 9.39.48s7.52 0 9.39-.48a3 3 0 002.11-2.12A31.3 31.3 0 0024 12a31.3 31.3 0 00-.5-5.8zM9.6 16.15V7.85L16.8 12z",
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-bg">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="text-lg font-medium">{siteConfig.name}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{siteConfig.tagline}</p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="mt-4 inline-block text-sm text-text underline-offset-4 transition-colors hover:text-accent hover:underline"
            >
              {siteConfig.email}
            </a>
          </div>

          <nav aria-label="Footer navigation">
            <ul className="grid grid-cols-2 gap-x-12 gap-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-text"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center border border-border transition-colors hover:border-muted"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-muted" aria-hidden>
                    <path d={socialIconPaths[social.label]} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {siteConfig.legalName}</p>
          <p>Site by Neex Creative</p>
        </div>
      </div>
    </footer>
  );
}
