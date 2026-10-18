import type { Metadata } from "next";
import PostsClient from "./PostsClient";
import { getPosts } from "@/lib/graphql";
import { adaptWPPost } from "@/lib/graphql/adapters";

export const metadata: Metadata = {
  title: "Todos os Posts — Armando",
  description:
    "Arquivo completo de publicações sobre arte, tecnologia, filosofia e cultura digital.",
};

// Time-based revalidation (#68): the page is rebuilt in the background at most once an hour.
// Must be a literal number in each file (Next reads it statically); cache-config.test.ts keeps
// the three in sync.
export const revalidate = 3600;

// WordPress allows at most 100 per request. At the blog's volume, one request and client-side
// pagination are enough; a failure propagates to error.tsx, it never falls back to the mock list.
export default async function PostsPage() {
  const { nodes } = await getPosts(100);
  return <PostsClient posts={nodes.map(adaptWPPost)} />;
}
