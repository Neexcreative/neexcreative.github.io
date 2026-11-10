import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { faqSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site-config";
import {
  sfAllPlansInclude,
  sfDeadlines,
  sfDescription,
  sfExtras,
  sfFaqs,
  sfKeywords,
  sfOgImage,
  sfPath,
  sfPlans,
  sfProductSchema,
  sfTitle,
} from "@/lib/small-forever";
import HowItWorks from "./_components/HowItWorks";
import ChristmasCountdown from "./_components/ChristmasCountdown";
import ChristmasDecor from "./_components/ChristmasDecor";
import ChatWidget from "./_components/ChatWidget";
import CheckoutButton from "./_components/CheckoutButton";
import CheckoutNotice from "./_components/CheckoutNotice";
import StorageBand from "./_components/StorageBand";
import PlansViewTracker from "./_components/PlansViewTracker";
import Testimonials from "./_components/Testimonials";
import { sans, serif, sfBaseCss } from "./fonts";
import CookieSettingsButton from "@/components/CookieSettingsButton";
import { sfLegalPaths } from "@/lib/sf-legal";
import { KeepsakeDrive, Laptop, OpenLetter, SealedEnvelope } from "./_components/Mockups";

const ogTitle = "Small Forever · Their small years, kept for a lifetime";

export const metadata: Metadata = {
  title: { absolute: sfTitle },
  description: sfDescription,
  keywords: sfKeywords,
  alternates: { canonical: sfPath },
  category: "Baby keepsakes",
  robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: "Small Forever by Neex Creative",
    url: sfPath,
    title: ogTitle,
    description: sfDescription,
    images: [{ url: sfOgImage, width: 1200, height: 630, alt: "Small Forever: a keepsake of your child's first years" }],
  },
  twitter: {
    card: "summary_large_image",
    title: ogTitle,
    description: sfDescription,
    images: [sfOgImage],
  },
};

function whatsapp(message: string) {
  return `${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}

const insideCards = [
  {
    visual: "laptop",
    title: "The timeline",
    text: "Plug in the drive and every photo and video is there, in order, with their age on each one.",
  },
  {
    visual: "letter",
    title: "Letters to the future",
    text: "Write to them now. Each letter stays sealed until the day you choose.",
  },
  {
    visual: "audio",
    title: "Their voice",
    text: "First laughs, first words and messages from the grandparents, in a player they can press any day.",
  },
  {
    visual: "sealed",
    title: "Waiting for them",
    text: "Some envelopes won't open for years. That's the point.",
  },
] as const;

/** The story told forward: what happens with the drive over the years. */
const future = [
  { when: "Today", title: "You send their moments", text: "Straight from your phone. We put everything in order." },
  { when: "Their 5th birthday", title: "The first letter opens", text: "You read it together, on the sofa, from the drive." },
  { when: "First day of school", title: "Another one unlocks", text: "Words you wrote when they were still learning to walk." },
  { when: "Their 18th birthday", title: "They plug it in themselves", text: "And find their whole beginning, in your voice and theirs." },
];

/**
 * Founder photo. Save an over-the-shoulder photo of a parent holding a child
 * in front of the laptop as /public/images/small-forever/founder.jpg and set
 * this to that path. Until then the laptop mockup is shown.
 */
const founderPhoto: string | null = "/images/small-forever/founder-timeline-2024.webp";

/* ── look ────────────────────────────────────────────────────────────── */
const label = "text-xs font-semibold uppercase tracking-[0.2em] text-[#8e5a52]";
const pillPrimary =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#7a2e2a] px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#62231f]";
const pillSecondary =
  "inline-flex items-center justify-center gap-2 rounded-full border border-[#3b2a24]/25 px-7 py-3.5 text-[15px] font-semibold text-[#3b2a24] transition-colors hover:border-[#3b2a24] hover:bg-white";

/** Small Forever: soft keepsake landing, blending an heirloom-print look with a gift-first flow. */
export default function SmallForeverPage() {
  return (
    <div className={`${serif.variable} ${sans.variable} sf-root bg-[#fbf7f2] text-[#3b2a24]`}>
      <style>{sfBaseCss}</style>
      <JsonLd data={sfProductSchema()} />
      <JsonLd data={faqSchema(sfFaqs)} />

      {/* Christmas promo bar. */}
      <a
        href="#christmas"
        className="block bg-[#7a2e2a] px-4 py-2.5 text-center text-[13px] text-white transition-colors hover:bg-[#62231f]"
      >
        <span className="sf-serif italic">Christmas delivery:</span> order and send your photos by 4 December ·
        gift vouchers until 24 December <span aria-hidden>→</span>
      </a>

      {/* Header: centred wordmark between thin rules. */}
      <header className="border-b border-[#e8d9cf]">
        <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-5 md:px-10">
          <nav aria-label="Small Forever" className="hidden gap-6 text-sm md:flex">
            <a href="#how" className="text-[#6f5a52] hover:text-[#3b2a24]">How it works</a>
            <a href="#plans" className="text-[#6f5a52] hover:text-[#3b2a24]">Plans</a>
            <a href="#faq" className="text-[#6f5a52] hover:text-[#3b2a24]">FAQ</a>
          </nav>
          <a href="#top" className="col-start-2 text-center" aria-label="Small Forever, back to top">
            <span className="block whitespace-nowrap border-y border-[#3b2a24]/40 px-2 py-1 text-[12px] font-medium tracking-[0.32em] md:px-3 md:text-sm md:tracking-[0.42em]">
              SMALL FOREVER
            </span>
          </a>
          <div className="col-start-3 flex justify-end">
            <a
              href="#plans"
              className="whitespace-nowrap rounded-full bg-[#3b2a24] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#2a1d18] md:px-5"
            >
              Give a gift
            </a>
          </div>
        </div>
      </header>

      <main id="top">
        {/* Hero. */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-12 md:grid-cols-[1.05fr_1fr] md:px-10 md:pb-24 md:pt-20">
          <div>
            <p className={label}>The keepsake for their first years</p>
            <h1 className="sf-serif mt-5 text-[2.75rem] leading-[1.04] sm:text-6xl md:text-[4.25rem]">
              Their small years, <em className="text-[#7a2e2a]">kept for a lifetime.</em>
            </h1>
            <p className="mt-6 max-w-md text-[17px] leading-relaxed text-[#6f5a52]">
              Photos, videos and their little voice, gathered into one private timeline, with
              letters that open on the right day in the future. Delivered on a keepsake drive.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#plans" className={pillPrimary}>
                Give it as a gift · from €149
              </a>
              <a href="#how" className={pillSecondary}>
                For my own family
              </a>
            </div>
            <p className="mt-6 text-sm text-[#6f5a52]">No app · No subscription · Frees up your phone · Made in Dublin</p>
          </div>

          {/* A family gathered around the laptop, with the keepsake drive. */}
          <div className="relative mx-auto w-full max-w-[560px] pb-8">
            <div className="overflow-hidden rounded-[2.25rem] shadow-[0_40px_80px_-40px_rgba(59,42,36,0.55)]">
              <Image
                src="/images/small-forever/hero-family.webp"
                alt="Three generations of a family smiling together around a laptop, watching their Small Forever"
                width={1448}
                height={1086}
                priority
                sizes="(min-width: 768px) 560px, 100vw"
                className="h-auto w-full"
              />
            </div>
            <KeepsakeDrive className="absolute -bottom-2 right-1 w-[30%] drop-shadow-[0_14px_18px_rgba(59,42,36,0.4)] md:-right-8" />
          </div>
        </section>

        {/* Manifesto: a premium dark band with a wax seal and gold rules. */}
        <section className="relative overflow-hidden bg-[#3a2722] text-[#fbf2ea]">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden
            style={{
              background:
                "radial-gradient(60% 80% at 50% 0%, rgba(226,201,143,0.16), transparent 70%), radial-gradient(40% 60% at 50% 110%, rgba(242,196,180,0.10), transparent 70%)",
            }}
          />
          <div className="relative mx-auto max-w-4xl px-5 py-12 text-center md:py-16">
            <div className="flex items-center justify-center gap-5" aria-hidden>
              <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#e2c98f]/70 md:w-28" />
              <Image
                src="/images/small-forever/seal.webp"
                alt=""
                width={276}
                height={276}
                sizes="72px"
                className="h-12 w-12 drop-shadow-[0_10px_16px_rgba(0,0,0,0.45)] md:h-14 md:w-14"
              />
              <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#e2c98f]/70 md:w-28" />
            </div>
            <p className="sf-serif mt-6 text-[2rem] leading-[1.12] md:text-[3.2rem]">
              They&apos;ll only be this small once.
              <br />
              <em className="text-[#f2c4b4]">Keep it somewhere that lasts.</em>
            </p>
            <p className="mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed text-[#e6d5cb]">
              Thousands of videos on your phone, and not one you&apos;ll find in ten years. Small
              Forever gathers them into one place that belongs to your family, waiting for the day
              they plug it in and meet their younger self.
            </p>
            <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#e2c98f]">
              Made with care in Dublin
            </p>
          </div>
        </section>

        <StorageBand />

        {/* How it works: gift / family switch. */}
        <section id="how" className="scroll-mt-6">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-24">
            <div className="text-center">
              <p className={label}>How it works</p>
              <h2 className="sf-serif mt-4 text-4xl md:text-5xl">Simple for you. Precious for them.</h2>
            </div>
            <div className="mt-10">
              <HowItWorks />
            </div>
          </div>
        </section>

        {/* What's inside: product-card grid on blush. */}
        <section className="bg-[#f5e8e1]">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-24">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className={label}>What&apos;s inside</p>
                <h2 className="sf-serif mt-4 text-4xl md:text-5xl">Not a folder of files. Their story.</h2>
              </div>
              <a href="#plans" className="text-sm font-medium text-[#6f5a52] underline underline-offset-4 hover:text-[#3b2a24]">
                See plans and prices
              </a>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {insideCards.map((card) => (
                <article key={card.title} className="group rounded-3xl bg-[#fbf7f2] p-3 pb-5">
                  <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-2xl bg-[#ead3c8] p-5">
                    {card.visual === "laptop" && (
                      <Image
                        src="/images/small-forever/laptop-moment.webp"
                        alt="A mother opens her daughter's Small Forever on a laptop"
                        fill
                        sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    )}
                    {card.visual === "letter" && <OpenLetter />}
                    {card.visual === "audio" && (
                      <div className="h-full overflow-hidden rounded-2xl shadow-[0_20px_40px_-20px_rgba(30,20,15,0.6)] transition-transform duration-500 group-hover:scale-[1.03]">
                        <Image
                          src="/images/small-forever/voice-first-laugh.webp"
                          alt="A voice recording in the player: First laugh, a little girl laughing as she plays with a blanket"
                          width={690}
                          height={1090}
                          sizes="200px"
                          className="h-full w-auto"
                        />
                      </div>
                    )}
                    {card.visual === "sealed" && (
                      <div className="w-full transition-transform duration-500 group-hover:-rotate-2">
                        <SealedEnvelope title="For your 18th birthday" opens="1 December 2041" />
                      </div>
                    )}
                  </div>
                  <h3 className="sf-serif mt-4 px-2 text-2xl">{card.title}</h3>
                  <p className="mt-1 px-2 text-[15px] leading-relaxed text-[#6f5a52]">{card.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* The future: what the drive becomes over the years. */}
        <section className="bg-[#fbf7f2]">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-24">
            <div className="text-center">
              <p className={label}>Eighteen years from now</p>
              <h2 className="sf-serif mx-auto mt-4 max-w-3xl text-4xl md:text-5xl">
                One day, <em className="text-[#7a2e2a]">they&apos;ll open it themselves.</em>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-[#6f5a52]">
                A small drive on a shelf, quietly waiting. Every few years another letter unlocks,
                until the day they plug it in on their own.
              </p>
            </div>
            <ol className="relative mt-14 grid gap-10 md:grid-cols-4 md:gap-6">
              <span className="absolute left-0 right-0 top-[11px] hidden h-px bg-gradient-to-r from-[#e2c98f]/0 via-[#c9a96e] to-[#e2c98f]/0 md:block" aria-hidden />
              {future.map((step, i) => (
                <li key={step.when} className="relative text-center">
                  <span
                    className={`relative mx-auto block h-[22px] w-[22px] rounded-full border-2 ${
                      i === future.length - 1 ? "border-[#7a2e2a] bg-[#7a2e2a]" : "border-[#c9a96e] bg-[#fbf7f2]"
                    }`}
                    aria-hidden
                  />
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#8e5a52]">{step.when}</p>
                  <h3 className="sf-serif mt-2 text-2xl">{step.title}</h3>
                  <p className="mx-auto mt-2 max-w-[15rem] text-[15px] leading-relaxed text-[#6f5a52]">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Christmas. */}
        <section id="christmas" className="relative scroll-mt-6 overflow-hidden bg-[#26382d] text-white">
          <ChristmasDecor />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-28 md:grid-cols-[1.1fr_1fr] md:px-10 md:pb-24 md:pt-32">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e2c98f]">Christmas 2026</p>
              <h2 className="sf-serif mt-4 text-4xl leading-tight md:text-6xl">
                The gift they&apos;ll open again <em className="text-[#e2c98f]">in 18 years.</em>
              </h2>
              <p className="mt-6 max-w-md text-[17px] leading-relaxed text-[#e9dcc3]">
                For new parents, grandchildren and godchildren. Order in time for it to arrive
                under the tree, or give a voucher today and we&apos;ll make it together in January.
              </p>
              <div className="mt-8">
                <ChristmasCountdown />
              </div>
            </div>
            <div>
              <ul className="divide-y divide-white/15 rounded-3xl border border-white/15 bg-[#1d2c23]/70 backdrop-blur-sm">
                {sfDeadlines.map((d) => (
                  <li key={d.date} className="flex items-center gap-5 px-6 py-5">
                    <time dateTime={d.iso} className="sf-serif w-24 shrink-0 whitespace-nowrap text-3xl text-[#e2c98f]">
                      {d.date}
                    </time>
                    <span className="text-sm leading-relaxed text-[#f3eadb]">{d.text}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-3xl bg-[#fbf7f2] p-6 text-[#3b2a24]">
                <p className="sf-serif text-2xl">Last-minute? Give the voucher.</p>
                <p className="mt-2 text-sm leading-relaxed text-[#6f5a52]">
                  Paid today, printable, valid for 5 years. They send their moments when
                  they&apos;re ready.
                </p>
                <a href="#plans" className={`${pillPrimary} mt-5 w-full sm:w-auto`}>
                  Choose a gift voucher
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Plans. */}
        <section id="plans" className="scroll-mt-6">
          <PlansViewTracker targetId="plans" />
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-24">
            <div className="text-center">
              <p className={label}>Plans for every family</p>
              <h2 className="sf-serif mt-4 text-4xl md:text-5xl">Pay once. Keep it for life.</h2>
              <p className="mx-auto mt-4 max-w-lg text-[17px] text-[#6f5a52]">
                One final price, with the drive and delivery in Ireland included. Nothing is added at checkout, and gift vouchers cost the same.
              </p>
            </div>

            {/* The two ways to buy, side by side, so nobody picks the wrong path for Christmas. */}
            <div className="mx-auto mt-8 grid max-w-3xl gap-3 text-left text-[15px] leading-snug sm:grid-cols-2">
              <p className="rounded-2xl bg-[#f5e8e1] px-5 py-4">
                <strong className="block text-[#7a2e2a]">Gift voucher</strong>
                Buy today, we make it together in January. Valid for 5 years.
              </p>
              <p className="rounded-2xl bg-[#f5e8e1] px-5 py-4">
                <strong className="block text-[#7a2e2a]">Order for my family</strong>
                Delivered before Christmas if your photos and videos reach us by the cut-off date.
              </p>
            </div>

            <div className="mt-10">
              <CheckoutNotice />
            </div>

            <div className="mt-2 grid gap-6 lg:grid-cols-3">
              {sfPlans.map((plan) => (
                <div
                  key={plan.key}
                  className={`relative flex flex-col rounded-3xl border p-7 md:p-8 ${
                    plan.recommended
                      ? "border-[#3a2722] bg-[#3a2722] text-[#fbf2ea] shadow-[0_30px_60px_-30px_rgba(58,39,34,0.7)]"
                      : "border-[#e8d9cf] bg-white"
                  }`}
                >
                  {plan.recommended && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#e2c98f] px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#3a2722]">
                      Our favourite
                    </span>
                  )}
                  <h3 className="sf-serif text-3xl">{plan.name}</h3>
                  <p className={`mt-1 text-sm ${plan.recommended ? "text-[#e6d5cb]" : "text-[#6f5a52]"}`}>{plan.tagline}</p>
                  <p className="sf-serif mt-5 text-5xl">€{plan.price}</p>
                  <ul className="mt-6 flex-1 space-y-3 text-[15px]">
                    {plan.features.map((f) => (
                      <li key={f} className="flex gap-3">
                        <span className={plan.recommended ? "text-[#e2c98f]" : "text-[#7a2e2a]"} aria-hidden>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-col gap-2.5">
                    <CheckoutButton
                      plan={plan.key}
                      planName={plan.name}
                      price={plan.price}
                      orderType="gift"
                      fallbackHref={whatsapp(`Hi! I'd like to give a Small Forever ${plan.name} gift voucher (€${plan.price}).`)}
                      className={`w-full ${
                        plan.recommended
                          ? "inline-flex items-center justify-center rounded-full bg-[#e2c98f] px-7 py-3.5 text-[15px] font-semibold text-[#3a2722] transition-colors hover:bg-[#ecd8a8]"
                          : pillPrimary
                      }`}
                    >
                      Give as a gift
                    </CheckoutButton>
                    <CheckoutButton
                      plan={plan.key}
                      planName={plan.name}
                      price={plan.price}
                      orderType="family"
                      fallbackHref={whatsapp(`Hi! I'd like to order Small Forever ${plan.name} (€${plan.price}) for my family.`)}
                      className={`w-full ${
                        plan.recommended
                          ? "inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:border-white"
                          : pillSecondary
                      }`}
                    >
                      Order for my family
                    </CheckoutButton>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-center text-sm text-[#6f5a52]">
              Before payment you&apos;ll confirm our{" "}
              <Link href={sfLegalPaths.terms} className="underline underline-offset-2 hover:text-[#3b2a24]">Terms of Sale</Link> and{" "}
              <Link href={sfLegalPaths.privacy} className="underline underline-offset-2 hover:text-[#3b2a24]">Privacy Notice</Link>.
              Read about your{" "}
              <Link href={sfLegalPaths.cancellation} className="underline underline-offset-2 hover:text-[#3b2a24]">right to cancel</Link>.
            </p>

            <div className="mt-10 grid gap-8 rounded-3xl bg-[#e3e9dc] p-7 md:grid-cols-[1.4fr_1fr] md:p-10">
              <div>
                <h3 className="sf-serif text-2xl">Every plan includes</h3>
                <ul className="mt-4 grid gap-x-6 gap-y-2.5 text-[15px] sm:grid-cols-2">
                  {sfAllPlansInclude.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="text-[#4f6b52]" aria-hidden>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="sf-serif text-2xl">Add a little more</h3>
                <ul className="mt-4 space-y-2.5 text-[15px]">
                  {sfExtras.map((e) => (
                    <li key={e.name} className="flex justify-between gap-4 border-b border-[#3b2a24]/10 pb-2.5">
                      <span>{e.name}</span>
                      <span className="font-semibold">€{e.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Founder note, set like an editorial quote. */}
        <section className="bg-[#f5e8e1]">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-[1.15fr_1fr] md:px-10 md:py-24">
            {founderPhoto ? (
              <div className="relative aspect-[3/2] overflow-hidden rounded-3xl shadow-[0_30px_60px_-40px_rgba(59,42,36,0.5)]">
                <Image
                  src={founderPhoto}
                  alt="Marina's Small Forever open on a laptop: her 2024 timeline, with her age under every video"
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="px-[8%]">
                <Laptop alt="The opening screen of Marina's Small Forever on a laptop" sizes="(min-width: 768px) 40vw, 90vw" />
              </div>
            )}
            <figure>
              <p className={label}>Why it exists</p>
              <blockquote className="sf-serif mt-5 text-3xl leading-snug md:text-4xl">
                &ldquo;I made the first one for my daughter, Marina. I wanted her to see where she
                came from, in a way that wouldn&apos;t disappear with the next phone.&rdquo;
              </blockquote>
              <figcaption className="mt-6 text-sm text-[#6f5a52]">Marlon, dad and founder · Neex Creative, Dublin</figcaption>
            </figure>
          </div>
        </section>

        {/* Promise: dark cocoa band. */}
        <section className="bg-[#2e201c] text-[#fbf2ea]">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-24">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#e2c98f]">Our promise</p>
            <h2 className="sf-serif mx-auto mt-4 max-w-2xl text-center text-4xl md:text-5xl">
              We don&apos;t trust one drive with your memories.
            </h2>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[
                { t: "Yours, outright", d: "No app, no account, no monthly fee. It opens in any browser, with or without internet." },
                { t: "A backup plan in the box", d: "Our 3-2-1 guide shows you how to keep three copies in two places, so no single failure can take them away." },
                { t: "Private by design", d: "A family password on the opening screen. We delete our working copy of your files 30 days after delivery." },
              ].map((item) => (
                <div key={item.t} className="rounded-3xl border border-white/10 bg-[#3a2a24] p-7">
                  <h3 className="sf-serif text-2xl">{item.t}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#e6d5cb]">{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Real, authorised testimonials only. Renders nothing while the list is empty. */}
        <Testimonials />

        {/* FAQ. */}
        <section id="faq" className="scroll-mt-6">
          <div className="mx-auto max-w-3xl px-5 py-16 md:py-24">
            <h2 className="sf-serif text-center text-4xl md:text-5xl">Questions, answered</h2>
            <div className="mt-10 divide-y divide-[#e8d9cf] border-y border-[#e8d9cf]">
              {sfFaqs.map((faq) => (
                <details key={faq.question} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                    <h3 className="sf-serif text-xl md:text-2xl">{faq.question}</h3>
                    <span className="text-2xl text-[#7a2e2a] transition-transform duration-300 group-open:rotate-45" aria-hidden>
                      +
                    </span>
                  </summary>
                  <p className="pb-6 text-[15px] leading-relaxed text-[#6f5a52]">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Closing. */}
        <section className="bg-[#7a2e2a] text-white">
          <div className="mx-auto max-w-4xl px-5 py-20 text-center md:py-28">
            <h2 className="sf-serif text-4xl leading-tight md:text-6xl">
              They grow up fast. <em className="text-[#f2d9b8]">Keep it.</em>
            </h2>
            <p className="mx-auto mt-5 max-w-md text-[17px] leading-relaxed text-white/85">
              Questions first? Message us and we&apos;ll show you a real Small Forever.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="#plans"
                className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-[#7a2e2a] hover:bg-[#fbf7f2]"
              >
                Choose a plan · from €149
              </a>
              <a
                href={whatsapp("Hi! I have a question about Small Forever.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-white/40 px-7 py-3.5 text-[15px] font-semibold text-white hover:border-white"
              >
                Ask on WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Minimal footer. */}
      <footer className="bg-[#2e201c] text-[#e6d5cb]">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 text-sm md:flex-row md:items-center md:justify-between md:px-10">
          <p>
            <span className="tracking-[0.3em] text-white">SMALL FOREVER</span> · by{" "}
            <Link href="/" className="underline underline-offset-4 hover:text-white">Neex Creative</Link>, Dublin
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a href={`mailto:${siteConfig.email}?subject=Small%20Forever`} className="hover:text-white">{siteConfig.email}</a>
            <a href={whatsapp("Hi! I have a question about Small Forever.")} target="_blank" rel="noopener noreferrer" className="hover:text-white">
              WhatsApp
            </a>
            <Link href={sfLegalPaths.terms} className="hover:text-white">Terms of Sale</Link>
            <Link href={sfLegalPaths.privacy} className="hover:text-white">Privacy</Link>
            <Link href={sfLegalPaths.cancellation} className="hover:text-white">Cancellation</Link>
            <CookieSettingsButton />
          </div>
        </div>
      </footer>

      <ChatWidget whatsappUrl={siteConfig.whatsapp} faqs={sfFaqs} />
    </div>
  );
}
