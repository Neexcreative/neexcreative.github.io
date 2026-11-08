"use client";

import { useState } from "react";

type Mode = "gift" | "family";

const steps: Record<Mode, { title: string; text: string }[]> = {
  gift: [
    {
      title: "Choose a plan",
      text: "Pick Little, Story or Legacy. Your gift voucher arrives by email in minutes, ready to print or forward.",
    },
    {
      title: "They send their moments",
      text: "In January, the family shares photos, videos and voice notes from their phones. No sorting needed.",
    },
    {
      title: "We make it, they keep it",
      text: "We build their Small Forever, they approve a preview, and it arrives at their door in a keepsake box.",
    },
  ],
  family: [
    {
      title: "Choose a plan",
      text: "Pick Little, Story or Legacy. We send you a simple link to share your files.",
    },
    {
      title: "Send it as it is",
      text: "Photos, videos and voice notes straight from your phone, through WeTransfer or Google Drive.",
    },
    {
      title: "Approve and receive",
      text: "We put every moment in order, you approve a preview, and it arrives at your door. Then we delete our copy.",
    },
  ],
};

/** Storyworth-style "As a gift / For me" switch over the three steps. */
export default function HowItWorks() {
  const [mode, setMode] = useState<Mode>("gift");
  const tab = (value: Mode, label: string) => (
    <button
      type="button"
      role="tab"
      aria-selected={mode === value}
      aria-controls="sf-steps"
      onClick={() => setMode(value)}
      className={`rounded-full px-5 py-2 text-xs font-medium uppercase tracking-[0.16em] transition-colors ${
        mode === value ? "bg-[#7a2e2a] text-white" : "text-[#6f5a52] hover:text-[#3b2a24]"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div role="tablist" aria-label="How it works" className="mx-auto flex w-fit gap-1 rounded-full border border-[#e8d9cf] bg-white p-1">
        {tab("gift", "As a gift")}
        {tab("family", "For my family")}
      </div>
      <ol id="sf-steps" role="tabpanel" className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
        {steps[mode].map((step, index) => (
          <li key={step.title} className="text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#8e5a52]">Step {index + 1}</p>
            <h3 className="sf-serif mt-3 text-2xl text-[#3b2a24]">{step.title}</h3>
            <p className="mx-auto mt-3 max-w-xs text-[15px] leading-relaxed text-[#6f5a52]">{step.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
