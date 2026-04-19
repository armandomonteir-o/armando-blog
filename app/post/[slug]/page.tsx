import type { Metadata } from "next";

// TODO issue #13: replace with generateMetadata() from WPGraphQL
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return {
    title: `Post — Armando`,
    description: "Leia este post no blog Armando.",
  };
}

// TODO issue #23: extract PostPage sub-components (ReadingProgress, TableOfContents, AuthorCard,
// PostCommentsSection) to components/content/ and implement full single-post page.
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <div
      className="flex-1 flex items-center justify-center p-6"
      style={{ backgroundColor: "var(--arm-bg)", transition: "background-color 0.3s ease" }}
    >
      <div
        className="text-center p-8"
        style={{
          border: "3px solid var(--arm-border)",
          boxShadow: "4px 4px 0 var(--arm-shadow)",
          backgroundColor: "var(--arm-bg-glass)",
          backdropFilter: "blur(12px)",
          maxWidth: 480,
        }}
      >
        <div
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "10px",
            color: "var(--arm-blue)",
            marginBottom: "8px",
            letterSpacing: "0.1em",
          }}
        >
          {">"} POST/{slug}_
        </div>
        <p
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: "16px",
            color: "var(--arm-text)",
            lineHeight: 1.4,
          }}
        >
          Full post page coming in issue #23.
        </p>
        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "10px",
            color: "var(--arm-text-secondary)",
            marginTop: "8px",
          }}
        >
          slug: {slug}
        </p>
      </div>
    </div>
  );
}
