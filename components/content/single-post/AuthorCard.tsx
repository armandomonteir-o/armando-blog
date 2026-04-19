import { RetroWindow } from "@/components/ui/RetroWindow";
import { WavyText } from "@/components/ui/WavyText";
import { AppImage } from "@/components/ui/AppImage";

interface Author {
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

interface AuthorCardProps {
  author: Author;
}

export function AuthorCard({ author }: AuthorCardProps) {
  return (
    <RetroWindow title="AUTHOR.EXE" variant="dark">
      <div className="p-5 flex gap-4">
        <div
          className="w-20 h-20 flex-shrink-0 overflow-hidden relative"
          style={{ border: "3px solid #80b0ff" }}
        >
          <AppImage
            src={author.avatar}
            alt={author.name}
            fill
            sizes="80px"
            className="object-cover"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)",
            }}
          />
        </div>
        <div className="flex-1">
          <WavyText
            text={author.name.toUpperCase()}
            variant="linear-wave"
            fontSize={20}
            amplitude={3}
            frequency={0.2}
            color="#fff"
          />
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "10px",
              color: "#4ade80",
              marginTop: "2px",
            }}
          >
            {author.role}
          </div>
          <p
            className="mt-2"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "13px",
              lineHeight: 1.6,
              color: "#c8e0ff",
            }}
          >
            {author.bio}
          </p>
        </div>
      </div>
    </RetroWindow>
  );
}
