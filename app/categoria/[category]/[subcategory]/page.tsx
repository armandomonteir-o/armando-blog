"use client";

import { use, useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Clock, Eye, MessageCircle, Hash, ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { WavyText } from "@/components/ui/WavyText";
import { RetroWindow } from "@/components/ui/RetroWindow";
import { AeroElements } from "@/components/ui/AeroElements";
import { AppImage } from "@/components/ui/AppImage";
import { Pagination } from "@/components/ui/Pagination";
import { CategoryHero } from "@/components/ui/CategoryHero";
import { NewsletterWidget } from "@/components/layout/newsletter";
import { getSubcategoryBySlug, type Subcategory, type Category } from "@/data/categories";

// TODO issue #13: replace with generateMetadata() from WPGraphQL

function generateMockPosts(subcategory: Subcategory, category: Category) {
  const mockTitles: Record<string, string[]> = {
    punk: ["DIGITAL HARDCORE: O PUNK QUE VIVE NO CODIGO", "DIY OU MORRA: MANIFESTO DE UM PUNK DIGITAL", "ATARI TEENAGE RIOT E A ANTI-ARTE", "FANZINES DIGITAIS: A NOVA RESISTENCIA", "NOISE COMO LINGUAGEM: ALEM DO SOM", "A ETICA PUNK NA ERA DOS ALGORITMOS"],
    synthwave: ["OUTRUN: A ESTETICA DO HORIZONTE NEON", "PERTURBATOR E O CINEMA SOMBRIO SONICO", "COMO PRODUZIR SYNTHWAVE EM 2026", "KAVINSKY: O PILOTO QUE NUNCA PAROU", "MOOG E JUNO: OS SINTETIZADORES QUE MOLDARAM O GENERO", "RETROWAVE VS SYNTHWAVE: UM DEBATE NECESSARIO"],
    "lo-fi": ["NUJABES E O NASCIMENTO DO LO-FI HIP HOP", "TEXTURAS ANALOGICAS EM PRODUCAO DIGITAL", "A GAROTA ESTUDANDO: ICONE DE UMA GERACAO", "COMO O LOFI VIROU TRILHA DA PRODUTIVIDADE", "SAMPLING COMO ARQUEOLOGIA MUSICAL", "BEDROOM PRODUCERS: HISTORIA E TECNICA"],
    ambient: ["BRIAN ENO: O ARQUITETO DO SOM INVISIVEL", "MUSICA PARA AEROPORTOS E ESPACOS LIMINAIS", "FIELD RECORDINGS COMO ARTE SONORA", "DRONE MUSIC: QUANDO O SOM SE TORNA ESPACO", "AMBIENT E MEDITACAO: INTERSECCOES", "STARS OF THE LID: A BELEZA DA LENTIDAO"],
    cyberpunk: ["BLADE RUNNER 2049: A SOLIDAO DO REPLICANTE", "AKIRA E A PROFECIA URBANA", "GHOST IN THE SHELL: IDENTIDADE POS-HUMANA", "NEON COMO LINGUAGEM VISUAL", "O LEGADO DE WILLIAM GIBSON NO CINEMA", "CYBERPUNK 2077: QUANDO O JOGO VIRA FILME"],
    "pixel-art": ["DITHERING: A TECNICA QUE DEFINE O PIXEL ART", "PALETAS LIMITADAS: 16 CORES E INFINITAS POSSIBILIDADES", "DO ATARI AO INDIE: HISTORIA DO PIXEL", "ANIMACAO SPRITE: QUADRO A QUADRO", "ISOMETRICO: MUNDOS EM PERSPECTIVA FALSA", "ASEPRITE MASTERCLASS: WORKFLOW COMPLETO"],
  };
  const titles = mockTitles[subcategory.slug] || [
    "POST SOBRE " + subcategory.name.toUpperCase(),
    "EXPLORANDO " + subcategory.name.toUpperCase(),
    "REFLEXOES SOBRE " + subcategory.name.toUpperCase(),
    "GUIA DEFINITIVO: " + subcategory.name.toUpperCase(),
    "A HISTORIA DE " + subcategory.name.toUpperCase(),
    "FUTURO DE " + subcategory.name.toUpperCase(),
  ];
  const images = [subcategory.heroImage, category.heroImage, subcategory.heroImage, category.heroImage, subcategory.heroImage, category.heroImage];
  return titles.slice(0, Math.min(6, subcategory.postCount)).map((title, i) => ({
    id: i + 1,
    title,
    category: category.name,
    subcategory: subcategory.name,
    date: `${28 - i * 4} Fev 2026`,
    reads: Math.floor(Math.random() * 200) + 40,
    comments: Math.floor(Math.random() * 30) + 5,
    image: images[i % images.length],
    excerpt: subcategory.description.slice(0, 100 + Math.floor(Math.random() * 40)) + "...",
  }));
}

export default function SubcategoryPage({ params }: { params: Promise<{ category: string; subcategory: string }> }) {
  const { category: categorySlug, subcategory: subcategorySlug } = use(params);
  const result = getSubcategoryBySlug(categorySlug, subcategorySlug);
  if (!result) redirect("/");
  const { category, subcategory } = result;
  const posts = generateMockPosts(subcategory, category);

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
              style={{ width: 150, height: 150, top: "30%", right: "20%", borderRadius: "50%", background: `radial-gradient(circle at 40% 40%, ${category.accentColor}44, transparent 70%)`, filter: "blur(40px)" }}
            />
          </>
        }
      >
        <div className="flex items-center gap-4 mt-5 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            {subcategory.tags.map((tag) => (
              <button
                key={tag}
                className="px-2.5 py-1 cursor-pointer"
                onClick={() => { setSelectedTag(selectedTag === tag ? null : tag); setCurrentPage(1); }}
                style={{
                  background: selectedTag === tag ? `${category.accentColor}55` : `${category.accentColor}22`,
                  backdropFilter: "blur(8px)",
                  border: `1.5px solid ${selectedTag === tag ? category.accentColor : `${category.accentColor}55`}`,
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "9px",
                  fontWeight: 700,
                  color: selectedTag === tag ? "#fff" : category.accentColor,
                  transition: "all 0.2s ease",
                }}
              >
                #{tag.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.2)" }}>
            <Hash size={12} style={{ color: "rgba(255,255,255,0.7)" }} />
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "14px", color: "#fff" }}>{subcategory.postCount}</span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", color: "rgba(255,255,255,0.5)" }}>posts</span>
          </div>
        </div>
        <motion.div className="flex flex-col items-center mt-8" initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ duration: 0.5, delay: 1.5 }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "8px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.15em", marginBottom: "4px" }}>SCROLL</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown size={16} style={{ color: "rgba(255,255,255,0.5)" }} />
          </motion.div>
        </motion.div>
      </CategoryHero>

      <div className="relative" style={{ backgroundColor: "var(--arm-bg)", transition: "background-color 0.3s ease" }}>
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#022a6e 1px, transparent 1px), linear-gradient(90deg, #022a6e 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
        <AeroElements />

        <div className="relative z-10 p-6 max-w-[1200px] mx-auto">
          <RetroWindow title={`${category.slug.toUpperCase()}/${subcategory.slug.toUpperCase()}-POSTS.EXE`} variant="dark">
            <div className="p-5">
              <div className="flex items-center justify-between mb-5">
                <WavyText text={`POSTS: ${subcategory.name.toUpperCase()}`} variant="stacked" fontSize={26} color="#fff" />
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", color: "#5a8ad0" }}>{filteredPosts.length} ENTRIES FOUND</span>
              </div>

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
                      href="/post/a-revolucao-do-algoritmo"
                      className="flex flex-col cursor-pointer group"
                      style={{ border: "2px solid #0560e0", backgroundColor: "#0458d4", textDecoration: "none" }}
                    >
                      <div className="flex items-center justify-between px-2 py-1" style={{ backgroundColor: "#0560e0", borderBottom: "2px solid #0560e0" }}>
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "8px", color: "#5a8ad0" }}>POST-{String(post.id).padStart(3, "0")}.MD</span>
                        <div className="flex gap-1">
                          <div className="w-2 h-2" style={{ backgroundColor: "#0347c1", border: "1px solid #022a6e" }} />
                          <div className="w-2 h-2" style={{ backgroundColor: "#e05050", border: "1px solid #022a6e" }} />
                        </div>
                      </div>
                      <div className="h-[140px] overflow-hidden relative">
                        <AppImage src={post.image} alt={post.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                        <div className="absolute inset-0 pointer-events-none opacity-40" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)" }} />
                        <div className="absolute top-2 left-2 px-2 py-0.5" style={{ backgroundColor: category.accentColor, border: "2px solid #022a6e", fontFamily: "'Space Mono', monospace", fontSize: "8px", fontWeight: 700, color: "#022a6e", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                          {post.subcategory.toUpperCase()}
                        </div>
                        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "linear-gradient(to top, rgba(3,71,193,0.25), transparent 60%)" }} />
                      </div>
                      <div className="p-3 flex flex-col flex-1">
                        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "13px", color: "#fff", lineHeight: 1.3, marginBottom: "6px" }}>{post.title}</h3>
                        <p className="flex-1" style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", lineHeight: 1.5, color: "#80b0ff", marginBottom: "8px" }}>{post.excerpt}</p>
                        <div className="flex items-center gap-3 pt-2" style={{ borderTop: "1px solid #0560e0" }}>
                          <div className="flex items-center gap-1" style={{ color: "#5a8ad0" }}><Clock size={10} /><span style={{ fontFamily: "'Space Mono', monospace", fontSize: "8px" }}>{post.date}</span></div>
                          <div className="flex items-center gap-1" style={{ color: "#5a8ad0" }}><Eye size={10} /><span style={{ fontFamily: "'Space Mono', monospace", fontSize: "8px" }}>{post.reads}</span></div>
                          <div className="flex items-center gap-1" style={{ color: "#5a8ad0" }}><MessageCircle size={10} /><span style={{ fontFamily: "'Space Mono', monospace", fontSize: "8px" }}>{post.comments}</span></div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={posts.length} itemsPerPage={POSTS_PER_PAGE} onPageChange={setCurrentPage} />
            </div>
          </RetroWindow>

          <div className="mt-5">
            <RetroWindow title="MORE-SUBCATEGORIES.EXE" variant="glass">
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "14px", color: "#022a6e" }}>Mais em {category.name}</span>
                  <Link href={`/categoria/${category.slug}`} style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", fontWeight: 700, color: "#0347c1", textDecoration: "none" }}>
                    VER TODAS →
                  </Link>
                </div>
                <div className="flex gap-3">
                  {category.subcategories.filter((s) => s.slug !== subcategory.slug).map((s) => (
                    <Link
                      key={s.slug}
                      href={`/categoria/${category.slug}/${s.slug}`}
                      className="flex-1 group"
                      style={{ border: "2px solid #022a6e", backgroundColor: "rgba(255,255,255,0.4)", backdropFilter: "blur(8px)", textDecoration: "none", boxShadow: "3px 3px 0 #022a6e", transition: "transform 0.2s ease" }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(-1px, -1px)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = "translate(0, 0)"; }}
                    >
                      <div className="h-[60px] overflow-hidden relative">
                        <AppImage src={s.heroImage} alt={s.name} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(2,42,110,0.7), transparent)" }} />
                      </div>
                      <div className="p-2.5 flex items-center justify-between">
                        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "12px", color: "#022a6e" }}>{s.name}</span>
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "8px", color: "#5a6a8e" }}>{s.postCount}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </RetroWindow>
          </div>

          <div className="mt-5">
            <NewsletterWidget />
          </div>
        </div>
      </div>
    </div>
  );
}
