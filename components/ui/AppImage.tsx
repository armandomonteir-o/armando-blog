"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";

// 1×1 transparent PNG — used when the real src fails to load
const FALLBACK_DATA_URI =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

interface AppImageProps extends Omit<ImageProps, "sizes"> {
  sizes: string;
}

export function AppImage({ src, alt, preload, loading, unoptimized, ...props }: AppImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  // Blob URLs (created via URL.createObjectURL) and data URIs are browser-local
  // and can't go through the Next.js image optimizer. Detect them automatically
  // so callers never need to think about it — always use <AppImage>, never raw <img>.
  const srcStr = typeof imgSrc === "string" ? imgSrc : "";
  const isBlobOrData = srcStr.startsWith("blob:") || srcStr.startsWith("data:");

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      preload={preload}
      // preload overrides loading: a preloaded image is always eager
      loading={preload ? "eager" : loading}
      unoptimized={isBlobOrData || unoptimized}
      onError={() => setImgSrc(FALLBACK_DATA_URI)}
    />
  );
}
