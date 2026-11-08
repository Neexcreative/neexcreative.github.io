/**
 * Product pages with their own header and footer (e.g. Small Forever).
 * The Neex Navbar and Footer are not rendered on these routes.
 */
const STANDALONE_PREFIXES = ["/small-forever"];

export function isStandaloneRoute(pathname: string | null) {
  if (!pathname) return false;
  return STANDALONE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}
