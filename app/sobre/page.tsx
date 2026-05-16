import type { Metadata } from "next";
import SobreClient from "./SobreClient";

export const metadata: Metadata = {
  title: "Sobre — Armando",
  description:
    "Armando Monteiro — desenvolvedor, artista digital e entusiasta de cultura retro-digital. Conheça o blog e o autor.",
};

export default function SobrePage() {
  return <SobreClient />;
}
