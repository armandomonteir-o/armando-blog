"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";

// 1×1 transparent PNG — used when the real src fails to load
const FALLBACK_DATA_URI =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

interface AppImageProps extends Omit<ImageProps, "sizes"> {
  sizes: string;
}

export function AppImage({ src, alt, priority, loading, ...props }: AppImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      priority={priority}
      // priority overrides loading: a priority image is always eager
      loading={priority ? "eager" : loading}
      onError={() => setImgSrc(FALLBACK_DATA_URI)}
    />
  );
}
