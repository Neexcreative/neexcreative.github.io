"use client";

import { useState } from "react";

interface ShareButtonProps {
  title: string;
  /** Absolute URL of the article. */
  url: string;
}

/** Native share sheet where available, clipboard copy otherwise. */
export default function ShareButton({ title, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // User dismissed the sheet — fall through to copy.
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-[0.12em] text-muted transition-colors hover:border-muted hover:text-text"
    >
      {copied ? "Link copied" : "Share"}
      <span aria-hidden>↗</span>
    </button>
  );
}
