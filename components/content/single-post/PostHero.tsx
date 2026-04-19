"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, Heart, MessageCircle, Share2, Bookmark, ChevronRight } from "lucide-react";
import { WavyText } from "@/components/ui/WavyText";

interface PostHeroProps {
  title: string;
  subtitle: string;
  category: string;
  date: string;
  readTime: string;
  reads: number;
  likes: number;
  comments: number;
  heroImage: string;
  categoryColors: Record<string, string>;
}

export function PostHero({
  title,
  subtitle,
  category,
  date,
  readTime,
  reads,
  likes,
  comments,
  heroImage,
  categoryColors,
}: PostHeroProps) {
  const [saved, setSaved] = useState(false);

  const breadcrumbs = [
    { href: "/", label: "HOME" },
    { label: category.toUpperCase() },
    { label: title },
  ];

  return (
    <div className="relative" style={{ minHeight: "420px", overflow: "hidden" }}>
      {/* Hero image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          backgroundAttachment: "fixed",
        }}
      />
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)",
        }}
      />
      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(3,71,193,0.15) 0%, rgba(2,42,110,0.5) 50%, rgba(2,42,110,0.85) 80%, #022a6e 100%)",
        }}
      />
      {/* Glass sheen */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 40%, rgba(255,255,255,0.03) 80%)",
        }}
      />

      {/* Aero orbs */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 200,
          height: 200,
          top: "-60px",
          right: "10%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 35% 35%, rgba(128,176,255,0.3), rgba(128,176,255,0.05), transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 120,
          height: 120,
          bottom: "20px",
          left: "5%",
          borderRadius: "50%",
          background: "radial-gradient(circle at 35% 35%, rgba(74,222,128,0.2), transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      {/* Hero content */}
      <div
        className="relative z-10 flex flex-col justify-end"
        style={{
          minHeight: "420px",
          padding: "clamp(16px, 4vw, 32px)",
          paddingBottom: "clamp(24px, 4vw, 40px)",
        }}
      >
        {/* Back + breadcrumbs */}
        <div className="flex flex-col gap-2 mb-5">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3 py-1.5 self-start"
            style={{
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(12px)",
              border: "2px solid rgba(255,255,255,0.25)",
              color: "#fff",
              fontFamily: "'Space Mono', monospace",
              fontSize: "10px",
              fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            }}
          >
            <ArrowLeft size={14} />
            VOLTAR
          </Link>
          <nav className="flex items-center gap-1 flex-wrap">
            {breadcrumbs.map((crumb, i, arr) => (
              <span key={i} className="inline-flex items-center gap-1">
                {i > 0 && (
                  <ChevronRight size={10} style={{ color: "rgba(255,255,255,0.4)" }} />
                )}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "9px",
                      color: "rgba(255,255,255,0.6)",
                      textDecoration: "none",
                    }}
                  >
                    {crumb.label}
                  </Link>
                ) : i < arr.length - 1 ? (
                  <span
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "9px",
                      color: "rgba(255,255,255,0.6)",
                    }}
                  >
                    {crumb.label}
                  </span>
                ) : (
                  <span
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "9px",
                      color: "#fff",
                      maxWidth: "200px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      display: "inline-block",
                    }}
                  >
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        </div>

        {/* Category + date */}
        <div className="flex items-center gap-3 mb-3">
          <span
            className="px-2.5 py-0.5"
            style={{
              backgroundColor: categoryColors[category] || "#0347c1",
              border: "2px solid #022a6e",
              fontFamily: "'Space Mono', monospace",
              fontSize: "9px",
              fontWeight: 700,
              color: "#022a6e",
            }}
          >
            {category.toUpperCase()}
          </span>
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "10px",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            {date} · {readTime} de leitura
          </span>
        </div>

        {/* Title */}
        <WavyText
          text={title}
          fontSize={48}
          amplitude={12}
          frequency={0.15}
          color="#fff"
          strokeColor="#80b0ff"
        />

        {/* Subtitle */}
        <p
          className="mt-3 max-w-[650px]"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "16px",
            lineHeight: 1.5,
            color: "rgba(255,255,255,0.8)",
          }}
        >
          {subtitle}
        </p>

        {/* Stats bar */}
        <div
          className="flex flex-wrap items-center gap-3 sm:gap-5 mt-5 px-4 py-2.5"
          style={{
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.2)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15)",
          }}
        >
          {(
            [
              { icon: Eye, value: reads, label: "leituras" },
              { icon: Heart, value: likes, label: "curtidas" },
              { icon: MessageCircle, value: comments, label: "comentarios" },
            ] as const
          ).map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-1.5"
              style={{ color: "rgba(255,255,255,0.8)" }}
            >
              <stat.icon size={14} />
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: "14px",
                }}
              >
                {stat.value}
              </span>
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "9px",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
          <div
            className="flex items-center gap-2 ml-3"
            style={{ borderLeft: "1px solid rgba(255,255,255,0.2)", paddingLeft: "12px" }}
          >
            <button
              className="cursor-pointer"
              title="Compartilhar"
              style={{ color: "rgba(255,255,255,0.7)", background: "none", border: "none" }}
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
            >
              <Share2 size={14} />
            </button>
            <button
              className="cursor-pointer"
              title="Salvar"
              style={{
                color: saved ? "#f59e0b" : "rgba(255,255,255,0.7)",
                background: "none",
                border: "none",
              }}
              onClick={() => setSaved((s) => !s)}
            >
              <Bookmark size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
