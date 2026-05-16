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
          <span className="flex-shrink-0 font-mono text-chrome-blue-body" style={{ fontSize: "9px" }}>
            {comments.length} RESPONSES
          </span>
        </div>

        {/* Comment input */}
        <div className="mb-5 p-3 border-2 border-chrome-blue-accent bg-chrome-blue-mid">
          <div className="mb-2 font-mono text-chrome-blue-body" style={{ fontSize: "9px" }}>
            {">"} ESCREVA SEU COMENTARIO_
          </div>
          <textarea
            placeholder="O que voce achou deste manifesto?..."
            className="w-full bg-transparent outline-none resize-none font-grotesk text-chrome-blue-content"
            rows={3}
            style={{ fontSize: "13px", border: "none" }}
          />
          <div className="flex justify-end mt-2">
            <button
              className="px-4 py-1.5 cursor-pointer font-mono font-bold bg-white text-chrome-blue border-2 border-chrome-blue-dark"
              style={{ fontSize: "10px", boxShadow: "2px 2px 0 var(--chrome-blue-dark)" }}
            >
              ENVIAR
            </button>
          </div>
        </div>

        {/* Comments list */}
        <div className="flex flex-col gap-3">
          {paginatedComments.map((comment, i) => {
            const globalIndex = (commentPage - 1) * COMMENTS_PER_PAGE + i;
            const fullStars = Math.floor(comment.rating);
            const hasHalf = comment.rating - fullStars >= 0.3;

            return (
              <div
                key={globalIndex}
                style={{ transition: "transform 0.2s ease", cursor: "default" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translate(-2px, -2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translate(0, 0)";
                }}
              >
                <RetroWindow
                  title={`COMMENT-${String(globalIndex + 1).padStart(2, "0")}.TXT`}
                  variant="dark"
                >
                  <div className="relative p-4 pl-5 flex flex-col gap-3">
                    {/* Left accent stripe */}
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-chrome-blue-soft" />

                    {/* Header: avatar + info + rating */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 overflow-hidden relative border-2 border-chrome-blue-accent flex-shrink-0">
                          <AppImage
                            src={comment.avatar}
                            alt={comment.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-grotesk font-bold text-white text-sm leading-tight">
                            {comment.name}
                          </p>
                          <p
                            className="font-mono text-chrome-blue-soft mt-0.5"
                            style={{ fontSize: "8px" }}
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
                                      : "#0560e0"
                                }
                                stroke="#022a6e"
                                strokeWidth="1"
                              />
                            </svg>
                          ))}
                        </div>
                        <span
                          className="font-mono font-bold text-white"
                          style={{ fontSize: "9px" }}
                        >
                          {comment.rating}/5
                        </span>
                      </div>
                    </div>

                    {/* Comment text */}
                    <p
                      className="font-mono text-chrome-blue-body"
                      style={{ fontSize: "10px", lineHeight: 1.7 }}
                    >
                      {comment.text}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center pt-2 border-t border-chrome-blue-accent">
                      <span
                        className="font-mono text-chrome-blue-dim"
                        style={{ fontSize: "8px", letterSpacing: "0.03em" }}
                      >
                        {comment.date}
                      </span>
                    </div>
                  </div>
                </RetroWindow>
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
