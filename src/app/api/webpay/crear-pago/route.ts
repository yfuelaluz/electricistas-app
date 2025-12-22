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
    const random = Math.random().toString(36).substr(2, 6); // 6 caracteres aleatorios
    const buyOrder = `ORD-${timestamp}-${random}`; // Formato: ORD-1234567890-abc123 (máx 24 chars)
    const sessionId = `SES-${timestamp}`;
    const amount = parseInt(monto);

    // URL de retorno después del pago
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const returnUrl = `${baseUrl}/api/webpay/confirmar`;

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
