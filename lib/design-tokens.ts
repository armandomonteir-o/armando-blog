import type { CSSProperties } from "react";

// Font family strings — use these in style={{ fontFamily }} for dynamic cases.
// For static elements, prefer the Tailwind classes: font-mono, font-grotesk, font-glitch, font-bungee
export const FONT_MONO = "'Space Mono', monospace";
export const FONT_GROTESK = "'Space Grotesk', sans-serif";
export const FONT_GLITCH = "'Rubik Glitch', sans-serif";
export const FONT_BUNGEE = "'Bungee Shade', sans-serif";

// Scanline overlay applied to card images throughout the blog.
// Use as: <div className="absolute inset-0 pointer-events-none" style={scanlineStyle} />
export const scanlineStyle: CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)",
};
