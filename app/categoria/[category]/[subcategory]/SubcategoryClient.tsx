"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, Eye, MessageCircle, Hash, ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { WavyText } from "@/components/ui/WavyText";
import { RetroWindow } from "@/components/ui/RetroWindow";
import { AeroElements } from "@/components/ui/AeroElements";
import { AppImage } from "@/components/ui/AppImage";
import { Pagination } from "@/components/ui/Pagination";
import { CategoryHero } from "@/components/ui/CategoryHero";
import { NewsletterWidget } from "@/components/layout/newsletter";
import type { Post } from "@/constants/posts";
import type { CategoryView, SubcategoryView } from "@/lib/categories";

export default function SubcategoryClient({
  category,
  subcategory,
  posts,
}: {
  category: CategoryView;
  subcategory: SubcategoryView;
  posts: Post[];
}) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const POSTS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const filteredPosts = selectedTag
    ? posts.filter((p) => p.title.toLowerCase().includes(selectedTag.toLowerCase()))
    : posts;
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIdx = (currentPage - 1) * POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(startIdx, startIdx + POSTS_PER_PAGE);

  return (
    <div
      className="flex-1 relative overflow-hidden"
      style={{ backgroundColor: "var(--arm-bg)", transition: "background-color 0.3s ease" }}
    >
      <CategoryHero
        minHeight="clamp(420px, 65svh, 700px)"
        heroImage={subcategory.heroImage}
        overlayGradient="linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(2,42,110,0.15) 20%, rgba(2,42,110,0.35) 50%, rgba(2,42,110,0.7) 75%, #022a6e 95%)"
        accentColor={category.accentColor}
        terminalPrefix={`/${category.slug.toUpperCase()}/${subcategory.slug.toUpperCase()}_`}
        title={subcategory.name.toUpperCase()}
        titleSize={72}
        description={subcategory.description}
        breadcrumbs={[
          { to: "/", label: "HOME" },
          { to: `/categoria/${category.slug}`, label: category.name.toUpperCase(), active: true },
          { label: subcategory.name.toUpperCase(), active: true },
        ]}
        extraDecorations={
          <>
            <motion.div
              className="absolute pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.25 }}
              transition={{ duration: 2, delay: 1.2 }}
              style={{
                width: 150,
                height: 150,
                top: "30%",
                right: "20%",
                borderRadius: "50%",
                background: `radial-gradient(circle at 40% 40%, ${category.accentColor}44, transparent 70%)`,
                filter: "blur(40px)",
              }}
            />
          </>
        }
      >
        <div className="flex items-center gap-4 mt-5 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            {subcategory.tags.map((tag) => (
              <button
                key={tag}
                className="px-2.5 py-1 cursor-pointer font-mono font-bold"
                onClick={() => {
                  setSelectedTag(selectedTag === tag ? null : tag);
                  setCurrentPage(1);
                }}
                style={{
                  background:
                    selectedTag === tag ? `${category.accentColor}55` : `${category.accentColor}22`,
                  backdropFilter: "blur(8px)",
                  border: `1.5px solid ${selectedTag === tag ? category.accentColor : `${category.accentColor}55`}`,
                  fontSize: "9px",
                  color: selectedTag === tag ? "#fff" : category.accentColor,
                  transition: "background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease",
                }}
              >
                #{tag.toUpperCase()}
              </button>
            ))}
          </div>
          <div
            className="flex items-center gap-2 px-3 py-1.5"
            style={{
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <Hash size={12} style={{ color: "rgba(255,255,255,0.7)" }} />
            <span className="font-grotesk font-bold text-white" style={{ fontSize: "14px" }}>
              {subcategory.postCount}
            </span>
            <span className="font-mono" style={{ fontSize: "9px", color: "rgba(255,255,255,0.5)" }}>
              posts
            </span>
          </div>
        </div>
        <motion.div
          className="flex flex-col items-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          <span
            className="font-mono"
            style={{
              fontSize: "8px",
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.15em",
              marginBottom: "4px",
            }}
          >
            SCROLL
          </span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown size={16} style={{ color: "rgba(255,255,255,0.5)" }} />
          </motion.div>
        </motion.div>
      </CategoryHero>

      <div
        className="relative"
        style={{ backgroundColor: "var(--arm-bg)", transition: "background-color 0.3s ease" }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#022a6e 1px, transparent 1px), linear-gradient(90deg, #022a6e 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />
        <AeroElements />

        <div className="relative z-10 p-6 max-w-[1200px] mx-auto">
          <RetroWindow
            title={`${category.slug.toUpperCase()}/${subcategory.slug.toUpperCase()}-POSTS.EXE`}
            variant="dark"
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-5">
                <WavyText
                  text={`POSTS: ${subcategory.name.toUpperCase()}`}
                  variant="stacked"
                  fontSize={26}
                  color="#fff"
                />
                <span className="font-mono text-chrome-blue-body" style={{ fontSize: "9px" }}>
                  {filteredPosts.length} ENTRIES FOUND
                </span>
              </div>

              {filteredPosts.length === 0 && (
                <p
                  className="font-mono font-bold text-chrome-blue-body py-10 text-center"
                  style={{ fontSize: "11px" }}
                >
                  NENHUM POST AQUI AINDA.
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {currentPosts.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                  >
                    <Link
                      href={`/post/${post.slug}`}
                      className="flex flex-col cursor-pointer group border-2 border-chrome-blue-accent bg-chrome-blue-mid"
                      style={{ textDecoration: "none" }}
                    >
                      <div className="flex items-center justify-between px-2 py-1 bg-chrome-blue-accent border-b-2 border-chrome-blue-accent">
                        <span
                          className="font-mono text-chrome-blue-body"
                          style={{ fontSize: "8px" }}
                        >
                          POST-{String(post.id).padStart(3, "0")}.MD
                        </span>
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-chrome-blue border border-chrome-blue-dark" />
                          <div className="w-2 h-2 bg-chrome-red border border-chrome-blue-dark" />
                        </div>
                      </div>
                      <div className="h-[140px] overflow-hidden relative">
                        <AppImage
                          src={post.image}
                          alt={post.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                          className="absolute top-2 left-2 px-2 py-0.5 font-mono font-bold text-chrome-blue-dark border-2 border-chrome-blue-dark"
                          style={{
                            backgroundColor: category.accentColor,
                            fontSize: "8px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                          }}
                        >
                          {subcategory.name.toUpperCase()}
                        </div>
                        <div
                          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background:
                              "linear-gradient(to top, rgba(3,71,193,0.25), transparent 60%)",
                          }}
                        />
                      </div>
                      <div className="p-3 flex flex-col flex-1">
                        <h3
                          className="font-grotesk font-bold text-white"
                          style={{ fontSize: "13px", lineHeight: 1.3, marginBottom: "6px" }}
                        >
                          {post.title}
                        </h3>
                        <p
                          className="flex-1 font-mono text-chrome-blue-text-on-dark"
                          style={{ fontSize: "10px", lineHeight: 1.5, marginBottom: "8px" }}
                        >
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-3 pt-2 border-t border-chrome-blue-accent">
                          <div className="flex items-center gap-1 text-chrome-blue-body">
                            <Clock size={10} />
                            <span className="font-mono" style={{ fontSize: "8px" }}>
                              {post.date}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-chrome-blue-body">
                            <Eye size={10} />
                            <span className="font-mono" style={{ fontSize: "8px" }}>
                              {post.reads ?? "—"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-chrome-blue-body">
                            <MessageCircle size={10} />
                            <span className="font-mono" style={{ fontSize: "8px" }}>
                              {post.comments}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={posts.length}
                itemsPerPage={POSTS_PER_PAGE}
                onPageChange={setCurrentPage}
              />
            </div>
          </RetroWindow>

          <div className="mt-5">
            <RetroWindow title="MORE-SUBCATEGORIES.EXE" variant="glass">
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="font-grotesk font-bold text-chrome-blue-dark"
                    style={{ fontSize: "14px" }}
                  >
                    Mais em {category.name}
                  </span>
                  <Link
                    href={`/categoria/${category.slug}`}
                    className="font-mono font-bold text-chrome-blue"
                    style={{ fontSize: "10px", textDecoration: "none" }}
                  >
                    VER TODAS →
                  </Link>
                </div>
                <div className="flex gap-3">
                  {category.subcategories
                    .filter((s) => s.slug !== subcategory.slug)
                    .map((s) => (
                      <Link
                        key={s.slug}
                        href={`/categoria/${category.slug}/${s.slug}`}
                        className="flex-1 group brutal-lift"
                        style={
                          {
                            border: "2px solid #022a6e",
                            backgroundColor: "rgba(255,255,255,0.4)",
                            backdropFilter: "blur(8px)",
                            textDecoration: "none",
                            "--lift-color": "#022a6e",
                            "--lift-rest": "3px",
                            "--lift-hover": "3px",
                            "--lift-distance": "1px",
                          } as React.CSSProperties
                        }
                      >
                        <div className="h-[60px] overflow-hidden relative">
                          <AppImage
                            src={s.heroImage}
                            alt={s.name}
                            fill
                            sizes="(max-width: 640px) 50vw, 25vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div
                            className="absolute inset-0"
                            style={{
                              background:
                                "linear-gradient(to top, rgba(2,42,110,0.7), transparent)",
                            }}
                          />
                        </div>
                        <div className="p-2.5 flex items-center justify-between">
                          <span
                            className="font-grotesk font-bold text-chrome-blue-dark"
                            style={{ fontSize: "12px" }}
                          >
                            {s.name}
                          </span>
                          <span className="font-mono" style={{ fontSize: "8px", color: "#5a6a8e" }}>
                            {s.postCount}
                          </span>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            </RetroWindow>
          </div>

          <NewsletterWidget />
        </div>
      </div>
    </div>
  );
}
