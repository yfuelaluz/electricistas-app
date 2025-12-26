import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Review } from '@/types/review';

const REVIEWS_FILE = path.join(process.cwd(), 'data', 'reviews.json');
const PROFESIONALES_FILE = path.join(process.cwd(), 'data', 'profesionales.json');

async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

async function leerReviews(): Promise<Review[]> {
  try {
    const data = await fs.readFile(REVIEWS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function guardarReviews(reviews: Review[]) {
  await ensureDataDir();
  await fs.writeFile(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
}

async function actualizarValoracionProfesional(profesionalId: number) {
  try {
    const reviews = await leerReviews();
    const reviewsProfesional = reviews.filter(r => r.profesionalId === profesionalId);
    
    if (reviewsProfesional.length === 0) return;

    const promedioValoracion = reviewsProfesional.reduce((sum, r) => sum + r.valoracion, 0) / reviewsProfesional.length;

    // Actualizar profesional
    const data = await fs.readFile(PROFESIONALES_FILE, 'utf-8');
    const profesionales = JSON.parse(data);
    const index = profesionales.findIndex((p: any) => p.id === profesionalId);

    if (index !== -1) {
      profesionales[index].valoracion = parseFloat(promedioValoracion.toFixed(1));
      profesionales[index].totalReviews = reviewsProfesional.length;
      await fs.writeFile(PROFESIONALES_FILE, JSON.stringify(profesionales, null, 2));
    }
  } catch (error) {
    console.error('Error actualizando valoración:', error);
  }
}

// POST - Crear nueva review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar datos requeridos
    if (!body.profesionalId || !body.clienteId || !body.cotizacionId || !body.valoracion) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    if (body.valoracion < 1 || body.valoracion > 5) {
      return NextResponse.json(
        { error: 'La valoración debe estar entre 1 y 5' },
        { status: 400 }
      );
    }

    const reviews = await leerReviews();

    // Verificar si ya existe review para esta cotización
    const yaExiste = reviews.some(r => 
      r.cotizacionId === body.cotizacionId && r.clienteId === body.clienteId
    );

    if (yaExiste) {
      return NextResponse.json(
        { error: 'Ya has dejado una valoración para este trabajo' },
        { status: 400 }
      );
    }

    // Crear nueva review
    const nuevaReview: Review = {
      id: `REV-${Date.now()}`,
      profesionalId: body.profesionalId,
      clienteId: body.clienteId,
      cotizacionId: body.cotizacionId,
      clienteNombre: body.clienteNombre,
      valoracion: body.valoracion,
      comentario: body.comentario || '',
      fecha: new Date().toISOString()
    };

    reviews.push(nuevaReview);
    await guardarReviews(reviews);

    // Actualizar valoración del profesional
    await actualizarValoracionProfesional(body.profesionalId);

    return NextResponse.json({
      success: true,
      mensaje: '¡Gracias por tu valoración!',
      review: nuevaReview
    });

  } catch (error) {
    console.error('Error al crear review:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// GET - Obtener reviews de un profesional
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profesionalId = searchParams.get('profesionalId');

    const reviews = await leerReviews();

    if (profesionalId) {
      const reviewsProfesional = reviews.filter(r => r.profesionalId === parseInt(profesionalId));
      
      // Calcular estadísticas
      const distribucion = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      reviewsProfesional.forEach(r => {
        distribucion[r.valoracion as keyof typeof distribucion]++;
      });

      const promedio = reviewsProfesional.length > 0
        ? reviewsProfesional.reduce((sum, r) => sum + r.valoracion, 0) / reviewsProfesional.length
        : 0;

      return NextResponse.json({
        reviews: reviewsProfesional,
        estadisticas: {
          totalReviews: reviewsProfesional.length,
          promedioValoracion: parseFloat(promedio.toFixed(1)),
          distribucion
        }
      });
    }

    return NextResponse.json(reviews);

  } catch (error) {
    console.error('Error al obtener reviews:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
