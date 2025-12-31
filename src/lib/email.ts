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

  nuevoProfesionalRegistrado: (nombre: string, email: string, especialidad: string, telefono: string) => ({
    subject: '🎯 Nuevo Profesional Registrado',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px; }
            .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8b5cf6; }
            .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">⚡ Nuevo Profesional Registrado</h1>
              <p style="margin: 10px 0 0; opacity: 0.9;">Se ha registrado automáticamente</p>
            </div>
            <div class="content">
              <p style="font-size: 18px; margin-bottom: 10px;">Hola <strong>Admin</strong>,</p>
              <p>Un nuevo profesional se ha registrado en la plataforma y ha sido activado automáticamente.</p>
              
              <div class="info-box">
                <p style="margin: 0 0 10px;"><strong>👤 Nombre:</strong> ${nombre}</p>
                <p style="margin: 0 0 10px;"><strong>📧 Email:</strong> ${email}</p>
                <p style="margin: 0 0 10px;"><strong>📞 Teléfono:</strong> ${telefono}</p>
                <p style="margin: 0;"><strong>🔧 Especialidad:</strong> ${especialidad}</p>
              </div>

              <p>El profesional ya está activo y puede recibir cotizaciones. Puedes revisarlo en el panel de administración.</p>
              
              <div class="footer">
                <p>Notificación automática de <strong>Electricistas Chile</strong></p>
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

// ============== NUEVAS FUNCIONES PARA NOTIFICACIONES DE PAGO ==============

interface EmailPaymentConfirmation {
  to: string;
  buyOrder: string;
  amount: number;
  authorizationCode: string;
  cardNumber: string;
  transactionDate: string;
  installments?: number;
  planType?: string;
  planName?: string;
}

interface EmailRefundConfirmation {
  to: string;
  buyOrder: string;
  amount: number;
  authorizationCode: string;
  refundDate: string;
}

export async function sendPaymentConfirmationEmail({
  to,
  buyOrder,
  amount,
  authorizationCode,
  cardNumber,
  transactionDate,
  planName,
}: EmailPaymentConfirmation) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️  RESEND_API_KEY no configurada. Email no enviado.');
    return { success: false, error: 'API key no configurada' };
  }

  try {
    const formattedAmount = new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(amount);

    const formattedDate = new Date(transactionDate).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const { data, error } = await resend.emails.send({
      from: 'Electricistas Chile <onboarding@resend.dev>',
      to: [to],
      subject: `✅ Pago confirmado - ${formattedAmount}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6; }
              .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; }
              .content { padding: 40px; }
              .detail-table { width: 100%; margin: 20px 0; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
              .detail-row { display: flex; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid #e5e7eb; }
              .detail-label { color: #6b7280; font-size: 14px; }
              .detail-value { color: #111827; font-weight: 600; font-size: 14px; }
              .amount { color: #059669; font-size: 18px; font-weight: bold; }
              .button { display: inline-block; background: #3b82f6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
              .footer { background: #f9fafb; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; }
              .alert { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 20px 0; border-radius: 4px; color: #92400e; }
              .plan-badge { background: #dbeafe; border-left: 4px solid #3b82f6; padding: 16px; margin: 20px 0; border-radius: 4px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 28px;">✅ Pago Confirmado</h1>
              </div>
              
              <div class="content">
                <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px;">
                  ¡Hola! Tu pago ha sido procesado exitosamente.
                </p>
                
                ${planName ? `
                  <div class="plan-badge">
                    <p style="margin: 0; color: #1e40af; font-weight: 600;">🎉 ¡Bienvenido a ${planName}!</p>
                  </div>
                ` : ''}
                
                <h2 style="color: #111827; font-size: 18px; margin: 30px 0 15px 0;">Detalles de la Transacción</h2>
                
                <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                  <div style="display: table; width: 100%;">
                    <div style="display: table-row; background: #f9fafb;">
                      <div style="display: table-cell; padding: 12px 16px; color: #6b7280; font-size: 14px; border-bottom: 1px solid #e5e7eb;">Orden de Compra:</div>
                      <div style="display: table-cell; padding: 12px 16px; color: #111827; font-weight: 600; font-size: 14px; text-align: right; border-bottom: 1px solid #e5e7eb;">${buyOrder}</div>
                    </div>
                    <div style="display: table-row;">
                      <div style="display: table-cell; padding: 12px 16px; color: #6b7280; font-size: 14px; border-bottom: 1px solid #e5e7eb;">Monto:</div>
                      <div class="amount" style="display: table-cell; padding: 12px 16px; text-align: right; border-bottom: 1px solid #e5e7eb;">${formattedAmount}</div>
                    </div>
                    <div style="display: table-row; background: #f9fafb;">
                      <div style="display: table-cell; padding: 12px 16px; color: #6b7280; font-size: 14px; border-bottom: 1px solid #e5e7eb;">Código de Autorización:</div>
                      <div style="display: table-cell; padding: 12px 16px; color: #111827; font-weight: 600; font-size: 14px; text-align: right; font-family: monospace; border-bottom: 1px solid #e5e7eb;">${authorizationCode}</div>
                    </div>
                    <div style="display: table-row;">
                      <div style="display: table-cell; padding: 12px 16px; color: #6b7280; font-size: 14px; border-bottom: 1px solid #e5e7eb;">Tarjeta:</div>
                      <div style="display: table-cell; padding: 12px 16px; color: #111827; font-weight: 600; font-size: 14px; text-align: right; font-family: monospace; border-bottom: 1px solid #e5e7eb;">**** **** **** ${cardNumber}</div>
                    </div>
                    <div style="display: table-row; background: #f9fafb;">
                      <div style="display: table-cell; padding: 12px 16px; color: #6b7280; font-size: 14px;">Fecha:</div>
                      <div style="display: table-cell; padding: 12px 16px; color: #111827; font-weight: 600; font-size: 14px; text-align: right;">${formattedDate}</div>
                    </div>
                  </div>
                </div>
                
                <div class="alert">
                  <p style="margin: 0; font-size: 14px;">
                    💡 <strong>Importante:</strong> Guarda este correo como comprobante de tu transacción.
                  </p>
                </div>
                
                <div style="text-align: center;">
                  <a href="https://www.electricistaschile.com/clientes/pedidos" class="button">
                    Ver Mis Transacciones
                  </a>
                </div>
              </div>
              
              <div class="footer">
                <p style="margin: 0 0 10px 0;">
                  © ${new Date().getFullYear()} Electricistas Chile. Todos los derechos reservados.
                </p>
                <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                  Portal de Construcción y Reparaciones Profesionales
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error al enviar email de confirmación:', error);
      return { success: false, error };
    }

    console.log('✅ Email de confirmación enviado:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Excepción al enviar email:', error);
    return { success: false, error };
  }
}

export async function sendRefundConfirmationEmail({
  to,
  buyOrder,
  amount,
  authorizationCode,
  refundDate,
}: EmailRefundConfirmation) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️  RESEND_API_KEY no configurada. Email no enviado.');
    return { success: false, error: 'API key no configurada' };
  }

  try {
    const formattedAmount = new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(amount);

    const formattedDate = new Date(refundDate).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const { data, error } = await resend.emails.send({
      from: 'Electricistas Chile <onboarding@resend.dev>',
      to: [to],
      subject: `💰 Reembolso procesado - ${formattedAmount}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6; }
              .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
              .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px; text-align: center; }
              .content { padding: 40px; }
              .amount { color: #059669; font-size: 18px; font-weight: bold; }
              .footer { background: #f9fafb; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; }
              .info-box { background: #dbeafe; border-left: 4px solid #3b82f6; padding: 16px; margin: 20px 0; border-radius: 4px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 28px;">💰 Reembolso Procesado</h1>
              </div>
              
              <div class="content">
                <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px;">
                  Tu solicitud de reembolso ha sido procesada exitosamente.
                </p>
                
                <h2 style="color: #111827; font-size: 18px; margin: 30px 0 15px 0;">Detalles del Reembolso</h2>
                
                <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                  <div style="display: table; width: 100%;">
                    <div style="display: table-row; background: #f9fafb;">
                      <div style="display: table-cell; padding: 12px 16px; color: #6b7280; font-size: 14px; border-bottom: 1px solid #e5e7eb;">Orden de Compra:</div>
                      <div style="display: table-cell; padding: 12px 16px; color: #111827; font-weight: 600; font-size: 14px; text-align: right; border-bottom: 1px solid #e5e7eb;">${buyOrder}</div>
                    </div>
                    <div style="display: table-row;">
                      <div style="display: table-cell; padding: 12px 16px; color: #6b7280; font-size: 14px; border-bottom: 1px solid #e5e7eb;">Monto Reembolsado:</div>
                      <div class="amount" style="display: table-cell; padding: 12px 16px; text-align: right; border-bottom: 1px solid #e5e7eb;">${formattedAmount}</div>
                    </div>
                    <div style="display: table-row; background: #f9fafb;">
                      <div style="display: table-cell; padding: 12px 16px; color: #6b7280; font-size: 14px; border-bottom: 1px solid #e5e7eb;">Código de Autorización:</div>
                      <div style="display: table-cell; padding: 12px 16px; color: #111827; font-weight: 600; font-size: 14px; text-align: right; font-family: monospace; border-bottom: 1px solid #e5e7eb;">${authorizationCode}</div>
                    </div>
                    <div style="display: table-row;">
                      <div style="display: table-cell; padding: 12px 16px; color: #6b7280; font-size: 14px;">Fecha:</div>
                      <div style="display: table-cell; padding: 12px 16px; color: #111827; font-weight: 600; font-size: 14px; text-align: right;">${formattedDate}</div>
                    </div>
                  </div>
                </div>
                
                <div class="info-box">
                  <p style="margin: 0 0 10px 0; color: #1e40af; font-weight: 600;">⏱️ Tiempo de Procesamiento</p>
                  <p style="margin: 0; color: #1e40af; font-size: 14px;">
                    El dinero será devuelto a tu tarjeta en un plazo de <strong>5 a 10 días hábiles</strong>, dependiendo de tu banco.
                  </p>
                </div>
              </div>
              
              <div class="footer">
                <p style="margin: 0 0 10px 0;">
                  © ${new Date().getFullYear()} Electricistas Chile. Todos los derechos reservados.
                </p>
                <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                  Portal de Construcción y Reparaciones Profesionales
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error al enviar email de reembolso:', error);
      return { success: false, error };
    }

    console.log('✅ Email de reembolso enviado:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Excepción al enviar email:', error);
    return { success: false, error };
  }
}

