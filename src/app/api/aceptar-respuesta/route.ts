import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const COTIZACIONES_FILE = path.join(process.cwd(), 'data', 'cotizaciones.json');

export async function POST(request: Request) {
  try {
    const { cotizacionId, respuestaId } = await request.json();

    if (!cotizacionId || !respuestaId) {
      return NextResponse.json(
        { error: 'Faltan parámetros' },
        { status: 400 }
      );
    }

    // Leer cotizaciones
    const data = await fs.readFile(COTIZACIONES_FILE, 'utf-8');
    const cotizaciones = JSON.parse(data);

    // Encontrar cotización
    const cotizacionIndex = cotizaciones.findIndex((c: any) => c.id === cotizacionId);
    if (cotizacionIndex === -1) {
      return NextResponse.json(
        { error: 'Cotización no encontrada' },
        { status: 404 }
      );
    }

    const cotizacion = cotizaciones[cotizacionIndex];

    // Encontrar respuesta
    const respuesta = cotizacion.respuestas?.find((r: any) => r.id === respuestaId);
    if (!respuesta) {
      return NextResponse.json(
        { error: 'Respuesta no encontrada' },
        { status: 404 }
      );
    }

    // Actualizar estado de la cotización
    cotizaciones[cotizacionIndex].estado = 'aprobada';

    // Marcar respuesta como aceptada
    cotizacion.respuestas = cotizacion.respuestas.map((r: any) => ({
      ...r,
      estado: r.id === respuestaId ? 'aceptada' : 'rechazada'
    }));

    // Guardar cambios
    await fs.writeFile(COTIZACIONES_FILE, JSON.stringify(cotizaciones, null, 2));

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
