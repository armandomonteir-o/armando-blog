"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { FileText, Clock, Eye, MessageCircle, Filter } from "lucide-react";
import { motion } from "motion/react";
import { WavyText } from "@/components/ui/WavyText";
import { RetroWindow } from "@/components/ui/RetroWindow";
import { AeroElements } from "@/components/ui/AeroElements";
import { AppImage } from "@/components/ui/AppImage";
import { Pagination } from "@/components/ui/Pagination";
import { CategoryHero } from "@/components/ui/CategoryHero";
import { posts, categoryColors } from "@/components/content/PostsGrid";
// TODO issue #13: replace with generateMetadata() from WPGraphQL

const POSTS_PER_PAGE = 9;
const allCategories = Array.from(
  new Set(posts.filter((p) => !p.isCorrupted).map((p) => p.category))
);

export default function PostsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    if (!selectedCategory) return posts;
    return posts.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIdx = (currentPage - 1) * POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(startIdx, startIdx + POSTS_PER_PAGE);

  const handleCategoryChange = (cat: string | null) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  return (
    <div
      className="flex-1 relative overflow-hidden"
      style={{ backgroundColor: "var(--arm-bg)", transition: "background-color 0.3s ease" }}
    >
      <CategoryHero
        minHeight="300px"
        heroImage="https://images.unsplash.com/photo-1581181780490-cd1df3c8ee40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwYXJ0JTIwY29sbGFnZSUyMG5lb24lMjBhZXN0aGV0aWN8ZW58MXx8fHwxNzcyOTA3MDg5fDA&ixlib=rb-4.1.0&q=80&w=1080"
        overlayGradient="linear-gradient(to bottom, rgba(3,71,193,0.7) 0%, rgba(2,42,110,0.55) 50%, rgba(2,42,110,0.85) 85%, #022a6e 100%)"
        accentColor="#80b0ff"
        terminalPrefix="ALL/POSTS_"
        title="TODOS OS POSTS"
        description="Arquivo completo de todas as publicacoes do blog. Arte, tecnologia, filosofia e cultura digital reunidas."
        statsBar={
          <>
            <div className="flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.8)" }}>
              <FileText size={13} />
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: "14px",
                }}
              >
                {posts.length}
              </span>
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "9px",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                posts
              </span>
            </div>
            <div className="flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.8)" }}>
              <Filter size={13} />
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: "14px",
                }}
              >
                {allCategories.length}
              </span>
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "9px",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                categorias
              </span>
            </div>
          </>
        }
      />

      <div
        className="relative"
        style={{ backgroundColor: "var(--arm-bg)", transition: "background-color 0.3s ease" }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(var(--arm-grid) 1px, transparent 1px), linear-gradient(90deg, var(--arm-grid) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />
        <AeroElements />

        <div className="relative z-10 p-6 max-w-[1200px] mx-auto">
          <RetroWindow title="ALL-POSTS.EXE" variant="dark">
            <style>{`@keyframes corruptedPulse { 0%, 100% { opacity: 1; border-color: #ff0000; } 50% { opacity: 0.85; border-color: #ff4444; } }`}</style>
            <div className="p-5">
              <div className="flex flex-col gap-4 mb-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <WavyText
                    text="ARQUIVO COMPLETO"
                    variant="stacked"
                    fontSize="clamp(18px, 2.5vw, 26px)"
                    color="#fff"
                  />
                  <span
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "9px",
                      color: "#5a8ad0",
                    }}
                  >
                    {filteredPosts.length} ENTRIES FOUND
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    className="px-3 py-1 cursor-pointer transition-all duration-150"
                    style={{
                      border: "2px solid #0560e0",
                      backgroundColor: !selectedCategory ? "#80b0ff" : "#0458d4",
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "10px",
                      fontWeight: 700,
                      color: !selectedCategory ? "#022a6e" : "#5a8ad0",
                    }}
                    onClick={() => handleCategoryChange(null)}
                  >
                    TODOS
                  </button>
                  {allCategories.map((cat) => (
                    <button
                      key={cat}
                      className="px-3 py-1 cursor-pointer transition-all duration-150"
                      style={{
                        border: `2px solid ${selectedCategory === cat ? categoryColors[cat] : "#0560e0"}`,
                        backgroundColor: selectedCategory === cat ? categoryColors[cat] : "#0458d4",
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "10px",
                        fontWeight: 700,
                        color: selectedCategory === cat ? "#022a6e" : "#5a8ad0",
                      }}
                      onClick={() => handleCategoryChange(cat)}
                    >
                      {cat.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                style={{ minHeight: 940 }}
              >
                {currentPosts.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.05 * i }}
                  >
                    <Link
                      href={post.isCorrupted ? "/void/corrupted/0x404" : `/post/${post.slug}`}
                      className="flex flex-col cursor-pointer group h-[300px]"
                      style={{
                        border: post.isCorrupted ? "2px solid #ff0000" : "2px solid #0560e0",
                        backgroundColor: post.isCorrupted ? "#1a0000" : "#0458d4",
                        textDecoration: "none",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        animation: post.isCorrupted
                          ? "corruptedPulse 2s ease-in-out infinite"
                          : undefined,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translate(-2px, -2px)";
                        e.currentTarget.style.boxShadow = post.isCorrupted
                          ? "4px 4px 0 #ff0000"
                          : "4px 4px 0 #022a6e";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translate(0, 0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div
                        className="flex items-center justify-between px-2 py-1"
                        style={{
                          backgroundColor: post.isCorrupted ? "#330000" : "#0560e0",
                          borderBottom: post.isCorrupted
                            ? "2px solid #ff0000"
                            : "2px solid #0560e0",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: "8px",
                            color: post.isCorrupted ? "#ff4444" : "#5a8ad0",
                          }}
                        >
                          {post.isCorrupted
                            ? "⚠ CORRUPTED.ERR"
                            : `POST-${String(post.id).padStart(3, "0")}.MD`}
                        </span>
                        <div className="flex gap-1">
                          <div
                            className="w-2 h-2"
                            style={{ backgroundColor: "#0347c1", border: "1px solid #022a6e" }}
                          />
                          <div
                            className="w-2 h-2"
                            style={{ backgroundColor: "#e05050", border: "1px solid #022a6e" }}
                          />
                        </div>
                      </div>

                      <div className="h-[140px] overflow-hidden relative">
                        <AppImage
                          src={post.image}
                          alt={post.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          priority={i === 0}
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
                            backgroundColor: categoryColors[post.category] || "#0347c1",
                            border: "2px solid #022a6e",
                            fontFamily: "'Space Mono', monospace",
                            fontSize: "8px",
                            fontWeight: 700,
                            color: "#022a6e",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                          }}
                        >
                          {post.category.toUpperCase()}
                        </div>
                        <div
                          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background:
                              "linear-gradient(to top, rgba(3,71,193,0.25), transparent 60%)",
                          }}
                        />
                      </div>

                      <div className="p-3 flex flex-col flex-1 overflow-hidden">
                        <h3
                          className="line-clamp-2"
                          style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontWeight: 700,
                            fontSize: "13px",
                            color: "#fff",
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
                            color: "#80b0ff",
                            marginBottom: "8px",
                          }}
                        >
                          {post.excerpt}
                        </p>
                        <div
                          className="flex items-center gap-3 pt-2"
                          style={{ borderTop: "1px solid #0560e0" }}
                        >
                          <div className="flex items-center gap-1" style={{ color: "#5a8ad0" }}>
                            <Clock size={10} />
                            <span
                              style={{ fontFamily: "'Space Mono', monospace", fontSize: "8px" }}
                            >
                              {post.date}
                            </span>
                          </div>
                          <div className="flex items-center gap-1" style={{ color: "#5a8ad0" }}>
                            <Eye size={10} />
                            <span
                              style={{ fontFamily: "'Space Mono', monospace", fontSize: "8px" }}
                            >
                              {post.reads}
                            </span>
                          </div>
                          <div className="flex items-center gap-1" style={{ color: "#5a8ad0" }}>
                            <MessageCircle size={10} />
                            <span
                              style={{ fontFamily: "'Space Mono', monospace", fontSize: "8px" }}
                            >
                              {post.comments}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredPosts.length}
                  itemsPerPage={POSTS_PER_PAGE}
                  onPageChange={setCurrentPage}
                />
              )}
            </div>
          </RetroWindow>
        </div>
      </div>
    </div>
  );
}
