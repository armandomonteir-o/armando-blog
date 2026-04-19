"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";

interface AppImageProps extends Omit<ImageProps, "sizes"> {
  sizes: string;
  fallbackSrc?: string;
}

export function AppImage({
  src,
  alt,
  fallbackSrc = "/images/placeholder.png",
  ...props
}: AppImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
}
