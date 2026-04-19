"use client";

import { useState, useEffect } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = document.getElementById("main-scroll-container");
    if (!el) return;
    const handleScroll = () => {
      const scrollHeight = el.scrollHeight - el.clientHeight;
      setProgress(scrollHeight > 0 ? Math.min((el.scrollTop / scrollHeight) * 100, 100) : 0);
    };
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="sticky top-0 z-50 w-full" style={{ height: "4px", backgroundColor: "#022a6e" }}>
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          background: "linear-gradient(90deg, #4ade80, #80b0ff, #c084fc)",
          transition: "width 0.15s ease-out",
          boxShadow: "0 0 8px rgba(74, 222, 128, 0.4)",
        }}
      />
    </div>
  );
}
