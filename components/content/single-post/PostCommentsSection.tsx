"use client";

import { useState } from "react";
import { RetroWindow } from "@/components/ui/RetroWindow";
import { WavyText } from "@/components/ui/WavyText";
import { Pagination } from "@/components/ui/Pagination";
import { AppImage } from "@/components/ui/AppImage";

export interface PostComment {
  name: string;
  role: string;
  avatar: string;
  text: string;
  date: string;
  likes: number;
  rating: number;
}

interface PostCommentsSectionProps {
  comments: PostComment[];
}

const COMMENTS_PER_PAGE = 3;
const COMMENT_ACCENTS = ["#c084fc", "#4ade80", "#f59e0b"];
const REACTION_SETS = [
  [
    { emoji: "❤️", count: 12 },
    { emoji: "🔥", count: 7 },
    { emoji: "👏", count: 3 },
  ],
  [
    { emoji: "❤️", count: 8 },
    { emoji: "🔥", count: 14 },
    { emoji: "👏", count: 6 },
  ],
  [
    { emoji: "❤️", count: 19 },
    { emoji: "🔥", count: 5 },
    { emoji: "👏", count: 11 },
  ],
];

export function PostCommentsSection({ comments }: PostCommentsSectionProps) {
  const [commentPage, setCommentPage] = useState(1);
  const totalPages = Math.ceil(comments.length / COMMENTS_PER_PAGE);
  const paginatedComments = comments.slice(
    (commentPage - 1) * COMMENTS_PER_PAGE,
    commentPage * COMMENTS_PER_PAGE
  );

  return (
    <RetroWindow title="POST-COMMENTS.EXE" variant="dark">
      <div className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
          <WavyText
            text="DISCUSSAO"
            variant="stacked"
            fontSize="clamp(16px, 2vw, 26px)"
            color="#fff"
          />
          <span
            className="flex-shrink-0"
            style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", color: "#a0c4ff" }}
          >
            {comments.length} RESPONSES
          </span>
        </div>

        {/* Comment input */}
        <div
          className="mb-5 p-3"
          style={{ border: "2px solid #0560e0", backgroundColor: "#0458d4" }}
        >
          <div
            className="mb-2"
            style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", color: "#a0c4ff" }}
          >
            {">"} ESCREVA SEU COMENTARIO_
          </div>
          <textarea
            placeholder="O que voce achou deste manifesto?..."
            className="w-full bg-transparent outline-none resize-none"
            rows={3}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "13px",
              color: "#c0d8ff",
              border: "none",
            }}
          />
          <div className="flex justify-end mt-2">
            <button
              className="px-4 py-1.5 cursor-pointer"
              style={{
                backgroundColor: "#fff",
                color: "#0347c1",
                border: "2px solid #022a6e",
                fontFamily: "'Space Mono', monospace",
                fontSize: "10px",
                fontWeight: 700,
                boxShadow: "2px 2px 0 #022a6e",
              }}
            >
              ENVIAR
            </button>
          </div>
        </div>

        {/* Comments list */}
        <div className="flex flex-col gap-3">
          {paginatedComments.map((comment, i) => {
            const globalIndex = (commentPage - 1) * COMMENTS_PER_PAGE + i;
            const accent = COMMENT_ACCENTS[globalIndex % COMMENT_ACCENTS.length];
            const reactions = REACTION_SETS[globalIndex % REACTION_SETS.length];
            const fullStars = Math.floor(comment.rating);
            const hasHalf = comment.rating - fullStars >= 0.3;

            return (
              <div
                key={globalIndex}
                className="flex flex-col relative overflow-hidden group"
                style={{
                  border: `2px solid ${accent}44`,
                  background: `linear-gradient(135deg, #0347c1 0%, #0458d4 40%, ${accent}18 100%)`,
                  backdropFilter: "blur(8px)",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.3s ease",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translate(-3px, -3px)";
                  e.currentTarget.style.boxShadow = `6px 6px 0 #022a6e, 0 0 20px ${accent}20`;
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
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%)",
                    transition: "opacity 0.3s ease",
                  }}
                />

                {/* Decorative quote mark */}
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

                {/* Title bar */}
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
                        border: "1px solid #022a6e",
                        boxShadow: `0 0 6px ${accent}60`,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "8px",
                        color: "#a0c4ff",
                        letterSpacing: "0.05em",
                      }}
                    >
                      COMMENT-{String(globalIndex + 1).padStart(2, "0")}.TXT
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <div
                      className="w-2 h-2"
                      style={{ backgroundColor: "#0560e0", border: "1px solid #022a6e" }}
                    />
                    <div
                      className="w-2 h-2"
                      style={{ backgroundColor: "#e05050", border: "1px solid #022a6e" }}
                    />
                  </div>
                </div>

                {/* Card body */}
                <div className="p-4 flex flex-col flex-1 relative z-10">
                  {/* Header: avatar + info + rating */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative flex-shrink-0">
                        <div
                          className="w-10 h-10 rounded-full overflow-hidden relative"
                          style={{
                            border: `2.5px solid ${accent}`,
                            boxShadow: `0 0 10px ${accent}40, inset 0 0 6px ${accent}20`,
                          }}
                        >
                          <AppImage
                            src={comment.avatar}
                            alt={comment.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <div
                          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: "#4ade80",
                            border: "2px solid #0347c1",
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
                          color="#fff"
                        />
                        <div className="flex items-center gap-1.5" style={{ marginTop: "1px" }}>
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

                    {/* Star rating */}
                    <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                      <div className="flex items-center gap-[2px]">
                        {Array.from({ length: 5 }).map((_, s) => (
                          <svg key={s} width="11" height="11" viewBox="0 0 20 20">
                            <polygon
                              points="10,1 13,7 19,7.5 14.5,12 16,18 10,15 4,18 5.5,12 1,7.5 7,7"
                              fill={
                                s < fullStars
                                  ? accent
                                  : s === fullStars && hasHalf
                                    ? `${accent}55`
                                    : "#0560e0"
                              }
                              stroke="#022a6e"
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

                  {/* Quote body */}
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
                        color: "#a0c4ff",
                        paddingLeft: "14px",
                        paddingTop: "1px",
                      }}
                    >
                      {comment.text}
                    </p>
                  </div>

                  {/* Bottom bar: reactions + timestamp */}
                  <div
                    className="flex items-center justify-between pt-2.5 mt-auto flex-wrap gap-2"
                    style={{ borderTop: `1px solid ${accent}22` }}
                  >
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
                            color: "#a0c4ff",
                            transition: "all 0.15s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = `${accent}15`;
                            e.currentTarget.style.borderColor = `${accent}50`;
                            e.currentTarget.style.color = "#fff";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                            e.currentTarget.style.borderColor = `${accent}25`;
                            e.currentTarget.style.color = "#a0c4ff";
                          }}
                        >
                          <span style={{ fontSize: "10px" }}>{r.emoji}</span>
                          <span>{r.count}</span>
                        </button>
                      ))}
                    </div>
                    <span
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "8px",
                        color: "#3a6aaa",
                        letterSpacing: "0.03em",
                      }}
                    >
                      {comment.date}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Pagination
          currentPage={commentPage}
          totalPages={totalPages}
          totalItems={comments.length}
          itemsPerPage={COMMENTS_PER_PAGE}
          onPageChange={setCommentPage}
        />
      </div>
    </RetroWindow>
  );
}
