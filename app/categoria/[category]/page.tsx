import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryClient from "./CategoryClient";
import { getCategories } from "@/lib/graphql";
import { buildCategoryView, findCategory } from "@/lib/categories";

// Time-based revalidation (#68): rebuilt in the background at most once an hour. Must be a
// literal number in each file (Next reads it statically); cache-config.test.ts keeps them in sync.
export const revalidate = 3600;

// The categories WordPress has at build time are prerendered. One created later is generated on
// its first visit (`dynamicParams` stays `true`). A slug WordPress doesn't know is a 404.
export async function generateStaticParams() {
  const tree = await getCategories();
  return tree.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const wp = findCategory(await getCategories(), category);
  if (!wp) return { title: "Categoria não encontrada — Armando" };
  return {
    title: `${wp.name} — Armando`,
    description: `Posts sobre ${wp.name} no blog Armando — arte, tecnologia e cultura digital.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const wp = findCategory(await getCategories(), category);
  if (!wp) notFound();
  return <CategoryClient category={buildCategoryView(wp)} />;
}
