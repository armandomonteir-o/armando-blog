"use client";

import Link from "next/link";
import { WavyText } from "@/components/ui/WavyText";
import { RetroWindow } from "@/components/ui/RetroWindow";
import { AppImage } from "@/components/ui/AppImage";
import type { HomeComment } from "@/lib/graphql/adapters";

export function CommentsSection({ comments }: { comments: HomeComment[] }) {
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
            className="px-4 py-1.5 flex-shrink-0 cursor-pointer self-start transition-[filter,translate] duration-150 hover:brightness-125 hover:-translate-y-px font-mono font-bold"
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

        {/* Comment cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 min-w-0">
          {comments.map((comment, i) => (
            <div
              key={comment.id}
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
                {/* Header: avatar + author + post it is on */}
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
                    <Link
                      href={`/post/${comment.postSlug}`}
                      className="font-mono mt-0.5 block truncate"
                      style={{
                        fontSize: "8px",
                        color: "var(--arm-panel-text-body)",
                        textDecoration: "none",
                      }}
                    >
                      {comment.postTitle.toUpperCase()}
                    </Link>
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
                    {comment.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </RetroWindow>
  );
}
