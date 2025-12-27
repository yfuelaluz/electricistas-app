import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
}

// POST - Agregar respuesta de profesional a una cotización
export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const respuesta = await req.json();
    
    // Obtener la cotización
    const { data: cotizacion, error: errorCotizacion } = await supabase
      .from('cotizaciones')
      .select('*')
      .eq('id', respuesta.cotizacionId)
      .single();
    
    if (errorCotizacion || !cotizacion) {
      return NextResponse.json({ error: 'Cotización no encontrada' }, { status: 404 });
    }
    
    // Crear la respuesta
    const nuevaRespuesta = {
      id: `RESP-${Date.now()}`,
      cotizacionId: respuesta.cotizacionId,
      profesionalId: respuesta.profesionalId,
      profesional: respuesta.profesional,
      presupuesto: respuesta.presupuesto,
      fecha: new Date().toISOString(),
      estado: 'enviada'
    };
    
    // Actualizar cotización: agregar respuesta y cambiar estado
    const respuestasActualizadas = [...(cotizacion.respuestas || []), nuevaRespuesta];
    
    const { error: errorUpdate } = await supabase
      .from('cotizaciones')
      .update({ 
        respuestas: respuestasActualizadas,
        estado: 'respondida'
      })
      .eq('id', respuesta.cotizacionId);
    
    if (errorUpdate) {
      console.error('Error al actualizar cotización:', errorUpdate);
      return NextResponse.json({ error: 'Error al guardar respuesta' }, { status: 500 });
    }
    
    // Enviar notificación al cliente vía WhatsApp
    const mensaje = `🔔 *NUEVA RESPUESTA A TU COTIZACIÓN*%0A%0A` +
      `📋 *Cotización:* ${cotizacion.id}%0A` +
      `👷 *Profesional:* ${respuesta.profesional.nombre}%0A` +
      `⭐ *Especialidad:* ${respuesta.profesional.especialidad}%0A` +
      `💰 *Presupuesto:* $${respuesta.presupuesto.monto.toLocaleString('es-CL')}%0A` +
      `⏱ *Tiempo estimado:* ${respuesta.presupuesto.tiempoEstimado}%0A` +
      `📝 *Detalles:* ${respuesta.presupuesto.detalles}%0A%0A` +
      `Ingresa a tu panel de cliente para ver todos los detalles.`;
    
    return NextResponse.json({ 
      success: true, 
      respuesta: nuevaRespuesta,
      mensaje: 'Respuesta enviada exitosamente',
      whatsappLink: `https://wa.me/${cotizacion.cliente.telefono.replace(/\D/g, '')}?text=${mensaje}`
    });
  } catch (error) {
    console.error('Error al crear respuesta:', error);
    return NextResponse.json({ error: 'Error al crear respuesta' }, { status: 500 });
  }
}

// GET - Obtener respuestas de una cotización específica
export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = new URL(req.url);
    const cotizacionId = searchParams.get('cotizacionId');
    
    if (cotizacionId) {
      const { data: cotizacion, error } = await supabase
        .from('cotizaciones')
        .select('*')
        .eq('id', cotizacionId)
        .single();
      
      if (error || !cotizacion) {
        return NextResponse.json({ error: 'Cotización no encontrada' }, { status: 404 });
      }
      return NextResponse.json(cotizacion.respuestas || []);
    }
    
    // Si no hay cotizacionId, retornar todas las cotizaciones con respuestas
    const { data: cotizaciones, error } = await supabase
      .from('cotizaciones')
      .select('*');
    
    if (error) {
      console.error('Error al leer cotizaciones:', error);
      return NextResponse.json({ error: 'Error al leer respuestas' }, { status: 500 });
    }
    
    return NextResponse.json(cotizaciones || []);
  } catch (error) {
    console.error('Error al obtener respuestas:', error);
    return NextResponse.json({ error: 'Error al obtener respuestas' }, { status: 500 });
  }
}
