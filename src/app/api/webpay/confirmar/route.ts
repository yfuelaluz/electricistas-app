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

    console.log('Confirmando transacción con token:', token);

    // Confirmar la transacción con Webpay
    const transaction = new WebpayPlus.Transaction(options);
    const response = await transaction.commit(token);

    console.log('Respuesta de confirmación:', response);

    // Verificar si el pago fue aprobado
    if (response.status === 'AUTHORIZED' && response.response_code === 0) {
      console.log('✅ Pago exitoso:', {
        buyOrder: response.buy_order,
        amount: response.amount,
        authorizationCode: response.authorization_code
      });

      // AQUÍ: Guardar en tu base de datos la suscripción del usuario
      // Por ejemplo: activar plan, registrar pago, enviar email, etc.

      // Verificar si es suscripción profesional
      const buyOrder = response.buy_order as string;
      const esPlanProfesional = buyOrder.startsWith('PRO-');
      const baseUrl = getBaseUrl(request);
      
      if (esPlanProfesional) {
        // Redirigir a completar registro de profesional
        return NextResponse.redirect(new URL(`/profesionales/registro?plan=${buyOrder}&pago=exitoso`, baseUrl));
      }

      // Si es plan cliente, redirigir a home con mensaje de éxito
      return NextResponse.redirect(new URL('/?pago=exitoso', baseUrl));
    } else {
      console.log('❌ Pago rechazado:', response);
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
      const esPlanProfesional = buyOrder.startsWith('PRO-');
      const baseUrl = getBaseUrl(request);
      
      if (esPlanProfesional) {
        return NextResponse.redirect(new URL(`/profesionales/registro?plan=${buyOrder}&pago=exitoso`, baseUrl));
      }
      return NextResponse.redirect(new URL('/?pago=exitoso', baseUrl));
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
