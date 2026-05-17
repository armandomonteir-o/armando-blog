"use client";

import { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { RetroWindow } from "@/components/ui/RetroWindow";

export function LoginCard() {
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleGoogleSignIn() {
    setLoading(true);
    await signIn("google", { callbackUrl: "/" });
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <RetroWindow
        title="LOGIN.EXE"
        variant="glass"
        titleBg="var(--arm-panel-bg-deep)"
        style={{
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
          transform: hovered ? "translate(-3px, -3px)" : "translate(0, 0)",
          boxShadow: hovered
            ? "8px 8px 0px var(--arm-border), 0 12px 40px rgba(3,71,193,0.2), inset 0 1px 0 rgba(255,255,255,0.2)"
            : "4px 4px 0px var(--arm-border), 0 8px 32px rgba(3,71,193,0.15), inset 0 1px 0 rgba(255,255,255,0.2)",
        }}
      >
        <div className="p-6 flex flex-col gap-6">

          {/* Icon + title */}
          <div className="flex flex-col items-center gap-3">
            <div
              style={{
                width: 64,
                height: 64,
                border: "2px solid var(--arm-border)",
                backgroundColor: "var(--arm-bg)",
                boxShadow: "3px 3px 0 var(--arm-border)",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                src="/avatar-pixel-art.png"
                alt="Armando"
                width={60}
                height={60}
                style={{ imageRendering: "pixelated" }}
              />
            </div>

            <h1
              className="font-grotesk font-bold"
              style={{ fontSize: "20px", color: "var(--arm-text)", lineHeight: 1.1 }}
            >
              ACESSE SUA CONTA
            </h1>

            <p
              className="font-mono text-center"
              style={{ fontSize: "10px", color: "var(--arm-text-secondary)", lineHeight: 1.6 }}
            >
              Entre com o Google pra comentar e interagir com o blog.
            </p>
          </div>

          <div style={{ height: "1px", backgroundColor: "var(--arm-border)", opacity: 0.2 }} />

          {/* Google button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 font-mono font-bold"
            style={{
              border: "2px solid var(--arm-border)",
              backgroundColor: loading ? "var(--arm-bg-card)" : "var(--arm-bg)",
              color: "var(--arm-text)",
              fontSize: "11px",
              letterSpacing: "0.08em",
              padding: "10px 16px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "transform 0.1s ease, box-shadow 0.1s ease",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translate(-2px, -2px)";
                e.currentTarget.style.boxShadow = "4px 4px 0 var(--arm-border)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translate(0, 0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {loading ? "REDIRECIONANDO..." : "ENTRAR COM GOOGLE"}
          </button>

          <p
            className="font-mono text-center"
            style={{ fontSize: "8px", color: "var(--arm-text-muted)", lineHeight: 1.6 }}
          >
            Ao entrar você concorda que seus dados públicos do Google
            (nome e foto) serão usados apenas pra identificação no blog.
          </p>

        </div>
      </RetroWindow>
    </div>
  );
}
