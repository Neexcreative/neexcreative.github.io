"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { services } from "@/lib/site-config";

/**
 * Desktop "Services" nav item with a full-width dropdown listing the five
 * services. Opens on hover, and from the chevron button for keyboard and
 * touch; Esc or leaving the item closes it. The panel is positioned against
 * the sticky header (the nearest positioned ancestor), but stays inside this
 * <li> so moving the pointer from the label into the panel keeps it open.
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
  // Short delay so a diagonal pointer path into the panel does not flicker it shut.
  const hide = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), 120);
  };

  const muted = dark ? "text-muted" : "text-light-muted";
  const text = dark ? "text-text" : "text-light-text";
  const accentHover = dark ? "group-hover/item:text-accent" : "group-hover/item:text-light-accent";
  const border = dark ? "border-border" : "border-light-border";

  return (
    <li
      className="flex h-16 items-center"
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
      <Link href="/services" className={linkClassName} aria-current={active ? "page" : undefined}>
        Services
      </Link>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="services-menu"
        aria-label="Show services"
        onClick={() => setOpen((value) => !value)}
        className={`ml-1 flex size-6 items-center justify-center ${
          dark ? "text-muted hover:text-text" : "text-light-muted hover:text-light-text"
        } transition-colors`}
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

      <div
        id="services-menu"
        hidden={!open}
        className={`absolute inset-x-0 top-full border-b shadow-[0_24px_48px_-24px_rgba(0,0,0,0.45)] before:absolute before:inset-x-0 before:-top-2 before:h-2 ${border} ${
          dark ? "bg-bg" : "bg-light-bg"
        }`}
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-10 md:px-12 lg:grid-cols-[16rem_1fr]">
          <div>
            <p className={`text-xs font-medium uppercase tracking-[0.2em] ${muted}`}>Services</p>
            <p className={`mt-4 font-display text-2xl font-semibold leading-tight tracking-tight ${text}`}>
              Not five services. One growth engine.
            </p>
            <Link
              href="/services"
              onClick={() => setOpen(false)}
              className={`mt-6 inline-block text-sm underline-offset-4 hover:underline ${
                dark ? "text-accent" : "text-light-accent"
              }`}
            >
              View all services <span aria-hidden>→</span>
            </Link>
          </div>

          <ul className={`-mt-4 divide-y ${dark ? "divide-border" : "divide-light-border"}`}>
            {services.map((service, index) => (
              <li key={service.slug}>
                <Link
                  href={service.href}
                  onClick={() => setOpen(false)}
                  className="group/item grid grid-cols-[3rem_1fr] items-baseline gap-x-4 py-4"
                >
                  <span className={`text-sm ${muted}`}>{String(index + 1).padStart(2, "0")}</span>
                  <span>
                    <span
                      className={`block font-display text-lg font-semibold tracking-tight transition-colors ${text} ${accentHover}`}
                    >
                      {service.title}
                    </span>
                    <span className={`mt-1 block max-w-2xl text-sm leading-relaxed ${muted}`}>
                      {service.description}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
}
