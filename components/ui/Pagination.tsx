"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const paginationButtonStyle: React.CSSProperties = {
  fontFamily: "'Space Mono', monospace",
  fontSize: "11px",
  fontWeight: 700,
  border: "2px solid var(--arm-panel-border)",
  backgroundColor: "var(--arm-panel-bg)",
  color: "var(--arm-panel-text-content)",
  cursor: "pointer",
};

const activePageStyle: React.CSSProperties = {
  ...paginationButtonStyle,
  backgroundColor: "var(--arm-panel-text)",
  color: "var(--arm-blue)",
  border: "2px solid var(--arm-panel-bg-deep)",
  boxShadow: "2px 2px 0 var(--arm-panel-bg-deep)",
};

const hoverAnim = { x: -1, y: -1, boxShadow: "3px 3px 0 var(--arm-panel-bg-deep)" };
const tapAnim = { x: 0, y: 0 };

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const startIdx = (currentPage - 1) * itemsPerPage;

  return (
    <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", color: "var(--arm-panel-text-body)" }}>
          SHOWING {startIdx + 1}-{Math.min(startIdx + itemsPerPage, totalItems)} OF {totalItems}
        </span>
        <div
          className="h-2 overflow-hidden"
          style={{ width: "80px", border: "1.5px solid var(--arm-panel-border)", backgroundColor: "var(--arm-panel-bg-deep)" }}
        >
          <div
            className="h-full"
            style={{
              width: `${(currentPage / totalPages) * 100}%`,
              backgroundColor: "var(--chrome-green)",
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>

      <nav aria-label="Paginação">
        <div className="flex items-center gap-1.5">
          <motion.button
            className="w-8 h-8 flex items-center justify-center"
            style={{
              ...paginationButtonStyle,
              opacity: currentPage === 1 ? 0.4 : 1,
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
            }}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            whileHover={currentPage !== 1 ? hoverAnim : {}}
            whileTap={currentPage !== 1 ? tapAnim : {}}
            aria-label="Página anterior"
          >
            <ChevronLeft size={14} />
          </motion.button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            const isActive = page === currentPage;
            return (
              <motion.button
                key={page}
                className="w-8 h-8 flex items-center justify-center"
                style={isActive ? activePageStyle : paginationButtonStyle}
                onClick={() => onPageChange(page)}
                whileHover={!isActive ? hoverAnim : {}}
                whileTap={!isActive ? tapAnim : {}}
                aria-label={`Página ${page}`}
                aria-current={isActive ? "page" : undefined}
              >
                {String(page).padStart(2, "0")}
              </motion.button>
            );
          })}

          <motion.button
            className="w-8 h-8 flex items-center justify-center"
            style={{
              ...paginationButtonStyle,
              opacity: currentPage === totalPages ? 0.4 : 1,
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            }}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            whileHover={currentPage !== totalPages ? hoverAnim : {}}
            whileTap={currentPage !== totalPages ? tapAnim : {}}
            aria-label="Próxima página"
          >
            <ChevronRight size={14} />
          </motion.button>
        </div>
      </nav>
    </div>
  );
}
