import type { Metadata } from "next";
import { withSocialMetadata } from "@/lib/metadata";
import PortfolioShowcase from "@/components/sections/PortfolioShowcase";

export const metadata: Metadata = withSocialMetadata({
  title: "Work",
  description: "Selected Neex Creative projects in branding, websites, video and 3D design.",
  alternates: { canonical: "/work" },
});

export default function WorkPage() {
  return <>
    <header className="mx-auto max-w-7xl px-6 pt-20 md:px-12 md:pt-28">
      <h1 className="text-4xl font-bold tracking-tight md:text-6xl">Selected creative work.</h1>
      <p className="mt-6 max-w-2xl leading-relaxed text-muted">Explore brand identities, live websites, motion and 3D projects. Open a project to see its case study or live website. Projects still in development are marked coming soon.</p>
    </header>
    <PortfolioShowcase />
  </>;
}
