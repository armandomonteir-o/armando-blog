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

const barColors = [
  "var(--arm-panel-bg-darker)",
  "#4ade80",
  "#e05050",
  "#c084fc",
  "var(--arm-panel-bg-darker)",
  "#4ade80",
  "#e05050",
];

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
            className="px-4 py-1.5 flex-shrink-0 cursor-pointer self-start transition-all duration-150 hover:brightness-125 hover:-translate-y-px font-mono font-bold"
            style={{
              border: "2px solid var(--arm-panel-border)",
              backgroundColor: "var(--arm-panel-bg)",
              fontSize: "11px",
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
                  fill="var(--chrome-green)"
                  stroke="var(--arm-panel-bg-deep)"
                  strokeWidth="1.5"
                />
              </svg>
              <span
                className="font-grotesk font-bold"
                style={{ fontSize: "26px", color: "var(--arm-panel-text)" }}
              >
                4.4 / 5.0
              </span>
            </div>
            <div
              className="mt-3 font-grotesk font-bold"
              style={{ fontSize: "38px", lineHeight: 1, color: "var(--arm-panel-text-soft)" }}
            >
              127
            </div>
            <div
              className="font-mono"
              style={{ fontSize: "10px", color: "var(--arm-panel-text-muted)" }}
            >
              comentarios
              <br />
              da comunidade
            </div>

            {/* Engagement chart */}
            <div className="mt-4">
              <WavyText
                text="ENGAJAMENTO"
                variant="linear-wave"
                fontSize={12}
                amplitude={2}
                frequency={0.25}
                color="var(--chrome-green)"
              />
              <div
                className="mt-2 p-2"
                style={{
                  border: "2px solid var(--arm-panel-border)",
                  backgroundColor: "var(--arm-panel-bg)",
                }}
              >
                {/* Custom CSS bar chart */}
                <div className="flex items-end justify-between gap-[3px]" style={{ height: 64 }}>
                  {engagementData.map((entry, i) => {
                    const maxVal = Math.max(...engagementData.map((d) => d.value));
                    const heightPct = (entry.value / maxVal) * 100;
                    return (
                      <div
                        key={entry.day}
                        className="flex flex-col items-center flex-1 h-full justify-end"
                      >
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
                      className="flex-1 text-center font-mono"
                      style={{ fontSize: "8px", color: "var(--arm-panel-text-muted)" }}
                    >
                      {entry.day}
                    </span>
                  ))}
                </div>
              </div>

              {/* Progress bar decoration */}
              <div className="mt-3">
                <div
                  className="font-mono"
                  style={{
                    fontSize: "8px",
                    color: "var(--arm-panel-text-muted)",
                    marginBottom: "3px",
                  }}
                >
                  DOWNLOADING... 87%
                </div>
                <div
                  className="h-2.5 w-full"
                  style={{
                    border: "2px solid var(--arm-panel-border)",
                    backgroundColor: "var(--arm-panel-bg-deep)",
                  }}
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
              const fullStars = Math.floor(comment.rating);
              const hasHalf = comment.rating - fullStars >= 0.3;

              return (
                <div
                  key={i}
                  className="flex flex-col relative overflow-hidden"
                  style={{
                    border: "2px solid var(--arm-panel-border)",
                    background: "var(--arm-panel-bg)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translate(-2px, -2px)";
                    e.currentTarget.style.boxShadow = "4px 4px 0 var(--arm-panel-bg-deep)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translate(0, 0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Left stripe */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-[3px]"
                    style={{ backgroundColor: "var(--arm-panel-text-soft)" }}
                  />

                  {/* Title bar */}
                  <div
                    className="flex items-center justify-between px-3 py-1.5"
                    style={{
                      background: "var(--arm-panel-bg-deep)",
                      borderBottom: "1px solid var(--arm-panel-border)",
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-2 h-2 bg-chrome-blue-accent"
                        style={{ border: "1px solid var(--arm-panel-bg-deep)" }}
                      />
                      <span
                        className="font-mono"
                        style={{
                          fontSize: "8px",
                          color: "var(--arm-panel-text-muted)",
                          letterSpacing: "0.05em",
                        }}
                      >
                        REVIEW-{String(i + 1).padStart(2, "0")}.TXT
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <div
                        className="w-2 h-2"
                        style={{
                          backgroundColor: "var(--arm-panel-border)",
                          border: "1px solid var(--arm-panel-bg-deep)",
                        }}
                      />
                      <div
                        className="w-2 h-2 bg-chrome-red"
                        style={{ border: "1px solid var(--arm-panel-bg-deep)" }}
                      />
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-4 pl-5 flex flex-col flex-1 gap-3">
                    {/* Header: avatar + info + rating */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-10 h-10 overflow-hidden relative flex-shrink-0"
                          style={{ border: "2px solid var(--arm-panel-border)" }}
                        >
                          <AppImage
                            src={comment.avatar}
                            alt={comment.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p
                            className="font-grotesk font-bold text-sm leading-tight"
                            style={{ color: "var(--arm-panel-text)" }}
                          >
                            {comment.name}
                          </p>
                          <p
                            className="font-mono mt-0.5"
                            style={{ fontSize: "8px", color: "var(--arm-panel-text-body)" }}
                          >
                            {comment.role.toUpperCase()}
                          </p>
                        </div>
                      </div>

                      {/* Star rating */}
                      <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                        <div className="flex items-center gap-[2px]">
                          {Array.from({ length: 5 }).map((_, s) => (
                            <svg key={s} width="11" height="11" viewBox="0 0 20 20">
                              <polygon
                                points="10,1 13,7 19,7.5 14.5,12 16,18 10,15 4,18 5.5,12 1,7.5 7,7"
                                fill={
                                  s < fullStars
                                    ? "#ffffff"
                                    : s === fullStars && hasHalf
                                      ? "#ffffff66"
                                      : "var(--arm-panel-border)"
                                }
                                stroke="var(--arm-panel-bg-deep)"
                                strokeWidth="1"
                              />
                            </svg>
                          ))}
                        </div>
                        <span
                          className="font-mono font-bold"
                          style={{ fontSize: "9px", color: "var(--arm-panel-text)" }}
                        >
                          {comment.rating}/5
                        </span>
                      </div>
                    </div>

                    {/* Comment text */}
                    <p
                      className="font-mono flex-1"
                      style={{
                        fontSize: "10px",
                        lineHeight: 1.7,
                        color: "var(--arm-panel-text-body)",
                      }}
                    >
                      {comment.text}
                    </p>

                    {/* Footer */}
                    <div
                      className="flex items-center pt-2 mt-auto"
                      style={{ borderTop: "1px solid var(--arm-panel-border)" }}
                    >
                      <span
                        className="font-mono"
                        style={{
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
