import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const galeriaNormal = path.join(process.cwd(), 'public', 'galeria');
    const galeriaOptimizada = path.join(process.cwd(), 'public', 'galeria', 'optimized');
    
    let archivos: string[] = [];
    let usarOptimizada = false;
    
    // Leer archivos de carpeta normal (excluir subdirectorios)
    const archivosNormales = fs.readdirSync(galeriaNormal)
      .filter(item => {
        const fullPath = path.join(galeriaNormal, item);
        const esArchivo = fs.statSync(fullPath).isFile();
        const esImagen = /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(item);
        return esArchivo && esImagen;
      });
    
    // Si existen imágenes optimizadas, usarlas preferentemente
    if (fs.existsSync(galeriaOptimizada)) {
      const archivosOptimizados = fs.readdirSync(galeriaOptimizada)
        .filter(file => /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(file));
      
      if (archivosOptimizados.length > 0) {
        archivos = archivosOptimizados;
        usarOptimizada = true;
      } else {
        archivos = archivosNormales;
      }
    } else {
      archivos = archivosNormales;
    }

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
      // Quitar extensión y tamaños de optimización (ej: -1024, -640)
      let titulo = filename.replace(/\.(jpg|jpeg|png|gif|webp|avif)$/i, '');
      titulo = titulo.replace(/-\d{3,4}$/i, ''); // Quitar tamaños como -1024, -640
      
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

    // Agrupar imágenes por nombre base (sin tamaño)
    const imagenesAgrupadas = new Map<string, {archivo: string, esOptimizada: boolean}>();
    
    // Primero procesar imágenes optimizadas
    if (usarOptimizada) {
      archivos.forEach(imagen => {
        const nombreBase = imagen.replace(/-\d{3,4}\.(jpg|jpeg|png|gif|webp|avif)$/i, '');
        
        // Solo agregar si no existe o si es la versión más grande
        if (!imagenesAgrupadas.has(nombreBase)) {
          imagenesAgrupadas.set(nombreBase, {archivo: imagen, esOptimizada: true});
        } else {
          // Si ya existe, quedarse con la versión más grande
          const actual = imagenesAgrupadas.get(nombreBase)!.archivo;
          const tamanioActual = parseInt(actual.match(/-(\d{3,4})\./)?.[1] || '0');
          const tamanioNuevo = parseInt(imagen.match(/-(\d{3,4})\./)?.[1] || '0');
          
          if (tamanioNuevo > tamanioActual) {
            imagenesAgrupadas.set(nombreBase, {archivo: imagen, esOptimizada: true});
          }
        }
      });
      
      // Luego agregar imágenes normales que NO estén optimizadas
      archivosNormales.forEach(imagen => {
        const nombreBase = imagen.replace(/\.(jpg|jpeg|png|gif|webp|avif)$/i, '');
        const nombreBaseLimpio = nombreBase.replace(/[-_]/g, '-');
        
        // Buscar si existe alguna versión optimizada de esta imagen
        let existeOptimizada = false;
        for (const key of imagenesAgrupadas.keys()) {
          const keyLimpio = key.replace(/[-_]/g, '-');
          if (keyLimpio.toLowerCase() === nombreBaseLimpio.toLowerCase()) {
            existeOptimizada = true;
            break;
          }
        }
        
        // Si no existe versión optimizada, agregar la normal
        if (!existeOptimizada) {
          imagenesAgrupadas.set(nombreBase, {archivo: imagen, esOptimizada: false});
        }
      });
    } else {
      // Si no hay optimizadas, usar solo normales
      archivosNormales.forEach(imagen => {
        const nombreBase = imagen.replace(/\.(jpg|jpeg|png|gif|webp|avif)$/i, '');
        imagenesAgrupadas.set(nombreBase, {archivo: imagen, esOptimizada: false});
      });
    }

    // Agregar a categorías
    imagenesAgrupadas.forEach((data) => {
      const categoria = categorizar(data.archivo);
      const titulo = generarTitulo(data.archivo);
      
      const rutaImagen = data.esOptimizada 
        ? `/galeria/optimized/${data.archivo}`
        : `/galeria/${data.archivo}`;
      
      galeria[categoria].push({
        src: rutaImagen,
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
