"use client";

import { BookOpen, Film, Headphones, Podcast, Brain, Code } from "lucide-react";
import { WavyText } from "@/components/ui/WavyText";
import { RetroWindow } from "@/components/ui/RetroWindow";

const recommendations = [
  { icon: Headphones, title: "Synthwave Retro", author: "FM-84", type: "Música" },
  { icon: Film, title: "Ghost in the Shell", author: "Mamoru Oshii", type: "Filme" },
  { icon: BookOpen, title: "Neuromancer", author: "William Gibson", type: "Livro" },
  { icon: Brain, title: "O Mito de Sísifo", author: "Albert Camus", type: "Filosofia" },
  { icon: Code, title: "Creative Coding", author: "Generative Art", type: "Estudo" },
  { icon: Podcast, title: "Arte & Código", author: "Podcast EP.42", type: "Podcast" },
];

export function SideContent() {
  return (
    <RetroWindow title="RECOMMENDED.EXE" variant="glass" className="h-full">
      <div className="p-4">
        <WavyText
          text="RECOMENDAÇÕES"
          variant="linear-wave"
          fontSize={18}
          amplitude={4}
          frequency={0.2}
          color="var(--arm-text)"
        />

        <div className="flex flex-col gap-2.5 mt-3">
          {recommendations.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-2.5 cursor-pointer"
              style={{
                border: "2px solid var(--arm-border)",
                backgroundColor: i % 2 === 0 ? "var(--arm-bg)" : "var(--arm-bg-card-title)",
                boxShadow: "2px 2px 0 var(--arm-shadow)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translate(-2px, -2px)";
                e.currentTarget.style.boxShadow = "4px 4px 0 var(--arm-shadow)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translate(0, 0)";
                e.currentTarget.style.boxShadow = "2px 2px 0 var(--arm-shadow)";
              }}
            >
              <div
                className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                style={{
                  border: "2px solid var(--arm-border)",
                  backgroundColor: i % 2 === 0 ? "var(--arm-blue)" : "#4ade80",
                  color: i % 2 === 0 ? "#fff" : "var(--arm-text)",
                }}
              >
                <item.icon size={14} strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: "12px",
                    lineHeight: 1.3,
                    color: "var(--arm-text)",
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "9px",
                    color: "var(--arm-text-secondary)",
                  }}
                >
                  {item.author} · {item.type}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 opacity-30">
          <svg width="16" height="20" viewBox="0 0 16 20">
            <polygon points="0,0 0,16 4,12 8,20 10,19 6,11 12,11" fill="var(--arm-text)" />
          </svg>
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "9px",
              color: "var(--arm-text)",
            }}
          >
            CLICK TO EXPLORE...
          </div>
        </div>
      </div>
    </RetroWindow>
  );
}
