import {
  embedLabel,
  imageSource,
  plainText,
  safeUrl,
  sanitizeFallback,
  type EditorBlock,
} from "@/lib/blocks";
import { AppImage } from "@/components/ui/AppImage";
import { RichText } from "./RichText";

// The paragraph style the post body already had. The other blocks reuse the same tokens.
const BODY_STYLE: React.CSSProperties = {
  fontSize: "15px",
  lineHeight: 1.85,
  letterSpacing: "0.01em",
};
const BODY_CLASS = "font-grotesk text-chrome-blue-content";
const CAPTION_CLASS = "font-mono text-chrome-blue-body";

function Children({ blocks }: { blocks: EditorBlock[] | null | undefined }) {
  return (
    <>
      {(blocks ?? []).map((child) => (
        <BlockRenderer key={child.clientId} block={child} />
      ))}
    </>
  );
}

function Heading({ block }: { block: EditorBlock }) {
  const level = Number(block.attributes?.level);
  const Tag = level >= 4 && level <= 6 ? (`h${level}` as "h4" | "h5" | "h6") : "h3";
  return (
    <RichText
      as={Tag}
      html={block.attributes?.content}
      className="font-grotesk font-bold mt-6 mb-3"
      style={{ fontSize: "18px", color: "#fff", lineHeight: 1.4 }}
    />
  );
}

function List({ block }: { block: EditorBlock }) {
  const Tag = block.attributes?.ordered ? "ol" : "ul";
  return (
    <Tag
      className={`mb-4 pl-6 ${BODY_CLASS} ${Tag === "ol" ? "list-decimal" : "list-disc"}`}
      style={BODY_STYLE}
      start={typeof block.attributes?.start === "number" ? block.attributes.start : undefined}
      reversed={block.attributes?.reversed === true ? true : undefined}
    >
      <Children blocks={block.innerBlocks} />
    </Tag>
  );
}

function ListItem({ block }: { block: EditorBlock }) {
  return (
    <li>
      <RichText html={block.attributes?.content} />
      <Children blocks={block.innerBlocks} />
    </li>
  );
}

function Quote({ block }: { block: EditorBlock }) {
  const citation = block.attributes?.citation;
  return (
    <blockquote
      className="mb-4 px-4 py-3"
      style={{
        borderLeft: "4px solid var(--chrome-green)",
        backgroundColor: "var(--arm-panel-bg)",
      }}
    >
      <Children blocks={block.innerBlocks} />
      {typeof citation === "string" && citation && (
        <RichText
          as="cite"
          html={citation}
          className={`block mt-1 not-italic ${CAPTION_CLASS}`}
          style={{ fontSize: "11px" }}
        />
      )}
    </blockquote>
  );
}

function Code({ block }: { block: EditorBlock }) {
  // The attribute is HTML-escaped text. It is decoded to plain text and given to React as a
  // child, which escapes it again: code is shown, never run.
  const text = plainText(
    typeof block.attributes?.content === "string" ? block.attributes.content : ""
  );
  return (
    <pre
      className="mb-4 p-4 overflow-x-auto font-mono text-chrome-blue-content"
      style={{
        fontSize: "13px",
        lineHeight: 1.6,
        backgroundColor: "var(--arm-panel-bg-darker)",
        border: "2px solid var(--arm-panel-border)",
      }}
    >
      <code>{text}</code>
    </pre>
  );
}

function ImageBlock({ block }: { block: EditorBlock }) {
  const img = imageSource(block.attributes);
  if (!img) return null;
  const caption = block.attributes?.caption;
  return (
    <figure className="mb-5">
      <div
        style={{
          border: "3px solid var(--arm-panel-border)",
          boxShadow: "4px 4px 0 var(--arm-panel-border)",
        }}
      >
        <AppImage
          src={img.src}
          alt={img.alt}
          width={img.width}
          height={img.height}
          sizes="(max-width: 1200px) 100vw, 900px"
          unoptimized={!img.optimized}
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>
      {typeof caption === "string" && caption && (
        <RichText
          as="figcaption"
          html={caption}
          className={`mt-2 ${CAPTION_CLASS}`}
          style={{ fontSize: "11px" }}
        />
      )}
    </figure>
  );
}

// An embed is shown as a link, not as the provider's iframe: no third-party script or cookie loads
// just because a post has a video in it. Turning it into a player can come later, with a decision.
function Embed({ block }: { block: EditorBlock }) {
  const url = safeUrl(block.attributes?.url);
  if (!url) return null;
  const caption = block.attributes?.caption;
  return (
    <div
      className="mb-4 px-4 py-3"
      style={{
        border: "2px solid var(--arm-panel-border)",
        backgroundColor: "var(--arm-panel-bg)",
      }}
    >
      <span className={`block ${CAPTION_CLASS}`} style={{ fontSize: "10px" }}>
        EMBED · {embedLabel(block.attributes)}
      </span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="font-grotesk text-chrome-green break-all"
        style={{ fontSize: "14px" }}
      >
        {url}
      </a>
      {typeof caption === "string" && caption && (
        <RichText
          as="figcaption"
          html={caption}
          className={`block mt-1 ${CAPTION_CLASS}`}
          style={{ fontSize: "11px" }}
        />
      )}
    </div>
  );
}

function Separator() {
  return (
    <hr className="my-6 bg-chrome-blue-accent border-0 opacity-50" style={{ height: "2px" }} />
  );
}

// A block the renderer has no component for (or raw HTML): its HTML is kept for the structure,
// after the allowlist removed anything active.
function Fallback({ block }: { block: EditorBlock }) {
  const clean = sanitizeFallback(block.renderedHtml);
  if (!clean.trim()) return null;
  return (
    <div
      className={`mb-4 ${BODY_CLASS}`}
      style={BODY_STYLE}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}

export function BlockRenderer({ block }: { block: EditorBlock }) {
  switch (block.name) {
    case "core/paragraph":
      return (
        <RichText
          as="p"
          html={block.attributes?.content}
          className={`mb-4 ${BODY_CLASS}`}
          style={BODY_STYLE}
        />
      );
    case "core/heading":
      return <Heading block={block} />;
    case "core/list":
      return <List block={block} />;
    case "core/list-item":
      return <ListItem block={block} />;
    case "core/quote":
      return <Quote block={block} />;
    case "core/code":
      return <Code block={block} />;
    case "core/image":
      return <ImageBlock block={block} />;
    case "core/embed":
      return <Embed block={block} />;
    case "core/separator":
      return <Separator />;
    default:
      return <Fallback block={block} />;
  }
}
