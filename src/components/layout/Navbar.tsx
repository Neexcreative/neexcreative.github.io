"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { navLinks, siteConfig } from "@/lib/site-config";

type Palette = "dark" | "light";

/**
 * Relative luminance of a CSS "rgb(a)" colour string; null while the
 * colour is transparent so callers keep walking up the ancestor chain.
 */
function luminanceOf(color: string): number | null {
  const match = color.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s/]+([\d.]+))?\s*\)/);
  if (!match) return null;
  const alpha = match[4] === undefined ? 1 : parseFloat(match[4]);
  if (alpha < 0.5) return null;
  const [r, g, b] = [match[1], match[2], match[3]].map((channel) => {
    const c = parseInt(channel, 10) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Palette of the content currently behind the sticky header: hit-test the
 * point under the header's centre, skip the header itself, and walk up from
 * the topmost hit until an element paints an opaque background. Works on
 * every page without per-page markup — sections already carry their palette
 * as a real background colour.
 */
function paletteBehind(header: HTMLElement): Palette {
  const rect = header.getBoundingClientRect();
  const x = window.innerWidth / 2;
  const y = rect.top + rect.height / 2;
  const hit = document
    .elementsFromPoint(x, y)
    .find((el) => !header.contains(el) && el instanceof HTMLElement);
  let node: Element | null = hit ?? document.body;
  while (node) {
    const luminance = luminanceOf(getComputedStyle(node).backgroundColor);
    if (luminance !== null) return luminance > 0.5 ? "light" : "dark";
    node = node.parentElement;
  }
  return "dark";
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [palette, setPalette] = useState<Palette>("dark");
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    let frame = 0;
    const sample = () => {
      if (headerRef.current) setPalette(paletteBehind(headerRef.current));
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(sample);
    };
    sample();
    // Layout can shift after hydration (fonts, images, animations settle).
    const settle = setTimeout(sample, 400);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(settle);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);

  const dark = palette === "dark";

  const isActive = (href: string) =>
    href.startsWith("/#") ? false : pathname === href || pathname.startsWith(`${href}/`);

  const linkClasses = (active: boolean) =>
    dark
      ? `text-sm transition-colors hover:text-text ${active ? "text-text" : "text-muted"}`
      : `text-sm transition-colors hover:text-light-text ${active ? "text-light-text" : "text-light-muted"}`;

  const ctaClasses = dark
    ? "bg-accent text-bg"
    : "bg-light-accent text-white";

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 border-b backdrop-blur transition-colors ${
        dark ? "border-border bg-bg/90" : "border-light-border bg-light-bg/90"
      }`}
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-12"
      >
        <Link href="/" aria-label={`${siteConfig.name} — home`} onClick={() => setOpen(false)}>
          {/* Both marks stay mounted so the swap is instant (no refetch):
              logo.png is the light-on-dark mark, logo_dark.png the dark-on-light. */}
          <Image
            src="/images/logo.png"
            alt={siteConfig.name}
            width={128}
            height={28}
            className={`h-7 w-auto ${dark ? "" : "hidden"}`}
            priority
          />
          <Image
            src="/images/logo_dark.png"
            alt={siteConfig.name}
            width={128}
            height={28}
            className={`h-7 w-auto ${dark ? "hidden" : ""}`}
            priority
          />
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={linkClasses(isActive(link.href))}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Link
            href="/contact"
            className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.18em] transition-opacity hover:opacity-85 ${ctaClasses}`}
          >
            Get a Quote <span aria-hidden>→</span>
          </Link>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`h-px w-6 transition-transform ${dark ? "bg-text" : "bg-light-text"} ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
          />
          <span
            className={`h-px w-6 transition-transform ${dark ? "bg-text" : "bg-light-text"} ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
          />
        </button>
      </nav>

      {/* Accent hairline under the nav — carried over from the legacy red-line. */}
      <div className={`h-px w-full ${dark ? "bg-accent" : "bg-light-accent"}`} aria-hidden />

      {open && (
        <div
          id="mobile-menu"
          className={`border-t md:hidden ${dark ? "border-border bg-bg" : "border-light-border bg-light-bg"}`}
        >
          <ul className="flex flex-col px-6 py-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={
                    dark
                      ? "block py-3 text-base text-muted transition-colors hover:text-text"
                      : "block py-3 text-base text-light-muted transition-colors hover:text-light-text"
                  }
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/contact"
                className={`mt-3 inline-flex items-center gap-2 px-5 py-3 text-xs font-medium uppercase tracking-[0.18em] ${ctaClasses}`}
                onClick={() => setOpen(false)}
              >
                Get a Quote <span aria-hidden>→</span>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
