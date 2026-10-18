import { categories as designed, type Category, type Subcategory } from "@/data/categories";
import { FALLBACK_IMAGE } from "@/lib/graphql/adapters";
import type { WPCategoryWithChildren, WPSubcategory } from "@/lib/graphql/types";

// What the category pages render: the shape of data/categories.ts plus the post counts that only
// WordPress knows. The visual part is optional (#73): WordPress decides which categories exist,
// the code decides how the ones it knows look, and the rest get the default look below.
export interface SubcategoryView extends Subcategory {
  postCount: number;
}

export interface CategoryView extends Omit<Category, "subcategories"> {
  postCount: number;
  subcategories: SubcategoryView[];
}

// Same colors as the `livros` category and the image posts already fall back to, so the default
// adds no new hex and no new image.
export const DEFAULT_CATEGORY_STYLE = {
  heroImage: FALLBACK_IMAGE,
  accentColor: "#80b0ff",
  gradientFrom: "rgba(128,176,255,0.3)",
  gradientTo: "rgba(2,42,110,0.9)",
  icon: "Hash",
} as const;

function designedCategory(slug: string): Category | undefined {
  return designed.find((c) => c.slug === slug);
}

function designedSubcategory(categorySlug: string, slug: string): Subcategory | undefined {
  return designedCategory(categorySlug)?.subcategories.find((s) => s.slug === slug);
}

export function buildCategoryView(wp: WPCategoryWithChildren): CategoryView {
  const look = designedCategory(wp.slug);
  const subcategories = wp.children.nodes.map((child): SubcategoryView => {
    const subLook = designedSubcategory(wp.slug, child.slug);
    return {
      slug: child.slug,
      name: child.name,
      description: child.description || subLook?.description || "",
      heroImage: subLook?.heroImage ?? look?.heroImage ?? DEFAULT_CATEGORY_STYLE.heroImage,
      tags: subLook?.tags ?? [],
      postCount: child.count ?? 0,
    };
  });
  return {
    slug: wp.slug,
    name: wp.name,
    description: wp.description || look?.description || "",
    heroImage: look?.heroImage ?? DEFAULT_CATEGORY_STYLE.heroImage,
    accentColor: look?.accentColor ?? DEFAULT_CATEGORY_STYLE.accentColor,
    gradientFrom: look?.gradientFrom ?? DEFAULT_CATEGORY_STYLE.gradientFrom,
    gradientTo: look?.gradientTo ?? DEFAULT_CATEGORY_STYLE.gradientTo,
    icon: look?.icon ?? DEFAULT_CATEGORY_STYLE.icon,
    // WordPress counts only direct posts, and returns null for a parent with none of its own.
    postCount: (wp.count ?? 0) + subcategories.reduce((sum, s) => sum + s.postCount, 0),
    subcategories,
  };
}

// A category is "known" when WordPress has it or when the design drew it. The menu links to
// categories that are only drawn so far (Músicas, Filmes, Livros): they open as an honest empty
// page, not a 404. A slug that neither knows is undefined, and the page answers 404.
export function findCategory(
  tree: WPCategoryWithChildren[],
  slug: string
): WPCategoryWithChildren | undefined {
  const fromWordPress = tree.find((c) => c.slug === slug);
  if (fromWordPress) return fromWordPress;
  const drawn = designedCategory(slug);
  if (!drawn) return undefined;
  return {
    slug: drawn.slug,
    name: drawn.name,
    description: drawn.description,
    count: 0,
    children: { nodes: [] },
  };
}

export function findSubcategory(
  tree: WPCategoryWithChildren[],
  categorySlug: string,
  subcategorySlug: string
): { category: CategoryView; subcategory: SubcategoryView } | undefined {
  const wp = findCategory(tree, categorySlug);
  if (!wp) return undefined;
  const inWordPress = wp.children.nodes.find((s) => s.slug === subcategorySlug);
  const drawn = designedSubcategory(categorySlug, subcategorySlug);
  const child: WPSubcategory | undefined =
    inWordPress ??
    (drawn && { slug: drawn.slug, name: drawn.name, description: drawn.description, count: 0 });
  if (!child) return undefined;
  const withChild = inWordPress
    ? wp
    : { ...wp, children: { nodes: [...wp.children.nodes, child] } };
  const category = buildCategoryView(withChild);
  const subcategory = category.subcategories.find((s) => s.slug === subcategorySlug);
  return subcategory ? { category, subcategory } : undefined;
}
