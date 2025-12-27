"use client";
import Image from 'next/image';

type Props = {
  original: string;
  alt?: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
  quality?: number;
  loading?: 'lazy' | 'eager';
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
};

/**
 * Componente optimizado de imagen usando next/image
 * - Lazy loading automático por defecto
 * - Responsive con sizes configurables
 * - Optimización automática de formato (WebP, AVIF)
 * - Carga progresiva con blur opcional
 */
export default function OptimizedImage({ 
  original, 
  alt = '', 
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  className = 'object-cover',
  priority = false,
  quality = 85,
  loading,
  placeholder = 'empty',
  blurDataURL,
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
      loading={loading || (priority ? 'eager' : 'lazy')}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      style={{ objectFit: 'cover' }}
    />
  );
}
