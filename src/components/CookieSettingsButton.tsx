"use client";

import { openCookieSettings } from "@/lib/consent";

/** Footer control to review or withdraw cookie consent. */
export default function CookieSettingsButton() {
  return (
    <button type="button" onClick={openCookieSettings} className="hover:text-text underline-offset-4 hover:underline">
      Cookie settings
    </button>
  );
}
