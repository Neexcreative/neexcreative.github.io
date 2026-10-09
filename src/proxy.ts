import { NextRequest, NextResponse } from "next/server";

/**
 * Read by /api/markdown. Set on every Markdown rewrite, overwriting or
 * removing any client-sent copy; they only select which public page is returned.
 */
const MARKDOWN_PATH_HEADER = "x-neex-markdown-path";
const MARKDOWN_QUERY_HEADER = "x-neex-markdown-query";

/** Only explicit Markdown preference opts in; wildcard and browser requests keep HTML. */
export function prefersMarkdown(accept: string) {
  const types = accept.toLowerCase().split(",").map(part => {
    const [type, ...params] = part.trim().split(";");
    const quality = params.map(p => p.trim()).find(p => p.startsWith("q="));
    const q = quality ? Number(quality.slice(2)) : 1;
    return { type, q: Number.isFinite(q) && q >= 0 && q <= 1 ? q : 0 };
  });
  const md = types.find(t => t.type === "text/markdown")?.q ?? 0;
  const html = types.find(t => t.type === "text/html")?.q ?? 0;
  return md > 0 && md >= html;
}

export function proxy(request: NextRequest) {
  if ((request.method === "GET" || request.method === "HEAD") &&
      !request.headers.has("rsc") && prefersMarkdown(request.headers.get("accept") ?? "")) {
    const url = request.nextUrl.clone();
    const path = url.pathname;
    url.pathname = "/api/markdown";
    const query = url.searchParams.get("q");
    url.search = "";
    if (query) url.searchParams.set("q", query);
    url.searchParams.set("path", path);
    // Also pass path/query as request headers: under `next start` the route
    // handler receives the original URL (/work), not the rewritten one, so the
    // query parameters above are lost and every page fell back to "/".
    const headers = new Headers(request.headers);
    headers.set(MARKDOWN_PATH_HEADER, path);
    if (query) headers.set(MARKDOWN_QUERY_HEADER, query);
    else headers.delete(MARKDOWN_QUERY_HEADER);
    const response = NextResponse.rewrite(url, { request: { headers } });
    response.headers.set("Vary", "Accept, Accept-Encoding");
    return response;
  }
  const response = NextResponse.next();
  response.headers.set("Vary", "Accept, Accept-Encoding");
  return response;
}

export const config = {
  matcher: ["/((?!api/|_next/|images/|icons/|docs/|.*\\.).*)"],
};
