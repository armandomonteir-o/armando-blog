// The window chrome the site's cards already wear (title bar with a file name, two little squares),
// for the blocks of a post that are "things": an image, a snippet, an embed.
export function WindowFrame({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        backgroundColor: "var(--arm-panel-bg)",
        border: "3px solid var(--arm-panel-border)",
        boxShadow: "4px 4px 0 var(--arm-panel-bg-deep)",
      }}
    >
      <div
        className="flex items-center justify-between px-3 py-1.5"
        style={{
          backgroundColor: "var(--arm-panel-border)",
          borderBottom: "2px solid var(--arm-panel-bg-deep)",
        }}
      >
        <span
          className="font-mono font-bold text-chrome-blue-text-on-dark truncate"
          style={{ fontSize: "9px" }}
        >
          {label}
        </span>
        <div className="flex gap-1 flex-shrink-0" aria-hidden="true">
          <div
            className="w-2.5 h-2.5 bg-chrome-blue"
            style={{ border: "1.5px solid var(--arm-panel-bg-deep)" }}
          />
          <div
            className="w-2.5 h-2.5 bg-chrome-red"
            style={{ border: "1.5px solid var(--arm-panel-bg-deep)" }}
          />
        </div>
      </div>
      {children}
    </div>
  );
}
