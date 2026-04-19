"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Mail,
  GitFork,
  AtSign,
  Share2,
  Headphones,
  Code,
  Palette,
  BookOpen,
  Zap,
  ChevronDown,
  Sparkles,
  Terminal,
  Coffee,
  Gamepad2,
  Pencil,
  Eye,
  FileText,
  MessageCircle,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";

const ActivityChart = dynamic(
  () => import("@/components/content/SobreCharts").then((m) => m.ActivityChart),
  { ssr: false }
);
const SkillRadar = dynamic(
  () => import("@/components/content/SobreCharts").then((m) => m.SkillRadar),
  { ssr: false }
);
import { WavyText } from "@/components/ui/WavyText";
import { RetroWindow } from "@/components/ui/RetroWindow";
import { AeroElements } from "@/components/ui/AeroElements";
import { AppImage } from "@/components/ui/AppImage";
import { ContactCTA } from "@/components/content/ContactCTA";
// TODO issue #13: replace with generateMetadata() from WPGraphQL

const AUTHOR = {
  name: "Armando Monteiro",
  role: "Escritor · Programador Criativo · Pensador Digital",
  location: "São Paulo, Brasil",
  since: "2021",
  bio: `Sou Armando — escrevo na intersecção onde arte, tecnologia e filosofia colidem. Este blog é meu laboratório público: um espaço onde desconstruo músicas, dissequei filmes, debato ideias filosóficas e documento minha jornada pela programação criativa.\n\nAcredito que o código é uma forma de arte e que a arte é uma forma de pensar. Cada post aqui é uma tentativa de conectar mundos que a academia insiste em separar — o técnico e o sensível, o racional e o intuitivo, o pixel e a poesia.`,
  manifesto: `"Num mundo saturado de conteúdo descartável, escolho a profundidade. Cada texto que publico é uma conversa que espero continuar por anos. Não escrevo para o algoritmo — escrevo para quem, como eu, acredita que uma boa ideia vale mais que mil cliques."`,
  avatar:
    "https://images.unsplash.com/photo-1766036388751-739036b0e861?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbiUyMHBvcnRyYWl0JTIwYXJ0aXN0aWMlMjBtb29keXxlbnwxfHx8fDE3NzI4MzY1NDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  heroImage:
    "https://images.unsplash.com/photo-1763931504138-3b9fb539f737?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGNvbG9yZnVsJTIwZGlnaXRhbCUyMGdyYWRpZW50fGVufDF8fHx8MTc3MjgzNjU0Mnww&ixlib=rb-4.1.0&q=80&w=1080",
  stats: { posts: 87, views: "24.3k", comments: 412, categories: 5 },
};

const timeline = [
  {
    year: "2021",
    title: "GENESIS.EXE",
    description:
      "Primeiro post publicado. Um ensaio sobre Brian Eno e a arte do acaso. O blog nasce como um fanzine digital sobre música e arte.",
    icon: Pencil,
    color: "#f59e0b",
  },
  {
    year: "2022",
    title: "EXPANSÃO DE HORIZONTES",
    description:
      "Adicionei as seções de Filmes e Livros. Começei a receber feedback de leitores de outros países. O blog ganha identidade visual neobrutalista.",
    icon: Sparkles,
    color: "#e05050",
  },
  {
    year: "2023",
    title: "MERGE: CÓDIGO + ARTE",
    description:
      "Lancei a seção de Estudos — programação criativa, design generativo e IA & Arte. O blog vira um verdadeiro laboratório multidisciplinar.",
    icon: Code,
    color: "#4ade80",
  },
  {
    year: "2024",
    title: "FILOSOFIA DIGITAL",
    description:
      "Nova seção de Filosofia. Ensaios sobre existencialismo digital, ética da IA e pós-humanismo. A comunidade cresce e os debates se aprofundam.",
    icon: Terminal,
    color: "#c084fc",
  },
  {
    year: "2025–26",
    title: "FRUTIGER AERO ERA",
    description:
      "Redesign completo com estética Frutiger Aero. Glassmorphism, bolhas glossy e gradientes translúcidos. O blog se torna uma experiência visual imersiva.",
    icon: Zap,
    color: "#80b0ff",
  },
];

const interests = [
  { icon: Headphones, label: "Synthwave & Ambient", color: "#f59e0b" },
  { icon: Gamepad2, label: "Jogos Indie & Pixel Art", color: "#4ade80" },
  { icon: Coffee, label: "Café & Lo-fi Beats", color: "#e05050" },
  { icon: Code, label: "Creative Coding", color: "#80b0ff" },
  { icon: Palette, label: "Design Generativo", color: "#c084fc" },
  { icon: BookOpen, label: "Sci-Fi & Filosofia", color: "#f59e0b" },
];

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1758872014929-174e4ccdf01f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHBlcnNvbiUyMHdvcmtzcGFjZSUyMGRpZ2l0YWwlMjBhcnR8ZW58MXx8fHwxNzcyODM2NTQyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "MEU SETUP CRIATIVO",
  },
  {
    src: "https://images.unsplash.com/photo-1758405392912-eb488da67a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW55bCUyMHJlY29yZHMlMjBtdXNpYyUyMGNvbGxlY3Rpb24lMjBzaGVsdmVzfGVufDF8fHx8MTc3MjgzNjU0Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "COLEÇÃO DE VINIS",
  },
  {
    src: "https://images.unsplash.com/photo-1738676524296-364cf18900a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNrJTIwY29tcHV0ZXIlMjBjcmVhdGl2ZSUyMHN0dWRpbyUyMHNldHVwfGVufDF8fHx8MTc3MjgzNjU0Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "STUDIO NOTURNO",
  },
  {
    src: "https://images.unsplash.com/photo-1761403794164-65897bc570a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBleGhpYml0aW9uJTIwZ2FsbGVyeSUyMGRhcmslMjBtb29keXxlbnwxfHx8fDE3NzI4MzY1NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "EXPOSIÇÃO IMERSIVA",
  },
];

const BAR_DURATIONS = Array.from({ length: 32 }, () => 1.2 + Math.random() * 0.5);

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -3, boxShadow: `6px 6px 0 #022a6e, 0 0 16px ${color}30` }}
      className="flex flex-col items-center justify-center p-4 cursor-default"
      style={{
        border: "3px solid #022a6e",
        backgroundColor: "#0458d4",
        boxShadow: "4px 4px 0 #022a6e",
        minWidth: 0,
        transition: "background-color 0.2s ease",
      }}
    >
      <motion.div
        whileHover={{ scale: 1.2, rotate: 8 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Icon size={20} style={{ color, marginBottom: "6px" }} />
      </motion.div>
      <span
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: "26px",
          color: "#fff",
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "8px",
          fontWeight: 700,
          color: "#5a8ad0",
          marginTop: "4px",
          letterSpacing: "0.1em",
        }}
      >
        {label}
      </span>
    </motion.div>
  );
}

export default function SobrePage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [heroFontSize, setHeroFontSize] = useState(72);
  const [heroAmplitude, setHeroAmplitude] = useState(14);

  useEffect(() => {
    const updateSize = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setHeroFontSize(32);
        setHeroAmplitude(6);
      } else if (w < 768) {
        setHeroFontSize(48);
        setHeroAmplitude(10);
      } else {
        setHeroFontSize(72);
        setHeroAmplitude(14);
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    const scrollContainer = document.getElementById("main-scroll-container");
    if (!scrollContainer) return;
    const handler = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      setScrollProgress(scrollTop / (scrollHeight - clientHeight));
    };
    scrollContainer.addEventListener("scroll", handler, { passive: true });
    return () => scrollContainer.removeEventListener("scroll", handler);
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex-1 relative overflow-hidden"
      style={{ backgroundColor: "var(--arm-bg)", transition: "background-color 0.3s ease" }}
    >
      <div
        className="fixed top-0 left-0 z-50"
        style={{
          width: `${scrollProgress * 100}%`,
          height: "3px",
          background: "linear-gradient(90deg, #0347c1, #80b0ff, #c084fc)",
          transition: "width 0.1s ease-out",
        }}
      />

      {/* Hero */}
      <div
        className="relative"
        style={{ height: "clamp(420px, 65svh, 700px)", overflow: "hidden" }}
      >
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1, opacity: 0 }}
          animate={{ scale: 1.08, opacity: 1 }}
          transition={{
            opacity: { duration: 1.2, ease: "easeOut" },
            scale: { duration: 25, ease: "linear", repeat: Infinity, repeatType: "reverse" },
          }}
          style={{
            backgroundImage: `url(${AUTHOR.heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            willChange: "transform",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, rgba(192,132,252,0.15) 0%, transparent 50%, rgba(3,71,193,0.1) 100%)",
          }}
        />
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(2,42,110,0.2) 20%, rgba(2,42,110,0.45) 50%, rgba(2,42,110,0.75) 75%, #022a6e 95%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 30%, rgba(255,255,255,0.03) 70%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.05) 3px, rgba(0,0,0,0.05) 6px)",
          }}
        />

        {/* Aero orbs */}
        <motion.div
          className="absolute pointer-events-none"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.35, scale: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          style={{
            width: 280,
            height: 280,
            top: "-60px",
            right: "-40px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 35% 35%, rgba(192,132,252,0.45), rgba(192,132,252,0.15), transparent 70%)",
            filter: "blur(55px)",
          }}
        />
        <motion.div
          className="absolute pointer-events-none"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.25, scale: 1 }}
          transition={{ duration: 2, delay: 0.8 }}
          style={{
            width: 200,
            height: 200,
            bottom: "20%",
            left: "-50px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 35% 35%, rgba(128,176,255,0.4), transparent 70%)",
            filter: "blur(50px)",
          }}
        />

        {/* Glossy bubbles */}
        {(
          [
            { size: 22, top: "12%", right: "10%", left: undefined, bottom: undefined, delay: 1 },
            { size: 16, top: "28%", left: "8%", right: undefined, bottom: undefined, delay: 1.4 },
            { size: 30, bottom: "28%", right: "6%", top: undefined, left: undefined, delay: 1.8 },
            { size: 12, top: "55%", left: "15%", right: undefined, bottom: undefined, delay: 2.1 },
          ] as {
            size: number;
            top?: string;
            right?: string;
            left?: string;
            bottom?: string;
            delay: number;
          }[]
        ).map(({ size, top, right, left, bottom, delay }, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay }}
            style={{
              width: size,
              height: size,
              top,
              right,
              left,
              bottom,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 20%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(3,71,193,0.15) 0%, transparent 80%)",
              border: "1px solid rgba(255,255,255,0.35)",
            }}
          />
        ))}

        <div className="absolute bottom-0 left-0 right-0 px-4 pb-8 sm:px-6 md:px-10 md:pb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3 py-1.5 mb-6"
              style={{
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(12px)",
                border: "2px solid rgba(255,255,255,0.2)",
                color: "#fff",
                fontFamily: "'Space Mono', monospace",
                fontSize: "10px",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              <ArrowLeft size={14} />
              HOME
            </Link>
          </motion.div>

          <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{
                scale: 1.04,
                boxShadow:
                  "8px 8px 0 #022a6e, 0 0 40px rgba(192,132,252,0.35), inset 0 0 20px rgba(128,176,255,0.15)",
              }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="w-[80px] h-[80px] sm:w-[110px] sm:h-[110px] md:w-[140px] md:h-[140px] flex-shrink-0 relative"
              style={{
                border: "4px solid #0560e0",
                boxShadow:
                  "6px 6px 0 #022a6e, 0 0 30px rgba(3,71,193,0.3), inset 0 0 20px rgba(128,176,255,0.1)",
                overflow: "hidden",
                cursor: "pointer",
              }}
            >
              <AppImage
                src={AUTHOR.avatar}
                alt={AUTHOR.name}
                fill
                sizes="(max-width: 640px) 80px, (max-width: 768px) 110px, 140px"
                className="object-cover"
              />
            </motion.div>

            <div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "11px",
                  color: "#c084fc",
                  marginBottom: "6px",
                  letterSpacing: "0.12em",
                }}
              >
                {">"} USER/ABOUT_ME_
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                <WavyText
                  text={AUTHOR.name.toUpperCase()}
                  fontSize={heroFontSize}
                  amplitude={heroAmplitude}
                  frequency={0.12}
                  color="#fff"
                  strokeColor="#c084fc"
                />
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(12px, 2vw, 16px)",
                  color: "rgba(255,255,255,0.7)",
                  marginTop: "4px",
                }}
              >
                {AUTHOR.role}
              </motion.p>
              <motion.div
                className="flex items-center gap-2 sm:gap-3 mt-3 flex-wrap"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(8px)",
                    border: "1.5px solid rgba(255,255,255,0.2)",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "9px",
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  <MapPin size={11} /> {AUTHOR.location}
                </span>
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1"
                  style={{
                    background: "rgba(192,132,252,0.15)",
                    backdropFilter: "blur(8px)",
                    border: "1.5px solid rgba(192,132,252,0.35)",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "9px",
                    fontWeight: 700,
                    color: "#c084fc",
                  }}
                >
                  <Calendar size={11} /> DESDE {AUTHOR.since}
                </span>
              </motion.div>
            </div>
          </div>

          <motion.div
            className="flex flex-col items-center mt-4 sm:mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 0.5, delay: 1.5 }}
          >
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "8px",
                color: "rgba(255,255,255,0.5)",
                letterSpacing: "0.15em",
                marginBottom: "4px",
              }}
            >
              CONHEÇA MINHA HISTÓRIA
            </span>
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <ChevronDown size={16} style={{ color: "rgba(255,255,255,0.5)" }} />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
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

        <div className="relative z-10 p-3 sm:p-6 max-w-[1100px] mx-auto space-y-4 sm:space-y-6">
          {/* Bio + Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 sm:gap-5">
            <RetroWindow title="BIO.TXT" variant="dark">
              <div className="p-5">
                <WavyText text="QUEM SOU EU" variant="stacked" fontSize={24} color="#fff" />
                <div className="mt-4 space-y-3">
                  {AUTHOR.bio.split("\n\n").map((p, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.1 * i }}
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: "14px",
                        lineHeight: 1.75,
                        color: "#80b0ff",
                      }}
                    >
                      {p}
                    </motion.p>
                  ))}
                </div>
                <motion.div
                  className="mt-5 p-4 relative"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  style={{ borderLeft: "4px solid #c084fc", background: "rgba(192,132,252,0.08)" }}
                >
                  <p
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "12px",
                      lineHeight: 1.7,
                      color: "#c084fc",
                      fontStyle: "italic",
                    }}
                  >
                    {AUTHOR.manifesto}
                  </p>
                </motion.div>
                <div className="flex gap-2 mt-5 flex-wrap">
                  {[
                    { icon: GitFork, label: "GITHUB", href: "#" },
                    { icon: AtSign, label: "TWITTER", href: "#" },
                    { icon: Share2, label: "INSTAGRAM", href: "#" },
                    { icon: Mail, label: "EMAIL", href: "#" },
                  ].map((s, i) => (
                    <motion.a
                      key={s.label}
                      href={s.href}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.1 * i }}
                      className="flex items-center gap-1.5 px-3 py-1.5 group"
                      style={{
                        border: "2px solid #0560e0",
                        backgroundColor: "rgba(5,96,224,0.3)",
                        textDecoration: "none",
                        transition: "background-color 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = "#0560e0";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          "rgba(5,96,224,0.3)";
                      }}
                    >
                      <s.icon size={13} style={{ color: "#80b0ff" }} />
                      <span
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: "8px",
                          fontWeight: 700,
                          color: "#80b0ff",
                        }}
                      >
                        {s.label}
                      </span>
                    </motion.a>
                  ))}
                </div>
              </div>
            </RetroWindow>

            <div className="space-y-5">
              <RetroWindow title="STATS.EXE" variant="dark">
                <div className="p-4 grid grid-cols-2 gap-3">
                  <StatCard
                    icon={FileText}
                    label="POSTS"
                    value={AUTHOR.stats.posts}
                    color="#f59e0b"
                    delay={0}
                  />
                  <StatCard
                    icon={Eye}
                    label="VIEWS"
                    value={AUTHOR.stats.views}
                    color="#80b0ff"
                    delay={0.1}
                  />
                  <StatCard
                    icon={MessageCircle}
                    label="COMENTÁRIOS"
                    value={AUTHOR.stats.comments}
                    color="#4ade80"
                    delay={0.2}
                  />
                  <StatCard
                    icon={Palette}
                    label="CATEGORIAS"
                    value={AUTHOR.stats.categories}
                    color="#c084fc"
                    delay={0.3}
                  />
                </div>
              </RetroWindow>
              <RetroWindow title="NOW-PLAYING.EXE" variant="glass">
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 flex items-center justify-center"
                      style={{ border: "2px solid #022a6e", backgroundColor: "rgba(3,71,193,0.2)" }}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      >
                        <Headphones size={20} style={{ color: "#0347c1" }} />
                      </motion.div>
                    </div>
                    <div>
                      <p
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontWeight: 700,
                          fontSize: "13px",
                          color: "var(--arm-text)",
                        }}
                      >
                        Midnight City
                      </p>
                      <p
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: "9px",
                          color: "var(--arm-text-secondary)",
                        }}
                      >
                        M83 · Hurry Up, We&apos;re Dreaming
                      </p>
                    </div>
                  </div>
                  <div className="flex items-end gap-[2px] mt-3 h-5">
                    {Array.from({ length: 32 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="flex-1"
                        animate={{
                          height: [
                            `${20 + Math.sin(i * 0.5) * 60}%`,
                            `${50 + Math.cos(i * 0.7) * 40}%`,
                            `${20 + Math.sin(i * 0.5) * 60}%`,
                          ],
                        }}
                        transition={{
                          duration: BAR_DURATIONS[i],
                          repeat: Infinity,
                          delay: i * 0.03,
                        }}
                        style={{
                          backgroundColor: "#0347c1",
                          opacity: 0.4 + Math.sin(i * 0.3) * 0.3,
                          minHeight: "2px",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </RetroWindow>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <RetroWindow title="ACTIVITY-LOG.EXE" variant="dark">
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} style={{ color: "#4ade80" }} />
                    <span
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 700,
                        fontSize: "14px",
                        color: "#fff",
                      }}
                    >
                      Atividade de Posts
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "9px",
                      color: "#5a8ad0",
                    }}
                  >
                    ÚLTIMOS 9 MESES
                  </span>
                </div>
                <div style={{ height: 180, minWidth: 0 }}>
                  <ActivityChart />
                </div>
              </div>
            </RetroWindow>
            <RetroWindow title="SKILL-SCAN.EXE" variant="dark">
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} style={{ color: "#c084fc" }} />
                    <span
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 700,
                        fontSize: "14px",
                        color: "#fff",
                      }}
                    >
                      Áreas de Expertise
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "9px",
                      color: "#5a8ad0",
                    }}
                  >
                    PROFICIENCY %
                  </span>
                </div>
                <div style={{ height: 180, minWidth: 0 }}>
                  <SkillRadar />
                </div>
              </div>
            </RetroWindow>
          </div>

          {/* Timeline */}
          <RetroWindow title="TIMELINE.EXE" variant="dark">
            <div className="p-5">
              <WavyText text="MINHA JORNADA" variant="stacked" fontSize={24} color="#fff" />
              <div className="mt-5 relative">
                <div
                  className="absolute"
                  style={{
                    left: "18px",
                    top: "12px",
                    bottom: "12px",
                    width: "2px",
                    background: "linear-gradient(to bottom, #0560e0, #c084fc, #0560e0)",
                  }}
                />
                <div className="space-y-0">
                  {timeline.map((item, i) => (
                    <motion.div
                      key={item.year}
                      className="flex gap-5 relative"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.1 * i }}
                    >
                      <div
                        className="flex items-center justify-center flex-shrink-0 z-10"
                        style={{
                          width: 38,
                          height: 38,
                          border: `3px solid ${item.color}`,
                          backgroundColor: "#0347c1",
                          boxShadow: `0 0 12px ${item.color}44`,
                        }}
                      >
                        <item.icon size={16} style={{ color: item.color }} />
                      </div>
                      <div
                        className="flex-1 pb-6"
                        style={{ borderBottom: "1px solid rgba(5,96,224,0.3)" }}
                      >
                        <div className="flex items-center gap-3 mb-1">
                          <span
                            className="px-2 py-0.5"
                            style={{
                              backgroundColor: item.color,
                              border: "2px solid #022a6e",
                              fontFamily: "'Space Mono', monospace",
                              fontSize: "10px",
                              fontWeight: 700,
                              color: "#022a6e",
                            }}
                          >
                            {item.year}
                          </span>
                          <span
                            style={{
                              fontFamily: "'Space Grotesk', sans-serif",
                              fontWeight: 700,
                              fontSize: "15px",
                              color: "#fff",
                            }}
                          >
                            {item.title}
                          </span>
                        </div>
                        <p
                          style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontSize: "13px",
                            lineHeight: 1.65,
                            color: "#80b0ff",
                          }}
                        >
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </RetroWindow>

          {/* Interests */}
          <RetroWindow title="INTERESTS.JSON" variant="glass">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <span
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: "14px",
                    color: "var(--arm-text)",
                  }}
                >
                  Coisas que me movem
                </span>
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "9px",
                    color: "var(--arm-text-secondary)",
                  }}
                >
                  {interests.length} ITEMS
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {interests.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.08 * i }}
                    className="flex items-center gap-3 p-3 group"
                    style={{
                      border: "2px solid var(--arm-border)",
                      backgroundColor: "var(--arm-bg-glass-highlight)",
                      backdropFilter: "blur(8px)",
                      boxShadow: "3px 3px 0 var(--arm-shadow)",
                      transition: "transform 0.2s ease",
                      cursor: "default",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translate(-1px, -1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translate(0, 0)";
                    }}
                  >
                    <div
                      className="w-9 h-9 flex items-center justify-center flex-shrink-0"
                      style={{
                        border: `2px solid ${item.color}`,
                        backgroundColor: `${item.color}15`,
                      }}
                    >
                      <item.icon size={16} style={{ color: item.color }} />
                    </div>
                    <span
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 700,
                        fontSize: "12px",
                        color: "var(--arm-text)",
                      }}
                    >
                      {item.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </RetroWindow>

          {/* Gallery */}
          <RetroWindow title="GALLERY.EXE" variant="dark">
            <div className="p-5">
              <WavyText text="FRAGMENTOS VISUAIS" variant="stacked" fontSize={24} color="#fff" />
              <p
                className="mt-1 mb-4"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "10px",
                  color: "#5a8ad0",
                }}
              >
                SNAPSHOTS DO MEU UNIVERSO CRIATIVO
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {galleryImages.map((img, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 * i }}
                    className="group relative overflow-hidden"
                    style={{ border: "2px solid #0560e0", height: "clamp(120px, 20vw, 160px)" }}
                  >
                    <AppImage
                      src={img.src}
                      alt={img.caption}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
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
                      className="absolute inset-0 flex items-end p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: "linear-gradient(to top, rgba(2,42,110,0.85), transparent 70%)",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: "8px",
                          fontWeight: 700,
                          color: "#80b0ff",
                          letterSpacing: "0.1em",
                        }}
                      >
                        {img.caption}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </RetroWindow>

          <ContactCTA />
        </div>
      </div>
    </div>
  );
}
