"use client";

import Link from "next/link";
import { WavyText } from "@/components/ui/WavyText";
import { RetroWindow } from "@/components/ui/RetroWindow";
import { AppImage } from "@/components/ui/AppImage";

const engagementData = [
  { day: "Seg", value: 24 },
  { day: "Ter", value: 38 },
  { day: "Qua", value: 15 },
  { day: "Qui", value: 52 },
  { day: "Sex", value: 45 },
  { day: "Sab", value: 30 },
  { day: "Dom", value: 60 },
];

const barColors = ["var(--arm-panel-bg-darker)", "#4ade80", "#e05050", "#c084fc", "var(--arm-panel-bg-darker)", "#4ade80", "#e05050"];

const comments = [
  {
    name: "Nicol W.",
    role: "Dev. Criativa",
    avatar:
      "https://images.unsplash.com/photo-1563669528538-1f3d1d08791b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHdvbWFuJTIwY3JlYXRpdmUlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzI4MzI1MDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.6,
    text: "O manifesto sobre algoritmos mudou minha perspectiva. Desde que comecei a explorar, minha arte digital ganhou uma camada de profundidade que antes nao existia.",
  },
  {
    name: "Vane F.",
    role: "Artista Digital",
    avatar:
      "https://images.unsplash.com/photo-1759287029376-f025fef629d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHlvdW5nJTIwd29tYW4lMjBnbGFzc2VzJTIwY3JlYXRpdmV8ZW58MXx8fHwxNzcyODMyNTA5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.3,
    text: "Experiencia brilhante de leitura. Muito interativo. Literalmente uma revolucao se voce esta aprendendo arte digital tardiamente. Adoro como mistura poesia e codigo.",
  },
  {
    name: "Marco T.",
    role: "Eng. de Software",
    avatar:
      "https://images.unsplash.com/photo-1561313021-b52621b123b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMG1hbiUyMGJlYXJkJTIwY3JlYXRpdmV8ZW58MXx8fHwxNzcyODMyNTA5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.7,
    text: "Senti que aprendi conceitos novos em uma semana. Adoro como ela usa a pratica e propoe desafios criativos para ajudar o leitor a entender um novo conceito e assunto.",
  },
];

export function CommentsSection() {
  return (
    <RetroWindow title="COMMUNITY-REVIEWS.EXE" variant="dark">
      <div className="p-5">
        {/* Top row */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
          <WavyText
            text="COMENTARIOS DA COMUNIDADE"
            variant="stacked"
            fontSize="clamp(16px, 2vw, 26px)"
            color="var(--arm-panel-text)"
          />
          <Link
            href="/posts"
            className="px-4 py-1.5 flex-shrink-0 cursor-pointer self-start transition-all duration-150 hover:brightness-125 hover:-translate-y-px"
            style={{
              border: "2px solid var(--arm-panel-border)",
              backgroundColor: "var(--arm-panel-bg)",
              fontFamily: "'Space Mono', monospace",
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--arm-panel-text-soft)",
              textDecoration: "none",
            }}
          >
            Ver todos
          </Link>
        </div>

        {/* Stats + Comments grid */}
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Left stats */}
          <div className="lg:flex-shrink-0 lg:w-[170px] w-full">
            <div className="flex items-center gap-2 mb-2">
              <svg width="18" height="18" viewBox="0 0 20 20">
                <polygon
                  points="10,1 13,7 19,7.5 14.5,12 16,18 10,15 4,18 5.5,12 1,7.5 7,7"
                  fill="#4ade80"
                  stroke="var(--arm-panel-bg-deep)"
                  strokeWidth="1.5"
                />
              </svg>
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: "26px",
                  color: "var(--arm-panel-text)",
                }}
              >
                4.4 / 5.0
              </span>
            </div>
            <div
              className="mt-3"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "38px",
                lineHeight: 1,
                color: "var(--arm-panel-text-soft)",
              }}
            >
              127
            </div>
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "10px",
                color: "var(--arm-panel-text-muted)",
              }}
            >
              comentarios<br />da comunidade
            </div>

            {/* Engagement chart */}
            <div className="mt-4">
              <WavyText
                text="ENGAJAMENTO"
                variant="linear-wave"
                fontSize={12}
                amplitude={2}
                frequency={0.25}
                color="#4ade80"
              />
              <div
                className="mt-2 p-2"
                style={{ border: "2px solid var(--arm-panel-border)", backgroundColor: "var(--arm-panel-bg)" }}
              >
                {/* Custom CSS bar chart */}
                <div className="flex items-end justify-between gap-[3px]" style={{ height: 64 }}>
                  {engagementData.map((entry, i) => {
                    const maxVal = Math.max(...engagementData.map(d => d.value));
                    const heightPct = (entry.value / maxVal) * 100;
                    return (
                      <div key={entry.day} className="flex flex-col items-center flex-1 h-full justify-end">
                        <div
                          style={{
                            width: "100%",
                            maxWidth: 12,
                            height: `${heightPct}%`,
                            backgroundColor: barColors[i],
                            border: "1.5px solid var(--arm-panel-bg-deep)",
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
                {/* X-axis labels */}
                <div
                  className="flex justify-between mt-1"
                  style={{ borderTop: "2px solid var(--arm-panel-border)", paddingTop: 2 }}
                >
                  {engagementData.map((entry) => (
                    <span
                      key={entry.day}
                      className="flex-1 text-center"
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "8px",
                        color: "var(--arm-panel-text-muted)",
                      }}
                    >
                      {entry.day}
                    </span>
                  ))}
                </div>
              </div>

              {/* Progress bar decoration */}
              <div className="mt-3">
                <div
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "8px",
                    color: "var(--arm-panel-text-muted)",
                    marginBottom: "3px",
                  }}
                >
                  DOWNLOADING... 87%
                </div>
                <div
                  className="h-2.5 w-full"
                  style={{ border: "2px solid var(--arm-panel-border)", backgroundColor: "var(--arm-panel-bg-deep)" }}
                >
                  <div
                    className="h-full"
                    style={{ width: "87%", backgroundColor: "var(--arm-panel-text-soft)" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Comment cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 lg:flex-1 min-w-0">
            {comments.map((comment, i) => {
              const accents = ["#c084fc", "#4ade80", "#f59e0b"];
              const accent = accents[i % accents.length];
              const fullStars = Math.floor(comment.rating);
              const hasHalf = comment.rating - fullStars >= 0.3;
              const reactions = [
                { emoji: "❤️", count: [12, 8, 19][i] },
                { emoji: "🔥", count: [7, 14, 5][i] },
                { emoji: "👏", count: [3, 6, 11][i] },
              ];

              return (
                <div
                  key={i}
                  className="flex flex-col relative overflow-hidden group"
                  style={{
                    border: `2px solid ${accent}44`,
                    background: `linear-gradient(135deg, var(--arm-panel-bg-darker) 0%, var(--arm-panel-bg) 40%, ${accent}18 100%)`,
                    backdropFilter: "blur(8px)",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.3s ease",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translate(-3px, -3px)";
                    e.currentTarget.style.boxShadow = `6px 6px 0 var(--arm-panel-bg-deep), 0 0 20px ${accent}20`;
                    e.currentTarget.style.borderColor = `${accent}88`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translate(0, 0)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = `${accent}44`;
                  }}
                >
                  {/* Left accent stripe */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-[3px]"
                    style={{ backgroundColor: accent }}
                  />

                  {/* Glass sheen overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
                    style={{
                      background: `linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%)`,
                      transition: "opacity 0.3s ease",
                    }}
                  />

                  {/* Background decorative quote mark */}
                  <div
                    className="absolute pointer-events-none select-none"
                    style={{
                      top: "12px",
                      right: "8px",
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "64px",
                      fontWeight: 700,
                      lineHeight: 1,
                      color: accent,
                      opacity: 0.07,
                    }}
                  >
                    &ldquo;
                  </div>

                  {/* Title bar with accent */}
                  <div
                    className="flex items-center justify-between px-3 py-1.5"
                    style={{
                      background: `linear-gradient(90deg, ${accent}30, transparent)`,
                      borderBottom: `1px solid ${accent}33`,
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-2 h-2"
                        style={{
                          backgroundColor: accent,
                          border: "1px solid var(--arm-panel-bg-deep)",
                          boxShadow: `0 0 6px ${accent}60`,
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: "8px",
                          color: "var(--arm-panel-text-muted)",
                          letterSpacing: "0.05em",
                        }}
                      >
                        REVIEW-{String(i + 1).padStart(2, "0")}.TXT
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2" style={{ backgroundColor: "var(--arm-panel-border)", border: "1px solid var(--arm-panel-bg-deep)" }} />
                      <div className="w-2 h-2" style={{ backgroundColor: "#e05050", border: "1px solid var(--arm-panel-bg-deep)" }} />
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-4 flex flex-col flex-1 relative z-10">
                    {/* Header row: avatar + info + rating */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Glowing avatar */}
                        <div className="relative flex-shrink-0">
                          <div
                            className="w-10 h-10 rounded-full overflow-hidden"
                            style={{
                              border: `2.5px solid ${accent}`,
                              boxShadow: `0 0 10px ${accent}40, inset 0 0 6px ${accent}20`,
                            }}
                          >
                            <AppImage
                              src={comment.avatar}
                              alt={comment.name}
                              width={40}
                              height={40}
                              sizes="40px"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {/* Online indicator */}
                          <div
                            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: "#4ade80",
                              border: "2px solid var(--arm-panel-bg-darker)",
                              boxShadow: "0 0 6px #4ade8060",
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <WavyText
                            text={comment.name}
                            variant="linear-wave"
                            fontSize={14}
                            amplitude={2}
                            frequency={0.3}
                            color="var(--arm-panel-text)"
                          />
                          <div
                            className="flex items-center gap-1.5"
                            style={{ marginTop: "1px" }}
                          >
                            <span
                              className="px-1.5 py-0.5"
                              style={{
                                fontFamily: "'Space Mono', monospace",
                                fontSize: "8px",
                                fontWeight: 700,
                                color: accent,
                                backgroundColor: `${accent}18`,
                                border: `1px solid ${accent}30`,
                              }}
                            >
                              {comment.role.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Star rating visual */}
                      <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                        <div className="flex items-center gap-[2px]">
                          {Array.from({ length: 5 }).map((_, s) => (
                            <svg key={s} width="11" height="11" viewBox="0 0 20 20">
                              <polygon
                                points="10,1 13,7 19,7.5 14.5,12 16,18 10,15 4,18 5.5,12 1,7.5 7,7"
                                fill={s < fullStars ? accent : (s === fullStars && hasHalf) ? `${accent}55` : "var(--arm-panel-border)"}
                                stroke="var(--arm-panel-bg-deep)"
                                strokeWidth="1"
                              />
                            </svg>
                          ))}
                        </div>
                        <span
                          style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: "9px",
                            fontWeight: 700,
                            color: accent,
                          }}
                        >
                          {comment.rating}/5
                        </span>
                      </div>
                    </div>

                    {/* Quote body with terminal feel */}
                    <div
                      className="flex-1 relative pl-3 mb-3"
                      style={{ borderLeft: `2px solid ${accent}40` }}
                    >
                      <span
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: "14px",
                          fontWeight: 700,
                          color: accent,
                          opacity: 0.6,
                          lineHeight: 1,
                          position: "absolute",
                          top: "-2px",
                          left: "8px",
                        }}
                      >
                        &gt;
                      </span>
                      <p
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: "10px",
                          lineHeight: 1.7,
                          color: "var(--arm-panel-text-body)",
                          paddingLeft: "14px",
                          paddingTop: "1px",
                        }}
                      >
                        {comment.text}
                      </p>
                    </div>

                    {/* Bottom bar: reactions + timestamp */}
                    <div
                      className="flex items-center justify-between pt-2.5 mt-auto"
                      style={{ borderTop: `1px solid ${accent}22` }}
                    >
                      {/* Reaction buttons */}
                      <div className="flex items-center gap-1.5">
                        {reactions.map((r, ri) => (
                          <button
                            key={ri}
                            className="flex items-center gap-1 px-1.5 py-0.5 cursor-pointer"
                            style={{
                              backgroundColor: "transparent",
                              border: `1px solid ${accent}25`,
                              fontFamily: "'Space Mono', monospace",
                              fontSize: "9px",
                              color: "var(--arm-panel-text-muted)",
                              transition: "all 0.15s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = `${accent}15`;
                              e.currentTarget.style.borderColor = `${accent}50`;
                              e.currentTarget.style.color = "var(--arm-panel-text)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "transparent";
                              e.currentTarget.style.borderColor = `${accent}25`;
                              e.currentTarget.style.color = "var(--arm-panel-text-muted)";
                            }}
                          >
                            <span style={{ fontSize: "10px" }}>{r.emoji}</span>
                            <span>{r.count}</span>
                          </button>
                        ))}
                      </div>

                      {/* Timestamp */}
                      <span
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: "8px",
                          color: "var(--arm-panel-text-dim)",
                          letterSpacing: "0.03em",
                        }}
                      >
                        {["2h ago", "1d ago", "3d ago"][i]}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </RetroWindow>
  );
}
