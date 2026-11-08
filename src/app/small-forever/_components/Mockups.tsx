import Image from "next/image";

/**
 * Product mockups drawn in code: a laptop showing Small Forever, the keepsake
 * drive plugged in by USB-C, a letter coming out of its envelope, and a
 * sealed envelope for the future.
 */

export function Laptop({
  src = "/images/small-forever/intro.webp",
  alt,
  priority = false,
  sizes = "(min-width: 768px) 520px, 90vw",
}: {
  src?: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div className="relative w-full">
      {/* lid */}
      <div className="rounded-t-[14px] bg-[#1d1816] p-[2.4%] pb-[3%] shadow-[0_40px_80px_-40px_rgba(40,25,20,0.6)] ring-1 ring-black/40">
        <div className="relative aspect-[16/10] overflow-hidden rounded-[4px] bg-[#fbf2ec]">
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            className="object-cover object-top"
          />
        </div>
      </div>
      {/* base */}
      <div className="relative -mx-[7%] h-[11px] rounded-b-[14px] bg-gradient-to-b from-[#d9d4cf] to-[#a9a39d] shadow-[0_18px_30px_-12px_rgba(40,25,20,0.45)] md:h-[14px]">
        <div className="absolute left-1/2 top-0 h-[5px] w-[16%] -translate-x-1/2 rounded-b-md bg-[#bdb7b1]" />
      </div>
    </div>
  );
}

/** Small portable drive with a USB-C cable curling towards the laptop. */
export function KeepsakeDrive({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 150" className={className} aria-hidden focusable="false">
      <defs>
        <linearGradient id="sf-drive" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#f3e3da" />
          <stop offset="1" stopColor="#d7b9ab" />
        </linearGradient>
      </defs>
      {/* cable */}
      <path d="M 4 40 C 40 40, 40 104, 84 100" fill="none" stroke="#3b2a24" strokeWidth="4" strokeLinecap="round" />
      <rect x="0" y="34" width="12" height="12" rx="3" fill="#3b2a24" />
      {/* drive body */}
      <g transform="rotate(-8 150 92)">
        <rect x="84" y="56" width="128" height="78" rx="16" fill="url(#sf-drive)" stroke="#c49d8d" strokeWidth="1.5" />
        <rect x="80" y="88" width="10" height="14" rx="3" fill="#3b2a24" />
        <circle cx="196" cy="70" r="3" fill="#7fbf8a" />
        <text x="148" y="100" textAnchor="middle" fontSize="9" letterSpacing="3" fill="#6f5a52" fontFamily="Georgia, serif">
          SMALL FOREVER
        </text>
        <line x1="112" y1="108" x2="184" y2="108" stroke="#6f5a52" strokeOpacity=".35" />
      </g>
    </svg>
  );
}

/** A letter rising out of its envelope. */
export function OpenLetter({ className = "" }: { className?: string }) {
  return (
    <div className={`relative mx-auto aspect-[4/5] w-full max-w-[260px] ${className}`}>
      {/* letter */}
      <div className="absolute inset-x-[12%] top-[4%] h-[66%] -rotate-2 overflow-hidden rounded-sm shadow-[0_18px_30px_-18px_rgba(59,42,36,0.6)] transition-transform duration-700 group-hover:-translate-y-3">
        <Image src="/images/small-forever/paper.webp" alt="" fill sizes="220px" className="object-cover" />
        <div className="absolute inset-0 flex flex-col items-center px-[12%] pt-[16%] text-center text-[#3d2b1a]" style={{ fontFamily: "Georgia, serif" }}>
          <p className="text-[8px] uppercase tracking-[0.25em] opacity-70">From Mum &amp; Dad</p>
          <p className="mt-3 text-[13px] italic">For your 18th birthday</p>
          <div className="mt-3 w-full space-y-1.5" aria-hidden>
            {[92, 84, 96, 70, 88, 60].map((w, i) => (
              <span key={i} className="block h-[2px] rounded bg-[#3d2b1a]/25" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      </div>
      {/* envelope front */}
      <div className="absolute inset-x-0 bottom-0 h-[52%] overflow-hidden rounded-lg shadow-[0_24px_40px_-24px_rgba(59,42,36,0.7)]">
        <Image src="/images/small-forever/envelope.webp" alt="" fill sizes="260px" className="object-cover object-bottom" />
      </div>
    </div>
  );
}

/** A sealed envelope with the date it opens. */
export function SealedEnvelope({ opens, title }: { opens: string; title: string }) {
  return (
    <div className="relative mx-auto aspect-[1400/1017] w-full max-w-[280px] overflow-hidden rounded-xl shadow-[0_24px_40px_-24px_rgba(59,42,36,0.7)]">
      <Image src="/images/small-forever/envelope.webp" alt="" fill sizes="280px" className="object-cover" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#2a1d18]/75 to-transparent px-4 pb-3 pt-10 text-center text-white">
        <p className="sf-serif text-base italic">{title}</p>
        <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-white/85">Opens {opens}</p>
      </div>
    </div>
  );
}
