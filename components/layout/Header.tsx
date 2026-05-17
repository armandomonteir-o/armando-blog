"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ArrowLeft, Bell, Menu, X, LogOut, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
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
  {
    id: 1,
    type: "comment",
    icon: "💬",
    title: "Novo comentário",
    body: 'alguém comentou em "Glitch como Forma"',
    time: "2 min atrás",
    unread: true,
  },
  {
    id: 2,
    type: "like",
    icon: "⭐",
    title: "Post curtido",
    body: '"Frutiger Aero não morreu" recebeu 12 curtidas',
    time: "18 min atrás",
    unread: true,
  },
  {
    id: 3,
    type: "system",
    icon: "📡",
    title: "SISTEMA",
    body: "Cache de realidade atualizado com sucesso",
    time: "1 h atrás",
    unread: true,
  },
  {
    id: 4,
    type: "follow",
    icon: "👾",
    title: "Novo seguidor",
    body: "px_ghost começou a seguir seu blog",
    time: "3 h atrás",
    unread: false,
  },
  {
    id: 5,
    type: "mention",
    icon: "🔗",
    title: "Menção",
    body: "databending_zine linkou seu artigo sobre glitch",
    time: "ontem",
    unread: false,
  },
];

export function Header({ onMobileMenuToggle }: HeaderProps) {
  const router = useRouter();
  const { data: session } = useSession();
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
      if (searchRef.current && !searchRef.current.contains(e.target as Node))
        setSearchFocused(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));

  return (
    <header
      className="flex items-center justify-between px-3 sm:px-6 py-3 relative flex-shrink-0 bg-chrome-blue"
      style={{ borderBottom: "3px solid var(--chrome-blue)", zIndex: 50 }}
    >
      {/* Glass sheen */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 40%, transparent 60%, rgba(255,255,255,0.04) 100%)",
        }}
      />

      {/* Glossy bubble */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 60,
          height: 60,
          top: "-20px",
          right: "20%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.2), rgba(128,176,255,0.1), transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      {/* Hamburger — mobile */}
      <button
        className="lg:hidden flex items-center justify-center w-9 h-9 cursor-pointer flex-shrink-0 mr-2 relative z-10 border-2 border-chrome-blue-accent bg-chrome-blue-mid text-chrome-blue-content"
        onClick={onMobileMenuToggle}
        aria-label="Abrir menu"
      >
        <Menu size={16} />
      </button>

      {/* Back button — desktop */}
      <button
        className="hidden lg:flex items-center justify-center w-9 h-9 cursor-pointer flex-shrink-0 relative z-10 border-2 border-chrome-blue-accent bg-chrome-blue-mid text-chrome-blue-content"
        onClick={() => router.back()}
        title="Voltar"
      >
        <ArrowLeft size={16} />
      </button>

      {/* Search bar */}
      <div ref={searchRef} className="relative flex-1 mx-2 sm:mx-5 z-10">
        <div
          className="flex items-center px-3 py-1.5 font-mono bg-chrome-blue-mid"
          style={{
            border: searchFocused ? "2px solid var(--chrome-green)" : "2px solid var(--chrome-blue-accent)",
            transition: "border-color 0.2s",
          }}
        >
          <Search
            size={14}
            className="mr-2 sm:mr-3 flex-shrink-0"
            style={{ color: searchFocused ? "var(--chrome-green)" : "var(--chrome-blue-text-on-dark)" }}
          />
          <input
            type="text"
            placeholder="pesquise aqui o que voce tem interesse!!"
            className="flex-1 bg-transparent outline-none min-w-0 font-mono text-chrome-blue-content"
            style={{ fontSize: "12px" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
          />
          {searchQuery && (
            <button
              className="flex-shrink-0 cursor-pointer text-chrome-blue-content"
              style={{ background: "none", border: "none", padding: 0 }}
              onClick={() => {
                setSearchQuery("");
                setSearchFocused(false);
              }}
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Search results dropdown */}
        {showSearchDropdown && (
          <div
            className="absolute left-0 right-0 mt-1 bg-chrome-blue"
            style={{
              border: "2.5px solid var(--chrome-blue)",
              boxShadow: "4px 4px 0 var(--chrome-blue)",
              zIndex: 9999,
            }}
          >
            <div
              className="px-3 py-1 flex items-center gap-2 bg-chrome-blue-mid"
              style={{ borderBottom: "2px solid var(--chrome-blue-accent)" }}
            >
              <span
                className="font-mono text-chrome-blue-content"
                style={{ fontSize: "9px", letterSpacing: "0.1em" }}
              >
                SEARCH.EXE
              </span>
              <span
                className="font-mono text-chrome-green"
                style={{ fontSize: "9px" }}
              >
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
                    borderBottom:
                      i < searchResults.length - 1 ? "1px solid rgba(5,96,224,0.35)" : "none",
                    textDecoration: "none",
                    transition: "background 0.15s",
                  }}
                  onClick={() => {
                    setSearchQuery("");
                    setSearchFocused(false);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <Search size={11} style={{ color: "var(--chrome-blue-body)", flexShrink: 0 }} />
                  <div className="flex-1 min-w-0">
                    <div
                      className="truncate font-grotesk"
                      style={{ fontSize: "12px", color: "#e0eeff" }}
                    >
                      {r.title}
                    </div>
                    <span
                      className="font-mono text-chrome-blue-body"
                      style={{ fontSize: "9px" }}
                    >
                      {r.category.toUpperCase()}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="px-3 py-3 text-center">
                <span
                  className="font-mono text-chrome-blue-body"
                  style={{ fontSize: "10px" }}
                >
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
            className="flex items-center justify-center w-9 h-9 relative cursor-pointer border-2 border-chrome-blue-accent text-chrome-blue-content"
            style={{ backgroundColor: notifOpen ? "var(--chrome-blue)" : "var(--chrome-blue-mid)" }}
            onClick={() => setNotifOpen((v) => !v)}
            aria-label="Notificações"
          >
            <Bell size={15} />
            {unreadCount > 0 && (
              <div
                className="absolute -top-1 -right-1 w-3 h-3"
                style={{ backgroundColor: "var(--chrome-green)", border: "1.5px solid var(--chrome-blue)" }}
              />
            )}
          </button>

          {notifOpen && (
            <div
              className="absolute right-0 mt-2 flex flex-col"
              style={{
                width: 310,
                zIndex: 9999,
                border: "2.5px solid var(--chrome-blue)",
                boxShadow: "4px 4px 0px var(--chrome-blue)",
                background:
                  "linear-gradient(160deg, rgba(3,71,193,0.82) 0%, rgba(2,42,110,0.95) 100%)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
              }}
            >
              {/* Title bar */}
              <div
                className="flex items-center justify-between px-3 py-1.5 flex-shrink-0"
                style={{
                  borderBottom: "2px solid var(--chrome-blue-accent)",
                  background: "linear-gradient(90deg, var(--chrome-blue-mid) 0%, var(--chrome-blue-accent) 60%, var(--chrome-blue-mid) 100%)",
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: "#ff5f57", border: "1px solid #022a6e" }}
                    />
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: "#febc2e", border: "1px solid #022a6e" }}
                    />
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: "#28c840", border: "1px solid #022a6e" }}
                    />
                  </div>
                  <span
                    className="font-mono text-chrome-blue-content uppercase"
                    style={{ fontSize: 10, letterSpacing: "0.12em" }}
                  >
                    NOTIFICAÇÕES
                  </span>
                  {unreadCount > 0 && (
                    <span
                      className="px-1.5 py-0.5 font-mono font-bold bg-chrome-green text-chrome-blue-dark border border-chrome-blue-dark"
                      style={{ fontSize: 9 }}
                    >
                      {unreadCount} novo{unreadCount > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <button
                  onClick={markAllRead}
                  className="font-mono text-chrome-blue-content underline cursor-pointer"
                  style={{
                    fontSize: 9,
                    background: "transparent",
                    border: "none",
                    letterSpacing: "0.05em",
                  }}
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
                      borderBottom:
                        i < notifications.length - 1 ? "1px solid rgba(5,96,224,0.35)" : "none",
                      background: n.unread ? "rgba(255,255,255,0.07)" : "transparent",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLDivElement).style.background =
                        "rgba(255,255,255,0.12)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLDivElement).style.background = n.unread
                        ? "rgba(255,255,255,0.07)"
                        : "transparent")
                    }
                    onClick={() =>
                      setNotifications((prev) =>
                        prev.map((x) => (x.id === n.id ? { ...x, unread: false } : x))
                      )
                    }
                  >
                    <div
                      className="flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{
                        width: 28,
                        height: 28,
                        border: "1.5px solid var(--chrome-blue-accent)",
                        background:
                          "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.25), rgba(3,71,193,0.6))",
                        fontSize: 13,
                      }}
                    >
                      {n.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-mono uppercase"
                          style={{
                            fontSize: 10,
                            color: n.unread ? "#e0eeff" : "var(--chrome-blue-text-on-dark)",
                            fontWeight: n.unread ? 700 : 400,
                            letterSpacing: "0.04em",
                          }}
                        >
                          {n.title}
                        </span>
                        {n.unread && (
                          <span
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-chrome-green"
                          />
                        )}
                      </div>
                      <p
                        className="mt-0.5 truncate font-grotesk"
                        style={{ fontSize: 11, color: "var(--chrome-blue-body)", lineHeight: 1.4 }}
                      >
                        {n.body}
                      </p>
                      <span
                        className="font-mono"
                        style={{ fontSize: 9, color: "rgba(128,176,255,0.55)", letterSpacing: "0.06em" }}
                      >
                        {n.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Panel footer */}
              <div
                className="px-3 py-2 flex items-center justify-center"
                style={{ borderTop: "2px solid var(--chrome-blue-accent)" }}
              >
                <button
                  onClick={() => {
                    markAllRead();
                    setNotifOpen(false);
                  }}
                  className="font-mono text-chrome-blue-content uppercase underline cursor-pointer"
                  style={{
                    fontSize: 10,
                    background: "transparent",
                    border: "none",
                    letterSpacing: "0.1em",
                  }}
                >
                  marcar lidas e fechar →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User area */}
        {session?.user ? (
          <div className="flex items-center gap-2">
            {/* Avatar + name — links to profile settings */}
            <Link
              href="/minha-conta"
              className="flex items-center gap-2"
              style={{ textDecoration: "none" }}
              title="Minha conta"
            >
              <div className="w-9 h-9 overflow-hidden relative flex-shrink-0 border-2 border-chrome-blue-accent">
                {(session.user.avatarUrl ?? session.user.image) ? (
                  <Image
                    src={session.user.avatarUrl ?? session.user.image!}
                    alt={session.user.displayName ?? session.user.name ?? "avatar"}
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-chrome-blue-mid flex items-center justify-center font-mono text-chrome-blue-content" style={{ fontSize: 14 }}>
                    {(session.user.displayName ?? session.user.name)?.[0]?.toUpperCase() ?? "?"}
                  </div>
                )}
              </div>
              <span
                className="hidden sm:block font-mono font-bold text-chrome-blue-content truncate max-w-[90px]"
                style={{ fontSize: "11px" }}
              >
                {(session.user.displayName ?? session.user.name?.split(" ")[0])?.toUpperCase()}
              </span>
            </Link>

            {/* Sign out */}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center justify-center w-9 h-9 cursor-pointer border-2 border-chrome-blue-accent bg-chrome-blue-mid text-chrome-blue-content"
              title="Sair"
              style={{ transition: "background-color 0.15s, color 0.15s, transform 0.15s" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--chrome-red)";
                e.currentTarget.style.borderColor = "var(--chrome-red)";
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.transform = "scale(1.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--chrome-blue-mid)";
                e.currentTarget.style.borderColor = "var(--chrome-blue-accent)";
                e.currentTarget.style.color = "var(--chrome-blue-content)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-1.5 px-3 h-9 font-mono font-bold border-2 border-chrome-blue-accent bg-chrome-blue-mid text-chrome-blue-content"
            style={{ fontSize: "11px", textDecoration: "none" }}
          >
            <LogIn size={13} />
            <span className="hidden sm:block">ENTRAR</span>
          </Link>
        )}
      </div>
    </header>
  );
}
