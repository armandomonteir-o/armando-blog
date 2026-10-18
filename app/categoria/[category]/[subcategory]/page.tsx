import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SubcategoryClient from "./SubcategoryClient";
import { getCategories, getCategoryPosts } from "@/lib/graphql";
import { adaptWPPost } from "@/lib/graphql/adapters";
import { findSubcategory } from "@/lib/categories";

// See the note in ../page.tsx: a literal number, kept in sync by cache-config.test.ts.
export const revalidate = 3600;

export async function generateStaticParams() {
  const tree = await getCategories();
  return tree.flatMap((c) =>
    c.children.nodes.map((s) => ({ category: c.slug, subcategory: s.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; subcategory: string }>;
}): Promise<Metadata> {
  const { category, subcategory } = await params;
  const found = findSubcategory(await getCategories(), category, subcategory);
  if (!found) return { title: "Categoria não encontrada — Armando" };
  return {
    title: `${found.subcategory.name} — ${found.category.name} — Armando`,
    description: `Posts sobre ${found.subcategory.name} em ${found.category.name} no blog Armando.`,
  };
}

// WordPress allows at most 100 per request; at the blog's volume one request and client-side
// pagination are enough, like /posts. A failure reaches error.tsx, it never becomes mock posts.
export default async function SubcategoryPage({
  params,
}: {
  params: Promise<{ category: string; subcategory: string }>;
}) {
  const { category, subcategory } = await params;
  const found = findSubcategory(await getCategories(), category, subcategory);
  if (!found) notFound();
  const { nodes } = await getCategoryPosts(subcategory, 100);
  return (
    <SubcategoryClient
      category={found.category}
      subcategory={found.subcategory}
      posts={nodes.map(adaptWPPost)}
    />
  );
}
