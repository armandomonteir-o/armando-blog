"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const scrollEl = document.getElementById("main-scroll-container");
    if (!scrollEl) return;
    const onScroll = () => setVisible(scrollEl.scrollTop > 400);
    scrollEl.addEventListener("scroll", onScroll, { passive: true });
    return () => scrollEl.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          onClick={() => {
            const scrollEl = document.getElementById("main-scroll-container");
            if (scrollEl) scrollEl.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="fixed bottom-6 right-6 z-[100] flex items-center justify-center w-10 h-10 cursor-pointer"
          style={{
            border: "3px solid var(--arm-border)",
            backgroundColor: "var(--arm-blue)",
            color: "#fff",
            boxShadow: "3px 3px 0 var(--arm-shadow)",
          }}
          whileHover={{ y: -2, boxShadow: "4px 5px 0 var(--arm-shadow)" }}
          whileTap={{ y: 1, boxShadow: "1px 1px 0 var(--arm-shadow)" }}
          aria-label="Voltar ao topo"
          title="Voltar ao topo"
        >
          <ArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
