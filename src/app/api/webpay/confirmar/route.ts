import { NextRequest, NextResponse } from 'next/server';
import { WebpayPlus, Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } from 'transbank-sdk';

// Configuración de Webpay
const commerceCode = process.env.WEBPAY_COMMERCE_CODE || IntegrationCommerceCodes.WEBPAY_PLUS;
const apiKey = process.env.WEBPAY_API_KEY || IntegrationApiKeys.WEBPAY;
const ambiente = process.env.WEBPAY_AMBIENTE || 'integracion';

// Configurar opciones
const options = new Options(commerceCode, apiKey, ambiente === 'produccion' ? Environment.Production : Environment.Integration);

// Helper para obtener URL base
function getBaseUrl(request: NextRequest): string {
  const host = request.headers.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') || host.includes('192.168') ? 'http' : 'https';
  return `${protocol}://${host}`;
}

export async function POST(request: NextRequest) {
  try {
    // Obtener el token que Webpay envía
    const formData = await request.formData();
    const token = formData.get('token_ws') as string;

    if (!token) {
      const baseUrl = getBaseUrl(request);
      return NextResponse.redirect(new URL('/?pago=error', baseUrl));
    }

    // Confirmar la transacción con Webpay
    const transaction = new WebpayPlus.Transaction(options);
    const response = await transaction.commit(token);

    // Verificar si el pago fue aprobado
    if (response.status === 'AUTHORIZED' && response.response_code === 0) {
      const buyOrder = response.buy_order as string;
      const baseUrl = getBaseUrl(request);
      
      // Determinar el plan según el código de la orden
      let planDestino = '';
      if (buyOrder.includes('CLI-B')) {
        planDestino = 'cliente-basico';
      } else if (buyOrder.includes('CLI-P')) {
        planDestino = 'cliente-premium';
      } else if (buyOrder.includes('CLI-E')) {
        planDestino = 'cliente-empresa';
      } else if (buyOrder.includes('PRO-S')) {
        planDestino = 'starter';
      } else if (buyOrder.includes('PRO-P')) {
        planDestino = 'pro';
      } else if (buyOrder.includes('PRO-E')) {
        planDestino = 'elite';
      }
      
      // Si es plan profesional, redirigir a registro de profesional
      if (buyOrder.startsWith('PRO-')) {
        return NextResponse.redirect(new URL(`/profesionales/registro?plan=${planDestino}&pago=exitoso`, baseUrl));
      }
      
      // Si es plan cliente, redirigir a registro de cliente
      return NextResponse.redirect(new URL(`/clientes/registro?plan=${planDestino}&pago=exitoso`, baseUrl));
    } else {
      const baseUrl = getBaseUrl(request);
      return NextResponse.redirect(new URL('/?pago=rechazado', baseUrl));
    }

  } catch (error) {
    console.error('Error al confirmar pago:', error);
    const baseUrl = getBaseUrl(request);
    return NextResponse.redirect(new URL('/?pago=error', baseUrl));
  }
}

// Webpay también puede usar GET para retorno
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token_ws');

  if (!token) {
    const baseUrl = getBaseUrl(request);
    return NextResponse.redirect(new URL('/?pago=cancelado', baseUrl));
  }

  try {
    const transaction = new WebpayPlus.Transaction(options);
    const response = await transaction.commit(token);

    if (response.status === 'AUTHORIZED' && response.response_code === 0) {
      const buyOrder = response.buy_order as string;
      const baseUrl = getBaseUrl(request);
      
      // Determinar el plan según el código de la orden
      let planDestino = '';
      if (buyOrder.includes('CLI-B')) {
        planDestino = 'cliente-basico';
      } else if (buyOrder.includes('CLI-P')) {
        planDestino = 'cliente-premium';
      } else if (buyOrder.includes('CLI-E')) {
        planDestino = 'cliente-empresa';
      } else if (buyOrder.includes('PRO-S')) {
        planDestino = 'starter';
      } else if (buyOrder.includes('PRO-P')) {
        planDestino = 'pro';
      } else if (buyOrder.includes('PRO-E')) {
        planDestino = 'elite';
      }
      
      if (buyOrder.startsWith('PRO-')) {
        return NextResponse.redirect(new URL(`/profesionales/registro?plan=${planDestino}&pago=exitoso`, baseUrl));
      }
      return NextResponse.redirect(new URL(`/clientes/registro?plan=${planDestino}&pago=exitoso`, baseUrl));
    } else {
      const baseUrl = getBaseUrl(request);
      return NextResponse.redirect(new URL('/?pago=rechazado', baseUrl));
    }
  } catch (error) {
    console.error('Error al confirmar pago:', error);
    const baseUrl = getBaseUrl(request);
    return NextResponse.redirect(new URL('/?pago=error', baseUrl));
  }
}
