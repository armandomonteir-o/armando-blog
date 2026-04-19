"use client";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
}

export function GlassCard({
  children,
  className = "",
  style = {},
  onMouseEnter,
  onMouseLeave,
}: GlassCardProps) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        background: "rgba(255, 255, 255, 0.12)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.25)",
        boxShadow: "0 8px 32px rgba(3, 71, 193, 0.1), inset 0 1px 0 rgba(255,255,255,0.3)",
        ...style,
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 30%, transparent 60%)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
