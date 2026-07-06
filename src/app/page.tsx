import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import MarqueeTicker from "@/components/MarqueeTicker";
import SelectedWork from "@/components/sections/SelectedWork";
import WebPortfolio from "@/components/sections/WebPortfolio";
import ServicesSystem from "@/components/sections/ServicesSystem";
import Journey from "@/components/sections/Journey";
import ContactCTA from "@/components/sections/ContactCTA";
import ConversionEvent from "@/components/ConversionEvent";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <ConversionEvent />
      <Hero />
      <MarqueeTicker />
      <SelectedWork />
      <WebPortfolio />
      <ServicesSystem />
      <Journey />
      <ContactCTA />
    </>
  );
}
