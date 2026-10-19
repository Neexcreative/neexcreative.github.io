"use client";

import { useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { services } from "@/lib/site-config";

/** 24px line icons, drawn with currentColor. */
const icon = (paths: ReactNode) => (
  <svg
    viewBox="0 0 24 24"
    className="size-[18px]"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    {paths}
  </svg>
);

const icons = {
  brand: icon(
    <>
      <path d="M12 19l7-7 3 3-7 7-3-3z" />
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="M2 2l7.6 7.6" />
      <circle cx="11" cy="11" r="2" />
    </>,
  ),
  web: icon(
    <>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </>,
  ),
  video: icon(
    <>
      <rect x="2" y="6" width="14" height="12" rx="2" />
      <path d="m22 8-6 4 6 4V8z" />
    </>,
  ),
  marketing: icon(
    <>
      <path d="m3 11 18-5v12L3 14v-3z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </>,
  ),
  print: icon(
    <>
      <path d="M6 9V2h12v7" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </>,
  ),
  grid: icon(
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>,
  ),
  work: icon(
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
    </>,
  ),
  calendar: icon(
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </>,
  ),
  message: icon(<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />),
};

/** Short subtitle and icon per service slug (titles and links come from site-config). */
const serviceMeta: Record<string, { tagline: string; icon: ReactNode }> = {
  "brand-strategy-design": { tagline: "Identity that sets the foundation", icon: icons.brand },
  "web-design": { tagline: "Sites built to convert", icon: icons.web },
  "photo-video-production": { tagline: "Reels, films and brand stories", icon: icons.video },
  "marketing-content": { tagline: "Social and campaign assets", icon: icons.marketing },
  "print-multimedia-design": { tagline: "From business cards to signage", icon: icons.print },
};

const startLinks = [
  { title: "All services", tagline: "The full growth system", href: "/services", icon: icons.grid },
  { title: "Our work", tagline: "Selected projects", href: "/work", icon: icons.work },
  { title: "Book a call", tagline: "30 minutes, no pressure", href: "/book", icon: icons.calendar },
  { title: "Get a quote", tagline: "Tell us about your project", href: "/contact", icon: icons.message },
];

interface MenuItem {
  title: string;
  tagline: string;
  href: string;
  icon: ReactNode;
}

/**
 * Desktop "Services" nav item with a floating dropdown card: the five
 * services on the left, quick "Get started" links on the right. Opens on
 * hover, and from the chevron button for keyboard and touch; Esc or leaving
 * the item closes it. The card stays inside this <li>, so moving the pointer
 * from the label into the card keeps it open.
 */
export default function ServicesMenu({
  dark,
  active,
  linkClassName,
}: {
  dark: boolean;
  active: boolean;
  linkClassName: string;
}) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const show = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  // Short delay so a diagonal pointer path into the card does not flicker it shut.
  const hide = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), 120);
  };

  const muted = dark ? "text-muted" : "text-light-muted";
  const text = dark ? "text-text" : "text-light-text";

  const Item = ({ item }: { item: MenuItem }) => (
    <li>
      <Link
        href={item.href}
        onClick={() => setOpen(false)}
        className={`group/item flex items-center gap-3.5 rounded-xl p-2 transition-colors ${
          dark ? "hover:bg-surface" : "hover:bg-light-bg"
        }`}
      >
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-lg border transition-colors ${
            dark
              ? "border-border bg-bg text-text group-hover/item:border-accent group-hover/item:text-accent"
              : "border-light-border bg-light-surface text-light-text group-hover/item:border-light-accent group-hover/item:text-light-accent"
          }`}
        >
          {item.icon}
        </span>
        <span className="min-w-0">
          <span className={`block text-sm font-semibold ${text}`}>{item.title}</span>
          <span className={`block truncate text-xs ${muted}`}>{item.tagline}</span>
        </span>
      </Link>
    </li>
  );

  return (
    <li
      className="relative flex h-16 items-center"
      onMouseEnter={show}
      onMouseLeave={hide}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          buttonRef.current?.focus();
        }
      }}
    >
      {/* Label + chevron read as one pill while the menu is open. */}
      <span
        className={`-mx-3 flex items-center rounded-full py-1.5 pl-3 pr-1.5 transition-colors ${
          open ? (dark ? "bg-surface" : "bg-light-border/60") : ""
        }`}
      >
        <Link
          href="/services"
          className={open ? `text-sm ${text}` : linkClassName}
          aria-current={active ? "page" : undefined}
        >
          Services
        </Link>
        <button
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-controls="services-menu"
          aria-label="Show services"
          onClick={() => setOpen((value) => !value)}
          className={`ml-0.5 flex size-6 items-center justify-center transition-colors ${
            open ? text : dark ? "text-muted hover:text-text" : "text-light-muted hover:text-light-text"
          }`}
        >
          <svg
            viewBox="0 0 12 12"
            className={`size-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden
          >
            <path d="M2.5 4.5 6 8l3.5-3.5" />
          </svg>
        </button>
      </span>

      <div
        id="services-menu"
        hidden={!open}
        className={`services-menu absolute -left-4 top-[calc(100%-6px)] w-80 rounded-2xl border p-4 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.5)] before:absolute before:inset-x-0 before:-top-3 before:h-3 lg:w-[40rem] ${
          dark ? "border-border bg-bg" : "border-light-border bg-light-surface"
        }`}
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <p className={`px-2 pb-2 text-xs font-medium ${muted}`}>Services</p>
            <ul>
              {services.map((service) => (
                <Item
                  key={service.slug}
                  item={{ title: service.title, href: service.href, ...serviceMeta[service.slug] }}
                />
              ))}
            </ul>
          </div>
          <div className="hidden lg:block">
            <p className={`px-2 pb-2 text-xs font-medium ${muted}`}>Get started</p>
            <ul>
              {startLinks.map((link) => (
                <Item key={link.href} item={link} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </li>
  );
}
