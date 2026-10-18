import { describe, expect, it } from "vitest";
import { categoryColor, categoryColors } from "./posts";

describe("categoryColor (#70)", () => {
  it("returns the defined color for a known category", () => {
    expect(categoryColor("Filosofia")).toBe(categoryColors.Filosofia);
  });

  it("falls back to a real color for a WordPress category the site has none for", () => {
    expect(categoryColor("Cultura")).toMatch(/^#[0-9a-f]{6}$/i);
  });
});

// The accents the design system already has (styles/theme.css): no new hex.
const DESIGN_SYSTEM_ACCENTS = ["#34d399", "#e05050", "#c084fc", "#f59e0b", "#80b0ff", "#a0c4ff"];
const WORDPRESS_CATEGORIES = ["Arte", "Blog", "Cultura", "Design", "Filosofia", "Tecnologia"];

describe("category colors for the categories WordPress has (#70)", () => {
  it("defines a color for each of them, not the generic fallback", () => {
    for (const name of WORDPRESS_CATEGORIES) expect(categoryColors[name]).toBeDefined();
  });

  it("takes every color from the design system accents", () => {
    for (const name of WORDPRESS_CATEGORIES) {
      expect(DESIGN_SYSTEM_ACCENTS).toContain(categoryColors[name]);
    }
  });

  it("gives the five content categories five different colors", () => {
    const five = WORDPRESS_CATEGORIES.filter((c) => c !== "Blog").map((c) => categoryColors[c]);
    expect(new Set(five).size).toBe(5);
  });
});
