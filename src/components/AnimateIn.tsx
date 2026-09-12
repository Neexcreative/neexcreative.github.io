import type { ReactNode } from "react";

interface AnimateInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/** Visible server HTML; entrance motion is optional CSS, never a hydration gate. */
export default function AnimateIn({ children, delay = 0, className }: AnimateInProps) {
  return <div className={[
    "animate-in", className,
  ].filter(Boolean).join(" ")} style={{ animationDelay: delay + "s" }}>{children}</div>;
}
