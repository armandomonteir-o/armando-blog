"use client";

import Link from "next/link";
import { WavyText } from "@/components/ui/WavyText";
import { RetroWindow } from "@/components/ui/RetroWindow";
import { AppImage } from "@/components/ui/AppImage";

export function FeaturedPost() {
  return (
    <RetroWindow title="FEATURED-POST.PSD" variant="dark">
      <div className="p-5">
        <div className="flex flex-col md:flex-row gap-5">
          {/* Image */}
          <div
            className="w-full md:w-[220px] lg:w-[260px] md:flex-shrink-0 overflow-hidden relative"
            style={{ border: "3px solid #80b0ff" }}
          >
            {/* Mobile: aspect-ratio box */}
            <div style={{ paddingBottom: "75%", position: "relative" }} className="md:hidden">
              <AppImage
                src="https://images.unsplash.com/photo-1762279389006-43963a0cee55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBkaWdpdGFsJTIwYXJ0JTIwbmVvbiUyMGlsbHVzdHJhdGlvbnxlbnwxfHx8fDE3NzI4MzI1MDd8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Cyberpunk digital art"
                fill
                sizes="(max-width: 768px) 100vw, 260px"
                className="object-cover"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
                }}
              />
              <div
                className="absolute inset-0 pointer-events-none opacity-15"
                style={{
                  backgroundImage:
                    "linear-gradient(#80b0ff 1px, transparent 1px), linear-gradient(90deg, #80b0ff 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 pointer-events-none"
                style={{
                  height: "40%",
                  background: "linear-gradient(to top, rgba(3,71,193,0.3), transparent)",
                  backdropFilter: "blur(2px)",
                }}
              />
            </div>

            {/* Desktop: fixed-height */}
            <div className="hidden md:block relative" style={{ height: "100%", minHeight: 260 }}>
              <AppImage
                src="https://images.unsplash.com/photo-1762279389006-43963a0cee55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBkaWdpdGFsJTIwYXJ0JTIwbmVvbiUyMGlsbHVzdHJhdGlvbnxlbnwxfHx8fDE3NzI4MzI1MDd8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Cyberpunk digital art"
                fill
                sizes="260px"
                className="object-cover"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
                }}
              />
              <div
                className="absolute inset-0 pointer-events-none opacity-15"
                style={{
                  backgroundImage:
                    "linear-gradient(#80b0ff 1px, transparent 1px), linear-gradient(90deg, #80b0ff 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 pointer-events-none"
                style={{
                  height: "40%",
                  background: "linear-gradient(to top, rgba(3,71,193,0.3), transparent)",
                  backdropFilter: "blur(2px)",
                }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col justify-between flex-1 min-w-0">
            <div>
              <WavyText
                text="A REVOLUCAO DO ALGORITMO"
                fontSize={34}
                amplitude={10}
                frequency={0.18}
                color="#fff"
                strokeColor="#80b0ff"
              />
              <p
                className="mt-2 mb-4"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "12px",
                  lineHeight: 1.7,
                  color: "#80b0ff",
                }}
              >
                Um manifesto sobre como a arte digital transcende
                os limites do humano e do codigo. Explorando as
                fronteiras entre criatividade artificial e
                expressao autentica na era pos-digital.
              </p>

              <div className="flex flex-wrap gap-2 sm:gap-3 mt-2">
                {[
                  { value: "42+", label: "leituras" },
                  { value: "#1", label: "manifesto" },
                  { value: "3 sem", label: "publicado" },
                  { value: "18", label: "reacoes" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="px-3 py-2 text-center"
                    style={{ border: "2px solid #0560e0", backgroundColor: "#0458d4" }}
                  >
                    <div
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 700,
                        fontSize: "18px",
                        color: "#4ade80",
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "9px",
                        color: "#5a8ad0",
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <Link
                href="/post/a-revolucao-do-algoritmo"
                className="px-5 py-2.5 cursor-pointer inline-block"
                style={{
                  backgroundColor: "#fff",
                  color: "#0347c1",
                  border: "3px solid #022a6e",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: "13px",
                  boxShadow: "3px 3px 0 #022a6e",
                  textDecoration: "none",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translate(-2px, -2px)";
                  e.currentTarget.style.boxShadow = "5px 5px 0 #022a6e";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translate(0, 0)";
                  e.currentTarget.style.boxShadow = "3px 3px 0 #022a6e";
                }}
              >
                Ler Manifesto
              </Link>
              <button
                className="px-5 py-2.5 cursor-pointer"
                style={{
                  backgroundColor: "#0458d4",
                  color: "#80b0ff",
                  border: "3px solid #0560e0",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: "13px",
                  boxShadow: "3px 3px 0 #022a6e",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translate(-2px, -2px)";
                  e.currentTarget.style.boxShadow = "5px 5px 0 #022a6e";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translate(0, 0)";
                  e.currentTarget.style.boxShadow = "3px 3px 0 #022a6e";
                }}
              >
                Ver Galeria
              </button>
            </div>
          </div>
        </div>
      </div>
    </RetroWindow>
  );
}
