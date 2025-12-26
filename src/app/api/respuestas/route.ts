import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const cotizacionesPath = path.join(process.cwd(), 'data', 'cotizaciones.json');

// POST - Agregar respuesta de profesional a una cotizacion
export async function POST(req: NextRequest) {
  try {
    const respuesta = await req.json();
    
    // Leer cotizaciones
    const data = fs.readFileSync(cotizacionesPath, 'utf-8');
    const cotizaciones = JSON.parse(data);
    
    // Encontrar la cotización
    const indice = cotizaciones.findIndex((c: any) => c.id === respuesta.cotizacionId);
    if (indice === -1) {
      return NextResponse.json({ error: 'Cotización no encontrada' }, { status: 404 });
    }
    
    // Inicializar array de respuestas si no existe
    if (!cotizaciones[indice].respuestas) {
      cotizaciones[indice].respuestas = [];
    }
    
    // Crear la respuesta con ID único
    const nuevaRespuesta = {
      ...respuesta,
      id: `RESP-${Date.now()}`,
      fecha: new Date().toISOString(),
      estado: 'enviada'
    };
    
    // Agregar respuesta
    cotizaciones[indice].respuestas.push(nuevaRespuesta);
    
    // Cambiar estado de la cotización a 'respondida'
    cotizaciones[indice].estado = 'respondida';
    
    // Guardar
    fs.writeFileSync(cotizacionesPath, JSON.stringify(cotizaciones, null, 2));
    
    // Enviar notificación al cliente vía WhatsApp
    const cotizacion = cotizaciones[indice];
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
    const { searchParams } = new URL(req.url);
    const cotizacionId = searchParams.get('cotizacionId');
    
    const data = fs.readFileSync(cotizacionesPath, 'utf-8');
    const cotizaciones = JSON.parse(data);
    
    if (cotizacionId) {
      const cotizacion = cotizaciones.find((c: any) => c.id === cotizacionId);
      if (!cotizacion) {
        return NextResponse.json({ error: 'Cotización no encontrada' }, { status: 404 });
      }
      return NextResponse.json(cotizacion.respuestas || []);
    }
    
    // Retornar todas las cotizaciones con sus respuestas
    return NextResponse.json(cotizaciones);
  } catch (error) {
    console.error('Error al obtener respuestas:', error);
    return NextResponse.json({ error: 'Error al obtener respuestas' }, { status: 500 });
  }
}
