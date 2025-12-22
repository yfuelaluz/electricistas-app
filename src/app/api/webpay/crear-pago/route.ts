import { NextRequest, NextResponse } from 'next/server';
import { WebpayPlus, Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } from 'transbank-sdk';

// Configuración de Webpay Plus
const commerceCode = process.env.WEBPAY_COMMERCE_CODE || IntegrationCommerceCodes.WEBPAY_PLUS;
const apiKey = process.env.WEBPAY_API_KEY || IntegrationApiKeys.WEBPAY;
const ambiente = process.env.WEBPAY_AMBIENTE || 'integracion';

// Configurar opciones
const options = new Options(commerceCode, apiKey, ambiente === 'produccion' ? Environment.Production : Environment.Integration);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const plan = searchParams.get('plan') || 'plan-desconocido';
    const monto = searchParams.get('monto') || '0';
    const descripcion = searchParams.get('descripcion') || 'Suscripción';

    // Generar identificadores únicos (máximo 26 caracteres para buyOrder)
    const timestamp = Date.now().toString().slice(-10); // Últimos 10 dígitos
    const random = Math.random().toString(36).substr(2, 4); // 4 caracteres aleatorios
    
    // Códigos cortos para planes (máximo 5 chars)
    let planCode = 'OTR';
    if (plan.includes('profesional-starter')) planCode = 'PRO-S';
    else if (plan.includes('profesional-pro')) planCode = 'PRO-P';
    else if (plan.includes('profesional-elite')) planCode = 'PRO-E';
    else if (plan.includes('cliente')) planCode = 'CLI';
    
    const buyOrder = `${planCode}-${timestamp}-${random}`; // Max: 5+1+10+1+4 = 21 chars
    const sessionId = `SES-${timestamp}`;
    const amount = parseInt(monto);

    // URL de retorno después del pago - detectar el host de la solicitud
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') || host.includes('192.168') ? 'http' : 'https';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;
    const returnUrl = `${baseUrl}/api/webpay/confirmar`;

    console.log('🌐 HOST DETECTADO:', host);
    console.log('📍 URL DE RETORNO:', returnUrl);

    console.log('Creando transacción Webpay:', {
      buyOrder,
      sessionId,
      amount,
      returnUrl,
      plan,
      descripcion
    });

    // Crear transacción con Webpay Plus
    const tx = new WebpayPlus.Transaction(options);
    const response = await tx.create(buyOrder, sessionId, amount, returnUrl);

    console.log('Transacción creada exitosamente:', response);

    // Retornar URL y token para redirección
    return NextResponse.json({
      success: true,
      url: response.url,
      token: response.token,
      buyOrder,
      sessionId,
      amount,
      plan,
      descripcion
    });

  } catch (error) {
    console.error('Error al crear transacción Webpay:', error);
    return NextResponse.json(
      { 
        error: 'Error al procesar el pago', 
        details: error instanceof Error ? error.message : 'Error desconocido' 
      },
      { status: 500 }
    );
  }
}
