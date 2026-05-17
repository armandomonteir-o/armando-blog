"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { RetroWindow } from "@/components/ui/RetroWindow";

export function ProfileForm() {
  const { data: session, update } = useSession();
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then(({ profile }) => {
        if (profile) {
          setDisplayName(profile.displayName ?? "");
          setAvatarUrl(profile.avatarUrl ?? "");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    if (saving) return;
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName, avatarUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro desconhecido");
      // Trigger JWT refresh so session.user.displayName updates immediately
      await update();
      setFeedback({ ok: true, msg: "PERFIL SALVO COM SUCESSO." });
    } catch (err) {
      setFeedback({ ok: false, msg: err instanceof Error ? err.message : "Erro ao salvar." });
    } finally {
      setSaving(false);
    }
  }

  const previewAvatar = avatarUrl || session?.user?.image || null;
  const previewName = displayName || session?.user?.name || "?";

  if (loading) {
    return (
      <p className="font-mono text-center py-10" style={{ fontSize: "11px", color: "var(--arm-text-secondary)" }}>
        CARREGANDO...
      </p>
    );
  }

  return (
    <RetroWindow
      title="MINHA-CONTA.EXE"
      variant="glass"
      style={{ maxWidth: 520, margin: "0 auto" }}
    >
      <div className="p-6 flex flex-col gap-6">

        {/* Avatar preview */}
        <div className="flex flex-col items-center gap-3">
          <div
            style={{
              width: 80,
              height: 80,
              border: "2px solid var(--arm-border)",
              boxShadow: "3px 3px 0 var(--arm-border)",
              overflow: "hidden",
              position: "relative",
              backgroundColor: "var(--arm-bg-card)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {previewAvatar ? (
              <Image
                src={previewAvatar}
                alt="avatar preview"
                fill
                sizes="80px"
                className="object-cover"
                unoptimized={!previewAvatar.startsWith("https://lh3.googleusercontent.com") && !previewAvatar.startsWith("https://secure.gravatar.com")}
              />
            ) : (
              <span className="font-grotesk font-bold" style={{ fontSize: 28, color: "var(--arm-text)" }}>
                {previewName[0]?.toUpperCase()}
              </span>
            )}
          </div>
          <p className="font-mono font-bold" style={{ fontSize: "13px", color: "var(--arm-text)" }}>
            {previewName.toUpperCase()}
          </p>
          <p className="font-mono text-center" style={{ fontSize: "9px", color: "var(--arm-text-secondary)", lineHeight: 1.6 }}>
            Esses dados aparecem nos seus comentários.
            <br />Os dados do Google são usados como fallback.
          </p>
        </div>

        <div style={{ height: "1px", backgroundColor: "var(--arm-border)", opacity: 0.2 }} />

        {/* Display name field */}
        <div className="flex flex-col gap-2">
          <label className="font-mono" style={{ fontSize: "9px", color: "var(--arm-text-secondary)", letterSpacing: "0.1em" }}>
            NOME DE EXIBIÇÃO
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder={session?.user?.name ?? "Seu nome..."}
            maxLength={60}
            className="w-full font-mono bg-transparent outline-none"
            style={{
              border: "2px solid var(--arm-border)",
              padding: "8px 12px",
              fontSize: "13px",
              color: "var(--arm-text)",
              backgroundColor: "var(--arm-bg-card)",
            }}
          />
        </div>

        {/* Avatar URL field */}
        <div className="flex flex-col gap-2">
          <label className="font-mono" style={{ fontSize: "9px", color: "var(--arm-text-secondary)", letterSpacing: "0.1em" }}>
            URL DO AVATAR
          </label>
          <input
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://..."
            className="w-full font-mono bg-transparent outline-none"
            style={{
              border: "2px solid var(--arm-border)",
              padding: "8px 12px",
              fontSize: "12px",
              color: "var(--arm-text)",
              backgroundColor: "var(--arm-bg-card)",
            }}
          />
          {session?.user?.image && (
            <button
              type="button"
              onClick={() => setAvatarUrl(session.user!.image!)}
              className="self-start font-mono"
              style={{
                fontSize: "9px",
                color: "var(--arm-text-secondary)",
                background: "none",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
                padding: 0,
              }}
            >
              usar foto do Google
            </button>
          )}
        </div>

        {/* Feedback */}
        {feedback && (
          <p
            className="font-mono"
            style={{
              fontSize: "9px",
              color: feedback.ok ? "var(--chrome-green)" : "var(--chrome-red)",
              letterSpacing: "0.05em",
            }}
          >
            {feedback.ok ? "✓ " : "✗ "}{feedback.msg}
          </p>
        )}

        {/* Save button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || (!displayName.trim() && !avatarUrl.trim())}
          className="w-full font-mono font-bold"
          style={{
            border: "2px solid var(--arm-border)",
            backgroundColor: "var(--arm-bg)",
            color: "var(--arm-text)",
            fontSize: "11px",
            letterSpacing: "0.08em",
            padding: "10px 16px",
            cursor: saving || (!displayName.trim() && !avatarUrl.trim()) ? "not-allowed" : "pointer",
            opacity: saving || (!displayName.trim() && !avatarUrl.trim()) ? 0.5 : 1,
            transition: "transform 0.1s ease, box-shadow 0.1s ease",
          }}
          onMouseEnter={(e) => {
            if (!saving) {
              e.currentTarget.style.transform = "translate(-2px, -2px)";
              e.currentTarget.style.boxShadow = "4px 4px 0 var(--arm-border)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translate(0, 0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {saving ? "SALVANDO..." : "SALVAR PERFIL"}
        </button>

      </div>
    </RetroWindow>
  );
}
