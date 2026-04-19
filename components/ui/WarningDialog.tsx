"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";

export function WarningDialog() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <GlassCard
      className="flex-shrink-0 w-full sm:w-auto"
      style={{
        border: "3px solid var(--arm-border)",
        boxShadow: "4px 4px 0 var(--arm-shadow)",
        width: "180px",
        background: "var(--arm-bg-glass)",
        backdropFilter: "blur(12px)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translate(-2px, -2px)";
        e.currentTarget.style.boxShadow = "6px 6px 0 var(--arm-shadow)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translate(0, 0)";
        e.currentTarget.style.boxShadow = "4px 4px 0 var(--arm-shadow)";
      }}
    >
      <div
        className="px-2 py-1 flex items-center justify-between"
        style={{
          backgroundColor: "var(--arm-bg-glass-title)",
          borderBottom: "2px solid var(--arm-border)",
          backdropFilter: "blur(8px)",
        }}
      >
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "9px",
            fontWeight: 700,
            color: "var(--arm-text)",
          }}
        >
          WARNING: REALITY!
        </span>
        <div className="w-3 h-3" style={{ backgroundColor: "#e05050", border: "1.5px solid var(--arm-border)" }} />
      </div>
      <div className="p-3 text-center">
        <div
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: "14px",
            color: "var(--arm-text)",
            lineHeight: 1.2,
          }}
        >
          DO YOU WISH<br />TO GO BACK?
        </div>
        <div className="flex gap-2 mt-2 justify-center">
          <button
            className="px-3 py-1 cursor-pointer"
            style={{
              border: "2px solid var(--arm-border)",
              backgroundColor: "var(--arm-bg-glass-highlight)",
              fontFamily: "'Space Mono', monospace",
              fontSize: "9px",
              fontWeight: 700,
              color: "var(--arm-text)",
              backdropFilter: "blur(4px)",
            }}
            onClick={() => setDismissed(true)}
          >
            CONTINUE
          </button>
          <button
            className="px-3 py-1 cursor-pointer"
            style={{
              border: "2px solid var(--arm-border)",
              backgroundColor: "var(--arm-bg-glass-highlight)",
              fontFamily: "'Space Mono', monospace",
              fontSize: "9px",
              fontWeight: 700,
              color: "var(--arm-text)",
              backdropFilter: "blur(4px)",
            }}
            onClick={() => setDismissed(true)}
          >
            CANCEL
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
