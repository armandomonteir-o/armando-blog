"use client";

import { useState, useEffect } from "react";
import { Clock, Eye } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

interface TocSection {
  id: string;
  title: string;
}

interface TableOfContentsProps {
  sections: TocSection[];
  readTime: string;
  reads: number;
}

export function TableOfContents({ sections, readTime, reads }: TableOfContentsProps) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const scrollContainer = document.getElementById("main-scroll-container");
    if (!scrollContainer) return;
    const handleScroll = () => {
      let current = sections[0]?.id ?? "";
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el && el.getBoundingClientRect().top <= 120) current = section.id;
      }
      setActiveSection(current);
    };
    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [sections]);

  return (
    <GlassCard
      className="sticky top-6"
      style={{
        border: "3px solid var(--arm-border)",
        boxShadow: "4px 4px 0 var(--arm-shadow)",
        background: "var(--arm-bg-glass)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div
        className="px-3 py-1.5 flex items-center justify-between"
        style={{
          backgroundColor: "var(--arm-bg-glass-title)",
          borderBottom: "2px solid var(--arm-border)",
        }}
      >
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "9px",
            fontWeight: 700,
            color: "var(--arm-text)",
            letterSpacing: "0.05em",
          }}
        >
          SUMARIO.EXE
        </span>
        <div className="flex gap-1">
          <div
            className="w-2.5 h-2.5"
            style={{
              border: "1.5px solid var(--arm-border)",
              backgroundColor: "var(--arm-bg-card-title)",
            }}
          />
          <div
            className="w-2.5 h-2.5"
            style={{ backgroundColor: "#e05050", border: "1.5px solid var(--arm-border)" }}
          />
        </div>
      </div>
      <div className="p-4">
        <div
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: "13px",
            color: "var(--arm-text)",
            marginBottom: "12px",
          }}
        >
          Neste Post
        </div>
        <nav className="flex flex-col gap-1">
          {sections.map((section, i) => {
            const isActive = activeSection === section.id;
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-start gap-2 px-2 py-1.5 transition-all"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" });
                }}
                style={{
                  backgroundColor: isActive ? "rgba(3,71,193,0.1)" : "transparent",
                  border: isActive ? "1px solid rgba(3,71,193,0.2)" : "1px solid transparent",
                  textDecoration: "none",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "9px",
                    fontWeight: 700,
                    color: isActive ? "var(--arm-blue)" : "var(--arm-text-secondary)",
                    minWidth: "16px",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "12px",
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "var(--arm-text)" : "var(--arm-text-secondary)",
                    lineHeight: 1.3,
                  }}
                >
                  {section.title}
                </span>
              </a>
            );
          })}
        </nav>

        <div
          className="mt-4 pt-3 flex items-center gap-3"
          style={{ borderTop: "1px solid rgba(2,42,110,0.15)" }}
        >
          <div className="flex items-center gap-1" style={{ color: "#5a6a8e" }}>
            <Clock size={11} />
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px" }}>
              {readTime}
            </span>
          </div>
          <div className="flex items-center gap-1" style={{ color: "#5a6a8e" }}>
            <Eye size={11} />
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px" }}>{reads}</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
