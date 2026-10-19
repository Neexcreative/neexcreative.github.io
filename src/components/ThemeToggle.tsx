"use client";

import { useSyncExternalStore } from "react";
import { getTheme, setTheme, subscribeTheme } from "@/lib/theme";

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-4" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}

/**
 * Light/dark switch: sun knob on the left, moon knob on the right.
 * With no stored choice the site shows its hybrid design, read as dark
 * (the first screen is dark), so the first click goes to light.
 *
 * `onDark` is the palette of the bar the switch sits on, so the track
 * always contrasts with it: dark track on light bars, light track on dark.
 */
export default function ThemeToggle({ onDark, onChange }: { onDark: boolean; onChange?: () => void }) {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, () => null);
  const isDark = theme !== "light";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Dark theme"
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => {
        setTheme(isDark ? "light" : "dark");
        onChange?.();
      }}
      className={`relative flex h-8 w-14 shrink-0 items-center rounded-full border transition-colors ${
        onDark ? "border-white/20 bg-white" : "border-black/10 bg-[#2a2a2a]"
      }`}
    >
      <span
        className={`absolute left-1 flex size-6 items-center justify-center rounded-full transition-transform duration-300 ease-out ${
          isDark ? "translate-x-6" : "translate-x-0"
        } ${onDark ? "bg-black text-white" : "bg-white text-black"}`}
      >
        {isDark ? <MoonIcon /> : <SunIcon />}
      </span>
    </button>
  );
}
