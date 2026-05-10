import Link from "next/link";
import { RetroWindow } from "@/components/ui/RetroWindow";
import { WavyText } from "@/components/ui/WavyText";
import { AppImage } from "@/components/ui/AppImage";

interface RelatedPost {
  id: number;
  title: string;
  category: string;
  image: string;
  excerpt: string;
  slug: string;
}

interface RelatedPostsProps {
  posts: RelatedPost[];
  categoryColors: Record<string, string>;
}

export function RelatedPosts({ posts, categoryColors }: RelatedPostsProps) {
  return (
    <RetroWindow title="RELATED-POSTS.EXE" variant="dark">
      <div className="p-5">
        <WavyText text="POSTS RELACIONADOS" variant="stacked" fontSize={22} color="#fff" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/post/${post.slug}`}
              className="flex flex-col group border-2 border-chrome-blue-accent bg-chrome-blue-mid"
              style={{ textDecoration: "none" }}
            >
              {/* Mini title bar */}
              <div
                className="flex items-center justify-between px-2 py-1 bg-chrome-blue-accent"
                style={{ borderBottom: "2px solid #0560e0" }}
              >
                <span
                  className="font-mono text-chrome-blue-body"
                  style={{ fontSize: "8px" }}
                >
                  RELATED-{String(post.id).padStart(2, "0")}.MD
                </span>
                <div
                  className="w-2 h-2 bg-chrome-red border border-chrome-blue-dark"
                />
              </div>

              {/* Image */}
              <div className="h-[100px] overflow-hidden relative">
                <AppImage
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
                  }}
                />
                <div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: "linear-gradient(to top, rgba(3,71,193,0.3), transparent 60%)",
                  }}
                />
                <div
                  className="absolute top-1.5 left-1.5 px-1.5 py-0.5 font-mono font-bold text-chrome-blue-dark"
                  style={{
                    backgroundColor: categoryColors[post.category] || "#0347c1",
                    border: "1.5px solid #022a6e",
                    fontSize: "7px",
                  }}
                >
                  {post.category.toUpperCase()}
                </div>
              </div>

              <div className="p-3">
                <h4
                  className="font-grotesk font-bold text-white"
                  style={{ fontSize: "12px", lineHeight: 1.3, marginBottom: "4px" }}
                >
                  {post.title}
                </h4>
                <p
                  className="font-mono text-chrome-blue-content"
                  style={{ fontSize: "9px", lineHeight: 1.5 }}
                >
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </RetroWindow>
  );
}
