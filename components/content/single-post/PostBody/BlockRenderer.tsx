import {
  embedLabel,
  imageFileName,
  imageSource,
  plainText,
  safeUrl,
  sanitizeFallback,
  type EditorBlock,
} from "@/lib/blocks";
import { AppImage } from "@/components/ui/AppImage";
import { RichText } from "./RichText";
import { WindowFrame } from "./WindowFrame";

// The look of every block comes from the site's own patterns: the window chrome of the cards, the
// terminal ">" and the big decorative quote mark of the prototype, scanlines on images, the hard
// shadow and the lift on hover. Only tokens that already exist.
const BODY_STYLE: React.CSSProperties = {
  fontSize: "15px",
  lineHeight: 1.85,
  letterSpacing: "0.01em",
};
const QUOTE_STYLE: React.CSSProperties = { fontSize: "18px", lineHeight: 1.7, letterSpacing: "0" };
const BODY_CLASS = "post-prose font-grotesk text-chrome-blue-content";
const CAPTION_CLASS = "font-mono text-chrome-blue-body";

const SCANLINES =
  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)";

// "quote" is the text inside a quotation: larger, and white.
type Tone = "body" | "quote";

function Children({ blocks, tone }: { blocks: EditorBlock[] | null | undefined; tone?: Tone }) {
  return (
    <>
      {(blocks ?? []).map((child) => (
        <BlockRenderer key={child.clientId} block={child} tone={tone} />
      ))}
    </>
  );
}

function Paragraph({ block, tone }: { block: EditorBlock; tone: Tone }) {
  const quote = tone === "quote";
  return (
    <RichText
      as="p"
      html={block.attributes?.content}
      className={quote ? "post-prose font-grotesk mb-2 text-white" : `mb-4 ${BODY_CLASS}`}
      style={quote ? QUOTE_STYLE : BODY_STYLE}
    />
  );
}

// A sub-heading: the terminal prompt in green, and a dashed rule under it.
function HeadingBlock({ block }: { block: EditorBlock }) {
  const level = Number(block.attributes?.level);
  const Tag = level >= 4 && level <= 6 ? (`h${level}` as "h4" | "h5" | "h6") : "h3";
  return (
    <div
      className="flex items-baseline gap-2 mt-8 mb-4 pb-2"
      style={{ borderBottom: "2px dashed var(--arm-panel-border)" }}
    >
      <span
        aria-hidden="true"
        className="font-mono font-bold flex-shrink-0"
        style={{ fontSize: "16px", color: "var(--post-accent)" }}
      >
        &gt;
      </span>
      <RichText
        as={Tag}
        html={block.attributes?.content}
        className="post-prose font-grotesk font-bold"
        style={{ fontSize: "19px", color: "#fff", lineHeight: 1.35 }}
      />
    </div>
  );
}

function List({ block }: { block: EditorBlock }) {
  const ordered = Boolean(block.attributes?.ordered);
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag
      className={`mb-5 pl-6 ${BODY_CLASS} marker:text-[color:var(--post-accent)] marker:font-bold ${ordered ? "marker:font-mono" : ""}`}
      style={{ ...BODY_STYLE, listStyleType: ordered ? "decimal" : "square" }}
      start={typeof block.attributes?.start === "number" ? block.attributes.start : undefined}
      reversed={block.attributes?.reversed === true ? true : undefined}
    >
      <Children blocks={block.innerBlocks} />
    </Tag>
  );
}

function ListItem({ block }: { block: EditorBlock }) {
  return (
    <li className="mb-1.5 pl-1">
      <RichText html={block.attributes?.content} />
      <Children blocks={block.innerBlocks} />
    </li>
  );
}

// The decorative quote mark of the prototype, in the accent at low opacity, and an accent bar.
function Quote({ block }: { block: EditorBlock }) {
  const citation = block.attributes?.citation;
  return (
    <blockquote
      className="relative mb-6 px-6 py-5 overflow-hidden"
      style={{
        backgroundColor: "var(--arm-panel-bg)",
        border: "3px solid var(--arm-panel-border)",
        borderLeft: "6px solid var(--post-accent)",
        boxShadow: "4px 4px 0 var(--arm-panel-bg-deep)",
      }}
    >
      <span
        aria-hidden="true"
        className="absolute pointer-events-none select-none font-grotesk font-bold"
        style={{
          top: "-2px",
          right: "16px",
          fontSize: "120px",
          lineHeight: 1,
          color: "var(--post-accent)",
          opacity: 0.4,
        }}
      >
        &ldquo;
      </span>
      <div className="relative">
        <Children blocks={block.innerBlocks} tone="quote" />
        {typeof citation === "string" && citation && (
          <RichText
            as="cite"
            html={citation}
            className={`post-prose block mt-3 not-italic font-bold ${CAPTION_CLASS}`}
            style={{ fontSize: "11px", color: "var(--post-accent)" }}
          />
        )}
      </div>
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
    <WindowFrame label="CODE.TXT" className="mb-6">
      <pre
        className="m-0 p-4 overflow-x-auto font-mono"
        style={{
          fontSize: "13px",
          lineHeight: 1.7,
          color: "var(--post-accent-soft)",
          backgroundColor: "var(--arm-panel-bg-deep)",
          backgroundImage: SCANLINES,
        }}
      >
        <code>{text}</code>
      </pre>
    </WindowFrame>
  );
}

function ImageBlock({ block }: { block: EditorBlock }) {
  const img = imageSource(block.attributes);
  if (!img) return null;
  const caption = block.attributes?.caption;
  return (
    <figure className="mb-6">
      <WindowFrame label={imageFileName(img.src)}>
        <div className="relative">
          <AppImage
            src={img.src}
            alt={img.alt}
            width={img.width}
            height={img.height}
            sizes="(max-width: 1200px) 100vw, 900px"
            unoptimized={!img.optimized}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: SCANLINES }}
          />
        </div>
        {typeof caption === "string" && caption && (
          <RichText
            as="figcaption"
            html={caption}
            className={`post-prose block px-3 py-2 ${CAPTION_CLASS}`}
            style={{
              fontSize: "11px",
              lineHeight: 1.6,
              borderTop: "2px solid var(--arm-panel-bg-deep)",
            }}
          />
        )}
      </WindowFrame>
    </figure>
  );
}

// An embed is shown as a link card, not as the provider's iframe: no third-party script or cookie
// loads just because a post has a video in it. Turning it into a player can come later, with a
// decision. The whole card is the link, and it lifts on hover like the other cards.
function Embed({ block }: { block: EditorBlock }) {
  const url = safeUrl(block.attributes?.url);
  if (!url) return null;
  const caption = block.attributes?.caption;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="brutal-lift block mb-6"
      style={
        {
          textDecoration: "none",
          "--lift-color": "var(--arm-panel-bg-deep)",
          "--lift-rest": "4px",
          "--lift-hover": "6px",
        } as React.CSSProperties
      }
    >
      <WindowFrame label="EMBED.LNK" className="!shadow-none">
        <div className="flex items-center gap-4 p-4">
          <div
            aria-hidden="true"
            className="flex-shrink-0 flex items-center justify-center font-mono font-bold"
            style={{
              width: "44px",
              height: "44px",
              fontSize: "18px",
              color: "var(--post-accent)",
              backgroundColor: "var(--arm-panel-bg-deep)",
              border: "2px solid var(--post-accent)",
            }}
          >
            &#9654;
          </div>
          <div className="min-w-0">
            <span className={`block font-bold ${CAPTION_CLASS}`} style={{ fontSize: "10px" }}>
              {embedLabel(block.attributes)}
            </span>
            <span
              className="block font-grotesk break-all"
              style={{ fontSize: "14px", color: "var(--post-accent)" }}
            >
              {url}
            </span>
            {typeof caption === "string" && caption && (
              <span className={`block mt-1 ${CAPTION_CLASS}`} style={{ fontSize: "11px" }}>
                {plainText(caption)}
              </span>
            )}
          </div>
        </div>
      </WindowFrame>
    </a>
  );
}

// The same divider the post puts between its sections: a line, three squares, a line.
function Separator() {
  return (
    <div className="flex items-center gap-2 my-8 opacity-40" role="separator">
      <div className="flex-1 bg-chrome-blue-accent" style={{ height: "2px" }} />
      <div className="flex gap-1" aria-hidden="true">
        {[0, 1, 2].map((d) => (
          <div key={d} className="w-1.5 h-1.5 bg-chrome-blue-soft" />
        ))}
      </div>
      <div className="flex-1 bg-chrome-blue-accent" style={{ height: "2px" }} />
    </div>
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

export function BlockRenderer({ block, tone = "body" }: { block: EditorBlock; tone?: Tone }) {
  switch (block.name) {
    case "core/paragraph":
      return <Paragraph block={block} tone={tone} />;
    case "core/heading":
      return <HeadingBlock block={block} />;
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
