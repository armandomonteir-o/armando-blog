"use client";

import { MotionConfig } from "motion/react";

// With the OS "reduce motion" setting on, motion/react skips transform and layout
// animations and keeps opacity and color ones.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
