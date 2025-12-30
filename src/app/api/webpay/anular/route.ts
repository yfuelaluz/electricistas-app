import { NextRequest, NextResponse } from 'next/server';
import { WebpayPlus, Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } from 'transbank-sdk';
import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const commerceCode = process.env.WEBPAY_COMMERCE_CODE || IntegrationCommerceCodes.WEBPAY_PLUS;
const apiKey = process.env.WEBPAY_API_KEY || IntegrationApiKeys.WEBPAY;
const ambiente = process.env.WEBPAY_AMBIENTE || 'integracion';

const options = new Options(commerceCode, apiKey, ambiente === 'produccion' ? Environment.Production : Environment.Integration);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const amountStr = searchParams.get('amount');

    if (!token) {
      return NextResponse.json({ error: 'Token requerido' }, { status: 400 });
    }

    const amount = amountStr ? Number(amountStr) : null;

    if (!amount || amount < 50) {
      return NextResponse.json({ error: 'Monto inválido (mínimo $50)' }, { status: 400 });
    }

    const transaction = new WebpayPlus.Transaction(options);
    const refundResponse = await transaction.refund(token, amount);

    // Si es anulación TOTAL (balance = 0), consultar el estado de la transacción
    // Transbank espera que el estado sea REVERSED después de anulación total
    let transactionStatus = null;
    if (refundResponse.balance === 0) {
      try {
        const statusResponse = await transaction.status(token);
        transactionStatus = statusResponse.status;
      } catch (error) {
        console.error('Error al consultar estado después de anulación total:', error);
      }
    }

    // Actualizar la transacción en Supabase
    try {
      const updateData: any = {
        nullified_amount: refundResponse.nullified_amount,
        balance: refundResponse.balance
      };

      // Si es anulación total (balance = 0), actualizar el status a REVERSED
      if (refundResponse.balance === 0) {
        updateData.status = 'REVERSED';
      }

      const { error: dbError } = await supabase
        .from('transactions')
        .update(updateData)
        .eq('token', token);

      if (dbError) {
        console.error('Error al actualizar transacción en DB:', dbError);
      }
    } catch (dbError) {
      console.error('Excepción al actualizar en DB:', dbError);
    }

    return NextResponse.json({
      success: true,
      type: refundResponse.type,
      authorization_code: refundResponse.authorization_code,
      authorization_date: refundResponse.authorization_date,
      nullified_amount: refundResponse.nullified_amount,
      balance: refundResponse.balance,
      response_code: refundResponse.response_code,
      // Estado de la transacción después de anulación (REVERSED si es anulación total)
      transaction_status: transactionStatus
    });

  } catch (error) {
    console.error('Error al anular transacción:', error);
    return NextResponse.json(
      { 
        error: 'Error al anular', 
        details: error instanceof Error ? error.message : 'Error desconocido' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { token, amount } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Token requerido' }, { status: 400 });
    }

    if (!amount || amount < 50) {
      return NextResponse.json({ error: 'Monto inválido (mínimo $50)' }, { status: 400 });
    }

    const transaction = new WebpayPlus.Transaction(options);
    const refundResponse = await transaction.refund(token, amount);

    // Si es anulación TOTAL (balance = 0), consultar el estado de la transacción
    // Transbank espera que el estado sea REVERSED después de anulación total
    let transactionStatus = null;
    if (refundResponse.balance === 0) {
      try {
        const statusResponse = await transaction.status(token);
        transactionStatus = statusResponse.status;
      } catch (error) {
        console.error('Error al consultar estado después de anulación total:', error);
      }
    }

    // Actualizar la transacción en Supabase
    try {
      const updateData: any = {
        nullified_amount: refundResponse.nullified_amount,
        balance: refundResponse.balance
      };

      // Si es anulación total (balance = 0), actualizar el status a REVERSED
      if (refundResponse.balance === 0) {
        updateData.status = 'REVERSED';
      }

      const { error: dbError } = await supabase
        .from('transactions')
        .update(updateData)
        .eq('token', token);

      if (dbError) {
        console.error('Error al actualizar transacción en DB:', dbError);
      }
    } catch (dbError) {
      console.error('Excepción al actualizar en DB:', dbError);
    }

    return NextResponse.json({
      success: true,
      type: refundResponse.type,
      authorization_code: refundResponse.authorization_code,
      authorization_date: refundResponse.authorization_date,
      nullified_amount: refundResponse.nullified_amount,
      balance: refundResponse.balance,
      response_code: refundResponse.response_code,
      // Estado de la transacción después de anulación (REVERSED si es anulación total)
      transaction_status: transactionStatus
    });

  } catch (error) {
    console.error('Error al anular transacción:', error);
    return NextResponse.json(
      { 
        error: 'Error al anular', 
        details: error instanceof Error ? error.message : 'Error desconocido' 
      },
      { status: 500 }
    );
  }
}
