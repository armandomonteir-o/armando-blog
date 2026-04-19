"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  Bell,
  CheckCircle,
  Send,
  X,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NewsletterModalProps {
  open: boolean;
  onClose: () => void;
}

export function NewsletterModal({ open, onClose }: NewsletterModalProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [btnHover, setBtnHover] = useState(false);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setSubscribed(false);
      setEmail("");
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[9998]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              backgroundColor: "rgba(2, 42, 110, 0.65)",
              backdropFilter: "blur(8px)",
            }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 10 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 28,
                delay: 0.05,
              }}
              className="relative w-full max-w-[460px]"
              onClick={(e) => e.stopPropagation()}
              style={{
                border: "3px solid #022a6e",
                boxShadow: "8px 8px 0 #022a6e, 0 0 60px rgba(3,71,193,0.3)",
              }}
            >
              {/* Title bar */}
              <div
                className="flex items-center justify-between px-3 py-2"
                style={{
                  backgroundColor: "#0458d4",
                  borderBottom: "2px solid #022a6e",
                }}
              >
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: [0, 12, -12, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                  >
                    <Bell size={12} style={{ color: "#4ade80" }} />
                  </motion.div>
                  <span
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "#80b0ff",
                      letterSpacing: "0.05em",
                    }}
                  >
                    NOTIFY.EXE
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-3 h-3"
                    style={{
                      border: "1.5px solid #022a6e",
                      backgroundColor: "#0347c1",
                    }}
                  />
                  <motion.button
                    className="w-3 h-3 flex items-center justify-center cursor-pointer"
                    style={{
                      border: "1.5px solid #022a6e",
                      backgroundColor: "#e05050",
                      padding: 0,
                    }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    aria-label="Fechar"
                  >
                    <X size={7} style={{ color: "#022a6e" }} />
                  </motion.button>
                </div>
              </div>

              {/* Body */}
              <div
                className="relative overflow-hidden"
                style={{ backgroundColor: "#0347c1" }}
              >
                {/* Pulsing glow */}
                <motion.div
                  className="absolute pointer-events-none"
                  animate={{
                    opacity: [0.08, 0.2, 0.08],
                    scale: [1, 1.15, 1],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    width: 220,
                    height: 220,
                    top: "-60px",
                    right: "-40px",
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle, rgba(74,222,128,0.4), transparent 70%)",
                    filter: "blur(50px)",
                  }}
                />

                {/* Scanlines */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 6px)",
                  }}
                />

                <div className="relative z-10 p-6 sm:p-7">
                  <AnimatePresence mode="wait">
                    {!subscribed ? (
                      <motion.div
                        key="form"
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* Header icon + title */}
                        <div className="flex items-center gap-3 mb-1">
                          <motion.div
                            className="w-11 h-11 flex items-center justify-center flex-shrink-0"
                            style={{
                              border: "2px solid #4ade80",
                              backgroundColor: "#4ade8012",
                              boxShadow: "0 0 16px rgba(74,222,128,0.15)",
                            }}
                            animate={{ rotate: [0, 6, -6, 0] }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              repeatDelay: 4,
                            }}
                          >
                            <Bell size={20} style={{ color: "#4ade80" }} />
                          </motion.div>
                          <div>
                            <span
                              style={{
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontWeight: 700,
                                fontSize: "18px",
                                color: "#fff",
                                display: "block",
                                lineHeight: 1.2,
                              }}
                            >
                              Fique por dentro!
                            </span>
                            <span
                              style={{
                                fontFamily: "'Space Mono', monospace",
                                fontSize: "9px",
                                color: "#4ade80",
                                letterSpacing: "0.05em",
                              }}
                            >
                              TRANSMISSAO ATIVA
                            </span>
                          </div>
                        </div>

                        <p
                          className="mt-3 mb-5"
                          style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontSize: "14px",
                            lineHeight: 1.65,
                            color: "#a0c4ff",
                          }}
                        >
                          Receba um aviso no e-mail sempre que sair post novo.
                          Nada de conteudo exclusivo — tudo esta aqui, aberto,
                          no blog.
                        </p>

                        <form onSubmit={handleSubmit}>
                          {/* Email input */}
                          <div className="relative mb-3">
                            <Mail
                              size={14}
                              className="absolute left-3 top-1/2 -translate-y-1/2"
                              style={{ color: "#5a8ad0" }}
                            />
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="seu@email.com"
                              required
                              autoFocus
                              className="w-full pl-9 pr-4 py-3"
                              style={{
                                backgroundColor: "#022a6e",
                                border: "2px solid #0560e0",
                                color: "#fff",
                                fontFamily: "'Space Mono', monospace",
                                fontSize: "12px",
                                outline: "none",
                                transition:
                                  "border-color 0.2s, box-shadow 0.2s",
                              }}
                              onFocus={(e) => {
                                e.currentTarget.style.borderColor = "#4ade80";
                                e.currentTarget.style.boxShadow =
                                  "0 0 12px rgba(74,222,128,0.15)";
                              }}
                              onBlur={(e) => {
                                e.currentTarget.style.borderColor = "#0560e0";
                                e.currentTarget.style.boxShadow = "none";
                              }}
                            />
                          </div>

                          {/* Submit button */}
                          <motion.button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 px-5 py-3"
                            style={{
                              border: "3px solid #022a6e",
                              backgroundColor: "#4ade80",
                              boxShadow: "4px 4px 0 #022a6e",
                              fontFamily: "'Space Mono', monospace",
                              fontSize: "11px",
                              fontWeight: 700,
                              color: "#022a6e",
                              cursor: "pointer",
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
                              transition={{
                                duration: 0.4,
                                repeat: Infinity,
                              }}
                            >
                              <Send size={14} />
                            </motion.div>
                            QUERO SER NOTIFICADO
                          </motion.button>
                        </form>

                        {/* Privacy notice */}
                        <div
                          className="mt-4 p-3 flex gap-2.5"
                          style={{
                            backgroundColor: "#022a6e",
                            border: "1px solid #0560e0",
                          }}
                        >
                          <Lock
                            size={13}
                            className="flex-shrink-0 mt-0.5"
                            style={{ color: "#5a8ad0" }}
                          />
                          <div>
                            <span
                              style={{
                                fontFamily: "'Space Mono', monospace",
                                fontSize: "9px",
                                fontWeight: 700,
                                color: "#80b0ff",
                                letterSpacing: "0.03em",
                                display: "block",
                                marginBottom: "3px",
                              }}
                            >
                              PRIVACIDADE
                            </span>
                            <p
                              style={{
                                fontFamily: "'Space Mono', monospace",
                                fontSize: "9px",
                                lineHeight: 1.6,
                                color: "#5a8ad0",
                              }}
                            >
                              Nao armazeno nenhuma informacao pessoal dos
                              visitantes deste site. Seu e-mail sera usado
                              apenas para enviar notificacoes de novos posts e
                              voce pode cancelar a qualquer momento.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      /* Success state */
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.35 }}
                        className="flex flex-col items-center text-center py-4"
                      >
                        {/* Animated check */}
                        <motion.div
                          initial={{ scale: 0, rotate: -30 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 15,
                            delay: 0.15,
                          }}
                          className="mb-4 w-16 h-16 flex items-center justify-center"
                          style={{
                            border: "3px solid #4ade80",
                            backgroundColor: "#4ade8015",
                            boxShadow: "0 0 30px rgba(74,222,128,0.2)",
                          }}
                        >
                          <CheckCircle size={36} style={{ color: "#4ade80" }} />
                        </motion.div>

                        <motion.span
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontWeight: 700,
                            fontSize: "20px",
                            color: "#4ade80",
                            display: "block",
                          }}
                        >
                          Tudo certo!
                        </motion.span>

                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="mt-2 max-w-[320px]"
                          style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontSize: "14px",
                            lineHeight: 1.6,
                            color: "#a0c4ff",
                          }}
                        >
                          Voce vai receber um aviso sempre que eu publicar algo
                          novo. Fique de olho na caixa de entrada!
                        </motion.p>

                        {/* ID badge */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.55 }}
                          className="mt-4 px-4 py-2"
                          style={{
                            backgroundColor: "#022a6e",
                            border: "2px solid #0560e0",
                            fontFamily: "'Space Mono', monospace",
                            fontSize: "10px",
                            color: "#4ade80",
                          }}
                        >
                          {">"} NOTIFY_ID: #
                          {Math.random()
                            .toString(36)
                            .substring(2, 8)
                            .toUpperCase()}
                        </motion.div>

                        {/* Privacy reminder */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.65 }}
                          className="mt-4 flex items-center gap-1.5"
                        >
                          <ShieldCheck size={12} style={{ color: "#5a8ad0" }} />
                          <span
                            style={{
                              fontFamily: "'Space Mono', monospace",
                              fontSize: "8px",
                              color: "#5a8ad0",
                            }}
                          >
                            NENHUMA INFORMACAO PESSOAL ARMAZENADA
                          </span>
                        </motion.div>

                        {/* Close button */}
                        <motion.button
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.75 }}
                          className="mt-5 px-5 py-2 cursor-pointer"
                          style={{
                            border: "2px solid #0560e0",
                            backgroundColor: "#0458d4",
                            fontFamily: "'Space Mono', monospace",
                            fontSize: "10px",
                            fontWeight: 700,
                            color: "#80b0ff",
                          }}
                          whileHover={{
                            backgroundColor: "#0560e0",
                            color: "#fff",
                          }}
                          onClick={onClose}
                        >
                          FECHAR
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
