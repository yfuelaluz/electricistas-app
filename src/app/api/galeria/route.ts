import { NextResponse } from 'next/server';
import { imagenesGaleria } from '@/data/galeria-index';

export async function GET() {
  try {
    // Categorizar automáticamente según palabras clave en el nombre
    const categorizar = (filename: string): string => {
      const lower = filename.toLowerCase();
      
      // Planos (PRIMERO para que tenga prioridad)
      if (lower.includes('plano')) {
        return 'planos';
      }
      
      // Electricidad
      if (lower.includes('tablero') || lower.includes('electr') || 
          lower.includes('iluminacion') || lower.includes('fotovoltaic') ||
          lower.includes('montaje') || lower.includes('epc') ||
          lower.includes('servicentro') || lower.includes('panel')) {
        return 'electricidad';
      }
      
      // Carpintería y Construcción
      if (lower.includes('casa') || lower.includes('ampliacion') ||
          lower.includes('cabaña') || lower.includes('techumbre') ||
          lower.includes('dorm') || lower.includes('baño') ||
          lower.includes('soltero') || lower.includes('pisos') ||
          lower.includes('mueble') || lower.includes('madera')) {
        return 'carpinteria';
      }
      
      // Mueblería
      if (lower.includes('mueble') || lower.includes('closet') ||
          lower.includes('cocina') || lower.includes('estante')) {
        return 'mueblistas';
      }
      
      // Por defecto
      return 'otros';
    };

    // Generar título limpio desde el nombre del archivo
    const generarTitulo = (filename: string): string => {
      // Quitar extensión y tamaños de optimización (ej: -1600)
      let titulo = filename.replace(/\.(jpg|jpeg|png|gif|webp|avif)$/i, '');
      titulo = titulo.replace(/-\d{3,4}$/i, ''); // Quitar tamaños como -1600
      
      // Reemplazar guiones y guiones bajos por espacios
      titulo = titulo.replace(/[-_]/g, ' ');
      
      // Capitalizar primera letra de cada palabra
      titulo = titulo.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      
      return titulo;
    };

    // Organizar por categorías
    const galeria: Record<string, Array<{src: string, titulo: string}>> = {
      electricidad: [],
      carpinteria: [],
      planos: [],
      mueblistas: [],
      otros: []
    };

    // Agregar imágenes a categorías usando el índice estático
    imagenesGaleria.forEach(imagen => {
      const categoria = categorizar(imagen);
      const titulo = generarTitulo(imagen);
      const rutaImagen = `/galeria/${imagen}`;
      
      galeria[categoria].push({
        src: rutaImagen,
        titulo: titulo
      });
    });

    return NextResponse.json(galeria);
    
  } catch (error) {
    console.error('Error al cargar galería:', error);
    return NextResponse.json(
      { error: 'Error al cargar galería' },
      { status: 500 }
    );
  }
}
