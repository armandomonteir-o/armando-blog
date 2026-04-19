"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { WavyText } from "@/components/ui/WavyText";
import { RetroWindow } from "@/components/ui/RetroWindow";
import { Home, ArrowLeft } from "lucide-react";

const asciiArt = `
  ██╗  ██╗ ██████╗ ██╗  ██╗
  ██║  ██║██╔═══██╗██║  ██║
  ███████║██║   ██║███████║
  ╚════██║██║   ██║╚════██║
       ██║╚██████╔╝     ██║
       ╚═╝ ╚═════╝      ╚═╝
`;

export default function NotFound() {
  const pathname = usePathname();
  const slug = pathname?.split("/").filter(Boolean).pop() ?? "???";

  const glitchMessages = useMemo(
    () => [
      `ta endoidando? a pagina '${slug}' nao existe aqui nao`,
      `ERRO: tentou acessar '${slug}' e foi parar no vazio`,
      `FATAL: ${slug}.exe foi pro espaco sideral`,
      `AVISO: nao achamos '${slug}' nem com lanterna`,
      `PANICO: como voce chegou aqui tentando acessar '${slug}'?`,
      `EXCECAO: SONHOS_OVERFLOW em 0x00000404`,
    ],
    [slug]
  );

  const [msgIndex, setMsgIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % glitchMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [glitchMessages.length]);

  useEffect(() => {
    const target = glitchMessages[msgIndex];
    let i = -1;
    const typeInterval = setInterval(() => {
      i++;
      setTypedText(target.slice(0, i));
      if (i >= target.length) clearInterval(typeInterval);
    }, 35);
    return () => clearInterval(typeInterval);
  }, [msgIndex, glitchMessages]);

  useEffect(() => {
    const interval = setInterval(() => setShowCursor((c) => !c), 530);
    return () => clearInterval(interval);
  }, []);

  const buttonHover = {
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      e.currentTarget.style.transform = "translate(-2px, -2px)";
      e.currentTarget.style.boxShadow = "5px 5px 0 #022a6e";
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      e.currentTarget.style.transform = "translate(0, 0)";
      e.currentTarget.style.boxShadow = "3px 3px 0 #022a6e";
    },
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: "var(--arm-bg)", transition: "background-color 0.3s ease" }}
    >
      {/* Background orbs */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 300,
          height: 300,
          top: "10%",
          left: "5%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 35% 35%, rgba(3,71,193,0.25), rgba(3,71,193,0.08), transparent 70%)",
          filter: "blur(60px)",
          animation: "aeroFloat 7s ease-in-out infinite alternate",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 200,
          height: 200,
          bottom: "15%",
          right: "8%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 35% 35%, rgba(224,80,80,0.2), rgba(224,80,80,0.06), transparent 70%)",
          filter: "blur(50px)",
          animation: "aeroFloat 9s ease-in-out infinite alternate",
          animationDelay: "2s",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 150,
          height: 150,
          top: "50%",
          right: "20%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 35% 35%, rgba(192,132,252,0.2), rgba(192,132,252,0.05), transparent 70%)",
          filter: "blur(40px)",
          animation: "aeroFloat 6s ease-in-out infinite alternate",
          animationDelay: "1s",
        }}
      />

      {/* Glossy bubbles */}
      {(
        [
          { size: 20, top: "12%", left: "15%", delay: 0 },
          { size: 14, top: "30%", right: "10%", delay: 1.2 },
          { size: 28, bottom: "20%", left: "8%", delay: 0.6 },
          { size: 16, top: "60%", right: "25%", delay: 2 },
          { size: 22, bottom: "35%", right: "5%", delay: 1.5 },
        ] as {
          size: number;
          delay: number;
          top?: string;
          left?: string;
          right?: string;
          bottom?: string;
        }[]
      ).map((b, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            width: b.size,
            height: b.size,
            top: b.top,
            left: b.left,
            right: b.right,
            bottom: b.bottom,
            borderRadius: "50%",
            background: `
              radial-gradient(circle at 30% 25%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 20%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(3,71,193,0.15) 0%, rgba(3,71,193,0.05) 60%, transparent 80%)
            `,
            border: "1px solid rgba(255,255,255,0.4)",
            animation: `aeroBubble ${5 + b.delay * 1.5}s ease-in-out infinite alternate`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
        }}
      />

      <style>{`
        @keyframes aeroFloat { 0% { transform: translateY(0) scale(1); } 100% { transform: translateY(-20px) scale(1.05); } }
        @keyframes aeroBubble { 0% { transform: translateY(0) translateX(0) scale(1); } 50% { transform: translateY(-8px) translateX(4px) scale(1.02); } 100% { transform: translateY(-15px) translateX(-3px) scale(0.98); } }
        @keyframes glitchShake { 0%, 100% { transform: translate(0); } 20% { transform: translate(-3px, 2px); } 40% { transform: translate(3px, -1px); } 60% { transform: translate(-1px, -2px); } 80% { transform: translate(2px, 1px); } }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 w-full max-w-[640px] mx-6"
      >
        <RetroWindow title="ERROR-404.EXE" variant="light">
          <div className="p-6">
            <div className="flex justify-center mb-4">
              <pre
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "10px",
                  lineHeight: 1.2,
                  color: "#e05050",
                  letterSpacing: "0.05em",
                  animation: "glitchShake 0.5s ease-in-out infinite",
                }}
              >
                {asciiArt}
              </pre>
            </div>

            <div className="flex justify-center mb-2">
              <WavyText
                text="PAGINA NAO ENCONTRADA"
                variant="stacked"
                fontSize={22}
                color="#022a6e"
              />
            </div>

            <div
              className="mb-5 p-3"
              style={{
                backgroundColor: "#0347c1",
                border: "3px solid #022a6e",
                boxShadow: "3px 3px 0 #022a6e",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-2.5 h-2.5"
                  style={{ backgroundColor: "#e05050", border: "1px solid #022a6e" }}
                />
                <div
                  className="w-2.5 h-2.5"
                  style={{ backgroundColor: "#4ade80", border: "1px solid #022a6e" }}
                />
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "8px",
                    color: "#e8f4ff",
                  }}
                >
                  TERMINAL_OUTPUT.LOG
                </span>
              </div>
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "11px",
                  color: "#e8f4ff",
                  lineHeight: 1.6,
                  minHeight: "20px",
                }}
              >
                <span style={{ color: "#4ade80" }}>{">"}</span> {typedText}
                <span
                  style={{
                    color: "#4ade80",
                    opacity: showCursor ? 1 : 0,
                    transition: "opacity 0.1s",
                  }}
                >
                  █
                </span>
              </div>
            </div>

            <p
              className="text-center mb-5"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "11px",
                lineHeight: 1.6,
                color: "#5a7a9a",
              }}
            >
              O arquivo que voce procura foi movido, deletado,
              <br />
              ou talvez nunca tenha existido neste plano digital.
            </p>

            <div
              className="mb-5 p-3 text-center"
              style={{
                background: "rgba(3, 71, 193, 0.06)",
                backdropFilter: "blur(12px)",
                border: "2px solid rgba(3, 71, 193, 0.15)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), 0 4px 16px rgba(3,71,193,0.06)",
              }}
            >
              <span
                style={{
                  fontFamily: "'Bungee Shade', sans-serif",
                  fontSize: "11px",
                  color: "#0347c1",
                  letterSpacing: "0.05em",
                }}
              >
                ARMANDO
              </span>
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "9px",
                  color: "#a0c4ff",
                  marginLeft: "8px",
                }}
              >
                {"// arte & tecnologia digital"}
              </span>
            </div>

            <div className="flex items-center justify-center gap-3">
              <Link
                href="/"
                className="px-5 py-2.5 cursor-pointer inline-flex items-center gap-2"
                style={{
                  backgroundColor: "#fff",
                  color: "#0347c1",
                  border: "3px solid #022a6e",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: "12px",
                  boxShadow: "3px 3px 0 #022a6e",
                  textDecoration: "none",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                {...buttonHover}
              >
                <Home size={14} />
                Voltar ao Inicio
              </Link>

              <button
                className="px-5 py-2.5 cursor-pointer inline-flex items-center gap-2"
                style={{
                  backgroundColor: "#0458d4",
                  color: "#e8f4ff",
                  border: "3px solid #022a6e",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: "12px",
                  boxShadow: "3px 3px 0 #022a6e",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onClick={() => window.history.back()}
                {...buttonHover}
              >
                <ArrowLeft size={14} />
                Pagina Anterior
              </button>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between mb-1">
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "8px",
                    color: "#a0c4ff",
                  }}
                >
                  SEARCHING_REALITY.EXE...
                </span>
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "8px",
                    color: "#e05050",
                  }}
                >
                  FAILED
                </span>
              </div>
              <div
                className="h-2.5 w-full overflow-hidden"
                style={{ border: "2px solid #022a6e", backgroundColor: "#e8e4dc" }}
              >
                <motion.div
                  className="h-full"
                  style={{ backgroundColor: "#e05050" }}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
              </div>
            </div>
          </div>
        </RetroWindow>
      </motion.div>
    </div>
  );
}
