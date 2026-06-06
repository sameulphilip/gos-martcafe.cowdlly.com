"use client";

import { useEffect, useState } from "react";
import Image, { type ImageProps } from "next/image";
import { FALLBACK_IMAGE } from "@/lib/item-images";

type ProductImageProps = Omit<ImageProps, "src" | "alt"> & {
  src: string | null | undefined;
  alt: string;
  fallbackSrc?: string;
};

export function ProductImage({
  src,
  alt,
  fallbackSrc = FALLBACK_IMAGE,
  ...props
}: ProductImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);

  useEffect(() => {
    setCurrentSrc(src || fallbackSrc);
  }, [src, fallbackSrc]);

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      onError={() => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
      }}
    />
  );
}
