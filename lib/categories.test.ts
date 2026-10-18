import { describe, expect, it } from "vitest";
import type { WPCategoryWithChildren } from "@/lib/graphql/types";
import {
  DEFAULT_CATEGORY_STYLE,
  buildCategoryView,
  findCategory,
  findSubcategory,
} from "./categories";

const wp = (over: Partial<WPCategoryWithChildren> = {}): WPCategoryWithChildren => ({
  slug: "games",
  name: "Games",
  description: null,
  count: null,
  children: {
    nodes: [
      { slug: "stardew-valley", name: "Stardew Valley", description: null, count: 2 },
      { slug: "habbo", name: "Habbo", description: "Salas e nostalgia", count: 1 },
    ],
  },
  ...over,
});

describe("buildCategoryView", () => {
  it("gives a category the WordPress doesn't style the default look, not a crash", () => {
    const view = buildCategoryView(wp());
    expect(view.accentColor).toBe(DEFAULT_CATEGORY_STYLE.accentColor);
    expect(view.heroImage).toBe(DEFAULT_CATEGORY_STYLE.heroImage);
    expect(view.subcategories.map((s) => s.slug)).toEqual(["stardew-valley", "habbo"]);
  });

  it("uses the designed look when the code has one for that slug", () => {
    const view = buildCategoryView(wp({ slug: "estudos", name: "Estudos" }));
    expect(view.accentColor).not.toBe(DEFAULT_CATEGORY_STYLE.accentColor);
  });

  it("counts the posts of the children, because WordPress counts only direct posts", () => {
    // The parent's own count comes back null from WPGraphQL when it has no direct posts.
    expect(buildCategoryView(wp()).postCount).toBe(3);
    expect(buildCategoryView(wp({ count: 4 })).postCount).toBe(7);
  });

  it("reads a missing count as zero, never NaN", () => {
    const view = buildCategoryView(
      wp({ children: { nodes: [{ slug: "a", name: "A", description: null, count: null }] } })
    );
    expect(view.postCount).toBe(0);
    expect(view.subcategories[0].postCount).toBe(0);
  });

  it("prefers the WordPress description, then the designed one, then an empty string", () => {
    const view = buildCategoryView(wp());
    expect(view.subcategories[1].description).toBe("Salas e nostalgia");
    expect(view.subcategories[0].description).toBe("");
    expect(view.description).toBe("");
  });

  it("styles a subcategory by its parent and its own slug", () => {
    const view = buildCategoryView(
      wp({
        slug: "estudos",
        name: "Estudos",
        children: {
          nodes: [{ slug: "pixel-art", name: "Pixel Art", description: null, count: 2 }],
        },
      })
    );
    expect(view.subcategories[0].tags.length).toBeGreaterThan(0);
  });

  it("gives a subcategory without a designed look no tags", () => {
    expect(buildCategoryView(wp()).subcategories[0].tags).toEqual([]);
  });
});

describe("findCategory and findSubcategory", () => {
  const tree = [wp(), wp({ slug: "estudos", name: "Estudos", children: { nodes: [] } })];

  it("finds a category WordPress has", () => {
    expect(findCategory(tree, "games")?.name).toBe("Games");
  });

  it("returns undefined for a slug that neither WordPress nor the design knows", () => {
    expect(findCategory(tree, "nao-existe")).toBeUndefined();
  });

  // The menu links to Músicas, Filmes and Livros (#73): those are designed but not in WordPress
  // yet, and must open as an honest empty page, not a 404.
  it("knows a designed category WordPress doesn't have yet, empty", () => {
    const found = findCategory(tree, "musicas");
    expect(found?.name).toBe("Músicas");
    expect(buildCategoryView(found!).subcategories).toEqual([]);
    expect(buildCategoryView(found!).postCount).toBe(0);
  });

  it("finds a subcategory under its own parent", () => {
    expect(findSubcategory(tree, "games", "habbo")?.subcategory.name).toBe("Habbo");
  });

  it("does not find a subcategory under another parent, or under a parent that doesn't exist", () => {
    expect(findSubcategory(tree, "estudos", "habbo")).toBeUndefined();
    expect(findSubcategory(tree, "nada", "habbo")).toBeUndefined();
  });

  it("knows a designed subcategory WordPress doesn't have yet, with no posts", () => {
    const found = findSubcategory(tree, "musicas", "punk");
    expect(found?.subcategory.name).toBe("Punk");
    expect(found?.subcategory.postCount).toBe(0);
  });
});
