import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { cotizacionId, respuestaId } = await request.json();

    if (!cotizacionId || !respuestaId) {
      return NextResponse.json(
        { error: 'Faltan parámetros' },
        { status: 400 }
      );
    }

    // Obtener cotización
    const { data: cotizacion, error: errorCotizacion } = await supabase
      .from('cotizaciones')
      .select('*')
      .eq('id', cotizacionId)
      .single();

    if (errorCotizacion || !cotizacion) {
      return NextResponse.json(
        { error: 'Cotización no encontrada' },
        { status: 404 }
      );
    }

    // Encontrar respuesta
    const respuesta = cotizacion.respuestas?.find((r: any) => r.id === respuestaId);
    if (!respuesta) {
      return NextResponse.json(
        { error: 'Respuesta no encontrada' },
        { status: 404 }
      );
    }

    // Actualizar todas las respuestas: marcar como aceptada la seleccionada, rechazar las demás
    const respuestasActualizadas = cotizacion.respuestas.map((r: any) => ({
      ...r,
      estado: r.id === respuestaId ? 'aceptada' : 'rechazada'
    }));

    // Actualizar cotización con nuevo estado y respuestas actualizadas
    const { error: errorUpdate } = await supabase
      .from('cotizaciones')
      .update({ 
        estado: 'aprobada',
        respuestas: respuestasActualizadas
      })
      .eq('id', cotizacionId);

    if (errorUpdate) {
      console.error('Error al actualizar cotización:', errorUpdate);
      return NextResponse.json({ error: 'Error al aceptar respuesta' }, { status: 500 });
    }

    // Generar enlace de WhatsApp para notificar al profesional
    const telefono = respuesta.profesional.telefono.replace(/\D/g, '');
    const mensaje = `🎉 *¡FELICITACIONES!*

Tu propuesta ha sido *ACEPTADA* por el cliente.

📋 *Cotización:* ${cotizacionId}
👤 *Cliente:* ${cotizacion.cliente.nombre}
📞 *Teléfono:* ${cotizacion.cliente.telefono}
📧 *Email:* ${cotizacion.cliente.email}

💰 *Presupuesto Aceptado:* $${respuesta.presupuesto.monto.toLocaleString('es-CL')}

📍 *Servicio:* ${cotizacion.servicio.tipo.replace(/-/g, ' ')}
📝 *Descripción:* ${cotizacion.servicio.descripcion}

⏱ *Tiempo estimado:* ${respuesta.presupuesto.tiempoEstimado}
📅 *Validez:* ${respuesta.presupuesto.validezOferta}

✅ *Próximos pasos:*
1. Contacta al cliente lo antes posible
2. Confirma fecha de inicio
3. Coordina detalles del trabajo

¡Mucho éxito con el proyecto! 🚀`;

    const whatsappUrl = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

    return NextResponse.json({
      success: true,
      mensaje: 'Propuesta aceptada exitosamente',
      whatsappUrl,
      profesional: respuesta.profesional
    });

  } catch (error) {
    console.error('Error al aceptar respuesta:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
