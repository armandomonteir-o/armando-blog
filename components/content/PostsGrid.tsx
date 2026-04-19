// MOCK DATA — replace with WPGraphQL query in issue #11
"use client";

import { useState } from "react";
import Link from "next/link";
import { WavyText } from "@/components/ui/WavyText";
import { RetroWindow } from "@/components/ui/RetroWindow";
import { AppImage } from "@/components/ui/AppImage";
import { Pagination } from "@/components/ui/Pagination";
import { Clock, Eye, MessageCircle } from "lucide-react";

interface Post {
  id: number;
  title: string;
  slug: string;
  category: string;
  date: string;
  reads: number;
  comments: number;
  image: string;
  excerpt: string;
  isCorrupted?: boolean;
}

export const posts: Post[] = [
  {
    id: 1,
    title: "PIXEL ART E A NOSTALGIA DIGITAL",
    slug: "pixel-art-e-a-nostalgia-digital",
    category: "Estudos",
    date: "28 Fev 2026",
    reads: 128,
    comments: 23,
    image:
      "https://images.unsplash.com/photo-1649877508777-1554357604eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRybyUyMGNvbXB1dGVyJTIwcGl4ZWwlMjBhZXN0aGV0aWN8ZW58MXx8fHwxNzcyODMzNDYxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    excerpt: "Uma investigacao sobre como a estetica pixel se tornou simbolo de resistencia cultural na era da ultra-definicao.",
  },
  {
    id: 2,
    title: "GLITCH: A BELEZA DO ERRO",
    slug: "glitch-a-beleza-do-erro",
    category: "Filosofia",
    date: "22 Fev 2026",
    reads: 95,
    comments: 17,
    image:
      "https://images.unsplash.com/photo-1575907153548-ccfef23907a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbGl0Y2glMjBhcnQlMjBuZW9ufGVufDF8fHx8MTc3MjgzMzQ2MXww&ixlib=rb-4.1.0&q=80&w=1080",
    excerpt: "Como os erros digitais se transformam em arte e questionam nossa obsessao por perfeicao tecnologica.",
  },
  {
    id: 3,
    title: "SYNTHWAVE: SOM DO FUTURO PASSADO",
    slug: "synthwave-som-do-futuro-passado",
    category: "Músicas",
    date: "18 Fev 2026",
    reads: 210,
    comments: 34,
    image:
      "https://images.unsplash.com/photo-1767481626894-bab78ae919be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzeW50aHdhdmUlMjBsYW5kc2NhcGUlMjBwdXJwbGV8ZW58MXx8fHwxNzcyODMzNDYxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    excerpt: "A trilha sonora retro-futurista que conecta os anos 80 ao universo digital contemporaneo.",
  },
  {
    id: 4,
    title: "NEON NOIR: CIDADES QUE NAO DORMEM",
    slug: "neon-noir-cidades-que-nao-dormem",
    category: "Filmes",
    date: "12 Fev 2026",
    reads: 156,
    comments: 28,
    image:
      "https://images.unsplash.com/photo-1647014475010-77094d39fadd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBjaXR5JTIwbmlnaHR8ZW58MXx8fHwxNzcyODMzNDYyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    excerpt: "Uma analise visual das cidades cyberpunk no cinema e como elas influenciam o design digital moderno.",
  },
  {
    id: 5,
    title: "ARTE GENERATIVA E CONSCIENCIA",
    slug: "arte-generativa-e-consciencia",
    category: "Filosofia",
    date: "06 Fev 2026",
    reads: 87,
    comments: 12,
    image:
      "https://images.unsplash.com/photo-1713188090500-a4fb0d2cf309?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGRpZ2l0YWwlMjBhcnQlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzI3MzEwMTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    excerpt: "Quando maquinas criam arte, onde reside a intencao? Uma reflexao sobre algoritmos e expressao humana.",
  },
  {
    id: 6,
    title: "VAPORWAVE: ESTETICA DA MELANCOLIA",
    slug: "vaporwave-estetica-da-melancolia",
    category: "Músicas",
    date: "01 Fev 2026",
    reads: 143,
    comments: 21,
    image:
      "https://images.unsplash.com/photo-1700067617672-8ead4a1ac9a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2YXBvcndhdmUlMjBzdGF0dWUlMjBhZXN0aGV0aWN8ZW58MXx8fHwxNzcyODMzNDYyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    excerpt: "O movimento que transformou consumismo em arte e nostalgia em critica social atraves da musica e do visual.",
  },
  {
    id: 7,
    title: "BAUHAUS DIGITAL: FORMA SEGUE FUNCAO",
    slug: "bauhaus-digital-forma-segue-funcao",
    category: "Estudos",
    date: "27 Jan 2026",
    reads: 102,
    comments: 19,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwZ2VvbWV0cmljJTIwZGVzaWdufGVufDF8fHx8MTc3MjgzNzk4MXww&ixlib=rb-4.1.0&q=80&w=1080",
    excerpt: "Como os principios da Bauhaus ressurgem no design de interfaces e na estetica digital contemporanea.",
  },
  {
    id: 8,
    title: "CYBERPUNK LITERARIO: NEUROMANCER E ALEM",
    slug: "cyberpunk-literario-neuromancer-e-alem",
    category: "Livros",
    date: "21 Jan 2026",
    reads: 178,
    comments: 31,
    image:
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwbmVvbiUyMGRhcmt8ZW58MXx8fHwxNzcyODM3OTgxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    excerpt: "Uma jornada pela ficcao cientifica que previu nosso presente digital e continua moldando o imaginario coletivo.",
  },
  {
    id: 9,
    title: "O SILENCIO DOS ALGORITMOS",
    slug: "o-silencio-dos-algoritmos",
    category: "Filosofia",
    date: "15 Jan 2026",
    reads: 64,
    comments: 9,
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwYWJzdHJhY3R8ZW58MXx8fHwxNzcyODM3OTgxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    excerpt: "O que os algoritmos decidem por nos quando nao estamos prestando atencao? Uma reflexao sobre autonomia digital.",
  },
  {
    id: 10,
    title: "BLADE RUNNER: SONHOS ELETRICOS",
    slug: "blade-runner-sonhos-eletricos",
    category: "Filmes",
    date: "08 Jan 2026",
    reads: 234,
    comments: 42,
    image:
      "https://images.unsplash.com/photo-1515705576963-95cad62945b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWluJTIwbmlnaHQlMjBjaXR5JTIwbmVvbiUyMGxpZ2h0c3xlbnwxfHx8fDE3NzI4Mzc5ODF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    excerpt: "Como Blade Runner redefiniu a estetica sci-fi e abriu caminho para toda uma geracao de artistas digitais.",
  },
  {
    id: 11,
    title: "KRAFTWERK: MAQUINAS COM ALMA",
    slug: "kraftwerk-maquinas-com-alma",
    category: "Músicas",
    date: "02 Jan 2026",
    reads: 119,
    comments: 16,
    image:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljJTIwbXVzaWMlMjBzeW50aGVzaXplcnxlbnwxfHx8fDE3NzI4Mzc5ODF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    excerpt: "A historia dos pioneiros da musica eletronica e como Kraftwerk influenciou tudo, do techno ao hip-hop.",
  },
  {
    id: 12,
    title: "BORGES E O HIPERTEXTO",
    slug: "borges-e-o-hipertexto",
    category: "Livros",
    date: "26 Dez 2025",
    reads: 91,
    comments: 14,
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWJyYXJ5JTIwYm9va3MlMjBvbGR8ZW58MXx8fHwxNzcyODM3OTgxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    excerpt: "Como Jorge Luis Borges antecipou a internet, o hipertexto e os labirintos da navegacao digital.",
  },
  {
    id: 13,
    title: "█▓▒░ CORRUPTED_POST ░▒▓█",
    slug: "corrupted-post",
    category: "ERROR",
    date: "?? ??? ????",
    reads: 404,
    comments: 0,
    image:
      "https://images.unsplash.com/photo-1765445665844-5d317051b664?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbGl0Y2glMjBlcnJvciUyMGJyb2tlbiUyMHNjcmVlbiUyMGRpZ2l0YWx8ZW58MXx8fHwxNzcyODM3OTgxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    excerpt: "FATAL: Este arquivo foi corrompido. Os dados nao puderam ser recuperados do servidor.",
    isCorrupted: true,
  },
];

const POSTS_PER_PAGE = 6;

// TODO issue #8: centralize categoryColors in a shared constants file
export const categoryColors: Record<string, string> = {
  "Estudos": "#4ade80",
  "Filosofia": "#c084fc",
  "Músicas": "#f59e0b",
  "Filmes": "#e05050",
  "Livros": "#80b0ff",
  "ERROR": "#ff0000",
};

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
                e.currentTarget.style.boxShadow = post.isCorrupted ? "4px 4px 0 #ff0000" : "4px 4px 0 var(--arm-panel-bg-deep)";
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
                  borderBottom: post.isCorrupted ? "2px solid #ff0000" : "2px solid var(--arm-panel-border)",
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
                  <div className="w-2 h-2" style={{ backgroundColor: "var(--arm-panel-bg-darker)", border: "1px solid var(--arm-panel-bg-deep)" }} />
                  <div className="w-2 h-2" style={{ backgroundColor: "#e05050", border: "1px solid var(--arm-panel-bg-deep)" }} />
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
                {/* Scanline overlay */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-40"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)",
                  }}
                />
                {/* Category badge */}
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
                {/* Glassmorphism hover overlay */}
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

        {/* Pagination */}
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
