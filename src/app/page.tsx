import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import MarqueeTicker from "@/components/MarqueeTicker";
import ServicesSystem from "@/components/sections/ServicesSystem";
import Journey from "@/components/sections/Journey";
import PortfolioShowcase from "@/components/sections/PortfolioShowcase";
import ContactCTA from "@/components/sections/ContactCTA";
import ConversionEvent from "@/components/ConversionEvent";
import JsonLd from "@/components/JsonLd";
import Seam from "@/components/Seam";
import { localBusinessSchema } from "@/lib/schema";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * Hybrid homepage: dark cinematic opening (hero + ticker), light
 * institutional middle (services + journey), dark portfolio centrepiece,
 * light close, dark footer. Background switches are the seams — each block
 * runs full-bleed with its own palette.
 */
export default function HomePage() {
  return (
    <>
      <ConversionEvent />
      <JsonLd data={localBusinessSchema} />
      <Hero />
      <MarqueeTicker />
      <Seam direction="darkToLight" />
      <ServicesSystem />
      <Journey palette="light" />
      <Seam direction="lightToDark" />
      <PortfolioShowcase />
      <Seam direction="darkToLight" />
      <ContactCTA palette="light" />
      <Seam direction="lightToDark" />
    </>
  );
}
