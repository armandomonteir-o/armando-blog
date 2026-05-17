"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { RetroWindow } from "@/components/ui/RetroWindow";
import { WavyText } from "@/components/ui/WavyText";
import { Pagination } from "@/components/ui/Pagination";
import { AppImage } from "@/components/ui/AppImage";
import type { WPComment } from "@/lib/graphql/types";
import { stripHtml, formatWPDate } from "@/lib/graphql/adapters";

interface PostCommentsSectionProps {
  postId: number | null;
  initialComments: WPComment[];
}

const COMMENTS_PER_PAGE = 3;

export function PostCommentsSection({ postId, initialComments }: PostCommentsSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<WPComment[]>(initialComments);
  const [commentPage, setCommentPage] = useState(1);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const totalPages = Math.ceil(comments.length / COMMENTS_PER_PAGE);
  const paginatedComments = comments.slice(
    (commentPage - 1) * COMMENTS_PER_PAGE,
    commentPage * COMMENTS_PER_PAGE
  );

  async function handleSubmit() {
    if (!text.trim() || !postId || submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content: text }),
      });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({}));
        throw new Error(error ?? "Erro desconhecido");
      }
      const { comment } = await res.json();
      if (comment) {
        setComments((prev) => [comment, ...prev]);
        setText("");
        setCommentPage(1);
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erro ao enviar comentário.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <RetroWindow title="POST-COMMENTS.EXE" variant="dark">
      <div className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
          <WavyText
            text="DISCUSSAO"
            variant="stacked"
            fontSize="clamp(16px, 2vw, 26px)"
            color="#fff"
          />
          <span className="flex-shrink-0 font-mono text-chrome-blue-body" style={{ fontSize: "9px" }}>
            {comments.length} RESPONSES
          </span>
        </div>

        {/* Comment input */}
        <div className="mb-5 p-3 border-2 border-chrome-blue-accent bg-chrome-blue-mid">
          <div className="mb-2 font-mono text-chrome-blue-body" style={{ fontSize: "9px" }}>
            {">"} ESCREVA SEU COMENTARIO_
          </div>

          {session ? (
            <>
              <div className="mb-2 flex items-center gap-2">
                {(session.user?.avatarUrl ?? session.user?.image) && (
                  <div className="w-6 h-6 overflow-hidden border border-chrome-blue-accent flex-shrink-0">
                    <AppImage
                      src={session.user.avatarUrl ?? session.user.image!}
                      alt={session.user.displayName ?? session.user.name ?? ""}
                      width={24}
                      height={24}
                      sizes="24px"
                      className="object-cover"
                    />
                  </div>
                )}
                <span className="font-mono text-chrome-blue-soft" style={{ fontSize: "9px" }}>
                  {(session.user?.displayName ?? session.user?.name)?.toUpperCase()}
                </span>
              </div>

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="O que voce achou deste manifesto?..."
                className="w-full bg-transparent outline-none resize-none font-grotesk text-chrome-blue-content"
                rows={3}
                style={{ fontSize: "13px", border: "none" }}
                disabled={submitting}
              />

              {submitError && (
                <p className="font-mono mt-1" style={{ fontSize: "9px", color: "var(--chrome-red)" }}>
                  {submitError}
                </p>
              )}

              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting || !text.trim()}
                  className="px-4 py-1.5 font-mono font-bold bg-white text-chrome-blue border-2 border-chrome-blue-dark"
                  style={{
                    fontSize: "10px",
                    boxShadow: "2px 2px 0 var(--chrome-blue-dark)",
                    opacity: submitting || !text.trim() ? 0.5 : 1,
                    cursor: submitting || !text.trim() ? "not-allowed" : "pointer",
                  }}
                >
                  {submitting ? "ENVIANDO..." : "ENVIAR"}
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between">
              <span className="font-mono text-chrome-blue-body" style={{ fontSize: "10px" }}>
                Faça login para comentar.
              </span>
              <Link
                href="/login"
                className="px-4 py-1.5 font-mono font-bold bg-white text-chrome-blue border-2 border-chrome-blue-dark"
                style={{
                  fontSize: "10px",
                  boxShadow: "2px 2px 0 var(--chrome-blue-dark)",
                  textDecoration: "none",
                }}
              >
                ENTRAR
              </Link>
            </div>
          )}
        </div>

        {/* Comments list */}
        <div className="flex flex-col gap-3">
          {paginatedComments.length === 0 ? (
            <p
              className="font-mono text-chrome-blue-body text-center py-8"
              style={{ fontSize: "11px" }}
            >
              Nenhum comentário ainda. Seja o primeiro!
            </p>
          ) : (
            paginatedComments.map((comment, i) => {
              const globalIndex = (commentPage - 1) * COMMENTS_PER_PAGE + i;
              const cleanContent = stripHtml(comment.content);
              const formattedDate = formatWPDate(comment.date);

              return (
                <div
                  key={comment.id}
                  style={{ transition: "transform 0.2s ease", cursor: "default" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translate(-2px, -2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translate(0, 0)";
                  }}
                >
                  <RetroWindow
                    title={`COMMENT-${String(globalIndex + 1).padStart(2, "0")}.TXT`}
                    variant="dark"
                  >
                    <div className="relative p-4 pl-5 flex flex-col gap-3">
                      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-chrome-blue-soft" />

                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 overflow-hidden relative border-2 border-chrome-blue-accent flex-shrink-0">
                          <AppImage
                            src={comment.author.node.avatar?.url ?? "/avatar-placeholder.jpg"}
                            alt={comment.author.node.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <p className="font-grotesk font-bold text-white text-sm leading-tight">
                          {comment.author.node.name}
                        </p>
                      </div>

                      <p
                        className="font-mono text-chrome-blue-body"
                        style={{ fontSize: "10px", lineHeight: 1.7 }}
                      >
                        {cleanContent}
                      </p>

                      <div className="flex items-center pt-2 border-t border-chrome-blue-accent">
                        <span
                          className="font-mono text-chrome-blue-dim"
                          style={{ fontSize: "8px", letterSpacing: "0.03em" }}
                        >
                          {formattedDate}
                        </span>
                      </div>
                    </div>
                  </RetroWindow>
                </div>
              );
            })
          )}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={commentPage}
            totalPages={totalPages}
            totalItems={comments.length}
            itemsPerPage={COMMENTS_PER_PAGE}
            onPageChange={setCommentPage}
          />
        )}
      </div>
    </RetroWindow>
  );
}
