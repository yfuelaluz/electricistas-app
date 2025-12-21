import { NextRequest, NextResponse } from 'next/server';
import { WebpayPlus, Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } from 'transbank-sdk';

// Configuración de Webpay
const commerceCode = process.env.WEBPAY_COMMERCE_CODE || IntegrationCommerceCodes.WEBPAY_PLUS;
const apiKey = process.env.WEBPAY_API_KEY || IntegrationApiKeys.WEBPAY;
const ambiente = process.env.WEBPAY_AMBIENTE || 'integracion';

// Configurar opciones
const options = new Options(commerceCode, apiKey, ambiente === 'produccion' ? Environment.Production : Environment.Integration);

export async function POST(request: NextRequest) {
  try {
    // Obtener el token que Webpay envía
    const formData = await request.formData();
    const token = formData.get('token_ws') as string;

    if (!token) {
      return NextResponse.redirect(new URL('/?pago=error', request.url));
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

      // Redirigir a página de éxito
      return NextResponse.redirect(new URL('/?pago=exitoso', request.url));
    } else {
      console.log('❌ Pago rechazado:', response);
      return NextResponse.redirect(new URL('/?pago=rechazado', request.url));
    }

  } catch (error) {
    console.error('Error al confirmar pago:', error);
    return NextResponse.redirect(new URL('/?pago=error', request.url));
  }
}

// Webpay también puede usar GET para retorno
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token_ws');

  if (!token) {
    return NextResponse.redirect(new URL('/?pago=cancelado', request.url));
  }

  try {
    const transaction = new WebpayPlus.Transaction(options);
    const response = await transaction.commit(token);

    if (response.status === 'AUTHORIZED' && response.response_code === 0) {
      return NextResponse.redirect(new URL('/?pago=exitoso', request.url));
    } else {
      return NextResponse.redirect(new URL('/?pago=rechazado', request.url));
    }
  } catch (error) {
    console.error('Error al confirmar pago:', error);
    return NextResponse.redirect(new URL('/?pago=error', request.url));
  }
}
