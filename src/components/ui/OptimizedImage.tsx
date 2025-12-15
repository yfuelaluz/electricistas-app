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
  const [src, setSrc] = useState<string>(original);

  useEffect(() => {
    let mounted = true;
    async function pick() {
      // extract filename without folders and extension, replace spaces with dashes
      const parts = original.split('/');
      const filename = parts[parts.length - 1] || original;
      const extIndex = filename.lastIndexOf('.');
      const base = extIndex !== -1 ? filename.slice(0, extIndex) : filename;
      const name = base.replace(/\s+/g, '-');

      for (const w of widths) {
        const avif = `/galeria/optimized/${name}-${w}.avif`;
        try {
          const r = await fetch(avif, { method: 'HEAD' });
          if (r.ok) { if (mounted) setSrc(avif); return; }
        } catch (e) {
        }

        const webp = `/galeria/optimized/${name}-${w}.webp`;
        try {
          const r2 = await fetch(webp, { method: 'HEAD' });
          if (r2.ok) { if (mounted) setSrc(webp); return; }
        } catch (e) {
        }
      }

      if (mounted) setSrc(original);
    }

    pick();
    return () => { mounted = false; };
  }, [original]);

  return (
    <Image src={src} alt={alt} fill className={className || 'object-cover'} sizes={sizes} />
  );
}
