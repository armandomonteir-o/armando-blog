"use client";

import Link from "next/link";
import { Code2, Share2, Camera, Mail, Rss } from "lucide-react";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Sobre", path: "/sobre" },
  { label: "Playlists", path: "/playlists" },
  { label: "Músicas", path: "/categoria/musicas" },
  { label: "Filmes", path: "/categoria/filmes" },
  { label: "Livros", path: "/categoria/livros" },
];

const socialLinks = [
  { icon: Code2, label: "GitHub", href: "#" },
  { icon: Share2, label: "Twitter/X", href: "#" },
  { icon: Camera, label: "Instagram", href: "#" },
  { icon: Mail, label: "Email", href: "mailto:oi@armando.blog" },
  { icon: Rss, label: "RSS", href: "#" },
];

interface FooterProps {
  contextLabel?: string;
}

export function Footer({ contextLabel }: FooterProps) {
  return (
    <footer
      className="mt-8 mb-4"
      style={{ borderTop: "3px solid var(--arm-border)", paddingTop: "24px" }}
    >
      <div className="flex flex-col gap-5 px-6">
        {/* Top row: branding + social */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              style={{
                fontFamily: "'Bungee Shade', sans-serif",
                fontSize: "14px",
                fontWeight: 700,
                color: "var(--arm-blue)",
                letterSpacing: "0.08em",
                opacity: "var(--arm-brand-opacity)",
              }}
            >
              ARMANDO
            </div>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "9px",
                color: "var(--arm-text-secondary)",
              }}
            >
              · ARTE & TECNOLOGIA DIGITAL ·
            </span>
          </div>

          <div className="flex items-center gap-2">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                title={s.label}
                className="flex items-center justify-center w-7 h-7 transition-colors"
                style={{
                  border: "2px solid var(--arm-border)",
                  backgroundColor: "var(--arm-bg-card)",
                  color: "var(--arm-text-secondary)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--arm-blue)";
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.borderColor = "var(--arm-blue)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--arm-bg-card)";
                  e.currentTarget.style.color = "var(--arm-text-secondary)";
                  e.currentTarget.style.borderColor = "var(--arm-border)";
                }}
              >
                <s.icon size={13} />
              </a>
            ))}
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex flex-wrap gap-x-4 gap-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "10px",
                color: "var(--arm-text-secondary)",
                textDecoration: "none",
                letterSpacing: "0.04em",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--arm-blue)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--arm-text-secondary)";
              }}
            >
              {link.label.toUpperCase()}
            </Link>
          ))}
        </nav>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "9px",
              color: "var(--arm-text-muted)",
              letterSpacing: "0.05em",
            }}
          >
            © 2026 ARMANDO. FEITO COM PIXELS E CAFE.
            {contextLabel && (
              <span style={{ marginLeft: "8px", color: "var(--arm-text-secondary)" }}>
                · {contextLabel} ·
              </span>
            )}
          </span>
          <div className="flex items-center gap-3 opacity-30">
            <svg width="30" height="30" viewBox="0 0 60 60">
              <ellipse
                cx="30"
                cy="30"
                rx="28"
                ry="28"
                fill="none"
                stroke="var(--arm-text)"
                strokeWidth="1.5"
              />
              <ellipse
                cx="30"
                cy="30"
                rx="18"
                ry="28"
                fill="none"
                stroke="var(--arm-text)"
                strokeWidth="1"
              />
              <ellipse
                cx="30"
                cy="30"
                rx="8"
                ry="28"
                fill="none"
                stroke="var(--arm-text)"
                strokeWidth="1"
              />
              <line x1="2" y1="20" x2="58" y2="20" stroke="var(--arm-text)" strokeWidth="1" />
              <line x1="2" y1="30" x2="58" y2="30" stroke="var(--arm-text)" strokeWidth="1" />
              <line x1="2" y1="40" x2="58" y2="40" stroke="var(--arm-text)" strokeWidth="1" />
            </svg>
            <svg width="14" height="18" viewBox="0 0 16 20">
              <polygon points="0,0 0,16 4,12 8,20 10,19 6,11 12,11" fill="var(--arm-text)" />
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
}
