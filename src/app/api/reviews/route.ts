import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Review } from '@/types/review';

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
}

// Función para convertir snake_case a camelCase (para enviar al frontend)
function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(item => toCamelCase(item));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result: any, key: string) => {
      const camelKey = key.replace(/_(\w)/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = toCamelCase(obj[key]);
      return result;
    }, {});
  }
  return obj;
}

async function actualizarValoracionProfesional(profesionalId: number) {
  try {
    const supabase = getSupabaseClient();
    // Obtener todas las reviews del profesional
    const { data: reviews, error: errorReviews } = await supabase
      .from('reviews')
      .select('*')
      .eq('profesional_id', profesionalId);
    
    if (errorReviews || !reviews || reviews.length === 0) return;

    // Calcular promedio
    const promedioValoracion = reviews.reduce((sum: number, r: any) => sum + r.valoracion, 0) / reviews.length;

    // Actualizar profesional
    await supabase
      .from('profesionales')
      .update({
        valoracion: parseFloat(promedioValoracion.toFixed(1)),
        total_reviews: reviews.length
      })
      .eq('id', profesionalId);
  } catch (error) {
    console.error('Error actualizando valoración:', error);
  }
}

// POST - Crear nueva review
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
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

    // Verificar si ya existe review para esta cotización
    const { data: existente, error: errorExistente } = await supabase
      .from('reviews')
      .select('*')
      .eq('cotizacion_id', body.cotizacionId)
      .eq('cliente_id', body.clienteId)
      .single();

    if (existente && !errorExistente) {
      return NextResponse.json(
        { error: 'Ya has dejado una valoración para este trabajo' },
        { status: 400 }
      );
    }

    // Crear nueva review
    const nuevaReview: Review = {
      id: `REV-${Date.now()}`,
      profesional_id: body.profesionalId,
      cliente_id: body.clienteId,
      cotizacion_id: body.cotizacionId,
      cliente_nombre: body.clienteNombre,
      valoracion: body.valoracion,
      comentario: body.comentario || '',
      fecha: new Date().toISOString()
    };

    const { error: errorInsert } = await supabase
      .from('reviews')
      .insert([nuevaReview]);

    if (errorInsert) {
      console.error('Error al insertar review:', errorInsert);
      return NextResponse.json({ error: 'Error al guardar valoración' }, { status: 500 });
    }

    // Actualizar valoración del profesional
    await actualizarValoracionProfesional(body.profesionalId);

    // Convertir snake_case a camelCase antes de enviar al frontend
    const reviewTransformada = toCamelCase(nuevaReview);
    
    return NextResponse.json({
      success: true,
      mensaje: '¡Gracias por tu valoración!',
      review: reviewTransformada
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
    const supabase = getSupabaseClient();
    const { searchParams } = new URL(request.url);
    const profesionalId = searchParams.get('profesionalId');

    if (profesionalId) {
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('profesional_id', parseInt(profesionalId));
      
      if (error) {
        console.error('Error al leer reviews:', error);
        return NextResponse.json({ error: 'Error al obtener valoraciones' }, { status: 500 });
      }

      const reviewsProfesional = reviews || [];
      
      // Calcular estadísticas
      const distribucion = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      reviewsProfesional.forEach((r: any) => {
        distribucion[r.valoracion as keyof typeof distribucion]++;
      });

      const promedio = reviewsProfesional.length > 0
        ? reviewsProfesional.reduce((sum: number, r: any) => sum + r.valoracion, 0) / reviewsProfesional.length
        : 0;

      // Convertir snake_case a camelCase antes de enviar al frontend
      const reviewsTransformadas = toCamelCase(reviewsProfesional);
      
      return NextResponse.json({
        reviews: reviewsTransformadas,
        estadisticas: {
          totalReviews: reviewsProfesional.length,
          promedioValoracion: parseFloat(promedio.toFixed(1)),
          distribucion
        }
      });
    }

    // Si no hay profesionalId, retornar todas las reviews
    const { data: allReviews, error } = await supabase
      .from('reviews')
      .select('*');

    if (error) {
      console.error('Error al leer reviews:', error);
      return NextResponse.json({ error: 'Error al obtener valoraciones' }, { status: 500 });
    }

    // Convertir snake_case a camelCase antes de enviar al frontend
    const reviewsTransformadas = toCamelCase(allReviews || []);
    return NextResponse.json(reviewsTransformadas);

  } catch (error) {
    console.error('Error al obtener reviews:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
