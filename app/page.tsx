import { WavyText } from "@/components/ui/WavyText";
import { AeroElements } from "@/components/ui/AeroElements";
import { WarningDialog } from "@/components/ui/WarningDialog";
import { FeaturedPost } from "@/components/content/FeaturedPost";
import { SideContent } from "@/components/content/SideContent";
import { PostsGrid } from "@/components/content/PostsGrid";
import { CommentsSection } from "@/components/content/CommentsSection";
import { NowPlaying } from "@/components/content/NowPlaying";
import { NewsletterWidget } from "@/components/layout/newsletter";
import { getPosts, getRecentComments } from "@/lib/graphql";
import {
  adaptHomeComment,
  adaptWPPost,
  pickFeaturedPost,
  type HomeComment,
} from "@/lib/graphql/adapters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Armando — Arte & Tecnologia Digital",
  description: "Blog pessoal sobre arte, tecnologia e filosofia digital.",
};

export default async function HomePage() {
  // No try/catch on purpose: a WordPress failure must reach error.tsx (or fail the build),
  // never fall back to the mock posts. An empty list means WordPress answered with no posts.
  const { nodes } = await getPosts(12);
  const realPosts = nodes.map(adaptWPPost);
  const featured = pickFeaturedPost(nodes);
  const comments = (await getRecentComments(6))
    .map(adaptHomeComment)
    .filter((c): c is HomeComment => c !== null);

  return (
    <div
      className="flex-1 p-6 relative overflow-hidden"
      style={{ backgroundColor: "var(--arm-bg)", transition: "background-color 0.3s ease" }}
    >
      {/* Subtle pixel grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--arm-grid) 1px, transparent 1px), linear-gradient(90deg, var(--arm-grid) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />

      <AeroElements />

      <div className="relative z-10">
        {/* Title with warning dialog */}
        <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
          <div className="flex-1 min-w-0">
            <div
              className="font-mono"
              style={{
                fontSize: "10px",
                color: "var(--arm-blue)",
                marginBottom: "4px",
                letterSpacing: "0.1em",
              }}
            >
              {">"} DIGITAL PARADISE AT_
            </div>
            <WavyText
              text="DESTAQUES DO MES"
              variant="stacked"
              fontSize="clamp(20px, 3.5vw, 40px)"
              color="var(--arm-text)"
            />
          </div>

          <WarningDialog />
        </div>

        {/* Main grid: Featured + Side */}
        <div className="flex flex-col xl:flex-row gap-5 mb-5">
          <div className="flex-1 min-w-0">
            <FeaturedPost post={featured ? adaptWPPost(featured) : null} />
          </div>
          <div className="xl:w-[280px] xl:flex-shrink-0 w-full">
            <SideContent />
          </div>
        </div>

        {/* Now Playing Widget */}
        <div className="mb-5">
          <NowPlaying />
        </div>

        {/* Latest Posts Grid */}
        <div className="mb-5">
          <PostsGrid posts={realPosts} />
        </div>

        {/* Comments */}
        {comments.length > 0 && <CommentsSection comments={comments} />}

        {/* Newsletter Widget */}
        <div className="mt-5">
          <NewsletterWidget />
        </div>
      </div>
    </div>
  );
}
