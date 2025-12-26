"use client";
import Image from 'next/image';

type Props = {
  original: string;
  alt?: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
  quality?: number;
};

export default function OptimizedImage({ 
  original, 
  alt = '', 
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  className = 'object-cover',
  priority = false,
  quality = 85
}: Props) {
  return (
    <Image 
      src={original} 
      alt={alt} 
      fill 
      className={className}
      sizes={sizes}
      priority={priority}
      quality={quality}
      style={{ objectFit: 'cover' }}
    />
  );
}
