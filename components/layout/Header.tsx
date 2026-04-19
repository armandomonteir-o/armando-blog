"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ArrowLeft, Bell, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface HeaderProps {
  onMobileMenuToggle?: () => void;
}

interface SearchResult {
  title: string;
  slug: string;
  category: string;
}

const NOTIFICATIONS = [
  { id: 1, type: "comment", icon: "💬", title: "Novo comentário", body: 'alguém comentou em "Glitch como Forma"', time: "2 min atrás", unread: true },
  { id: 2, type: "like", icon: "⭐", title: "Post curtido", body: '"Frutiger Aero não morreu" recebeu 12 curtidas', time: "18 min atrás", unread: true },
  { id: 3, type: "system", icon: "📡", title: "SISTEMA", body: "Cache de realidade atualizado com sucesso", time: "1 h atrás", unread: true },
  { id: 4, type: "follow", icon: "👾", title: "Novo seguidor", body: "px_ghost começou a seguir seu blog", time: "3 h atrás", unread: false },
  { id: 5, type: "mention", icon: "🔗", title: "Menção", body: "databending_zine linkou seu artigo sobre glitch", time: "ontem", unread: false },
];

export function Header({ onMobileMenuToggle }: HeaderProps) {
  const router = useRouter();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Search is wired to WP search API in issue #10 — empty until then
  const searchResults: SearchResult[] = [];
  const showSearchDropdown = searchFocused && searchQuery.trim().length >= 2;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchFocused(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));

  return (
    <header
      className="flex items-center justify-between px-3 sm:px-6 py-3 relative flex-shrink-0"
      style={{ borderBottom: "3px solid #022a6e", backgroundColor: "#0347c1", zIndex: 50 }}
    >
      {/* Glass sheen */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 40%, transparent 60%, rgba(255,255,255,0.04) 100%)" }}
      />

      {/* Glossy bubble */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 60, height: 60, top: "-20px", right: "20%", borderRadius: "50%",
          background: "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.2), rgba(128,176,255,0.1), transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      {/* Hamburger — mobile */}
      <button
        className="lg:hidden flex items-center justify-center w-9 h-9 cursor-pointer flex-shrink-0 mr-2 relative z-10"
        style={{ border: "2px solid #0560e0", backgroundColor: "#0458d4", color: "#80b0ff" }}
        onClick={onMobileMenuToggle}
        aria-label="Abrir menu"
      >
        <Menu size={16} />
      </button>

      {/* Back button — desktop */}
      <button
        className="hidden lg:flex items-center justify-center w-9 h-9 cursor-pointer flex-shrink-0 relative z-10"
        style={{ border: "2px solid #0560e0", backgroundColor: "#0458d4", color: "#80b0ff" }}
        onClick={() => router.back()}
        title="Voltar"
      >
        <ArrowLeft size={16} />
      </button>

      {/* Search bar */}
      <div ref={searchRef} className="relative flex-1 mx-2 sm:mx-5 z-10">
        <div
          className="flex items-center px-3 py-1.5"
          style={{
            border: searchFocused ? "2px solid #4ade80" : "2px solid #0560e0",
            backgroundColor: "#0458d4",
            fontFamily: "'Space Mono', monospace",
            transition: "border-color 0.2s",
          }}
        >
          <Search size={14} className="mr-2 sm:mr-3 flex-shrink-0" style={{ color: searchFocused ? "#4ade80" : "#80b0ff" }} />
          <input
            type="text"
            placeholder="pesquise aqui o que voce tem interesse!!"
            className="flex-1 bg-transparent outline-none min-w-0"
            style={{ fontSize: "12px", fontFamily: "'Space Mono', monospace", color: "#c0d8ff" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
          />
          {searchQuery && (
            <button
              className="flex-shrink-0 cursor-pointer"
              style={{ background: "none", border: "none", color: "#80b0ff", padding: 0 }}
              onClick={() => { setSearchQuery(""); setSearchFocused(false); }}
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Search results dropdown */}
        {showSearchDropdown && (
          <div
            className="absolute left-0 right-0 mt-1"
            style={{
              border: "2.5px solid #022a6e",
              boxShadow: "4px 4px 0 #022a6e",
              backgroundColor: "#0347c1",
              zIndex: 9999,
            }}
          >
            <div
              className="px-3 py-1 flex items-center gap-2"
              style={{ borderBottom: "2px solid #0560e0", backgroundColor: "#0458d4" }}
            >
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", color: "#80b0ff", letterSpacing: "0.1em" }}>
                SEARCH.EXE
              </span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", color: "#4ade80" }}>
                {searchResults.length} resultado{searchResults.length !== 1 ? "s" : ""}
              </span>
            </div>
            {searchResults.length > 0 ? (
              searchResults.map((r, i) => (
                <Link
                  key={i}
                  href={`/post/${r.slug}`}
                  className="flex items-center gap-3 px-3 py-2.5 cursor-pointer"
                  style={{
                    borderBottom: i < searchResults.length - 1 ? "1px solid rgba(5,96,224,0.35)" : "none",
                    textDecoration: "none",
                    transition: "background 0.15s",
                  }}
                  onClick={() => { setSearchQuery(""); setSearchFocused(false); }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <Search size={11} style={{ color: "#5a8ad0", flexShrink: 0 }} />
                  <div className="flex-1 min-w-0">
                    <div className="truncate" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "12px", color: "#e0eeff" }}>
                      {r.title}
                    </div>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", color: "#5a8ad0" }}>
                      {r.category.toUpperCase()}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="px-3 py-3 text-center">
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "#5a8ad0" }}>
                  NENHUM RESULTADO ENCONTRADO
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3 relative z-10 flex-shrink-0">
        {/* Bell + notification panel */}
        <div ref={panelRef} className="relative">
          <button
            className="flex items-center justify-center w-9 h-9 relative cursor-pointer"
            style={{ border: "2px solid #0560e0", backgroundColor: notifOpen ? "#022a6e" : "#0458d4", color: "#80b0ff" }}
            onClick={() => setNotifOpen((v) => !v)}
            aria-label="Notificações"
          >
            <Bell size={15} />
            {unreadCount > 0 && (
              <div
                className="absolute -top-1 -right-1 w-3 h-3"
                style={{ backgroundColor: "#4ade80", border: "1.5px solid #022a6e" }}
              />
            )}
          </button>

          {notifOpen && (
            <div
              className="absolute right-0 mt-2 flex flex-col"
              style={{
                width: 310, zIndex: 9999,
                border: "2.5px solid #022a6e",
                boxShadow: "4px 4px 0px #022a6e",
                background: "linear-gradient(160deg, rgba(3,71,193,0.82) 0%, rgba(2,42,110,0.95) 100%)",
                backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
              }}
            >
              {/* Title bar */}
              <div
                className="flex items-center justify-between px-3 py-1.5 flex-shrink-0"
                style={{ borderBottom: "2px solid #0560e0", background: "linear-gradient(90deg, #0347c1 0%, #0458d4 60%, #0347c1 100%)" }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57", border: "1px solid #022a6e" }} />
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#febc2e", border: "1px solid #022a6e" }} />
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#28c840", border: "1px solid #022a6e" }} />
                  </div>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#c0d8ff", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    NOTIFICAÇÕES
                  </span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5" style={{ background: "#4ade80", color: "#022a6e", fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, border: "1px solid #022a6e" }}>
                      {unreadCount} novo{unreadCount > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <button
                  onClick={markAllRead}
                  style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#80b0ff", background: "transparent", border: "none", cursor: "pointer", textDecoration: "underline", letterSpacing: "0.05em" }}
                >
                  marcar tudo lido
                </button>
              </div>

              {/* Notification list */}
              <div className="overflow-y-auto" style={{ maxHeight: 280 }}>
                {notifications.map((n, i) => (
                  <div
                    key={n.id}
                    className="flex items-start gap-3 px-3 py-2.5 cursor-pointer"
                    style={{
                      borderBottom: i < notifications.length - 1 ? "1px solid rgba(5,96,224,0.35)" : "none",
                      background: n.unread ? "rgba(255,255,255,0.07)" : "transparent",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.12)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = n.unread ? "rgba(255,255,255,0.07)" : "transparent")}
                    onClick={() => setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, unread: false } : x)))}
                  >
                    <div
                      className="flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{
                        width: 28, height: 28, border: "1.5px solid #0560e0",
                        background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.25), rgba(3,71,193,0.6))",
                        fontSize: 13,
                      }}
                    >
                      {n.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: n.unread ? "#e0eeff" : "#80b0ff", fontWeight: n.unread ? 700 : 400, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                          {n.title}
                        </span>
                        {n.unread && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#4ade80" }} />}
                      </div>
                      <p className="mt-0.5 truncate" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: "#a0c0f0", lineHeight: 1.4 }}>
                        {n.body}
                      </p>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "rgba(128,176,255,0.55)", letterSpacing: "0.06em" }}>
                        {n.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Panel footer */}
              <div className="px-3 py-2 flex items-center justify-center" style={{ borderTop: "2px solid #0560e0" }}>
                <button
                  onClick={() => { markAllRead(); setNotifOpen(false); }}
                  style={{
                    fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#80b0ff",
                    background: "transparent", border: "none", cursor: "pointer",
                    letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "underline",
                  }}
                >
                  marcar lidas e fechar →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User avatars */}
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-9 h-9 overflow-hidden relative" style={{ border: "2px solid #80b0ff" }}>
            <Image
              src="https://images.unsplash.com/photo-1563669528538-1f3d1d08791b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHdvbWFuJTIwY3JlYXRpdmUlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzI4MzI1MDh8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>
          <div className="hidden sm:block w-9 h-9 overflow-hidden rounded-full relative" style={{ border: "2px solid #4ade80" }}>
            <Image
              src="https://images.unsplash.com/photo-1753176185106-eba130fdc775?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMG1hbiUyMGFydGlzdGljJTIwc3R1ZGlvfGVufDF8fHx8MTc3MjgzMjUwOHww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Profile 2"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
