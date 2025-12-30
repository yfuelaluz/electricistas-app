import { NextRequest, NextResponse } from 'next/server';
import { WebpayPlus, Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } from 'transbank-sdk';
import { createClient } from '@supabase/supabase-js';
import { sendPaymentConfirmationEmail } from '@/lib/email';

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
      
      // Guardar la transacción en Supabase
      try {
        const { error: dbError } = await supabase
          .from('transactions')
          .insert({
            token: token,
            buy_order: buyOrder,
            amount: response.amount,
            status: response.status,
            payment_type_code: response.payment_type_code,
            card_number: response.card_detail?.card_number || null,
            installments_number: response.installments_number || null,
            installments_amount: response.installments_amount || null,
            authorization_code: response.authorization_code,
            response_code: response.response_code,
            balance: response.balance || 0,
            nullified_amount: 0,
            transaction_date: response.transaction_date,
            accounting_date: response.accounting_date,
            metadata: {
              vci: response.vci,
              session_id: response.session_id,
              card_detail: response.card_detail
            }
          });

        if (dbError) {
          console.error('Error al guardar transacción en DB:', dbError);
        }
      } catch (dbError) {
        console.error('Excepción al guardar en DB:', dbError);
      }
      
      // Determinar el plan según el código de la orden
      let planDestino = '';
      let planNombre = '';
      if (buyOrder.includes('CLI-B')) {
        planDestino = 'cliente-basico';
        planNombre = 'Plan Cliente Básico';
      } else if (buyOrder.includes('CLI-P')) {
        planDestino = 'cliente-premium';
        planNombre = 'Plan Cliente Premium';
      } else if (buyOrder.includes('CLI-E')) {
        planDestino = 'cliente-empresa';
        planNombre = 'Plan Cliente Empresa';
      } else if (buyOrder.includes('PRO-S')) {
        planDestino = 'starter';
        planNombre = 'Plan Starter';
      } else if (buyOrder.includes('PRO-P')) {
        planDestino = 'pro';
        planNombre = 'Plan Pro';
      } else if (buyOrder.includes('PRO-E')) {
        planDestino = 'elite';
        planNombre = 'Plan Elite';
      }

      // Enviar email de confirmación (NO bloqueante)
      const email = formData.get('email') as string;
      if (email) {
        sendPaymentConfirmationEmail({
          to: email,
          buyOrder: buyOrder,
          amount: response.amount,
          authorizationCode: response.authorization_code,
          cardNumber: response.card_detail?.card_number?.slice(-4) || '****',
          transactionDate: response.transaction_date,
          planName: planNombre,
        }).catch(err => console.error('Error enviando email (no crítico):', err));
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
      
      // Guardar la transacción en Supabase
      try {
        const { error: dbError } = await supabase
          .from('transactions')
          .insert({
            token: token,
            buy_order: buyOrder,
            amount: response.amount,
            status: response.status,
            payment_type_code: response.payment_type_code,
            card_number: response.card_detail?.card_number || null,
            installments_number: response.installments_number || null,
            installments_amount: response.installments_amount || null,
            authorization_code: response.authorization_code,
            response_code: response.response_code,
            balance: response.balance || 0,
            nullified_amount: 0,
            transaction_date: response.transaction_date,
            accounting_date: response.accounting_date,
            metadata: {
              vci: response.vci,
              session_id: response.session_id,
              card_detail: response.card_detail
            }
          });

        if (dbError) {
          console.error('Error al guardar transacción en DB:', dbError);
        }
      } catch (dbError) {
        console.error('Excepción al guardar en DB:', dbError);
      }
      
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
