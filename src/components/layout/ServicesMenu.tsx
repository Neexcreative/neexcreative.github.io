"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { services } from "@/lib/site-config";

/** Short subtitle per service slug (titles and links come from site-config). */
const taglines: Record<string, string> = {
  "brand-strategy-design": "Identity that sets the foundation",
  "web-design": "Sites built to convert",
  "photo-video-production": "Reels, films and brand stories",
  "marketing-content": "Social and campaign assets",
  "print-multimedia-design": "From business cards to signage",
};

/**
 * Desktop "Services" nav item with a floating dropdown card listing the
 * five services. Opens on hover, and from the chevron button for keyboard
 * and touch; Esc or leaving the item closes it. The card stays inside this <li>, so moving the pointer
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
        className={`services-menu absolute -left-4 top-[calc(100%-6px)] w-72 rounded-2xl border p-2 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.5)] before:absolute before:inset-x-0 before:-top-3 before:h-3 ${
          dark ? "border-border bg-bg" : "border-light-border bg-light-surface"
        }`}
      >
        <ul>
          {services.map((service) => (
            <li key={service.slug}>
              <Link
                href={service.href}
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-3 py-2.5 transition-colors ${
                  dark ? "hover:bg-surface" : "hover:bg-light-bg"
                }`}
              >
                <span className={`block text-sm font-semibold ${text}`}>{service.title}</span>
                <span className={`block text-xs ${muted}`}>{taglines[service.slug]}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
