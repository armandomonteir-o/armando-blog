"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { CornerDownLeft, FileText, SearchX, TriangleAlert, X } from "lucide-react";
import { easeOut } from "@/lib/motion";
import { splitHighlight, type SearchResult, type SearchState } from "@/lib/search";

export const SEARCH_LISTBOX_ID = "header-search-results";
export const searchOptionId = (index: number) => `header-search-option-${index}`;

interface SearchPanelProps {
  query: string;
  state: SearchState;
  activeIndex: number;
  onActiveChange: (index: number) => void;
  onSelect: () => void;
  onRetry: () => void;
  onClose: () => void;
}

// The results window under the header search bar. Same language as the other windows of the site
// (title bar with .EXE name, square buttons, hard shadow), with the category as a colored tag.
export function SearchPanel({
  query,
  state,
  activeIndex,
  onActiveChange,
  onSelect,
  onRetry,
  onClose,
}: SearchPanelProps) {
  const results: SearchResult[] = state.status === "done" ? state.results : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.16, ease: easeOut }}
      className="absolute left-0 right-0 mt-2 bg-chrome-blue-mid"
      style={{
        border: "3px solid var(--chrome-blue-dark)",
        boxShadow: "4px 4px 0 var(--chrome-blue-dark)",
        zIndex: 9999,
      }}
    >
      <div
        className="flex items-center gap-2 px-3 py-1.5 bg-chrome-blue-dark"
        style={{ borderBottom: "2px solid var(--chrome-blue-dark)" }}
      >
        <span
          className="w-2 h-2 flex-shrink-0"
          style={{
            background: state.status === "error" ? "var(--chrome-red)" : "var(--chrome-green)",
          }}
        />
        <span
          className="font-mono text-chrome-blue-soft"
          style={{ fontSize: "9px", letterSpacing: "0.1em" }}
        >
          SEARCH.EXE
        </span>
        <span className="flex-1" />
        <span className="font-mono text-chrome-blue-muted" style={{ fontSize: "9px" }}>
          {state.status === "done" &&
            `${results.length} ${results.length === 1 ? "post" : "posts"}`}
        </span>
        <button
          type="button"
          aria-label="Fechar busca"
          onClick={onClose}
          className="flex items-center justify-center w-4 h-4 cursor-pointer text-white"
          style={{ background: "var(--chrome-red)", border: "none", padding: 0 }}
        >
          <X size={10} strokeWidth={3} />
        </button>
      </div>

      {state.status === "done" && results.length > 0 && (
        <div role="listbox" id={SEARCH_LISTBOX_ID} aria-label="Resultados da busca">
          {results.map((r, i) => {
            const active = i === activeIndex;
            return (
              <Link
                key={r.slug}
                id={searchOptionId(i)}
                role="option"
                aria-selected={active}
                href={`/post/${r.slug}`}
                onClick={onSelect}
                onMouseEnter={() => onActiveChange(i)}
                className="flex items-center gap-3 px-3 py-2"
                style={{
                  background: active ? "var(--chrome-blue-accent)" : "transparent",
                  textDecoration: "none",
                  transition: "background var(--duration-hover) var(--ease-out)",
                }}
              >
                <FileText
                  size={14}
                  aria-hidden="true"
                  className="flex-shrink-0"
                  style={{
                    color: active ? "var(--chrome-green)" : "var(--chrome-blue-muted)",
                    transition: "color var(--duration-hover)",
                  }}
                />
                <div className="flex-1 min-w-0 sm:flex sm:items-center sm:gap-3">
                  <div
                    className="line-clamp-2 sm:truncate sm:flex-1 font-grotesk"
                    style={{
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "var(--chrome-blue-content)",
                    }}
                  >
                    {splitHighlight(r.title, query).map((part, j) =>
                      part.match ? (
                        <span
                          key={j}
                          style={{ color: "var(--chrome-green-soft)", fontWeight: 700 }}
                        >
                          {part.text}
                        </span>
                      ) : (
                        <span key={j}>{part.text}</span>
                      )
                    )}
                  </div>
                  {r.category && (
                    <span
                      className="block sm:flex-shrink-0 font-mono text-chrome-blue-soft"
                      style={{ fontSize: "9px", letterSpacing: "0.08em" }}
                    >
                      {r.category.toUpperCase()}
                    </span>
                  )}
                </div>
                <CornerDownLeft
                  size={12}
                  className="flex-shrink-0 text-chrome-green"
                  style={{ opacity: active ? 1 : 0, transition: "opacity var(--duration-hover)" }}
                />
              </Link>
            );
          })}
        </div>
      )}

      {(state.status === "loading" || state.status === "idle") && (
        <div aria-busy="true" aria-label="Buscando">
          {[78, 58, 68].map((width, i) => (
            <div
              key={i}
              className="px-4 py-3"
              style={{
                borderBottom: i < 2 ? "1px solid var(--chrome-blue-accent)" : "none",
              }}
            >
              <div
                className="motion-safe:animate-pulse"
                style={{
                  height: "10px",
                  width: `${width}%`,
                  background: "var(--chrome-blue-accent)",
                }}
              />
              <div
                className="motion-safe:animate-pulse mt-2"
                style={{ height: "8px", width: "22%", background: "var(--chrome-blue-accent)" }}
              />
            </div>
          ))}
        </div>
      )}

      {state.status === "done" && results.length === 0 && (
        <div className="flex flex-col items-center gap-2 px-4 py-6 text-center">
          <SearchX size={22} className="text-chrome-blue-muted" />
          <p className="font-grotesk text-white" style={{ fontSize: "13px", fontWeight: 700 }}>
            nada por aqui pra “{query.trim()}”
          </p>
          <p className="font-mono text-chrome-blue-body" style={{ fontSize: "10px" }}>
            tenta outra palavra, ou{" "}
            <Link
              href="/posts"
              onClick={onSelect}
              className="text-chrome-green"
              style={{ textDecoration: "underline" }}
            >
              veja todos os posts
            </Link>
          </p>
        </div>
      )}

      {state.status === "error" && (
        <div className="flex flex-col items-center gap-3 px-4 py-6 text-center">
          <TriangleAlert size={22} className="text-chrome-red" />
          <p className="font-grotesk text-white" style={{ fontSize: "13px", fontWeight: 700 }}>
            a busca não respondeu
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="font-mono text-white cursor-pointer"
            style={{
              fontSize: "10px",
              letterSpacing: "0.08em",
              padding: "4px 12px",
              background: "var(--chrome-blue)",
              border: "2px solid var(--chrome-blue-dark)",
              boxShadow: "2px 2px 0 var(--chrome-blue-dark)",
            }}
          >
            TENTAR DE NOVO
          </button>
        </div>
      )}

      {state.status === "done" && results.length > 0 && (
        <div
          className="hidden sm:flex items-center gap-4 px-3 py-1.5 bg-chrome-blue-dark font-mono text-chrome-blue-muted"
          style={{ fontSize: "9px", letterSpacing: "0.08em" }}
        >
          <span>↑↓ NAVEGAR</span>
          <span>↵ ABRIR</span>
          <span>ESC FECHAR</span>
        </div>
      )}
    </motion.div>
  );
}
