import type { Metadata } from "next";
import SubcategoryClient from "./SubcategoryClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; subcategory: string }>;
}): Promise<Metadata> {
  const { category, subcategory } = await params;
  const catName = category.charAt(0).toUpperCase() + category.slice(1);
  const subName = subcategory.charAt(0).toUpperCase() + subcategory.slice(1);
  return {
    title: `${subName} — ${catName} — Armando`,
    description: `Posts sobre ${subName} em ${catName} no blog Armando.`,
  };
}

export default function SubcategoryPage() {
  return <SubcategoryClient />;
}
