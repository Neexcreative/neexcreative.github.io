import Image from "next/image";
import StorageNotice from "./StorageNotice";

/**
 * "Storage full" band: the everyday pain of a phone filled with baby photos
 * and videos, right after the emotional manifesto and before How it works.
 * Half the band is a real photo; the animated notification card is a generic
 * illustration (no real OS interface).
 */

const benefits = [
  { t: "Free up space", d: "with peace of mind, once your copy is safe." },
  { t: "Every moment kept", d: "in order, with their age on each one." },
  { t: "Nothing to sort", d: "send it all, just as it is on your phone." },
];

export default function StorageBand() {
  return (
    <section className="bg-[#f5e8e1] md:grid md:grid-cols-2" aria-labelledby="storage-title">
      {/* Photo: a mother and daughter taking a selfie, on the phone that's always full. */}
      <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[600px]">
        <Image
          src="/images/small-forever/storage-selfie.webp"
          alt="A mother takes a selfie while her little daughter hugs and kisses her"
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover object-[45%_center]"
        />
        <StorageNotice className="absolute bottom-3 right-3 w-[212px] rounded-2xl bg-white/95 p-3 shadow-[0_14px_30px_-12px_rgba(30,20,15,0.55)] backdrop-blur md:bottom-auto md:left-8 md:right-auto md:top-8 md:w-[260px]" />
      </div>

      <div className="flex items-center px-5 py-12 md:px-12 md:py-16 lg:px-16">
        <div className="max-w-xl">
          <h2 id="storage-title" className="sf-serif text-[2.1rem] leading-[1.1] md:text-[2.6rem] lg:text-[2.9rem]">
            Your phone is full of them. <em className="text-[#7a2e2a]">Give them a better home.</em>
          </h2>
          <p className="mt-5 text-[17px] leading-relaxed text-[#6f5a52]">
            First smiles, bath times, the same giggle filmed ten times. Every week there are a hundred more, until
            the phone says it&apos;s full and asks you what to delete. Send them to us instead: we turn them into
            their Small Forever, and your phone can finally breathe again.
          </p>
          <ul className="mt-7 grid gap-4 sm:grid-cols-3">
            {benefits.map((b) => (
              <li key={b.t} className="border-t border-[#3b2a24]/15 pt-3 text-[15px] leading-snug">
                <span className="block font-semibold text-[#3b2a24]">{b.t}</span>
                <span className="text-[#6f5a52]">{b.d}</span>
              </li>
            ))}
          </ul>
          <a
            href="#how"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#3b2a24]/25 px-6 py-3 text-[15px] font-semibold text-[#3b2a24] transition-colors hover:border-[#3b2a24] hover:bg-white"
          >
            See how it works <span aria-hidden>↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
