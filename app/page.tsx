import { WavyText } from "@/components/ui/WavyText";
import { AeroElements } from "@/components/ui/AeroElements";
import { WarningDialog } from "@/components/ui/WarningDialog";
import { FeaturedPost } from "@/components/content/FeaturedPost";
import { SideContent } from "@/components/content/SideContent";
import { PostsGrid } from "@/components/content/PostsGrid";
import { CommentsSection } from "@/components/content/CommentsSection";
import { NowPlaying } from "@/components/content/NowPlaying";
import { NewsletterWidget } from "@/components/layout/newsletter";
import type { Metadata } from "next";

// TODO issue #13: replace with generateMetadata() from WPGraphQL
export const metadata: Metadata = {
  title: "Armando — Arte & Tecnologia Digital",
  description: "Blog pessoal sobre arte, tecnologia e filosofia digital.",
};

export default function HomePage() {
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
              style={{
                fontFamily: "'Space Mono', monospace",
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
            <FeaturedPost />
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
          <PostsGrid />
        </div>

        {/* Comments */}
        <CommentsSection />

        {/* Newsletter Widget */}
        <div className="mt-5">
          <NewsletterWidget />
        </div>
      </div>
    </div>
  );
}
