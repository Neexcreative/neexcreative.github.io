"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { navLinks, siteConfig } from "@/lib/site-config";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href.startsWith("/#") ? false : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-12"
      >
        <Link href="/" aria-label={`${siteConfig.name} — home`} onClick={() => setOpen(false)}>
          <Image
            src="/images/logo_dark.png"
            alt={siteConfig.name}
            width={128}
            height={28}
            className="h-7 w-auto"
            priority
          />
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-sm transition-colors hover:text-text ${
                  isActive(link.href) ? "text-text" : "text-muted"
                }`}
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
            className="inline-flex items-center gap-2 bg-accent px-5 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-bg transition-opacity hover:opacity-85"
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
            className={`h-px w-6 bg-text transition-transform ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
          />
          <span
            className={`h-px w-6 bg-text transition-transform ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
          />
        </button>
      </nav>

      {/* Accent hairline under the nav — carried over from the legacy red-line. */}
      <div className="h-px w-full bg-accent" aria-hidden />

      {open && (
        <div id="mobile-menu" className="border-t border-border bg-bg md:hidden">
          <ul className="flex flex-col px-6 py-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block py-3 text-base text-muted transition-colors hover:text-text"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/contact"
                className="mt-3 inline-flex items-center gap-2 bg-accent px-5 py-3 text-xs font-medium uppercase tracking-[0.18em] text-bg"
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
