import { tickerItems } from "@/lib/site-config";

/**
 * Infinite horizontal marquee, pure CSS (keyframes in globals.css).
 * The track is rendered twice; the duplicate is aria-hidden so screen
 * readers hear the list once.
 */
export default function MarqueeTicker() {
  const track = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-6 pr-6 text-sm uppercase tracking-[0.18em] text-muted"
    >
      {tickerItems.map((item) => (
        <li key={item} className="flex items-center gap-6 whitespace-nowrap">
          {item}
          <span className="text-accent" aria-hidden>
            ·
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="overflow-hidden border-b border-border py-5" role="marquee">
      <div className="marquee-track flex w-max">
        {track(false)}
        {track(true)}
      </div>
    </div>
  );
}
