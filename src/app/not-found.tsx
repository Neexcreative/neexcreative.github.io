import Link from "next/link";

export default function NotFound() {
  return <section className="mx-auto max-w-3xl px-6 py-24">
    <h1 className="text-4xl font-bold">404: Page not found</h1>
    <p className="mt-6 text-muted">This address does not match an available page. Explore Neex Creative using the links below.</p>
    <nav aria-label="Page recovery" className="mt-8 flex flex-wrap gap-6 underline underline-offset-4">
      <Link href="/">Home</Link><Link href="/services">Services</Link><Link href="/work">Work</Link><Link href="/contact">Contact</Link>
      <a href="/sitemap.xml">Sitemap</a><a href="/llms.txt">Agent guide</a>
    </nav>
  </section>;
}
