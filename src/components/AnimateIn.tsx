"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface AnimateInProps {
  children: ReactNode;
  /** Seconds to wait before the animation starts — used for staggering siblings. */
  delay?: number;
  className?: string;
}

/**
 * House fade-up reveal: opacity 0→1, y 30→0, 0.7s, ease [0.25,0.1,0.25,1].
 * Triggers once when the element enters the viewport; respects reduced motion.
 */
export default function AnimateIn({ children, delay = 0, className }: AnimateInProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}
