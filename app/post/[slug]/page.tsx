import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AeroElements } from "@/components/ui/AeroElements";
import { RetroWindow } from "@/components/ui/RetroWindow";
import { WavyText } from "@/components/ui/WavyText";
import { ContactCTA } from "@/components/content/ContactCTA";
import { NewsletterWidget } from "@/components/layout/newsletter/NewsletterWidget";
import { posts, categoryColors } from "@/constants/posts";
import {
  ReadingProgress,
  TableOfContents,
  PostHero,
  AuthorCard,
  RelatedPosts,
  PostCommentsSection,
} from "@/components/content/single-post";
import { postData, relatedPosts, postComments } from "./_data";
import { getPost } from "@/lib/graphql";
import { adaptWPPostDetail } from "@/lib/graphql/adapters";

// TODO issue #13: replace with generateMetadata() from WPGraphQL
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const matched = posts.find((p) => p.slug === slug);
  return {
    title: matched ? `${matched.title} — Armando` : "Post — Armando",
    description: matched?.excerpt ?? "Leia este post no blog Armando.",
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Try WordPress first
  const wpPost = await getPost(slug).catch((e) => { console.error("[PostPage] WP fetch failed:", e); return null; });

  let currentPost: typeof postData;

  if (wpPost) {
    currentPost = { ...postData, ...adaptWPPostDetail(wpPost) };
  } else {
    // Fallback to mock data
    const matchedPost = posts.find((p) => p.slug === slug);
    if (!matchedPost) notFound();
    currentPost = {
      ...postData,
      title: matchedPost.title,
      category: matchedPost.category,
      date: matchedPost.date,
      heroImage: matchedPost.image,
      reads: matchedPost.reads,
      comments: matchedPost.comments,
      subtitle: matchedPost.excerpt,
    };
  }

  return (
    <div
      className="flex-1 relative"
      style={{ backgroundColor: "var(--arm-bg)", transition: "background-color 0.3s ease" }}
    >
      <ReadingProgress />

      <PostHero
        title={currentPost.title}
        subtitle={currentPost.subtitle}
        category={currentPost.category}
        date={currentPost.date}
        readTime={currentPost.readTime}
        reads={currentPost.reads}
        likes={currentPost.likes}
        comments={currentPost.comments}
        heroImage={currentPost.heroImage}
        categoryColors={categoryColors}
      />

      {/* Post body */}
      <div
        className="relative"
        style={{ backgroundColor: "var(--arm-bg)", transition: "background-color 0.3s ease" }}
      >
        {/* Pixel grid background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(var(--arm-grid) 1px, transparent 1px), linear-gradient(90deg, var(--arm-grid) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />

        {/* AeroElements wrapped so it can't cause horizontal overflow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <AeroElements />
        </div>

        <div className="relative z-10 flex flex-col xl:flex-row gap-6 p-4 sm:p-6 max-w-[1200px] mx-auto">
          {/* Table of contents sidebar — hidden on mobile */}
          <div className="hidden xl:block xl:w-[220px] xl:flex-shrink-0">
            <TableOfContents
              sections={currentPost.sections}
              readTime={currentPost.readTime}
              reads={currentPost.reads}
            />
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Article content */}
            <RetroWindow title="MANIFEST-CONTENT.MD" variant="dark">
              <div className="p-6">
                {currentPost.sections.map((section, idx) => (
                  <div key={section.id} id={section.id} className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className="font-mono font-bold text-chrome-green"
                        style={{ fontSize: "11px", minWidth: "28px" }}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div
                        className="flex-1 bg-chrome-blue-accent"
                        style={{ height: "2px" }}
                      />
                    </div>
                    <WavyText
                      text={section.title.toUpperCase()}
                      variant="linear-wave"
                      fontSize={22}
                      amplitude={4}
                      frequency={0.2}
                      color="#fff"
                    />
                    <div className="mt-4">
                      {section.content.split("\n\n").map((paragraph, pIdx) => (
                        <p
                          key={pIdx}
                          className="mb-4 font-grotesk text-chrome-blue-content"
                          style={{
                            fontSize: "15px",
                            lineHeight: 1.85,
                            letterSpacing: "0.01em",
                          }}
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    {idx < currentPost.sections.length - 1 && (
                      <div className="flex items-center gap-2 mt-6 opacity-30">
                        <div className="flex-1 bg-chrome-blue-accent" style={{ height: "1px" }} />
                        <div className="flex gap-1">
                          {[0, 1, 2].map((d) => (
                            <div
                              key={d}
                              className="w-1.5 h-1.5 bg-chrome-blue-soft"
                            />
                          ))}
                        </div>
                        <div className="flex-1 bg-chrome-blue-accent" style={{ height: "1px" }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </RetroWindow>

            <div className="mt-5">
              <AuthorCard author={currentPost.author} />
            </div>

            <div className="mt-5">
              <RelatedPosts posts={relatedPosts} categoryColors={categoryColors} />
            </div>

            <div className="mt-5">
              <PostCommentsSection comments={postComments} />
            </div>

            <div className="mt-5">
              <ContactCTA />
            </div>

            <div className="mt-5">
              <NewsletterWidget />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
