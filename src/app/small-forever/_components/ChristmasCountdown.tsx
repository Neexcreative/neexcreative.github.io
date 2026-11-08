"use client";

import { useEffect, useState } from "react";

/** Last order for delivery before Christmas: 4 December 2026, 23:59 Irish time (UTC in winter). */
const CUTOFF = Date.UTC(2026, 11, 4, 23, 59, 0);

function remaining(now: number) {
  const ms = Math.max(0, CUTOFF - now);
  return {
    done: ms === 0,
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms / 3_600_000) % 24),
    minutes: Math.floor((ms / 60_000) % 60),
  };
}

/** Days / hours / minutes until the Christmas delivery cut-off. */
export default function ChristmasCountdown() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setNow(Date.now());
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  // Before hydration, show the date only (no mismatched numbers).
  if (now === null) {
    return <p className="text-sm text-[#e9dcc3]">Order by 4 December for delivery before Christmas.</p>;
  }

  const t = remaining(now);
  if (t.done) {
    return (
      <p className="text-sm text-[#e9dcc3]">
        Christmas delivery has closed. Gift vouchers still arrive by email in minutes, until 24 December.
      </p>
    );
  }

  const unit = (n: number, label: string) => (
    <div className="flex min-w-[4.5rem] flex-col items-center rounded-2xl border border-white/15 bg-white/5 px-3 py-4">
      <span className="sf-serif text-4xl leading-none text-white tabular-nums md:text-5xl">{n}</span>
      <span className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#e9dcc3]">{label}</span>
    </div>
  );

  return (
    <div aria-live="polite">
      <div className="flex gap-3">
        {unit(t.days, t.days === 1 ? "day" : "days")}
        {unit(t.hours, t.hours === 1 ? "hour" : "hours")}
        {unit(t.minutes, "min")}
      </div>
      <p className="mt-4 text-sm text-[#e9dcc3]">left to order for delivery before Christmas</p>
    </div>
  );
}
