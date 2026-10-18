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
