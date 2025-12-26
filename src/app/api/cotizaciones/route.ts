import { NextResponse } from 'next/server';
import { SolicitudCotizacion, Cotizacion } from '@/types/cotizacion';
import { calcularPresupuestoEstimado } from '@/lib/calculadora-precios';
import { enviarEmail, emailTemplates } from '@/lib/email';
import fs from 'fs/promises';
import path from 'path';

const COTIZACIONES_FILE = path.join(process.cwd(), 'data', 'cotizaciones.json');
const PROFESIONALES_FILE = path.join(process.cwd(), 'data', 'profesionales.json');

// Asegurar que existe el directorio data
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Leer cotizaciones del archivo
async function leerCotizaciones(): Promise<Cotizacion[]> {
  try {
    const data = await fs.readFile(COTIZACIONES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Guardar cotizaciones
async function guardarCotizaciones(cotizaciones: Cotizacion[]) {
  await ensureDataDir();
  await fs.writeFile(COTIZACIONES_FILE, JSON.stringify(cotizaciones, null, 2));
}

// POST - Crear nueva cotización
export async function POST(request: Request) {
  try {
    const solicitud: SolicitudCotizacion = await request.json();
    
    // Validar datos requeridos
    if (!solicitud.cliente.nombre || !solicitud.cliente.email || !solicitud.cliente.telefono) {
      return NextResponse.json(
        { error: 'Faltan datos del cliente' },
        { status: 400 }
      );
    }
    
    if (!solicitud.servicio.tipo || !solicitud.servicio.descripcion) {
      return NextResponse.json(
        { error: 'Faltan datos del servicio' },
        { status: 400 }
      );
    }
    
    // Verificar límite de cotizaciones según el plan del cliente
    if (solicitud.cliente.email) {
      const cotizaciones = await leerCotizaciones();
      const inicioMes = new Date();
      inicioMes.setDate(1);
      inicioMes.setHours(0, 0, 0, 0);
      
      const cotizacionesEsteMes = cotizaciones.filter(c => 
        c.cliente.email === solicitud.cliente.email &&
        new Date(c.fecha) >= inicioMes
      );
      
      // Límites por plan
      const limitesPlan: Record<string, number> = {
        'cliente-basico': 2,
        'cliente-premium': 6,
        'cliente-empresa': 999999 // ilimitado
      };
      
      const planCliente = solicitud.cliente.plan || 'cliente-basico';
      const limite = limitesPlan[planCliente] || 2;
      
      if (cotizacionesEsteMes.length >= limite) {
        return NextResponse.json(
          { 
            error: 'Límite de cotizaciones alcanzado',
            mensaje: `Has alcanzado el límite de ${limite} cotizaciones mensuales de tu plan ${planCliente.replace('cliente-', '').toUpperCase()}. Actualiza tu plan para solicitar más cotizaciones.`,
            limite,
            usadas: cotizacionesEsteMes.length
          },
          { status: 403 }
        );
      }
    }
    
    // Calcular presupuesto estimado
    const presupuestoEstimado = calcularPresupuestoEstimado({
      tipo: solicitud.servicio.tipo,
      urgencia: solicitud.servicio.urgencia,
      metrosCuadrados: solicitud.servicio.metrosCuadrados,
      puntosDeLuz: solicitud.servicio.puntosDeLuz,
    });
    
    // Crear cotización
    const nuevaCotizacion: Cotizacion = {
      id: `COT-${Date.now()}`,
      fecha: new Date().toISOString(),
      cliente: solicitud.cliente,
      servicio: solicitud.servicio,
      presupuesto: {
        estimadoAutomatico: presupuestoEstimado,
      },
      estado: 'pendiente',
    };
    
    // Guardar en archivo
    const cotizaciones = await leerCotizaciones();
    cotizaciones.unshift(nuevaCotizacion);
    await guardarCotizaciones(cotizaciones);
    
    // Enviar email de notificación
    try {
      const tiposServicio: Record<string, string> = {
        'instalacion-electrica': 'Instalación Eléctrica',
        'reparacion-emergencia': 'Reparación de Emergencia',
        'proyecto-construccion': 'Proyecto de Construcción',
        'iluminacion': 'Iluminación',
        'panel-solar': 'Panel Solar',
        'automatizacion': 'Automatización',
        'certificacion': 'Certificación'
      };

      await resend.emails.send({
        from: 'Cotizaciones ELIENI <onboarding@resend.dev>',
        to: process.env.EMAIL_TO || 'yfuelaluz@gmail.com',
        subject: `🔔 Nueva Cotización: ${nuevaCotizacion.id}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3b82f6;">Nueva Solicitud de Cotización</h2>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #1f2937;">📋 Información del Cliente</h3>
              <p><strong>Nombre:</strong> ${nuevaCotizacion.cliente.nombre}</p>
              <p><strong>Email:</strong> <a href="mailto:${nuevaCotizacion.cliente.email}">${nuevaCotizacion.cliente.email}</a></p>
              <p><strong>Teléfono:</strong> <a href="tel:${nuevaCotizacion.cliente.telefono}">${nuevaCotizacion.cliente.telefono}</a></p>
              <p><strong>WhatsApp:</strong> <a href="https://wa.me/56${nuevaCotizacion.cliente.telefono.replace(/\D/g, '')}" target="_blank">Contactar por WhatsApp</a></p>
              ${nuevaCotizacion.cliente.direccion ? `<p><strong>Dirección:</strong> ${nuevaCotizacion.cliente.direccion}</p>` : ''}
            </div>
            
            <div style="background: #e0f2fe; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #0c4a6e;">⚡ Detalles del Servicio</h3>
              <p><strong>Tipo:</strong> ${tiposServicio[nuevaCotizacion.servicio.tipo] || nuevaCotizacion.servicio.tipo}</p>
              <p><strong>Urgencia:</strong> <span style="text-transform: uppercase; color: ${nuevaCotizacion.servicio.urgencia === 'emergencia' ? '#dc2626' : nuevaCotizacion.servicio.urgencia === 'urgente' ? '#ea580c' : '#059669'}; font-weight: bold;">${nuevaCotizacion.servicio.urgencia}</span></p>
              <p><strong>Descripción:</strong> ${nuevaCotizacion.servicio.descripcion}</p>
              ${nuevaCotizacion.servicio.puntosDeLuz ? `<p><strong>Puntos de Luz:</strong> ${nuevaCotizacion.servicio.puntosDeLuz}</p>` : ''}
              ${nuevaCotizacion.servicio.metrosCuadrados ? `<p><strong>Metros Cuadrados:</strong> ${nuevaCotizacion.servicio.metrosCuadrados} m²</p>` : ''}
            </div>
            
            <div style="background: linear-gradient(135deg, #3b82f6, #a855f7); color: white; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
              <h3 style="margin-top: 0;">💰 Presupuesto Estimado</h3>
              <p style="font-size: 32px; font-weight: bold; margin: 10px 0;">${new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(presupuestoEstimado)}</p>
              <p style="font-size: 12px; opacity: 0.9; margin: 0;">*Precio referencial automático</p>
            </div>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 10px; border-left: 4px solid #f59e0b;">
              <p style="margin: 0;"><strong>⏰ Fecha de solicitud:</strong> ${new Date(nuevaCotizacion.fecha).toLocaleString('es-CL')}</p>
              <p style="margin: 10px 0 0 0;"><strong>🆔 ID:</strong> ${nuevaCotizacion.id}</p>
            </div>
            
            <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
              Este es un email automático generado por el sistema de cotizaciones de Ingeniería y Construcciones ELIENI spa.
            </p>
          </div>
        `
      });
      
      console.log('📧 Email de notificación enviado para:', nuevaCotizacion.id);
    } catch (emailError) {
      console.error('❌ Error al enviar email:', emailError);
      // No fallar la cotización si el email falla
    }
    
    return NextResponse.json(nuevaCotizacion, { status: 201 });
    
  } catch (error) {
    console.error('Error al crear cotización:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}

// GET - Listar cotizaciones (para admin)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const estado = searchParams.get('estado');
    
    let cotizaciones = await leerCotizaciones();
    
    // Filtrar por estado si se especifica
    if (estado) {
      cotizaciones = cotizaciones.filter(c => c.estado === estado);
    }
    
    return NextResponse.json(cotizaciones);
    
  } catch (error) {
    console.error('Error al leer cotizaciones:', error);
    return NextResponse.json(
      { error: 'Error al obtener cotizaciones' },
      { status: 500 }
    );
  }
}
