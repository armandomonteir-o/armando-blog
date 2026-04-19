"use client";

import { Mail, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { RetroWindow } from "@/components/ui/RetroWindow";

interface ContactCTAProps {
  accentColor?: string;
}

export function ContactCTA({ accentColor = "#0347c1" }: ContactCTAProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -2 }}
    >
      <RetroWindow title="CONTACT.EXE" variant="glass">
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative overflow-hidden">
          <motion.div
            className="absolute pointer-events-none"
            animate={{ opacity: [0.08, 0.15, 0.08], scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 200,
              height: 200,
              top: "-60px",
              right: "-40px",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${accentColor}40, transparent 70%)`,
              filter: "blur(40px)",
            }}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Sparkles size={14} style={{ color: accentColor }} />
              </motion.div>
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(14px, 2.5vw, 18px)",
                  color: "var(--arm-text)",
                }}
              >
                Quer conversar sobre arte, codigo ou filosofia?
              </span>
            </div>
            <p
              className="mt-1"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "11px",
                color: "var(--arm-text-secondary)",
              }}
            >
              Estou sempre aberto a colaboracoes, debates e cafes virtuais.
            </p>
          </div>

          <motion.a
            href="mailto:armando@exemplo.com"
            className="flex items-center justify-center gap-2 px-5 py-3 relative z-10"
            style={{
              border: "3px solid var(--arm-border)",
              backgroundColor: "var(--arm-blue)",
              boxShadow: "4px 4px 0 var(--arm-shadow)",
              fontFamily: "'Space Mono', monospace",
              fontSize: "11px",
              fontWeight: 700,
              color: "#fff",
              textDecoration: "none",
              flexShrink: 0,
            }}
            whileHover={{
              x: -2,
              y: -2,
              boxShadow: "6px 6px 0 var(--arm-shadow)",
              backgroundColor: "#0560e0",
            }}
            whileTap={{ x: 1, y: 1, boxShadow: "2px 2px 0 var(--arm-shadow)" }}
            transition={{ duration: 0.15 }}
          >
            <Mail size={15} />
            ENVIAR MENSAGEM
          </motion.a>
        </div>
      </RetroWindow>
    </motion.div>
  );
}
