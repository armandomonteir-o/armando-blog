import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono, Rubik_Glitch, Bungee_Shade } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
  preload: false,
});

// Display fonts — preload: false so they don't block initial render
const rubikGlitch = Rubik_Glitch({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-rubik-glitch",
  display: "swap",
  preload: false,
});

const bungeeShade = Bungee_Shade({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bungee-shade",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Armando — art & digital technology",
  description: "Personal blog by Armando Monteiro on art and digital technology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${spaceGrotesk.variable} ${spaceMono.variable} ${rubikGlitch.variable} ${bungeeShade.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
