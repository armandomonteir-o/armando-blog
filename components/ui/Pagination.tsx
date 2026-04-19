"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

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
  border: "2px solid #0560e0",
  backgroundColor: "#0458d4",
  color: "#c8e0ff",
  cursor: "pointer",
  transition: "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease",
};

const activePageStyle: React.CSSProperties = {
  ...paginationButtonStyle,
  backgroundColor: "#fff",
  color: "#0347c1",
  border: "2px solid #022a6e",
  boxShadow: "2px 2px 0 #022a6e",
};

const handleBtnHoverEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.style.transform = "translate(-1px, -1px)";
  e.currentTarget.style.boxShadow = "3px 3px 0 #022a6e";
};

const handleBtnHoverLeave = (e: React.MouseEvent<HTMLButtonElement>, isActive: boolean) => {
  e.currentTarget.style.transform = "translate(0, 0)";
  e.currentTarget.style.boxShadow = isActive ? "2px 2px 0 #022a6e" : "none";
};

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
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", color: "#a0c4ff" }}>
          SHOWING {startIdx + 1}-{Math.min(startIdx + itemsPerPage, totalItems)} OF {totalItems}
        </span>
        <div
          className="h-2 overflow-hidden"
          style={{ width: "80px", border: "1.5px solid #0560e0", backgroundColor: "#022a6e" }}
        >
          <div
            className="h-full"
            style={{
              width: `${(currentPage / totalPages) * 100}%`,
              backgroundColor: "#4ade80",
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          className="w-8 h-8 flex items-center justify-center"
          style={{
            ...paginationButtonStyle,
            opacity: currentPage === 1 ? 0.4 : 1,
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
          }}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          onMouseEnter={(e) => {
            if (currentPage !== 1) handleBtnHoverEnter(e);
          }}
          onMouseLeave={(e) => handleBtnHoverLeave(e, false)}
        >
          <ChevronLeft size={14} />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              className="w-8 h-8 flex items-center justify-center"
              style={isActive ? activePageStyle : paginationButtonStyle}
              onClick={() => onPageChange(page)}
              onMouseEnter={(e) => {
                if (!isActive) handleBtnHoverEnter(e);
              }}
              onMouseLeave={(e) => handleBtnHoverLeave(e, isActive)}
            >
              {String(page).padStart(2, "0")}
            </button>
          );
        })}

        <button
          className="w-8 h-8 flex items-center justify-center"
          style={{
            ...paginationButtonStyle,
            opacity: currentPage === totalPages ? 0.4 : 1,
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          }}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          onMouseEnter={(e) => {
            if (currentPage !== totalPages) handleBtnHoverEnter(e);
          }}
          onMouseLeave={(e) => handleBtnHoverLeave(e, false)}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
