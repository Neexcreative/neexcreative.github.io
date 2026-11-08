"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { isStandaloneRoute } from "@/lib/standalone-routes";

/** Renders its children everywhere except on standalone product routes. */
export default function HideOnStandalone({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (isStandaloneRoute(pathname)) return null;
  return <>{children}</>;
}
