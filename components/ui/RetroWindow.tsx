interface RetroWindowProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  variant?: "dark" | "light" | "glass";
  onClose?: boolean;
  onMinimize?: boolean;
  style?: React.CSSProperties;
}

export function RetroWindow({
  title,
  children,
  className = "",
  variant = "light",
  onClose = true,
  onMinimize = true,
  style,
}: RetroWindowProps) {
  const isDark = variant === "dark";
  const isGlass = variant === "glass";

  const borderColor = isDark ? "#022a6e" : "var(--arm-border)";
  const titleBg = isGlass
    ? "var(--arm-bg-glass-title)"
    : isDark
      ? "#0458d4"
      : "var(--arm-bg-card-title)";
  const titleText = isGlass ? "#fff" : isDark ? "#fff" : "var(--arm-text)";
  const bodyBg = isGlass ? "var(--arm-glass-body)" : isDark ? "#0347c1" : "var(--arm-bg-card)";

  const glassStyles: React.CSSProperties = isGlass
    ? {
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        boxShadow: `4px 4px 0px ${borderColor}, 0 8px 32px rgba(3,71,193,0.15), inset 0 1px 0 rgba(255,255,255,0.2)`,
      }
    : {};

  return (
    <div
      className={`flex flex-col ${className}`}
      style={{
        border: `3px solid ${borderColor}`,
        boxShadow: `4px 4px 0px ${isDark ? "#022a6e" : "var(--arm-shadow)"}`,
        ...glassStyles,
        ...style,
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center justify-between px-3 py-1.5"
        style={{
          backgroundColor: titleBg,
          borderBottom: `2px solid ${borderColor}`,
          minHeight: "28px",
          ...(isGlass ? { backdropFilter: "blur(10px)" } : {}),
        }}
      >
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "11px",
            fontWeight: 700,
            color: titleText,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          {title}
        </span>
        <div className="flex items-center gap-1.5">
          {onMinimize && (
            <button
              className="w-4 h-4 flex items-center justify-center"
              style={{
                border: `2px solid ${borderColor}`,
                backgroundColor: isDark ? "#0560e0" : "var(--arm-bg-card-title)",
                fontSize: "10px",
                fontWeight: 700,
                lineHeight: 1,
                color: titleText,
              }}
            >
              _
            </button>
          )}
          {onClose && (
            <button
              className="w-4 h-4 flex items-center justify-center"
              style={{
                border: `2px solid ${borderColor}`,
                backgroundColor: "#e05050",
                fontSize: "10px",
                fontWeight: 700,
                lineHeight: 1,
                color: "#fff",
              }}
            >
              x
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 relative" style={{ backgroundColor: bodyBg }}>
        {isGlass && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, var(--arm-glass-sheen) 0%, rgba(255,255,255,0.02) 40%, transparent 70%)",
            }}
          />
        )}
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}
