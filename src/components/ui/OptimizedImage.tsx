"use client";
import Image from 'next/image';
import { useEffect, useState } from 'react';

type Props = {
  original: string;
  alt?: string;
  sizes?: string;
  className?: string;
};

const widths = [1024, 640, 320];

export default function OptimizedImage({ original, alt = '', sizes, className }: Props) {
  // Ya que las imágenes optimizadas están en /galeria/, simplemente usamos el original
  return (
    <Image src={original} alt={alt} fill className={className || 'object-cover'} sizes={sizes} />
  );
}
