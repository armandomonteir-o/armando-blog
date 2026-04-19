function PixelCursor({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 16 20" className={className}>
      <polygon points="2,2 2,18 6,14 10,22 12,21 8,13 14,13" fill="rgba(0,0,0,0.15)" />
      <polygon points="0,0 0,16 4,12 8,20 10,19 6,11 12,11" fill="#222" />
      <polygon points="1,2 1,13 3,11 3,3" fill="#666" />
      <polygon points="1,2 5,2 3,3 1,3" fill="#999" />
    </svg>
  );
}

function PixelHeart({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size * 0.85}
      viewBox="0 0 14 12"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="4" y="1" width="2" height="1" fill="#990033" />
      <rect x="8" y="1" width="2" height="1" fill="#990033" />
      <rect x="2" y="2" width="4" height="1" fill="#cc0044" />
      <rect x="8" y="2" width="4" height="1" fill="#cc0044" />
      <rect x="1" y="3" width="12" height="1" fill="#ff0055" />
      <rect x="1" y="4" width="12" height="1" fill="#ff0055" />
      <rect x="2" y="5" width="10" height="1" fill="#ff3377" />
      <rect x="3" y="6" width="8" height="1" fill="#ff3377" />
      <rect x="4" y="7" width="6" height="1" fill="#ff6699" />
      <rect x="5" y="8" width="4" height="1" fill="#ff6699" />
      <rect x="6" y="9" width="2" height="1" fill="#ff99bb" />
      <rect x="3" y="2" width="1" height="1" fill="#ff99bb" />
      <rect x="3" y="3" width="1" height="1" fill="#ffccdd" />
      <rect x="9" y="2" width="1" height="1" fill="#ff99bb" />
    </svg>
  );
}

function PixelFolder({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size * 0.8}
      viewBox="0 0 20 16"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="1" y="1" width="7" height="3" fill="#e6c233" />
      <rect x="1" y="1" width="7" height="1" fill="#f5d94a" />
      <rect x="1" y="4" width="18" height="11" fill="#e6c233" />
      <rect x="1" y="4" width="18" height="1" fill="#f5d94a" />
      <rect x="2" y="14" width="18" height="1" fill="rgba(0,0,0,0.15)" />
      <rect x="19" y="5" width="1" height="10" fill="rgba(0,0,0,0.15)" />
      <rect x="2" y="5" width="1" height="9" fill="#f5e67a" />
      <rect x="0" y="0" width="8" height="1" fill="#8a7520" />
      <rect x="0" y="1" width="1" height="3" fill="#8a7520" />
      <rect x="0" y="3" width="19" height="1" fill="#8a7520" />
      <rect x="0" y="4" width="1" height="11" fill="#8a7520" />
      <rect x="18" y="4" width="1" height="11" fill="#8a7520" />
      <rect x="1" y="15" width="18" height="1" fill="#8a7520" />
    </svg>
  );
}

function PixelHourglass({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size * 1.2}
      viewBox="0 0 12 15"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="1" y="0" width="10" height="2" fill="#666" />
      <rect x="2" y="2" width="8" height="1" fill="#c9a947" />
      <rect x="3" y="3" width="6" height="1" fill="#c9a947" />
      <rect x="4" y="4" width="4" height="1" fill="#c9a947" />
      <rect x="5" y="5" width="2" height="1" fill="#c9a947" />
      <rect x="4" y="6" width="4" height="1" fill="#9ad4e6" />
      <rect x="3" y="7" width="6" height="1" fill="#9ad4e6" />
      <rect x="2" y="8" width="8" height="2" fill="#9ad4e6" />
      <rect x="2" y="10" width="8" height="1" fill="#7abfda" />
      <rect x="1" y="11" width="10" height="2" fill="#666" />
      <rect x="1" y="0" width="10" height="1" fill="#999" />
      <rect x="1" y="11" width="10" height="1" fill="#999" />
    </svg>
  );
}

function GlassOrb({
  size,
  color,
  top,
  left,
  right,
  bottom,
  opacity = 0.5,
  blur = 40,
  delay = 0,
}: {
  size: number;
  color: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  opacity?: number;
  blur?: number;
  delay?: number;
}) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        width: size,
        height: size,
        top,
        left,
        right,
        bottom,
        borderRadius: "50%",
        background: `radial-gradient(circle at 35% 35%, ${color}88, ${color}44, ${color}11, transparent 70%)`,
        filter: `blur(${blur}px)`,
        opacity,
        animation: `aeroFloat ${6 + delay}s ease-in-out infinite alternate`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

function GlossyBubble({
  size,
  top,
  left,
  right,
  bottom,
  delay = 0,
}: {
  size: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  delay?: number;
}) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        width: size,
        height: size,
        top,
        left,
        right,
        bottom,
        borderRadius: "50%",
        background: `
          radial-gradient(circle at 30% 25%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 20%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(3,71,193,0.15) 0%, rgba(3,71,193,0.05) 60%, transparent 80%)
        `,
        border: "1px solid rgba(255,255,255,0.4)",
        boxShadow: `inset 0 -${size / 6}px ${size / 3}px rgba(3,71,193,0.1), 0 ${size / 10}px ${size / 4}px rgba(3,71,193,0.08)`,
        animation: `aeroBubble ${5 + delay * 1.5}s ease-in-out infinite alternate`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

function GlassSheen({
  className = "",
  style = {},
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`absolute pointer-events-none ${className}`}
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 40%, transparent 60%)",
        borderRadius: "inherit",
        ...style,
      }}
    />
  );
}

function AquaWave({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`absolute pointer-events-none ${className}`}
      width="300"
      height="40"
      viewBox="0 0 300 40"
      style={{ opacity: 0.08 }}
    >
      <path
        d="M0 20 Q25 5 50 20 Q75 35 100 20 Q125 5 150 20 Q175 35 200 20 Q225 5 250 20 Q275 35 300 20"
        fill="none"
        stroke="#0347c1"
        strokeWidth="2"
      />
      <path
        d="M0 28 Q25 13 50 28 Q75 43 100 28 Q125 13 150 28 Q175 43 200 28 Q225 13 250 28 Q275 43 300 28"
        fill="none"
        stroke="#80b0ff"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function AeroElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <style>{`
        @keyframes aeroFloat {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes aeroBubble {
          0% { transform: translateY(0) translateX(0) scale(1); }
          50% { transform: translateY(-8px) translateX(4px) scale(1.02); }
          100% { transform: translateY(-15px) translateX(-3px) scale(0.98); }
        }
        @keyframes pixelBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>

      <GlassOrb
        size={180}
        color="#0347c1"
        top="-40px"
        right="10%"
        opacity={0.35}
        blur={50}
        delay={0}
      />
      <GlassOrb
        size={120}
        color="#80b0ff"
        bottom="20%"
        left="-30px"
        opacity={0.25}
        blur={35}
        delay={2}
      />
      <GlassOrb
        size={90}
        color="#4ade80"
        top="40%"
        right="-20px"
        opacity={0.2}
        blur={30}
        delay={1.5}
      />
      <GlassOrb
        size={150}
        color="#c084fc"
        bottom="-30px"
        right="30%"
        opacity={0.15}
        blur={45}
        delay={3}
      />

      <GlossyBubble size={24} top="15%" right="5%" delay={0} />
      <GlossyBubble size={16} top="25%" right="12%" delay={1} />
      <GlossyBubble size={32} top="60%" left="2%" delay={2} />
      <GlossyBubble size={20} bottom="30%" right="8%" delay={0.5} />
      <GlossyBubble size={14} top="45%" right="3%" delay={1.5} />
      <GlossyBubble size={18} bottom="15%" left="5%" delay={2.5} />

      <AquaWave className="bottom-[120px] right-0" />
      <AquaWave className="top-[80px] left-0" />

      <div
        className="absolute pointer-events-none"
        style={{
          top: "8%",
          right: "3%",
          animation: "pixelBounce 3s ease-in-out infinite",
          opacity: 0.6,
        }}
      >
        <PixelCursor size={28} />
      </div>
      <div
        className="absolute pointer-events-none"
        style={{
          top: "55%",
          right: "1%",
          animation: "pixelBounce 4s ease-in-out infinite 0.5s",
          opacity: 0.5,
        }}
      >
        <PixelHeart size={24} />
      </div>
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "25%",
          left: "1%",
          animation: "pixelBounce 3.5s ease-in-out infinite 1s",
          opacity: 0.5,
        }}
      >
        <PixelFolder size={28} />
      </div>
      <div
        className="absolute pointer-events-none"
        style={{
          top: "35%",
          left: "4%",
          animation: "pixelBounce 4.5s ease-in-out infinite 1.5s",
          opacity: 0.45,
        }}
      >
        <PixelHourglass size={22} />
      </div>
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "8%",
          right: "6%",
          animation: "pixelBounce 3.8s ease-in-out infinite 0.8s",
          opacity: 0.5,
        }}
      >
        <PixelCursor size={20} className="scale-x-[-1]" />
      </div>
      <div
        className="absolute pointer-events-none"
        style={{
          top: "75%",
          right: "15%",
          animation: "pixelBounce 3.2s ease-in-out infinite 2s",
          opacity: 0.4,
        }}
      >
        <PixelHeart size={18} />
      </div>

      <GlassSheen
        className="top-0 right-0 w-[300px] h-[200px]"
        style={{
          background:
            "radial-gradient(ellipse at top right, rgba(255,255,255,0.08) 0%, transparent 70%)",
        }}
      />
      <GlassSheen
        className="bottom-0 left-0 w-[250px] h-[150px]"
        style={{
          background:
            "radial-gradient(ellipse at bottom left, rgba(3,71,193,0.06) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
