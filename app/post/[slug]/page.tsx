import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AeroElements } from "@/components/ui/AeroElements";
import { RetroWindow } from "@/components/ui/RetroWindow";
import { WavyText } from "@/components/ui/WavyText";
import { ContactCTA } from "@/components/content/ContactCTA";
import { NewsletterWidget } from "@/components/layout/newsletter/NewsletterWidget";
import { categoryColors } from "@/constants/posts";
import {
  ReadingProgress,
  TableOfContents,
  PostHero,
  AuthorCard,
  RelatedPosts,
  PostCommentsSection,
} from "@/components/content/single-post";
import { getPost, getPosts } from "@/lib/graphql";
import { adaptWPPost, adaptWPPostDetail, stripHtml } from "@/lib/graphql/adapters";

const RELATED_COUNT = 3;

// Other published posts from the same category. This is secondary content: if only this query
// fails, the post itself still renders, without the section.
async function getRelatedPosts(categorySlug: string | undefined, currentSlug: string) {
  if (!categorySlug) return [];
  try {
    const { nodes } = await getPosts(RELATED_COUNT + 1, undefined, categorySlug);
    return nodes
      .filter((p) => p.slug !== currentSlug)
      .slice(0, RELATED_COUNT)
      .map(adaptWPPost);
  } catch (e) {
    console.error("[PostPage] related posts failed:", e);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  // No catch on purpose: null means WordPress answered "no such post"; a failure must propagate.
  const wpPost = await getPost(slug);
  if (!wpPost) return { title: "Post não encontrado — Armando" };
  return {
    title: `${wpPost.title} — Armando`,
    description: wpPost.acfPostFields?.subtitle ?? stripHtml(wpPost.excerpt),
    openGraph: {
      title: wpPost.title,
      description: wpPost.acfPostFields?.subtitle ?? stripHtml(wpPost.excerpt),
      images: wpPost.acfPostFields?.heroImage?.node.sourceUrl
        ? [wpPost.acfPostFields.heroImage.node.sourceUrl]
        : wpPost.featuredImage?.node.sourceUrl
          ? [wpPost.featuredImage.node.sourceUrl]
          : [],
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // No catch on purpose: null means WordPress answered "no such post" (404). If WordPress fails,
  // the error reaches error.tsx. Never fall back to the mock posts.
  const wpPost = await getPost(slug);
  if (!wpPost) notFound();

  const wpComments = wpPost.comments?.nodes ?? [];
  const postId = wpPost.databaseId;
  const currentPost = adaptWPPostDetail(wpPost);
  const related = await getRelatedPosts(wpPost.categories.nodes[0]?.slug, slug);

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
                      <div className="flex-1 bg-chrome-blue-accent" style={{ height: "2px" }} />
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
                            <div key={d} className="w-1.5 h-1.5 bg-chrome-blue-soft" />
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

            {related.length > 0 && (
              <div className="mt-5">
                <RelatedPosts posts={related} categoryColors={categoryColors} />
              </div>
            )}

            <div className="mt-5">
              <PostCommentsSection postId={postId} initialComments={wpComments} />
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
