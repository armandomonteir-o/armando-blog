"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import {
  Home,
  Music,
  Film,
  BookOpen,
  Brain,
  GraduationCap,
  User,
  ListMusic,
  Bell,
  Sun,
  Moon,
} from "lucide-react";
import { useThemeStore } from "@/store/useThemeStore";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Music, label: "Músicas", path: "/categoria/musicas" },
  { icon: Film, label: "Filmes", path: "/categoria/filmes" },
  { icon: BookOpen, label: "Livros", path: "/categoria/livros" },
  { icon: Brain, label: "Filosofia", path: "/categoria/filosofia" },
  { icon: GraduationCap, label: "Estudos", path: "/categoria/estudos" },
  { icon: ListMusic, label: "Playlists", path: "/playlists" },
  { icon: User, label: "Sobre Mim", path: "/sobre" },
];

interface SidebarProps {
  collapsed?: boolean;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  onNotifyClick?: () => void;
}

export function Sidebar({
  collapsed = false,
  mobileOpen = false,
  onMobileClose,
  onNotifyClick,
}: SidebarProps) {
  const [hovered, setHovered] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === "dark";
  const isExpanded = mobileOpen ? true : collapsed ? hovered : true;
  const width = isExpanded ? 220 : 64;

  return (
    <aside
      className={[
        "fixed top-0 left-0 h-dvh z-50 overflow-y-auto overflow-x-hidden",
        "lg:sticky lg:top-0 lg:left-auto lg:h-screen lg:z-30",
        "flex flex-col flex-shrink-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      ].join(" ")}
      style={{
        width: mobileOpen ? "min(280px, 80vw)" : width,
        backgroundColor: "#0347c1",
        borderRight: "3px solid #022a6e",
        fontFamily: "'Space Grotesk', sans-serif",
        boxShadow: "4px 0 0 #022a6e",
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s ease-in-out",
      }}
      onMouseEnter={() => collapsed && setHovered(true)}
      onMouseLeave={() => collapsed && setHovered(false)}
    >
      {/* Glass sheen overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 30%, rgba(255,255,255,0.03) 80%, rgba(0,0,0,0.1) 100%)",
        }}
      />

      {/* Aero orb decoration */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 120,
          height: 120,
          bottom: "15%",
          left: "-30px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 40% 40%, rgba(128,176,255,0.25), rgba(128,176,255,0.05), transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* Mobile spacer */}
      {mobileOpen && <div className="lg:hidden flex-shrink-0" style={{ height: 56 }} />}

      {/* Title bar */}
      <div
        className="flex items-center justify-between px-3 py-1.5 flex-shrink-0"
        style={{ backgroundColor: "#0458d4", borderBottom: "2px solid #022a6e", minHeight: "28px" }}
      >
        {isExpanded ? (
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "10px",
              fontWeight: 700,
              color: "#c8e0ff",
              letterSpacing: "0.05em",
              whiteSpace: "nowrap",
            }}
          >
            NAVIGATION.EXE
          </span>
        ) : (
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "10px",
              fontWeight: 700,
              color: "#c8e0ff",
            }}
          >
            NAV
          </span>
        )}
        <div className="flex items-center gap-1 flex-shrink-0">
          <div
            className="w-3 h-3"
            style={{ border: "1.5px solid #0560e0", backgroundColor: "#0347c1" }}
          />
          <div
            className="w-3 h-3"
            style={{ border: "1.5px solid #0560e0", backgroundColor: "#e05050" }}
          />
        </div>
      </div>

      <div
        className="flex flex-col justify-between flex-1"
        style={{ padding: isExpanded ? 20 : 8 }}
      >
        <div>
          {/* Logo */}
          <div
            className="flex items-center gap-2 mb-10 overflow-hidden"
            style={{ justifyContent: isExpanded ? "flex-start" : "center" }}
          >
            <div
              className="w-10 h-10 flex items-center justify-center flex-shrink-0 overflow-hidden"
              style={{ border: "3px solid #80b0ff", backgroundColor: "#0458d4" }}
            >
              {/* Replace /avatar-pixel-art.png with the extracted Figma asset */}
              <Image
                src="/avatar-pixel-art.png"
                alt="Armando"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            {isExpanded && (
              <span
                style={{
                  fontFamily: "'Rubik Glitch', sans-serif",
                  fontWeight: 700,
                  fontSize: "22px",
                  letterSpacing: "-0.02em",
                  color: "#fff",
                  whiteSpace: "nowrap",
                  opacity: isExpanded ? 1 : 0,
                  transition: "opacity 0.2s ease",
                }}
              >
                Armando
              </span>
            )}
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path));
              return (
                <Link
                  key={item.label}
                  href={item.path}
                  onClick={() => onMobileClose?.()}
                  className="flex items-center gap-3 transition-all overflow-hidden"
                  title={!isExpanded ? item.label : undefined}
                  style={{
                    backgroundColor: isActive ? "#fff" : "transparent",
                    color: isActive ? "#0347c1" : "#c8e0ff",
                    border: isActive ? "2px solid #fff" : "2px solid transparent",
                    fontWeight: isActive ? 700 : 500,
                    fontSize: "14px",
                    padding: isExpanded ? "10px 12px" : "10px",
                    justifyContent: isExpanded ? "flex-start" : "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  <item.icon size={18} className="flex-shrink-0" />
                  {isExpanded && item.label}
                </Link>
              );
            })}
          </nav>

          {/* Notify button */}
          <motion.button
            className="flex items-center gap-3 overflow-hidden cursor-pointer mt-4"
            title={!isExpanded ? "Notificações" : undefined}
            style={{
              backgroundColor: "rgba(74,222,128,0)",
              border: "2px solid #4ade80",
              color: "#4ade80",
              fontWeight: 700,
              fontSize: "14px",
              padding: isExpanded ? "10px 12px" : "10px",
              justifyContent: isExpanded ? "flex-start" : "center",
              whiteSpace: "nowrap",
              position: "relative",
              overflow: "hidden",
              width: "100%",
            }}
            whileHover={{
              backgroundColor: "#4ade80",
              color: "#022a6e",
              boxShadow: "0 0 16px rgba(74,222,128,0.25)",
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              onMobileClose?.();
              onNotifyClick?.();
            }}
          >
            <motion.div
              className="absolute pointer-events-none"
              animate={{ opacity: [0.15, 0.35, 0.15] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: 30,
                height: 30,
                left: isExpanded ? 8 : "50%",
                top: "50%",
                transform: isExpanded ? "translateY(-50%)" : "translate(-50%, -50%)",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(74,222,128,0.4), transparent 70%)",
                filter: "blur(6px)",
              }}
            />
            <motion.div
              className="flex-shrink-0 relative z-10"
              animate={{ rotate: [0, 12, -12, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
            >
              <Bell size={18} />
            </motion.div>
            {isExpanded && <span className="relative z-10">Notificar-me</span>}
          </motion.button>
        </div>

        {/* Bottom area */}
        <div className="mt-auto pt-8">
          {isExpanded && (
            <>
              <svg width="60" height="60" viewBox="0 0 60 60" className="opacity-25 mb-4">
                <ellipse
                  cx="30"
                  cy="30"
                  rx="28"
                  ry="28"
                  fill="none"
                  stroke="#80b0ff"
                  strokeWidth="1.5"
                />
                <ellipse
                  cx="30"
                  cy="30"
                  rx="18"
                  ry="28"
                  fill="none"
                  stroke="#80b0ff"
                  strokeWidth="1"
                />
                <ellipse
                  cx="30"
                  cy="30"
                  rx="8"
                  ry="28"
                  fill="none"
                  stroke="#80b0ff"
                  strokeWidth="1"
                />
                <line x1="2" y1="20" x2="58" y2="20" stroke="#80b0ff" strokeWidth="1" />
                <line x1="2" y1="30" x2="58" y2="30" stroke="#80b0ff" strokeWidth="1" />
                <line x1="2" y1="40" x2="58" y2="40" stroke="#80b0ff" strokeWidth="1" />
              </svg>
              <div className="mb-4 px-1">
                <div
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "9px",
                    color: "#4ade80",
                    marginBottom: "2px",
                  }}
                >
                  LOADING...
                </div>
                <div
                  className="h-3 w-full"
                  style={{ border: "2px solid #0560e0", backgroundColor: "#022a6e" }}
                >
                  <div className="h-full" style={{ width: "72%", backgroundColor: "#4ade80" }} />
                </div>
              </div>
            </>
          )}

          {/* Dark mode toggle */}
          <button
            className="flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors w-full"
            title={isDark ? "Modo claro" : "Modo escuro"}
            style={{
              fontSize: "12px",
              fontWeight: 500,
              fontFamily: "'Space Mono', monospace",
              color: "#c8e0ff",
              backgroundColor: "transparent",
              border: "none",
              justifyContent: isExpanded ? "flex-start" : "center",
            }}
            onClick={toggleTheme}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#c8e0ff";
            }}
          >
            {isDark ? (
              <Sun size={15} className="flex-shrink-0" />
            ) : (
              <Moon size={15} className="flex-shrink-0" />
            )}
            {isExpanded && <span style={{ fontSize: "11px" }}>{isDark ? "Light" : "Dark"}</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
