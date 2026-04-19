"use client";

import { useId } from "react";

interface WavyTextProps {
  text: string;
  className?: string;
  amplitude?: number;
  frequency?: number;
  fontSize?: number | string;
  color?: string;
  strokeColor?: string;
  variant?: "wavy" | "stacked" | "linear-wave";
}

export function WavyText({
  text,
  className = "",
  amplitude = 8,
  frequency = 0.15,
  fontSize = 32,
  color = "#000",
  strokeColor,
  variant = "wavy",
}: WavyTextProps) {
  const rawId = useId();
  const id = `wavytext-${rawId.replace(/:/g, "")}`;

  if (variant === "stacked") {
    const cssSize = typeof fontSize === "number" ? `${fontSize}px` : fontSize;
    return (
      <div
        className={`relative overflow-hidden ${className}`}
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              fontSize: cssSize,
              lineHeight: 0.85,
              color: i === 0 ? color : "transparent",
              WebkitTextStroke: i > 0 ? `1.5px ${color}` : "none",
              opacity: i === 0 ? 1 : 0.3 + i * 0.15,
              letterSpacing: "-0.02em",
            }}
          >
            {text}
          </div>
        ))}
      </div>
    );
  }

  const fontSizeNum = typeof fontSize === "number" ? fontSize : 32;

  if (variant === "linear-wave") {
    const textWidth = text.length * fontSizeNum * 0.6;
    const svgWidth = Math.max(textWidth + 40, 200);
    const svgHeight = fontSizeNum + amplitude * 2 + 10;
    const midY = svgHeight / 2;

    let pathD = `M 10 ${midY}`;
    for (let x = 10; x <= svgWidth - 10; x += 1) {
      const y = midY + Math.sin((x - 10) * frequency * 0.3) * (amplitude * 0.5);
      pathD += ` L ${x} ${y}`;
    }

    return (
      <svg
        width="100%"
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className={className}
        preserveAspectRatio="xMidYMid meet"
        suppressHydrationWarning
      >
        <defs>
          <path id={id} d={pathD} suppressHydrationWarning />
        </defs>
        <text
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: `${fontSizeNum}px`,
            fontWeight: 700,
            fill: color,
            letterSpacing: "-0.02em",
          }}
        >
          <textPath href={`#${id}`} startOffset="0%" suppressHydrationWarning>
            {text}
          </textPath>
        </text>
      </svg>
    );
  }

  // Default wavy variant
  const textWidth = text.length * fontSizeNum * 0.65;
  const svgWidth = Math.max(textWidth + 40, 200);
  const svgHeight = fontSizeNum * 1.4 + amplitude * 2 + 20;
  const midY = svgHeight / 2;

  let pathD = `M 10 ${midY}`;
  for (let x = 10; x <= svgWidth - 10; x += 1) {
    const y = midY + Math.sin((x - 10) * frequency * 0.25) * amplitude;
    pathD += ` L ${x} ${y}`;
  }

  return (
    <svg
      width="100%"
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className={className}
      preserveAspectRatio="xMidYMid meet"
      suppressHydrationWarning
    >
      <defs>
        <path id={id} d={pathD} suppressHydrationWarning />
      </defs>
      {strokeColor && (
        <text
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: `${fontSizeNum}px`,
            fontWeight: 700,
            fill: "none",
            stroke: strokeColor,
            strokeWidth: 2,
          }}
        >
          <textPath href={`#${id}`} startOffset="0%">
            {text}
          </textPath>
        </text>
      )}
      <text
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: `${fontSizeNum}px`,
          fontWeight: 700,
          fill: color,
          letterSpacing: "-0.01em",
        }}
      >
        <textPath href={`#${id}`} startOffset="0%">
          {text}
        </textPath>
      </text>
    </svg>
  );
}
