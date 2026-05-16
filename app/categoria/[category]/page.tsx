import type { Metadata } from "next";
import CategoryClient from "./CategoryClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const name = category.charAt(0).toUpperCase() + category.slice(1);
  return {
    title: `${name} — Armando`,
    description: `Posts sobre ${name} no blog Armando — arte, tecnologia e cultura digital.`,
  };
}

export default function CategoryPage() {
  return <CategoryClient />;
}
