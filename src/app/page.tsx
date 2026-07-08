import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import MarqueeTicker from "@/components/MarqueeTicker";
import ServicesSystem from "@/components/sections/ServicesSystem";
import Journey from "@/components/sections/Journey";
import PortfolioShowcase from "@/components/sections/PortfolioShowcase";
import ContactCTA from "@/components/sections/ContactCTA";
import ConversionEvent from "@/components/ConversionEvent";
import JsonLd from "@/components/JsonLd";
import { localBusinessSchema } from "@/lib/schema";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * Hybrid homepage: one dark cinematic block (hero + ticker + portfolio),
 * one light institutional block (services + journey + CTA), dark footer.
 * Palette changes are clean hard cuts — no transition bands.
 */
export default function HomePage() {
  return (
    <>
      <ConversionEvent />
      <JsonLd data={localBusinessSchema} />
      <Hero />
      <MarqueeTicker />
      <PortfolioShowcase />
      <ServicesSystem />
      <Journey palette="light" />
      <ContactCTA palette="light" />
    </>
  );
}
