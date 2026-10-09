import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";
import { siteGraphSchema } from "@/lib/schema";
import JsonLd from "@/components/JsonLd";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GoogleTag from "@/components/GoogleTag";
import CookieBanner from "@/components/CookieBanner";

/** Body, labels, nav, UI. Variable font, all weights available, we use 400/500. */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/** Headings only, 600 to 700. */
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Creative Agency Dublin | Brand Systems, Web & Video | Neex Creative",
    template: "%s | Neex Creative",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "Creative Agency Dublin | Brand Systems, Web & Video | Neex Creative",
    description: siteConfig.description,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Creative Agency Dublin | Brand Systems, Web & Video | Neex Creative",
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-bg text-text">
        <JsonLd data={siteGraphSchema} />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />

        {/* Single Google tag (GA4 + Google Ads), loaded only after consent. */}
        <GoogleTag />
        <CookieBanner />
      </body>
    </html>
  );
}
