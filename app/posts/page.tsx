import type { Metadata } from "next";
import PostsClient from "./PostsClient";

export const metadata: Metadata = {
  title: "Todos os Posts — Armando",
  description:
    "Arquivo completo de publicações sobre arte, tecnologia, filosofia e cultura digital.",
};

export default function PostsPage() {
  return <PostsClient />;
}
