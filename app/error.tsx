"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, RefreshCw } from "lucide-react";
import { RetroWindow } from "@/components/ui/RetroWindow";

// Shown when a page throws, e.g. WordPress unreachable. Same window and buttons as not-found.
export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="flex-1 flex items-center justify-center p-6"
      style={{ backgroundColor: "var(--arm-bg)", transition: "background-color 0.3s ease" }}
    >
      <div className="w-full max-w-[480px]">
        <RetroWindow title="ERRO.EXE" variant="light">
          <div className="p-6">
            <div
              className="font-mono mb-2"
              style={{ fontSize: "12px", lineHeight: 1.6, color: "var(--arm-panel-bg-deep)" }}
            >
              <span className="text-chrome-red">{">"}</span> ERRO: nao consegui falar com o servidor
              de conteudo._
            </div>
            <p
              className="mb-5 font-mono"
              style={{ fontSize: "11px", lineHeight: 1.6, color: "#5a7a9a" }}
            >
              tente de novo em alguns instantes.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                className="px-5 py-2.5 cursor-pointer inline-flex items-center gap-2 font-grotesk font-bold bg-chrome-blue-mid brutal-lift"
                style={
                  {
                    color: "#e8f4ff",
                    border: "3px solid var(--arm-panel-bg-deep)",
                    fontSize: "12px",
                    "--lift-rest": "3px",
                    "--lift-hover": "5px",
                  } as React.CSSProperties
                }
                onClick={() => retry()}
              >
                <RefreshCw size={14} />
                Tentar de Novo
              </button>
              <Link
                href="/"
                className="px-5 py-2.5 cursor-pointer inline-flex items-center gap-2 font-grotesk font-bold bg-white text-chrome-blue brutal-lift"
                style={
                  {
                    border: "3px solid var(--arm-panel-bg-deep)",
                    fontSize: "12px",
                    textDecoration: "none",
                    "--lift-rest": "3px",
                    "--lift-hover": "5px",
                  } as React.CSSProperties
                }
              >
                <Home size={14} />
                Inicio
              </Link>
            </div>
          </div>
        </RetroWindow>
      </div>
    </div>
  );
}
