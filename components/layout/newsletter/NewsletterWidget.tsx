"use client";

import { useState } from "react";
import { Mail, Bell, CheckCircle, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { RetroWindow } from "@/components/ui/RetroWindow";

export function NewsletterWidget() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [notifyId] = useState(() => Math.random().toString(36).substring(2, 8).toUpperCase());
  const [btnHover, setBtnHover] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
    >
      <RetroWindow title="NOTIFY.EXE" variant="dark">
        <div className="p-4 sm:p-5 relative overflow-hidden">
          {/* Subtle pulsing glow */}
          <motion.div
            className="absolute pointer-events-none"
            animate={{ opacity: [0.06, 0.14, 0.06], scale: [1, 1.15, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 180,
              height: 180,
              top: "-50px",
              right: "-30px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(74,222,128,0.35), transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          <AnimatePresence mode="wait">
            {!subscribed ? (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="relative z-10"
              >
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                  <motion.div
                    className="flex-shrink-0 w-9 h-9 flex items-center justify-center mt-0.5"
                    style={{
                      border: "2px solid #4ade80",
                      backgroundColor: "#4ade8015",
                    }}
                    animate={{ rotate: [0, 8, -8, 0] }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      repeatDelay: 4,
                    }}
                  >
                    <Bell size={16} style={{ color: "#4ade80" }} />
                  </motion.div>

                  <div>
                    <span
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 700,
                        fontSize: "clamp(14px, 2.5vw, 17px)",
                        color: "#fff",
                        display: "block",
                        lineHeight: 1.25,
                      }}
                    >
                      Quer receber os novos posts no seu e-mail?
                    </span>
                    <p
                      className="mt-1"
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "10px",
                        lineHeight: 1.55,
                        color: "#5a8ad0",
                      }}
                    >
                      Sem spam, sem conteudo premium — so um aviso quando sair post novo.
                    </p>
                  </div>
                </div>

                {/* Input row */}
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="flex-1 relative">
                    <Mail
                      size={13}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2"
                      style={{ color: "#5a8ad0" }}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                      className="w-full pl-8 pr-3 py-2.5"
                      style={{
                        backgroundColor: "#022a6e",
                        border: "2px solid #0560e0",
                        color: "#fff",
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "11px",
                        outline: "none",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#4ade80";
                        e.currentTarget.style.boxShadow = "0 0 10px rgba(74,222,128,0.15)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#0560e0";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>

                  <motion.button
                    type="submit"
                    className="flex items-center justify-center gap-2 px-5 py-2.5"
                    style={{
                      border: "3px solid #022a6e",
                      backgroundColor: "#4ade80",
                      boxShadow: "4px 4px 0 #022a6e",
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "#022a6e",
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                    whileHover={{
                      x: -2,
                      y: -2,
                      boxShadow: "6px 6px 0 #022a6e",
                      backgroundColor: "#6ee7a0",
                    }}
                    whileTap={{
                      x: 1,
                      y: 1,
                      boxShadow: "2px 2px 0 #022a6e",
                    }}
                    onMouseEnter={() => setBtnHover(true)}
                    onMouseLeave={() => setBtnHover(false)}
                  >
                    <motion.div
                      animate={btnHover ? { x: [0, 3, 0] } : {}}
                      transition={{ duration: 0.4, repeat: Infinity }}
                    >
                      <Send size={13} />
                    </motion.div>
                    INSCREVER
                  </motion.button>
                </div>

                <p
                  className="mt-2"
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "8px",
                    color: "#3a6aaa",
                  }}
                >
                  * Cancele quando quiser. Nada de conteudo exclusivo — tudo esta aqui no blog.
                </p>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                className="flex items-center gap-3 relative z-10 py-1"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 220,
                    delay: 0.15,
                  }}
                >
                  <CheckCircle size={28} style={{ color: "#4ade80" }} />
                </motion.div>

                <div>
                  <span
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700,
                      fontSize: "14px",
                      color: "#4ade80",
                      display: "block",
                    }}
                  >
                    Pronto! Voce vai saber quando sair post novo.
                  </span>
                  <p
                    className="mt-0.5"
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "9px",
                      color: "#5a8ad0",
                    }}
                  >
                    ID: #{notifyId} — confira sua caixa de entrada.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </RetroWindow>
    </motion.div>
  );
}
