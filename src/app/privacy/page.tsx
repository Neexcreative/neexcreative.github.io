import type { Metadata } from "next";
import { withSocialMetadata } from "@/lib/metadata";
import { privacySections } from "@/lib/privacy-content";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = withSocialMetadata({
  title: "Privacy",
  description: "How to contact Neex Creative about personal information, project enquiries and website services.",
  alternates: { canonical: "/privacy" },
});

export default function PrivacyPage() {
  return <article className="mx-auto max-w-3xl px-6 py-20 md:py-28">
    <h1 className="text-4xl font-bold tracking-tight md:text-6xl">Privacy notice</h1>
    {privacySections.map(section => <section key={section.title} className="mt-10">
      <h2 className="text-2xl font-semibold">{section.title}</h2>
      <p className="mt-4 leading-relaxed text-muted">{section.text}</p>
    </section>)}
    <a className="mt-8 inline-block underline underline-offset-4" href={`mailto:${siteConfig.email}`}>Contact us about privacy</a>
  </article>;
}
