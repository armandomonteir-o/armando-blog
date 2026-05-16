import type { Metadata } from "next";
import PlaylistsClient from "./PlaylistsClient";

export const metadata: Metadata = {
  title: "Playlists — Armando",
  description:
    "Playlists curadas para ouvir enquanto você navega pelo blog. Arte sonora, eletrônica e trilhas para criar.",
};

export default function PlaylistsPage() {
  return <PlaylistsClient />;
}
