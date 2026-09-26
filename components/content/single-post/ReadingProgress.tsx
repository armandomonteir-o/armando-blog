"use client";

import { useEffect, useRef } from "react";

export function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = document.getElementById("main-scroll-container");
    const bar = barRef.current;
    if (!el || !bar) return;

    // Scroll-linked motion must track the scroll 1:1: no transition, at most one write per frame.
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = el.scrollHeight - el.clientHeight;
      const progress = max > 0 ? Math.min(el.scrollTop / max, 1) : 0;
      bar.style.transform = `scaleX(${progress})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="sticky top-0 z-50 w-full" style={{ height: "4px", backgroundColor: "#022a6e" }}>
      <div
        ref={barRef}
        style={{
          height: "100%",
          width: "100%",
          transform: "scaleX(0)",
          transformOrigin: "left",
          background: "linear-gradient(90deg, var(--chrome-green), #80b0ff, #c084fc)",
          boxShadow: "0 0 8px rgba(52,211,153,0.4)",
        }}
      />
    </div>
  );
}
