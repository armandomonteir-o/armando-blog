"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { RetroWindow } from "@/components/ui/RetroWindow";
import { AppImage } from "@/components/ui/AppImage";

type UploadState = "idle" | "uploading" | "done" | "error";

export function ProfileForm() {
  const { data: session, update } = useSession();
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then(({ profile }) => {
        if (profile) {
          setDisplayName(profile.displayName ?? "");
          setAvatarUrl(profile.avatarUrl ?? "");
          setPreviewUrl(profile.avatarUrl ?? null);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately — user sees instant feedback
    const blob = URL.createObjectURL(file);
    setPreviewUrl(blob);
    setUploadState("uploading");
    setUploadError(null);
    setFeedback(null);

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/profile/avatar", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Falha no upload");

      URL.revokeObjectURL(blob);
      setAvatarUrl(data.url);
      setPreviewUrl(data.url);
      setUploadState("done");
    } catch (err) {
      URL.revokeObjectURL(blob);
      setPreviewUrl(avatarUrl || null); // revert to last saved avatar
      setUploadState("error");
      setUploadError(err instanceof Error ? err.message : "Falha no upload");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function handleUseGooglePhoto() {
    const url = session?.user?.image ?? null;
    setAvatarUrl(url ?? "");
    setPreviewUrl(url);
    setUploadState("idle");
    setUploadError(null);
  }

  async function handleSave() {
    if (saving || uploadState === "uploading") return;
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
      await update();
      setFeedback({ ok: true, msg: "PERFIL SALVO COM SUCESSO." });
      setUploadState("idle");
    } catch (err) {
      setFeedback({ ok: false, msg: err instanceof Error ? err.message : "Erro ao salvar." });
    } finally {
      setSaving(false);
    }
  }

  const displayAvatar = previewUrl ?? session?.user?.image ?? null;
  const displayName_ = displayName || session?.user?.name || "?";
  const canSave = !saving && uploadState !== "uploading" && (displayName.trim() !== "" || avatarUrl !== "");

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
            {displayAvatar ? (
              <AppImage
                src={displayAvatar}
                alt="avatar preview"
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <span className="font-grotesk font-bold" style={{ fontSize: 28, color: "var(--arm-text)" }}>
                {displayName_[0]?.toUpperCase()}
              </span>
            )}
          </div>
          <p className="font-mono font-bold" style={{ fontSize: "13px", color: "var(--arm-text)" }}>
            {displayName_.toUpperCase()}
          </p>
          <p className="font-mono text-center" style={{ fontSize: "9px", color: "var(--arm-text-secondary)", lineHeight: 1.6 }}>
            Esses dados aparecem nos seus comentários.
            <br />Os dados do Google são usados como fallback.
          </p>
        </div>

        <div style={{ height: "1px", backgroundColor: "var(--arm-border)", opacity: 0.2 }} />

        {/* Display name */}
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

        {/* Avatar upload */}
        <div className="flex flex-col gap-2">
          <label className="font-mono" style={{ fontSize: "9px", color: "var(--arm-text-secondary)", letterSpacing: "0.1em" }}>
            FOTO DE PERFIL
          </label>

          {/* Hidden file input — opened programmatically */}
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploadState === "uploading"}
              className="font-mono font-bold"
              style={{
                border: "2px solid var(--arm-border)",
                backgroundColor: "var(--arm-bg-card)",
                color: "var(--arm-text)",
                fontSize: "10px",
                padding: "6px 14px",
                cursor: uploadState === "uploading" ? "wait" : "pointer",
                letterSpacing: "0.06em",
                transition: "transform 0.1s ease, box-shadow 0.1s ease",
              }}
              onMouseEnter={(e) => {
                if (uploadState !== "uploading") {
                  e.currentTarget.style.transform = "translate(-2px, -2px)";
                  e.currentTarget.style.boxShadow = "3px 3px 0 var(--arm-border)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translate(0,0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {uploadState === "uploading" ? "ENVIANDO..." : "ESCOLHER ARQUIVO"}
            </button>

            {session?.user?.image && (
              <button
                type="button"
                onClick={handleUseGooglePhoto}
                className="font-mono"
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

          {uploadState === "done" && (
            <p className="font-mono" style={{ fontSize: "9px", color: "var(--chrome-green)", letterSpacing: "0.05em" }}>
              ✓ Upload concluído — clique em SALVAR PERFIL para confirmar
            </p>
          )}
          {uploadState === "error" && uploadError && (
            <p className="font-mono" style={{ fontSize: "9px", color: "var(--chrome-red)", letterSpacing: "0.05em" }}>
              ✗ {uploadError}
            </p>
          )}

          <p className="font-mono" style={{ fontSize: "9px", color: "var(--arm-text-secondary)", opacity: 0.6 }}>
            JPG, PNG, WEBP ou GIF · máx. 2MB
          </p>
        </div>

        {/* Save feedback */}
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
          disabled={!canSave}
          className="w-full font-mono font-bold"
          style={{
            border: "2px solid var(--arm-border)",
            backgroundColor: "var(--arm-bg)",
            color: "var(--arm-text)",
            fontSize: "11px",
            letterSpacing: "0.08em",
            padding: "10px 16px",
            cursor: !canSave ? "not-allowed" : "pointer",
            opacity: !canSave ? 0.5 : 1,
            transition: "transform 0.1s ease, box-shadow 0.1s ease",
          }}
          onMouseEnter={(e) => {
            if (canSave) {
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
