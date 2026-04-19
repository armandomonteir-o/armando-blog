"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music } from "lucide-react";

interface Track {
  title: string;
  artist: string;
  album: string;
  duration: string;
  src: string;
}

const TRACKS: Track[] = [
  {
    title: "Digital Paradise",
    artist: "FM-84",
    album: "Atlas",
    duration: "4:12",
    src: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3",
  },
  {
    title: "Neon Skyline",
    artist: "Timecop1983",
    album: "Night Drive",
    duration: "3:48",
    src: "https://cdn.pixabay.com/audio/2022/10/25/audio_0cda1f9bf3.mp3",
  },
  {
    title: "Midnight Protocol",
    artist: "Perturbator",
    album: "The Uncanny Valley",
    duration: "5:01",
    src: "https://cdn.pixabay.com/audio/2023/07/19/audio_e552e8a464.mp3",
  },
  {
    title: "Chrome Dreams",
    artist: "Carpenter Brut",
    album: "Trilogy",
    duration: "4:33",
    src: "https://cdn.pixabay.com/audio/2024/11/01/audio_4956b4aeac.mp3",
  },
];

function EqualizerBars({ playing, barCount = 5 }: { playing: boolean; barCount?: number }) {
  return (
    <div className="flex items-end gap-[2px]" style={{ height: 18 }}>
      {Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 3,
            backgroundColor: i % 2 === 0 ? "#4ade80" : "#80b0ff",
            borderRadius: 1,
            height: playing ? undefined : 3,
            animation: playing
              ? `eqBounce${(i % 3) + 1} ${0.4 + i * 0.08}s ease-in-out infinite alternate`
              : "none",
            transition: "height 0.3s ease",
          }}
        />
      ))}
    </div>
  );
}

function MarqueeText({ text, playing }: { text: string; playing: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);

  useEffect(() => {
    if (containerRef.current && textRef.current) {
      setShouldScroll(textRef.current.scrollWidth > containerRef.current.clientWidth);
    }
  }, [text]);

  return (
    <div
      ref={containerRef}
      className="overflow-hidden whitespace-nowrap relative"
      style={{ maskImage: "linear-gradient(90deg, black 85%, transparent)" }}
    >
      <span
        ref={textRef}
        className="inline-block"
        style={{
          animation: shouldScroll && playing ? "marqueeScroll 8s linear infinite" : "none",
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: "13px",
          color: "#fff",
        }}
      >
        {text}
      </span>
    </div>
  );
}

export function MusicConsentBar({
  onAccept,
  onDecline,
}: {
  onAccept: () => void;
  onDecline: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-3"
      style={{ pointerEvents: "none" }}
    >
      <div
        className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 px-4 py-3 max-w-xl w-full"
        style={{
          pointerEvents: "auto",
          border: "3px solid #022a6e",
          backgroundColor: "rgba(3,71,193,0.92)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow: "4px 4px 0 #022a6e, 0 -4px 24px rgba(3,71,193,0.3)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%)",
          }}
        />

        <div className="flex items-center gap-3 relative z-10 flex-1 min-w-0">
          <div
            className="w-9 h-9 flex items-center justify-center flex-shrink-0"
            style={{
              border: "2px solid #80b0ff",
              backgroundColor: "#0458d4",
            }}
          >
            <Music size={16} color="#4ade80" />
          </div>
          <div className="min-w-0">
            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "13px",
                color: "#fff",
              }}
            >
              Quer ouvir música?
            </div>
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "9px",
                color: "#80b0ff",
              }}
            >
              Toque uma playlist enquanto navega pelo blog
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 relative z-10 flex-shrink-0">
          <button
            onClick={onAccept}
            className="px-4 py-1.5 cursor-pointer"
            style={{
              border: "2px solid #022a6e",
              backgroundColor: "#fff",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "12px",
              color: "#0347c1",
              boxShadow: "2px 2px 0 #022a6e",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translate(-1px, -1px)";
              e.currentTarget.style.boxShadow = "3px 3px 0 #022a6e";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translate(0,0)";
              e.currentTarget.style.boxShadow = "2px 2px 0 #022a6e";
            }}
          >
            Sim!
          </button>
          <button
            onClick={onDecline}
            className="px-4 py-1.5 cursor-pointer"
            style={{
              border: "2px solid #0560e0",
              backgroundColor: "transparent",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "12px",
              color: "#80b0ff",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            Não
          </button>
        </div>
      </div>
    </div>
  );
}

export function NowPlayingWidget() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.6);
  const [muted, setMuted] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const track = TRACKS[currentTrack];

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setPlaying(!playing);
  }, [playing]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = TRACKS[currentTrack].src;
    audio.load();
    if (playing) {
      audio.play().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    };
    const onEnded = () => {
      setCurrentTrack((prev) => (prev + 1) % TRACKS.length);
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);

  const prevTrack = () => setCurrentTrack((p) => (p - 1 + TRACKS.length) % TRACKS.length);
  const nextTrack = () => setCurrentTrack((p) => (p + 1) % TRACKS.length);

  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = progressBarRef.current;
    const audio = audioRef.current;
    if (!bar || !audio || !duration) return;
    const rect = bar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = pct * duration;
  };

  const formatTime = (s: number) => {
    if (!s || !isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const pct = duration > 0 ? (progress / duration) * 100 : 0;

  if (minimized) {
    return (
      <div
        className="flex items-center gap-3 px-4 py-2 cursor-pointer"
        style={{
          border: "3px solid #022a6e",
          backgroundColor: "#0347c1",
          boxShadow: "4px 4px 0 #022a6e",
        }}
        onClick={() => setMinimized(false)}
      >
        <audio ref={audioRef} src={track.src} preload="auto" />
        <EqualizerBars playing={playing} barCount={4} />
        <span
          className="flex-1 truncate"
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "11px",
            color: "#80b0ff",
          }}
        >
          {track.artist} — {track.title}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          className="cursor-pointer flex-shrink-0"
          style={{ color: "#fff", background: "none", border: "none" }}
        >
          {playing ? <Pause size={14} /> : <Play size={14} />}
        </button>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col"
      style={{
        border: "3px solid #022a6e",
        boxShadow: "4px 4px 0 #022a6e",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes eqBounce1 {
          0% { height: 3px; }
          100% { height: 16px; }
        }
        @keyframes eqBounce2 {
          0% { height: 5px; }
          100% { height: 12px; }
        }
        @keyframes eqBounce3 {
          0% { height: 2px; }
          100% { height: 18px; }
        }
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes vinylSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <audio ref={audioRef} src={track.src} preload="auto" />

      {/* Title bar — Winamp style */}
      <div
        className="flex items-center justify-between px-3 py-1"
        style={{
          backgroundColor: "#0458d4",
          borderBottom: "2px solid #022a6e",
          minHeight: "26px",
        }}
      >
        <div className="flex items-center gap-2">
          <EqualizerBars playing={playing} barCount={3} />
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "10px",
              fontWeight: 700,
              color: "#80b0ff",
              letterSpacing: "0.05em",
            }}
          >
            PLAYER.EXE
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setMinimized(true)}
            className="w-4 h-4 flex items-center justify-center cursor-pointer"
            style={{
              border: "2px solid #022a6e",
              backgroundColor: "#0560e0",
              fontSize: "10px",
              fontWeight: 700,
              lineHeight: 1,
              color: "#fff",
            }}
          >
            _
          </button>
          <div
            className="w-4 h-4"
            style={{ border: "2px solid #022a6e", backgroundColor: "#e05050" }}
          />
        </div>
      </div>

      {/* Player body */}
      <div className="flex items-center gap-3 px-4 py-3" style={{ backgroundColor: "#0347c1" }}>
        {/* Vinyl / Album art placeholder */}
        <div
          className="w-11 h-11 flex-shrink-0 flex items-center justify-center relative"
          style={{
            border: "2px solid #80b0ff",
            backgroundColor: "#022a6e",
            overflow: "hidden",
          }}
        >
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              animation: playing ? "vinylSpin 3s linear infinite" : "none",
            }}
          >
            <div
              className="w-full h-full"
              style={{
                background:
                  "conic-gradient(from 0deg, #0560e0, #80b0ff, #0560e0, #80b0ff, #0560e0)",
                opacity: 0.3,
              }}
            />
          </div>
          <Music size={16} color="#80b0ff" className="relative z-10" />
        </div>

        {/* Track info + controls */}
        <div className="flex-1 min-w-0">
          <MarqueeText text={`${track.title} — ${track.artist}`} playing={playing} />
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "9px",
              color: "#5a8ad0",
              marginTop: 1,
            }}
          >
            {track.album} · Track {currentTrack + 1}/{TRACKS.length}
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-2 mt-2">
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "8px",
                color: "#5a8ad0",
                minWidth: 28,
              }}
            >
              {formatTime(progress)}
            </span>
            <div
              ref={progressBarRef}
              className="flex-1 h-2 cursor-pointer relative"
              style={{
                border: "2px solid #0560e0",
                backgroundColor: "#022a6e",
              }}
              onClick={seekTo}
            >
              <div
                className="h-full"
                style={{
                  width: `${pct}%`,
                  backgroundColor: "#4ade80",
                  transition: "width 0.1s linear",
                }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 60%)",
                }}
              />
            </div>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "8px",
                color: "#5a8ad0",
                minWidth: 28,
                textAlign: "right",
              }}
            >
              {formatTime(duration)}
            </span>
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1">
              <button
                onClick={prevTrack}
                className="w-7 h-7 flex items-center justify-center cursor-pointer"
                style={{
                  border: "2px solid #0560e0",
                  backgroundColor: "#0458d4",
                  color: "#80b0ff",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0560e0")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0458d4")}
              >
                <SkipBack size={12} fill="currentColor" />
              </button>

              <button
                onClick={togglePlay}
                className="w-8 h-8 flex items-center justify-center cursor-pointer"
                style={{
                  border: "2px solid #022a6e",
                  backgroundColor: "#fff",
                  color: "#0347c1",
                  boxShadow: "2px 2px 0 #022a6e",
                  transition: "transform 0.15s, box-shadow 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translate(-1px,-1px)";
                  e.currentTarget.style.boxShadow = "3px 3px 0 #022a6e";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translate(0,0)";
                  e.currentTarget.style.boxShadow = "2px 2px 0 #022a6e";
                }}
              >
                {playing ? <Pause size={14} /> : <Play size={14} />}
              </button>

              <button
                onClick={nextTrack}
                className="w-7 h-7 flex items-center justify-center cursor-pointer"
                style={{
                  border: "2px solid #0560e0",
                  backgroundColor: "#0458d4",
                  color: "#80b0ff",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0560e0")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0458d4")}
              >
                <SkipForward size={12} fill="currentColor" />
              </button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setMuted(!muted)}
                className="cursor-pointer"
                style={{ color: "#80b0ff", background: "none", border: "none" }}
              >
                {muted || volume === 0 ? <VolumeX size={13} /> : <Volume2 size={13} />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={muted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  setMuted(false);
                }}
                className="w-14 h-1 cursor-pointer"
                style={{ accentColor: "#4ade80" }}
              />
            </div>

            <EqualizerBars playing={playing} barCount={5} />
          </div>
        </div>
      </div>

      {/* Track list — foobar2000 style */}
      <div style={{ borderTop: "2px solid #022a6e", backgroundColor: "#022a6e" }}>
        {TRACKS.map((t, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-3 py-1.5 cursor-pointer"
            style={{
              backgroundColor: i === currentTrack ? "#0458d4" : "transparent",
              borderBottom: i < TRACKS.length - 1 ? "1px solid #0a3a7a" : "none",
              transition: "background 0.15s",
            }}
            onClick={() => {
              setCurrentTrack(i);
              setPlaying(true);
              setTimeout(() => audioRef.current?.play().catch(() => {}), 100);
            }}
            onMouseEnter={(e) => {
              if (i !== currentTrack) e.currentTarget.style.backgroundColor = "#0a3a7a";
            }}
            onMouseLeave={(e) => {
              if (i !== currentTrack) e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "9px",
                color: i === currentTrack ? "#4ade80" : "#5a8ad0",
                width: 16,
                textAlign: "center",
                flexShrink: 0,
              }}
            >
              {i === currentTrack && playing ? "▶" : String(i + 1).padStart(2, "0")}
            </span>
            <span
              className="flex-1 truncate"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "11px",
                fontWeight: i === currentTrack ? 700 : 400,
                color: i === currentTrack ? "#fff" : "#80b0ff",
              }}
            >
              {t.artist} — {t.title}
            </span>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "9px",
                color: "#5a8ad0",
                flexShrink: 0,
              }}
            >
              {t.duration}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function NowPlaying() {
  const [consented, setConsented] = useState<boolean | null>(null);

  if (consented === null) {
    return (
      <MusicConsentBar onAccept={() => setConsented(true)} onDecline={() => setConsented(false)} />
    );
  }

  if (!consented) return null;

  return <NowPlayingWidget />;
}
