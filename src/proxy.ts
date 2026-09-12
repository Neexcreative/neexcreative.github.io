import { NextRequest, NextResponse } from "next/server";

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
    const response = NextResponse.rewrite(url);
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
