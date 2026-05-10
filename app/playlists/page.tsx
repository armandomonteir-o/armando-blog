"use client";

import React, { useState } from "react";
import {
  Music,
  Clock,
  Users,
  ExternalLink,
  ListMusic,
  Filter,
  X,
  Play,
  Disc3,
  Radio,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { WavyText } from "@/components/ui/WavyText";
import { RetroWindow } from "@/components/ui/RetroWindow";
import { AeroElements } from "@/components/ui/AeroElements";
import { AppImage } from "@/components/ui/AppImage";
import { Pagination } from "@/components/ui/Pagination";
import { CategoryHero } from "@/components/ui/CategoryHero";
import { genres, genreColors, getPlaylistsByGenre, type Playlist } from "@/data/playlists";

// TODO issue #13: replace with generateMetadata() from WPGraphQL

const PLAYLISTS_PER_PAGE = 6;

function EqualizerBars({ color = "#4ade80" }: { color?: string }) {
  return (
    <div className="flex items-end gap-[2px]" style={{ height: 14 }}>
      {[0, 0.2, 0.1, 0.3, 0.15].map((delay, i) => (
        <motion.div
          key={i}
          animate={{ height: [4, 14, 6, 12, 4] }}
          transition={{ duration: 1.2, repeat: Infinity, delay, ease: "easeInOut" }}
          style={{ width: 2, backgroundColor: color, borderRadius: 1 }}
        />
      ))}
    </div>
  );
}

function GenreChip({
  genre,
  isActive,
  onClick,
}: {
  genre: string;
  isActive: boolean;
  onClick: () => void;
}) {
  const color = genreColors[genre] || "#80b0ff";
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 cursor-pointer transition-all font-mono font-bold"
      style={{
        border: isActive ? `2px solid ${color}` : "2px solid #0560e0",
        backgroundColor: isActive ? `${color}22` : "#0458d4",
        color: isActive ? color : "#c8e0ff",
        fontSize: "10px",
        boxShadow: isActive ? `2px 2px 0 ${color}55` : "none",
        transform: isActive ? "translate(-1px, -1px)" : "none",
      }}
    >
      {isActive && (
        <div
          className="w-1.5 h-1.5"
          style={{ backgroundColor: color, borderRadius: "50%", boxShadow: `0 0 6px ${color}` }}
        />
      )}
      {genre.toUpperCase()}
    </button>
  );
}

const PlaylistCard = React.forwardRef<HTMLDivElement, { playlist: Playlist; index: number }>(
  function PlaylistCard({ playlist, index }, ref) {
    const [isHovered, setIsHovered] = useState(false);
    const [expanded, setExpanded] = useState(false);

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, delay: index * 0.06 }}
        layout
      >
        <div
          className="flex flex-col group bg-chrome-blue-mid"
          style={{
            border: `2px solid ${isHovered ? playlist.accentColor : "#0560e0"}`,
            transition: "border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
            transform: isHovered ? "translate(-2px, -2px)" : "none",
            boxShadow: isHovered ? `5px 5px 0 ${playlist.accentColor}44` : "none",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex items-center justify-between px-2.5 py-1 bg-chrome-blue-accent border-b-2 border-chrome-blue-dark">
            <div className="flex items-center gap-2">
              <Disc3
                size={10}
                className={isHovered ? "animate-spin" : ""}
                style={{ color: playlist.accentColor, animationDuration: "3s" }}
              />
              <span className="font-mono font-bold text-chrome-blue-text-on-dark" style={{ fontSize: "8px" }}>
                PLAYLIST-{playlist.id.split("-")[1]}.SPT
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {isHovered && <EqualizerBars color={playlist.accentColor} />}
              <div className="flex gap-1 ml-1">
                <div className="w-2 h-2 bg-chrome-blue border border-chrome-blue-dark" />
                <div className="w-2 h-2 bg-chrome-red border border-chrome-blue-dark" />
              </div>
            </div>
          </div>

          <div className="relative h-[180px] overflow-hidden">
            <AppImage
              src={playlist.coverImage}
              alt={playlist.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              preload={index === 0}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to top, rgba(4,88,212,0.95) 0%, rgba(4,88,212,0.4) 40%, transparent 70%)",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div
                className="w-14 h-14 flex items-center justify-center"
                style={{
                  background: `${playlist.accentColor}cc`,
                  border: "3px solid #fff",
                  borderRadius: "50%",
                  boxShadow: `0 4px 20px ${playlist.accentColor}88`,
                }}
              >
                <Play size={22} fill="#fff" className="text-white ml-0.5" />
              </div>
            </div>
            <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap">
              {playlist.genres.map((g) => (
                <span
                  key={g}
                  className="px-2 py-0.5 font-mono font-bold text-chrome-blue-dark"
                  style={{
                    backgroundColor: genreColors[g] || "#0347c1",
                    border: "1.5px solid #022a6e",
                    fontSize: "7px",
                  }}
                >
                  {g.toUpperCase()}
                </span>
              ))}
            </div>
            <div
              className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1"
              style={{
                background: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(8px)",
                border: `1.5px solid ${playlist.accentColor}88`,
              }}
            >
              <ListMusic size={10} style={{ color: playlist.accentColor }} />
              <span
                className="font-mono font-bold"
                style={{ fontSize: "9px", color: playlist.accentColor }}
              >
                {playlist.trackCount}
              </span>
            </div>
          </div>

          <div className="p-4">
            <h3
              className="font-grotesk font-bold text-white mb-1.5"
              style={{ fontSize: "16px", lineHeight: 1.2 }}
            >
              {playlist.name}
            </h3>
            <p
              className="font-mono text-chrome-blue-text-on-dark mb-2.5"
              style={{ fontSize: "10px", lineHeight: 1.5 }}
            >
              {playlist.description.length > 120
                ? playlist.description.slice(0, 120) + "..."
                : playlist.description}
            </p>
            <div className="flex items-center gap-3 py-2 mb-3 border-y border-chrome-blue-accent">
              <div className="flex items-center gap-1 text-chrome-blue-body">
                <Clock size={10} />
                <span className="font-mono" style={{ fontSize: "8px" }}>
                  {playlist.totalDuration}
                </span>
              </div>
              <div className="flex items-center gap-1 text-chrome-blue-body">
                <Users size={10} />
                <span className="font-mono" style={{ fontSize: "8px" }}>
                  {playlist.followers.toLocaleString("pt-BR")}
                </span>
              </div>
              <div className="flex items-center gap-1 ml-auto text-chrome-blue-body">
                <span className="font-mono" style={{ fontSize: "7px" }}>
                  UPD: {playlist.lastUpdated}
                </span>
              </div>
            </div>

            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full flex items-center justify-between px-2 py-1.5 mb-3 cursor-pointer font-mono font-bold text-chrome-blue-text-on-dark"
              style={{
                backgroundColor: "rgba(5,96,224,0.4)",
                border: "1.5px solid #0560e0",
                fontSize: "9px",
              }}
            >
              <span>{expanded ? "OCULTAR" : "VER"} TOP TRACKS</span>
              <motion.span
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: "inline-block" }}
              >
                ▼
              </motion.span>
            </button>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: "hidden" }}
                >
                  <div className="mb-3">
                    {playlist.tracks.map((track, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 py-1.5 px-2"
                        style={{
                          borderBottom:
                            i < playlist.tracks.length - 1
                              ? "1px solid rgba(5,96,224,0.3)"
                              : "none",
                        }}
                      >
                        <span
                          className="font-mono shrink-0"
                          style={{ fontSize: "8px", color: playlist.accentColor, width: 14 }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="truncate font-grotesk font-semibold text-white" style={{ fontSize: "11px" }}>
                            {track.title}
                          </div>
                          <div className="truncate font-mono text-chrome-blue-body" style={{ fontSize: "8px" }}>
                            {track.artist}
                          </div>
                        </div>
                        <span
                          className="font-mono text-chrome-blue-body shrink-0"
                          style={{ fontSize: "8px" }}
                        >
                          {track.duration}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <a
              href={playlist.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2 cursor-pointer font-mono font-bold text-white no-underline border-2 border-chrome-blue-dark"
              style={{
                backgroundColor: "#1DB954",
                fontSize: "10px",
                boxShadow: "3px 3px 0 #022a6e",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translate(-1px, -1px)";
                e.currentTarget.style.boxShadow = "4px 4px 0 #022a6e";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translate(0, 0)";
                e.currentTarget.style.boxShadow = "3px 3px 0 #022a6e";
              }}
            >
              <ExternalLink size={12} />
              ABRIR NO SPOTIFY
            </a>
          </div>
        </div>
      </motion.div>
    );
  }
);

export default function PlaylistsPage() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(true);

  const filteredPlaylists = getPlaylistsByGenre(selectedGenres);
  const totalPages = Math.ceil(filteredPlaylists.length / PLAYLISTS_PER_PAGE);
  const startIdx = (currentPage - 1) * PLAYLISTS_PER_PAGE;
  const currentPlaylists = filteredPlaylists.slice(startIdx, startIdx + PLAYLISTS_PER_PAGE);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setCurrentPage(1);
  };
  const totalTracks = filteredPlaylists.reduce((a, p) => a + p.trackCount, 0);

  return (
    <div
      className="flex-1 relative overflow-hidden bg-arm-bg"
      style={{ transition: "background-color 0.3s ease" }}
    >
      <CategoryHero
        minHeight="320px"
        backgroundGradient="linear-gradient(135deg, #0347c1 0%, #022a6e 30%, #1DB954 60%, #0347c1 100%)"
        overlayGradient="transparent"
        accentColor="#1DB954"
        strokeColor="#1DB954"
        terminalPrefix="SPOTIFY/PLAYLISTS_"
        title="PLAYLISTS"
        description="Minhas playlists curadas no Spotify. Cada uma e uma viagem sonora — filtre por genero e encontre a trilha perfeita para o seu momento."
        keyframeCSS="@keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }"
        statsBar={
          <>
            <div className="flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.8)" }}>
              <Radio size={13} />
              <span className="font-grotesk font-bold" style={{ fontSize: "14px" }}>
                {filteredPlaylists.length}
              </span>
              <span className="font-mono" style={{ fontSize: "9px", color: "rgba(255,255,255,0.5)" }}>
                playlists
              </span>
            </div>
            <div className="flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.8)" }}>
              <Music size={13} />
              <span className="font-grotesk font-bold" style={{ fontSize: "14px" }}>
                {totalTracks}
              </span>
              <span className="font-mono" style={{ fontSize: "9px", color: "rgba(255,255,255,0.5)" }}>
                tracks
              </span>
            </div>
            <div className="flex items-center gap-1" style={{ color: "#1DB954" }}>
              <div
                className="w-2 h-2"
                style={{
                  backgroundColor: "#1DB954",
                  borderRadius: "50%",
                  boxShadow: "0 0 6px #1DB954",
                }}
              />
              <span className="font-mono font-bold" style={{ fontSize: "9px" }}>
                SPOTIFY CONNECTED
              </span>
            </div>
          </>
        }
        extraDecorations={
          <>
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.06]"
              style={{
                backgroundImage:
                  "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            <motion.div
              className="absolute pointer-events-none hidden md:block"
              initial={{ opacity: 0, rotate: -30 }}
              animate={{ opacity: 0.15, rotate: 0 }}
              transition={{ duration: 1.5, delay: 0.3 }}
              style={{
                width: 240,
                height: 240,
                top: "40px",
                right: "60px",
                borderRadius: "50%",
                border: "3px solid rgba(255,255,255,0.2)",
                background:
                  "radial-gradient(circle at 50% 50%, rgba(0,0,0,0.5) 20%, transparent 22%, rgba(0,0,0,0.1) 30%, transparent 32%, rgba(0,0,0,0.1) 40%, transparent 42%, rgba(0,0,0,0.1) 55%, transparent 57%)",
              }}
            >
              <div
                className="absolute"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,255,255,0.2)",
                  border: "2px solid rgba(255,255,255,0.3)",
                }}
              />
            </motion.div>
          </>
        }
      />

      <div
        className="relative bg-arm-bg"
        style={{ transition: "background-color 0.3s ease" }}
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

        <div className="relative z-10 p-4 sm:p-6 max-w-[1200px] mx-auto">
          <RetroWindow title="GENRE-FILTER.EXE" variant="glass">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Filter size={14} className="text-arm-text" />
                  <span className="font-grotesk font-bold text-arm-text" style={{ fontSize: "14px" }}>
                    Filtrar por Genero
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {selectedGenres.length > 0 && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-1 px-2 py-1 cursor-pointer font-mono font-bold text-chrome-red border-2 border-chrome-red"
                      style={{
                        backgroundColor: "rgba(224,80,80,0.1)",
                        fontSize: "9px",
                      }}
                    >
                      <X size={10} />
                      LIMPAR ({selectedGenres.length})
                    </button>
                  )}
                  <button
                    onClick={() => setFilterOpen(!filterOpen)}
                    className="px-2 py-1 cursor-pointer font-mono font-bold text-arm-text border-2 border-chrome-blue-dark"
                    style={{
                      backgroundColor: "rgba(3,71,193,0.1)",
                      fontSize: "9px",
                    }}
                  >
                    {filterOpen ? "OCULTAR" : "MOSTRAR"}
                  </button>
                </div>
              </div>
              <AnimatePresence>
                {filterOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: "hidden" }}
                  >
                    <div className="flex flex-wrap gap-2 pt-1">
                      {genres.map((genre) => (
                        <GenreChip
                          key={genre}
                          genre={genre}
                          isActive={selectedGenres.includes(genre)}
                          onClick={() => toggleGenre(genre)}
                        />
                      ))}
                    </div>
                    {selectedGenres.length > 0 && (
                      <div
                        className="mt-3 px-3 py-2"
                        style={{
                          backgroundColor: "rgba(3,71,193,0.08)",
                          border: "1.5px solid rgba(3,71,193,0.2)",
                        }}
                      >
                        <span className="font-mono text-arm-text-secondary" style={{ fontSize: "9px" }}>
                          FILTRANDO: {selectedGenres.map((g) => g.toUpperCase()).join(" + ")}
                          {" → "}
                          {filteredPlaylists.length} resultado
                          {filteredPlaylists.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </RetroWindow>

          <div className="mt-5">
            <RetroWindow title="PLAYLISTS-GRID.EXE" variant="dark">
              <div className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                  <WavyText
                    text={
                      selectedGenres.length > 0
                        ? `PLAYLISTS: ${selectedGenres[0].toUpperCase()}${selectedGenres.length > 1 ? ` +${selectedGenres.length - 1}` : ""}`
                        : "TODAS AS PLAYLISTS"
                    }
                    variant="stacked"
                    fontSize="clamp(16px, 2.5vw, 26px)"
                    color="#fff"
                  />
                  <span className="font-mono text-chrome-blue-body" style={{ fontSize: "9px" }}>
                    {filteredPlaylists.length} ENTRIES FOUND
                  </span>
                </div>

                {filteredPlaylists.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16"
                  >
                    <div
                      className="w-16 h-16 flex items-center justify-center mb-4 bg-chrome-blue-mid"
                      style={{ border: "3px solid #0560e0" }}
                    >
                      <Music size={28} className="text-chrome-blue-body" />
                    </div>
                    <p
                      className="font-grotesk font-bold text-chrome-blue-text-on-dark mb-2"
                      style={{ fontSize: "16px" }}
                    >
                      Nenhuma playlist encontrada
                    </p>
                    <p className="font-mono text-chrome-blue-body" style={{ fontSize: "10px" }}>
                      Tente selecionar outros generos no filtro acima
                    </p>
                    <button
                      onClick={clearFilters}
                      className="mt-4 px-4 py-2 cursor-pointer font-mono font-bold text-chrome-blue-text-on-dark border-2 border-chrome-blue-accent bg-chrome-blue-mid"
                      style={{ fontSize: "11px", boxShadow: "3px 3px 0 #022a6e" }}
                    >
                      LIMPAR FILTROS
                    </button>
                  </motion.div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      <AnimatePresence mode="popLayout">
                        {currentPlaylists.map((playlist, i) => (
                          <PlaylistCard key={playlist.id} playlist={playlist} index={i} />
                        ))}
                      </AnimatePresence>
                    </div>
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={filteredPlaylists.length}
                      itemsPerPage={PLAYLISTS_PER_PAGE}
                      onPageChange={setCurrentPage}
                    />
                  </>
                )}
              </div>
            </RetroWindow>
          </div>

          <div className="mt-5">
            <RetroWindow title="SPOTIFY-API.README" variant="glass">
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 flex items-center justify-center flex-shrink-0 border-2 border-chrome-blue-dark"
                    style={{ backgroundColor: "#1DB954", boxShadow: "2px 2px 0 #022a6e" }}
                  >
                    <Music size={18} className="text-white" />
                  </div>
                  <div>
                    <h4
                      className="font-grotesk font-bold text-arm-text mb-1"
                      style={{ fontSize: "14px" }}
                    >
                      Integracao com Spotify
                    </h4>
                    <p
                      className="font-mono text-arm-text-secondary"
                      style={{ fontSize: "10px", lineHeight: 1.6 }}
                    >
                      Estas playlists serao sincronizadas automaticamente com a API do Spotify. Por
                      enquanto, os dados sao mock — a integracao real conectara ao seu perfil e
                      atualizara covers, tracklists e contagem de seguidores em tempo real.
                    </p>
                    <div
                      className="inline-flex items-center gap-1.5 mt-2 px-2 py-1 font-mono font-bold"
                      style={{
                        backgroundColor: "rgba(29,185,84,0.1)",
                        border: "1.5px solid rgba(29,185,84,0.3)",
                        fontSize: "8px",
                        color: "#1DB954",
                      }}
                    >
                      <div
                        className="w-1.5 h-1.5"
                        style={{
                          backgroundColor: "#1DB954",
                          borderRadius: "50%",
                          animation: "pulse 2s infinite",
                        }}
                      />
                      STATUS: MOCK DATA · INTEGRACAO PENDENTE
                    </div>
                  </div>
                </div>
              </div>
            </RetroWindow>
          </div>
        </div>
      </div>
    </div>
  );
}
