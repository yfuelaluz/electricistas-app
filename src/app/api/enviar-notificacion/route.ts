import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const datos = await request.json();
    
    // Aquí puedes integrar un servicio de email como Resend, SendGrid, etc.
    // Por ahora, solo registramos en consola
    console.log('📧 Nueva visita técnica solicitada:', datos);
    
    // Ejemplo de email HTML que se enviaría
    const emailHTML = `
      <h2>🔧 Nueva Visita Técnica Solicitada</h2>
      <p><strong>Nombre:</strong> ${datos.nombre}</p>
      <p><strong>Teléfono:</strong> ${datos.telefono}</p>
      <p><strong>Dirección:</strong> ${datos.direccion}</p>
      <p><strong>Servicio:</strong> ${datos.servicio}</p>
      <p><strong>Fecha:</strong> ${new Date(datos.fecha).toLocaleDateString('es-ES')}</p>
      <p><strong>Valor:</strong> $60.000</p>
    `;
    
    // TODO: Implementar servicio de email real (Resend, SendGrid, etc.)
    // Ejemplo con Resend (requiere npm install resend):
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'notificaciones@tudominio.com',
    //   to: 'yfuelaluz@gmail.com',
    //   subject: '🔧 Nueva Visita Técnica Solicitada',
    //   html: emailHTML
    // });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Notificación procesada (WhatsApp enviado, email pendiente de configuración)' 
    });
  } catch (error) {
    console.error('Error en notificación:', error);
    return NextResponse.json({ success: false, error: 'Error al enviar notificación' }, { status: 500 });
  }
}
