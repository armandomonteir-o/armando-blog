import { describe, expect, it, vi } from "vitest";

// #73: /categoria/... used to read data/categories.ts and invent posts. It now comes from
// WordPress: a category or subcategory WordPress doesn't have is a 404, one it has but with no
// posts is an honest empty state, and a failure reaches error.tsx instead of becoming mock data.
type Tree = {
  slug: string;
  name: string;
  description: string | null;
  count: number | null;
  children: {
    nodes: { slug: string; name: string; description: string | null; count: number | null }[];
  };
}[];
let tree: () => Promise<Tree> = async () => [];
let postsImpl: () => Promise<unknown> = async () => ({ nodes: [] });
vi.mock("@/lib/graphql", () => ({
  getCategories: () => tree(),
  getCategoryPosts: () => postsImpl(),
}));

const games = {
  slug: "games",
  name: "Games",
  description: null,
  count: null,
  children: {
    nodes: [{ slug: "habbo", name: "Habbo", description: null, count: 0 }],
  },
};

const { default: CategoryPage, generateStaticParams: categoryParams } =
  await import("./[category]/page");
const { default: SubcategoryPage, generateStaticParams: subcategoryParams } =
  await import("./[category]/[subcategory]/page");
const is404 = { digest: expect.stringContaining("404") };
const cat = (category: string) => ({ params: Promise.resolve({ category }) });
const sub = (category: string, subcategory: string) => ({
  params: Promise.resolve({ category, subcategory }),
});

describe("category page", () => {
  it("is a 404 for a slug that neither WordPress nor the design knows", async () => {
    tree = async () => [games];
    await expect(CategoryPage(cat("nao-existe"))).rejects.toMatchObject(is404);
  });

  it("opens a designed category WordPress doesn't have yet as an empty page, not a 404", async () => {
    // The menu links to /categoria/musicas (#73).
    tree = async () => [games];
    const element = await CategoryPage(cat("musicas"));
    expect(element.props.category.subcategories).toEqual([]);
  });

  it("renders a category WordPress has", async () => {
    tree = async () => [games];
    const element = await CategoryPage(cat("games"));
    expect(element.props.category.name).toBe("Games");
    expect(element.props.category.subcategories.map((s: { slug: string }) => s.slug)).toEqual([
      "habbo",
    ]);
  });

  it("propagates the error when WordPress fails", async () => {
    tree = async () => {
      throw new Error("ENOTFOUND");
    };
    await expect(CategoryPage(cat("games"))).rejects.toThrow("ENOTFOUND");
  });

  it("prerenders the categories WordPress has", async () => {
    tree = async () => [games];
    expect(await categoryParams()).toEqual([{ category: "games" }]);
  });
});

describe("subcategory page", () => {
  it("is a 404 for a subcategory that is not under that category", async () => {
    tree = async () => [games];
    await expect(SubcategoryPage(sub("games", "nao-existe"))).rejects.toMatchObject(is404);
    await expect(SubcategoryPage(sub("outra", "habbo"))).rejects.toMatchObject(is404);
  });

  it("passes the real posts and does not invent any when there are none", async () => {
    tree = async () => [games];
    postsImpl = async () => ({ nodes: [] });
    const element = await SubcategoryPage(sub("games", "habbo"));
    expect(element.props.posts).toEqual([]);
  });

  it("propagates the error when the posts query fails", async () => {
    tree = async () => [games];
    postsImpl = async () => {
      throw new Error("ETIMEDOUT");
    };
    await expect(SubcategoryPage(sub("games", "habbo"))).rejects.toThrow("ETIMEDOUT");
  });

  it("prerenders every subcategory of every category", async () => {
    tree = async () => [games];
    expect(await subcategoryParams()).toEqual([{ category: "games", subcategory: "habbo" }]);
  });
});
