"use client";

import { useState } from "react";
import Link from "next/link";
import { WavyText } from "@/components/ui/WavyText";
import { RetroWindow } from "@/components/ui/RetroWindow";
import { AppImage } from "@/components/ui/AppImage";
import { Pagination } from "@/components/ui/Pagination";
import { Clock, Eye, MessageCircle } from "lucide-react";
import { posts, categoryColors } from "@/constants/posts";
import type { Post } from "@/constants/posts";

// Re-export so existing imports (Header, AllPostsPage) continue to work
export { posts, categoryColors };
export type { Post };

const POSTS_PER_PAGE = 6;

export function PostsGrid() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  const startIdx = (currentPage - 1) * POSTS_PER_PAGE;
  const currentPosts = posts.slice(startIdx, startIdx + POSTS_PER_PAGE);

  return (
    <RetroWindow title="LATEST-POSTS.EXE" variant="dark">
      <style>{`
        @keyframes corruptedPulse {
          0%, 100% { opacity: 1; border-color: #ff0000; }
          50% { opacity: 0.85; border-color: #ff4444; }
        }
      `}</style>
      <div className="p-5">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <WavyText
            text="ULTIMOS POSTS"
            variant="stacked"
            fontSize="clamp(18px, 2.5vw, 26px)"
            color="var(--arm-panel-text)"
          />
          <div className="flex items-center gap-2 flex-shrink-0">
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "9px",
                color: "var(--arm-panel-text-muted)",
              }}
            >
              {posts.length} ENTRIES FOUND
            </span>
            <Link
              href="/posts"
              className="px-4 py-1.5 cursor-pointer transition-all duration-150 hover:brightness-125 hover:-translate-y-px"
              style={{
                border: "2px solid var(--arm-panel-border)",
                backgroundColor: "var(--arm-panel-bg)",
                fontFamily: "'Space Mono', monospace",
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--arm-panel-text-soft)",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Ver todos
            </Link>
          </div>
        </div>

        {/* Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
          style={{ minHeight: 632 }}
        >
          {currentPosts.map((post) => (
            <Link
              key={post.id}
              href={post.isCorrupted ? "/void/corrupted/0x404" : `/post/${post.slug}`}
              className="flex flex-col cursor-pointer group h-[300px]"
              style={{
                border: post.isCorrupted ? "2px solid #ff0000" : "2px solid var(--arm-panel-border)",
                backgroundColor: post.isCorrupted ? "#1a0000" : "var(--arm-panel-bg)",
                textDecoration: "none",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                animation: post.isCorrupted ? "corruptedPulse 2s ease-in-out infinite" : undefined,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translate(-2px, -2px)";
                e.currentTarget.style.boxShadow = post.isCorrupted
                  ? "4px 4px 0 #ff0000"
                  : "4px 4px 0 var(--arm-panel-bg-deep)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translate(0, 0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Mini title bar */}
              <div
                className="flex items-center justify-between px-2 py-1"
                style={{
                  backgroundColor: post.isCorrupted ? "#330000" : "var(--arm-panel-border)",
                  borderBottom: post.isCorrupted
                    ? "2px solid #ff0000"
                    : "2px solid var(--arm-panel-border)",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "8px",
                    color: post.isCorrupted ? "#ff4444" : "var(--arm-panel-text-muted)",
                  }}
                >
                  {post.isCorrupted ? "⚠ CORRUPTED.ERR" : `POST-${String(post.id).padStart(3, "0")}.MD`}
                </span>
                <div className="flex gap-1">
                  <div
                    className="w-2 h-2"
                    style={{
                      backgroundColor: "var(--arm-panel-bg-darker)",
                      border: "1px solid var(--arm-panel-bg-deep)",
                    }}
                  />
                  <div
                    className="w-2 h-2"
                    style={{ backgroundColor: "#e05050", border: "1px solid var(--arm-panel-bg-deep)" }}
                  />
                </div>
              </div>

              {/* Image */}
              <div className="h-[140px] overflow-hidden relative">
                <AppImage
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 pointer-events-none opacity-40"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)",
                  }}
                />
                <div
                  className="absolute top-2 left-2 px-2 py-0.5"
                  style={{
                    backgroundColor: categoryColors[post.category] || "var(--arm-panel-bg-darker)",
                    border: "2px solid var(--arm-panel-bg-deep)",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "8px",
                    fontWeight: 700,
                    color: "var(--arm-panel-bg-deep)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  }}
                >
                  {post.category.toUpperCase()}
                </div>
                <div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: "linear-gradient(to top, rgba(3,71,193,0.25), transparent 60%)",
                  }}
                />
              </div>

              {/* Content */}
              <div className="p-3 flex flex-col flex-1 overflow-hidden">
                <h3
                  className="line-clamp-2"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: "13px",
                    color: "var(--arm-panel-text)",
                    lineHeight: 1.3,
                    marginBottom: "6px",
                  }}
                >
                  {post.title}
                </h3>
                <p
                  className="flex-1 line-clamp-3"
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "10px",
                    lineHeight: 1.5,
                    color: "var(--arm-panel-text-soft)",
                    marginBottom: "8px",
                  }}
                >
                  {post.excerpt}
                </p>

                {/* Meta */}
                <div
                  className="flex items-center gap-3 pt-2"
                  style={{ borderTop: "1px solid var(--arm-panel-border)" }}
                >
                  <div className="flex items-center gap-1" style={{ color: "var(--arm-panel-text-muted)" }}>
                    <Clock size={10} />
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "8px" }}>
                      {post.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-1" style={{ color: "var(--arm-panel-text-muted)" }}>
                    <Eye size={10} />
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "8px" }}>
                      {post.reads}
                    </span>
                  </div>
                  <div className="flex items-center gap-1" style={{ color: "var(--arm-panel-text-muted)" }}>
                    <MessageCircle size={10} />
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "8px" }}>
                      {post.comments}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={posts.length}
            itemsPerPage={POSTS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </RetroWindow>
  );
}
