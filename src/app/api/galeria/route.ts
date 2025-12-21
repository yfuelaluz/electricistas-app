import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const galeriaPath = path.join(process.cwd(), 'public', 'galeria');
    
    // Leer todos los archivos de la carpeta galeria
    const archivos = fs.readdirSync(galeriaPath);
    
    // Filtrar solo imágenes
    const imagenes = archivos.filter(file => 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );

    // Categorizar automáticamente según palabras clave en el nombre
    const categorizar = (filename: string): string => {
      const lower = filename.toLowerCase();
      
      // Electricidad
      if (lower.includes('tablero') || lower.includes('electr') || 
          lower.includes('iluminacion') || lower.includes('fotovoltaic') ||
          lower.includes('plano') && (lower.includes('alumbrado') || lower.includes('servicentro')) ||
          lower.includes('montaje') || lower.includes('epc') ||
          lower.includes('servicentro')) {
        return 'electricidad';
      }
      
      // Carpintería
      if (lower.includes('casa') || lower.includes('ampliacion') ||
          lower.includes('cabaña') || lower.includes('techumbre') ||
          lower.includes('dorm') || lower.includes('baño') ||
          lower.includes('soltero') || lower.includes('pisos')) {
        return 'carpinteria';
      }
      
      // Por defecto
      return 'otros';
    };

    // Generar título limpio desde el nombre del archivo
    const generarTitulo = (filename: string): string => {
      // Quitar extensión
      let titulo = filename.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '');
      
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
      otros: []
    };

    imagenes.forEach(imagen => {
      const categoria = categorizar(imagen);
      const titulo = generarTitulo(imagen);
      
      galeria[categoria].push({
        src: `/galeria/${imagen}`,
        titulo: titulo
      });
    });

    return NextResponse.json(galeria);
    
  } catch (error) {
    console.error('Error al leer galería:', error);
    return NextResponse.json(
      { error: 'Error al cargar galería' },
      { status: 500 }
    );
  }
}
