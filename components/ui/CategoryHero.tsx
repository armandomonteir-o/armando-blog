"use client";

import { Fragment } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { WavyText } from "@/components/ui/WavyText";

interface Breadcrumb {
  to?: string;
  label: string;
  active?: boolean;
}

interface CategoryHeroProps {
  minHeight?: string;
  heroImage?: string;
  backgroundGradient?: string;
  overlayGradient: string;
  accentColor: string;
  strokeColor?: string;
  terminalPrefix: string;
  title: string;
  titleSize?: number;
  description: string;
  breadcrumbs?: Breadcrumb[];
  statsBar?: React.ReactNode;
  children?: React.ReactNode;
  extraDecorations?: React.ReactNode;
  keyframeCSS?: string;
}

export function CategoryHero({
  minHeight = "340px",
  heroImage,
  backgroundGradient,
  overlayGradient,
  accentColor,
  strokeColor,
  terminalPrefix,
  title,
  titleSize = 52,
  description,
  breadcrumbs,
  statsBar,
  children,
  extraDecorations,
  keyframeCSS,
}: CategoryHeroProps) {
  return (
    <div className="relative" style={{ minHeight, overflow: "hidden" }}>
      {keyframeCSS && <style>{keyframeCSS}</style>}

      {heroImage && (
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}

      {backgroundGradient && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{ background: backgroundGradient, backgroundSize: "400% 400%", animation: "gradientShift 12s ease infinite" }}
        />
      )}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)",
        }}
      />

      <div className="absolute inset-0" style={{ background: overlayGradient }} />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 40%, rgba(255,255,255,0.04) 80%)",
        }}
      />

      <div
        className="absolute pointer-events-none"
        style={{
          width: 220,
          height: 220,
          top: "-80px",
          right: "8%",
          borderRadius: "50%",
          background: `radial-gradient(circle at 35% 35%, ${accentColor}55, ${accentColor}15, transparent 70%)`,
          filter: "blur(50px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 140,
          height: 140,
          bottom: "10px",
          left: "3%",
          borderRadius: "50%",
          background: "radial-gradient(circle at 35% 35%, rgba(128,176,255,0.25), transparent 70%)",
          filter: "blur(35px)",
        }}
      />

      {extraDecorations}

      <div
        className="relative z-10 flex flex-col justify-end"
        style={{ minHeight, padding: "clamp(16px, 4vw, 32px)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {breadcrumbs ? (
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {breadcrumbs.map((crumb, i) => (
                <Fragment key={i}>
                  {i > 0 && (
                    <ArrowRight size={12} style={{ color: "rgba(255,255,255,0.4)", flexShrink: 0 }} />
                  )}
                  {crumb.to ? (
                    <Link
                      href={crumb.to}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5"
                      style={{
                        background: "rgba(255,255,255,0.1)",
                        backdropFilter: "blur(12px)",
                        border: crumb.active
                          ? `2px solid ${accentColor}66`
                          : "2px solid rgba(255,255,255,0.2)",
                        color: crumb.active ? accentColor : "#fff",
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "10px",
                        fontWeight: 700,
                        textDecoration: "none",
                      }}
                    >
                      {i === 0 && <ArrowLeft size={12} />}
                      {crumb.label}
                    </Link>
                  ) : (
                    <span
                      className="px-3 py-1.5"
                      style={{
                        background: crumb.active
                          ? `${accentColor}22`
                          : "rgba(255,255,255,0.1)",
                        backdropFilter: "blur(12px)",
                        border: crumb.active
                          ? `2px solid ${accentColor}66`
                          : "2px solid rgba(255,255,255,0.2)",
                        color: "#fff",
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "10px",
                        fontWeight: 700,
                      }}
                    >
                      {crumb.label}
                    </span>
                  )}
                </Fragment>
              ))}
            </div>
          ) : (
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3 py-1.5 mb-4"
              style={{
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(12px)",
                border: "2px solid rgba(255,255,255,0.25)",
                color: "#fff",
                fontFamily: "'Space Mono', monospace",
                fontSize: "10px",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              <ArrowLeft size={14} />
              HOME
            </Link>
          )}

          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "10px",
              color: accentColor,
              marginBottom: "6px",
              letterSpacing: "0.1em",
            }}
          >
            {">"} {terminalPrefix}
          </div>

          <WavyText
            text={title}
            fontSize={titleSize}
            amplitude={10}
            frequency={0.14}
            color="#fff"
            strokeColor={strokeColor ?? accentColor}
          />

          <p
            className="mt-3 max-w-[600px]"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "15px",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.75)",
            }}
          >
            {description}
          </p>

          {statsBar && (
            <div
              className="inline-flex flex-wrap items-center gap-3 sm:gap-5 mt-4 px-4 py-2"
              style={{
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.2)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15)",
              }}
            >
              {statsBar}
            </div>
          )}

          {children}
        </motion.div>
      </div>
    </div>
  );
}
