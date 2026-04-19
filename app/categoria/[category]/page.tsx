"use client";

import { use, useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Hash, FileText } from "lucide-react";
import { motion } from "motion/react";
import { WavyText } from "@/components/ui/WavyText";
import { RetroWindow } from "@/components/ui/RetroWindow";
import { AeroElements } from "@/components/ui/AeroElements";
import { AppImage } from "@/components/ui/AppImage";
import { Pagination } from "@/components/ui/Pagination";
import { CategoryHero } from "@/components/ui/CategoryHero";
import { getCategoryBySlug } from "@/data/categories";

// TODO issue #13: replace with generateMetadata() from WPGraphQL

const SUBCATS_PER_PAGE = 4;

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = use(params);
  const category = getCategoryBySlug(categorySlug);

  if (!category) redirect("/");

  const totalPosts = category.subcategories.reduce((a, s) => a + s.postCount, 0);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(category.subcategories.length / SUBCATS_PER_PAGE);
  const startIdx = (currentPage - 1) * SUBCATS_PER_PAGE;
  const currentSubcats = category.subcategories.slice(startIdx, startIdx + SUBCATS_PER_PAGE);

  return (
    <div
      className="flex-1 relative overflow-hidden"
      style={{ backgroundColor: "var(--arm-bg)", transition: "background-color 0.3s ease" }}
    >
      <CategoryHero
        minHeight="340px"
        heroImage={category.heroImage}
        overlayGradient={`linear-gradient(to bottom, ${category.gradientFrom} 0%, rgba(2,42,110,0.55) 50%, ${category.gradientTo} 85%, #022a6e 100%)`}
        accentColor={category.accentColor}
        terminalPrefix={`CATEGORY/${category.slug.toUpperCase()}_`}
        title={category.name.toUpperCase()}
        description={category.description}
        statsBar={
          <>
            <div className="flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.8)" }}>
              <Hash size={13} />
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: "14px",
                }}
              >
                {category.subcategories.length}
              </span>
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "9px",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                subcategorias
              </span>
            </div>
            <div className="flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.8)" }}>
              <FileText size={13} />
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: "14px",
                }}
              >
                {totalPosts}
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
          <RetroWindow title={`${category.slug.toUpperCase()}-SUBCATEGORIES.EXE`} variant="dark">
            <div className="p-5">
              <div className="flex items-center justify-between mb-5">
                <WavyText
                  text="EXPLORAR SUBCATEGORIAS"
                  variant="stacked"
                  fontSize="clamp(16px, 2.5vw, 26px)"
                  color="#fff"
                />
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "9px",
                    color: "#a0c4ff",
                  }}
                >
                  {category.subcategories.length} ENTRIES FOUND
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {currentSubcats.map((sub, i) => (
                  <motion.div
                    key={sub.slug}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 * i }}
                  >
                    <Link
                      href={`/categoria/${category.slug}/${sub.slug}`}
                      className="flex flex-col group"
                      style={{
                        border: "3px solid #0560e0",
                        backgroundColor: "#0458d4",
                        textDecoration: "none",
                        boxShadow: "4px 4px 0 #022a6e",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translate(-2px, -2px)";
                        e.currentTarget.style.boxShadow = "6px 6px 0 #022a6e";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translate(0, 0)";
                        e.currentTarget.style.boxShadow = "4px 4px 0 #022a6e";
                      }}
                    >
                      <div
                        className="flex items-center justify-between px-3 py-1.5"
                        style={{ backgroundColor: "#0560e0", borderBottom: "2px solid #022a6e" }}
                      >
                        <span
                          style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: "9px",
                            fontWeight: 700,
                            color: "#c8e0ff",
                          }}
                        >
                          SUBCAT-{String(i + 1).padStart(2, "0")}.EXE
                        </span>
                        <div className="flex gap-1">
                          <div
                            className="w-2.5 h-2.5"
                            style={{ border: "1.5px solid #022a6e", backgroundColor: "#0347c1" }}
                          />
                          <div
                            className="w-2.5 h-2.5"
                            style={{ backgroundColor: "#e05050", border: "1.5px solid #022a6e" }}
                          />
                        </div>
                      </div>

                      <div className="h-[180px] overflow-hidden relative">
                        <AppImage
                          src={sub.heroImage}
                          alt={sub.name}
                          fill
                          sizes="(max-width: 640px) 100vw, 50vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            backgroundImage:
                              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
                          }}
                        />
                        <div
                          className="absolute inset-0 pointer-events-none opacity-10"
                          style={{
                            backgroundImage:
                              "linear-gradient(#80b0ff 1px, transparent 1px), linear-gradient(90deg, #80b0ff 1px, transparent 1px)",
                            backgroundSize: "20px 20px",
                          }}
                        />
                        <div
                          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{
                            background:
                              "linear-gradient(to top, rgba(2,42,110,0.6), transparent 60%)",
                          }}
                        />
                        <div
                          className="absolute bottom-0 left-0 right-0 pointer-events-none"
                          style={{
                            height: "35%",
                            background: `linear-gradient(to top, ${category.gradientTo}, transparent)`,
                          }}
                        />
                        <div
                          className="absolute top-3 right-3 px-2.5 py-1"
                          style={{
                            background: "rgba(0,0,0,0.5)",
                            backdropFilter: "blur(8px)",
                            border: `1.5px solid ${category.accentColor}`,
                            fontFamily: "'Space Mono', monospace",
                            fontSize: "9px",
                            fontWeight: 700,
                            color: category.accentColor,
                          }}
                        >
                          {sub.postCount} POSTS
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <WavyText
                            text={sub.name.toUpperCase()}
                            variant="linear-wave"
                            fontSize={20}
                            amplitude={3}
                            frequency={0.25}
                            color="#fff"
                          />
                          <ArrowRight
                            size={16}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{ color: category.accentColor }}
                          />
                        </div>
                        <p
                          className="mb-3"
                          style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontSize: "13px",
                            lineHeight: 1.6,
                            color: "#c8e0ff",
                          }}
                        >
                          {sub.description.length > 130
                            ? sub.description.slice(0, 130) + "..."
                            : sub.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {sub.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5"
                              style={{
                                border: "1.5px solid #0560e0",
                                backgroundColor: "rgba(5,96,224,0.3)",
                                fontFamily: "'Space Mono', monospace",
                                fontSize: "8px",
                                fontWeight: 700,
                                color: "#a0c4ff",
                              }}
                            >
                              {tag.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={category.subcategories.length}
                itemsPerPage={SUBCATS_PER_PAGE}
                onPageChange={setCurrentPage}
              />
            </div>
          </RetroWindow>
        </div>
      </div>
    </div>
  );
}
