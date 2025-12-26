import { Resend } from 'resend';

// Inicializar Resend con tu API key
// Para obtener tu API key, regístrate en https://resend.com
const resend = new Resend(process.env.RESEND_API_KEY || '');

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function enviarEmail({ to, subject, html }: EmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️  RESEND_API_KEY no configurada. Email no enviado.');
    return { success: false, error: 'API key no configurada' };
  }

  try {
    const data = await resend.emails.send({
      from: 'Electricistas App <onboarding@resend.dev>', // Cambiar cuando tengas dominio verificado
      to,
      subject,
      html,
    });

    console.log('✅ Email enviado:', data);
    return { success: true, data };
  } catch (error: any) {
    console.error('❌ Error al enviar email:', error);
    return { success: false, error: error.message };
  }
}

// Templates de emails
export const emailTemplates = {
  nuevaCotizacion: (profesional: string, nombreCliente: string, servicio: string) => ({
    subject: '🔔 Nueva solicitud de cotización',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px; }
            .button { display: inline-block; background: #3b82f6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px; }
            .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
            .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">⚡ Nueva Oportunidad</h1>
              <p style="margin: 10px 0 0; opacity: 0.9;">Tienes una nueva solicitud de cotización</p>
            </div>
            <div class="content">
              <p style="font-size: 18px; margin-bottom: 10px;">Hola <strong>${profesional}</strong>,</p>
              <p>Tienes una nueva solicitud de cotización en tu bandeja.</p>
              
              <div class="info-box">
                <p style="margin: 0 0 10px;"><strong>📋 Servicio solicitado:</strong></p>
                <p style="margin: 0; font-size: 16px; color: #475569;">${servicio}</p>
                <p style="margin: 15px 0 0;"><strong>👤 Cliente:</strong> ${nombreCliente}</p>
              </div>

              <p>Responde rápido para aumentar tus posibilidades de conseguir el trabajo.</p>
              
              <a href="http://192.168.1.17:3000/profesionales/dashboard" class="button">
                Ver Cotización →
              </a>

              <div class="footer">
                <p>Este email fue enviado automáticamente por <strong>Electricistas App</strong></p>
                <p style="font-size: 12px; margin-top: 10px;">Si no solicitaste este email, puedes ignorarlo.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  cotizacionAceptada: (profesional: string, nombreCliente: string, monto: number) => ({
    subject: '🎉 ¡Cotización aceptada!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px; }
            .button { display: inline-block; background: #22c55e; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px; }
            .price { font-size: 32px; font-weight: 800; color: #16a34a; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">🎉 ¡Felicitaciones!</h1>
              <p style="margin: 10px 0 0; opacity: 0.9;">Tu cotización fue aceptada</p>
            </div>
            <div class="content">
              <p style="font-size: 18px; margin-bottom: 10px;">Hola <strong>${profesional}</strong>,</p>
              <p>Excelentes noticias: <strong>${nombreCliente}</strong> ha aceptado tu cotización.</p>
              
              <div class="price">
                ${new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(monto)}
              </div>

              <p>El cliente se pondrá en contacto contigo pronto para coordinar los detalles del trabajo.</p>
              
              <a href="http://192.168.1.17:3000/profesionales/dashboard" class="button">
                Ver Detalles →
              </a>

              <div class="footer">
                <p>Este email fue enviado automáticamente por <strong>Electricistas App</strong></p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
};
