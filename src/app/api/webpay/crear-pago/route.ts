import { NextRequest, NextResponse } from 'next/server';
import { WebpayPlus, Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } from 'transbank-sdk';

// Configuración de Webpay Plus
const commerceCode = process.env.WEBPAY_COMMERCE_CODE || IntegrationCommerceCodes.WEBPAY_PLUS;
const apiKey = process.env.WEBPAY_API_KEY || IntegrationApiKeys.WEBPAY;
const ambiente = process.env.WEBPAY_AMBIENTE || 'integracion';

// Configurar opciones
const options = new Options(commerceCode, apiKey, ambiente === 'produccion' ? Environment.Production : Environment.Integration);

// Tabla de planes permitidos y montos (solo se usan estos valores)
const PLANES: Record<string, { amount: number; descripcion: string; code: string }> = {
  'cliente-basico': { amount: 0, descripcion: 'Plan Básico Cliente', code: 'CLI-B' },
  'cliente-premium': { amount: 14990, descripcion: 'Plan Premium Cliente', code: 'CLI-P' },
  'cliente-empresa': { amount: 29990, descripcion: 'Plan Empresa Cliente', code: 'CLI-E' },
  'profesional-starter': { amount: 14990, descripcion: 'Plan Starter Profesional', code: 'PRO-S' },
  'profesional-pro': { amount: 29990, descripcion: 'Plan Pro Profesional', code: 'PRO-P' },
  'profesional-elite': { amount: 59990, descripcion: 'Plan Elite Profesional', code: 'PRO-E' }
};

const getBaseUrl = (request: NextRequest) => {
  const host = request.headers.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') || host.includes('192.168') ? 'http' : 'https';
  return process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;
};

export async function GET(request: NextRequest) {
  try {
    // Para testing: permitir pasar parámetros por URL
    const { searchParams } = new URL(request.url);
    const monto = searchParams.get('monto');
    const descripcion = searchParams.get('descripcion') || 'Pago de prueba';
    const plan = searchParams.get('plan') || 'test';

    // Si es test, usar monto y descripción custom
    if (plan === 'test') {
      if (!monto || isNaN(Number(monto)) || Number(monto) < 50) {
        return NextResponse.json({ error: 'Monto inválido (mínimo $50)' }, { status: 400 });
      }

      const timestamp = Date.now().toString().slice(-10);
      const random = Math.random().toString(36).substr(2, 4);
      const buyOrder = `TEST-${timestamp}-${random}`;
      const sessionId = `SES-${timestamp}`;
      const amount = Number(monto);
      const returnUrl = `${getBaseUrl(request)}/api/webpay/confirmar`;

      const tx = new WebpayPlus.Transaction(options);
      const response = await tx.create(buyOrder, sessionId, amount, returnUrl);

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
    }

    // Para planes regulares, usar la configuración de PLANES
    if (!PLANES[plan]) {
      return NextResponse.json({ error: 'Plan inválido' }, { status: 400 });
    }

    const planInfo = PLANES[plan];

    // Plan gratuito: no requiere Webpay
    if (planInfo.amount === 0) {
      return NextResponse.json({
        success: true,
        free: true,
        plan,
        descripcion: planInfo.descripcion
      });
    }

    const timestamp = Date.now().toString().slice(-10);
    const random = Math.random().toString(36).substr(2, 4);
    const buyOrder = `${planInfo.code}-${timestamp}-${random}`;
    const sessionId = `SES-${timestamp}`;
    const amount = planInfo.amount;
    const returnUrlPlan = `${getBaseUrl(request)}/api/webpay/confirmar`;

    const tx = new WebpayPlus.Transaction(options);
    const response = await tx.create(buyOrder, sessionId, amount, returnUrlPlan);

    return NextResponse.json({
      success: true,
      url: response.url,
      token: response.token,
      buyOrder,
      sessionId,
      amount,
      plan,
      descripcion: planInfo.descripcion
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const plan = body?.plan as string | undefined;
    const email = body?.email as string | undefined;

    if (!plan || !PLANES[plan]) {
      return NextResponse.json({ error: 'Plan inválido' }, { status: 400 });
    }

    const planInfo = PLANES[plan];

    // Plan gratuito: no requiere Webpay
    if (planInfo.amount === 0) {
      return NextResponse.json({
        success: true,
        free: true,
        plan,
        descripcion: planInfo.descripcion
      });
    }

    // Generar identificadores únicos (máximo 26 caracteres para buyOrder)
    const timestamp = Date.now().toString().slice(-10); // Últimos 10 dígitos
    const random = Math.random().toString(36).substr(2, 4); // 4 caracteres aleatorios
    
    // Agregar email codificado en base64 al sessionId para recuperarlo después
    const emailEncoded = email ? Buffer.from(email).toString('base64').substring(0, 20) : '';
    const buyOrder = `${planInfo.code}-${timestamp}-${random}`; // Ej: PRO-P-1234567890-abcd
    const sessionId = emailEncoded ? `${emailEncoded}-${timestamp}` : `SES-${timestamp}`;
    const amount = planInfo.amount;
    const descripcion = planInfo.descripcion;

    // URL de retorno después del pago
    const returnUrl = `${getBaseUrl(request)}/api/webpay/confirmar`;

    // Crear transacción con Webpay Plus
    const tx = new WebpayPlus.Transaction(options);
    const response = await tx.create(buyOrder, sessionId, amount, returnUrl);

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
