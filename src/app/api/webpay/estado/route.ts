import { NextRequest, NextResponse } from 'next/server';
import { WebpayPlus, Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } from 'transbank-sdk';

const commerceCode = process.env.WEBPAY_COMMERCE_CODE || IntegrationCommerceCodes.WEBPAY_PLUS;
const apiKey = process.env.WEBPAY_API_KEY || IntegrationApiKeys.WEBPAY;
const ambiente = process.env.WEBPAY_AMBIENTE || 'integracion';

const options = new Options(commerceCode, apiKey, ambiente === 'produccion' ? Environment.Production : Environment.Integration);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token requerido' }, { status: 400 });
    }

    const transaction = new WebpayPlus.Transaction(options);
    const response = await transaction.status(token);

    return NextResponse.json({
      success: true,
      status: response.status,
      buy_order: response.buy_order,
      session_id: response.session_id,
      card_number: response.card_detail?.card_number,
      accounting_date: response.accounting_date,
      transaction_date: response.transaction_date,
      authorization_code: response.authorization_code,
      payment_type_code: response.payment_type_code,
      response_code: response.response_code,
      amount: response.amount,
      installments_number: response.installments_number,
      installments_amount: response.installments_amount,
      balance: response.balance
    });

  } catch (error) {
    console.error('Error al consultar estado:', error);
    return NextResponse.json(
      { 
        error: 'Error al consultar estado', 
        details: error instanceof Error ? error.message : 'Error desconocido' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Token requerido' }, { status: 400 });
    }

    const transaction = new WebpayPlus.Transaction(options);
    const response = await transaction.status(token);

    return NextResponse.json({
      success: true,
      status: response.status,
      buy_order: response.buy_order,
      session_id: response.session_id,
      card_number: response.card_detail?.card_number,
      accounting_date: response.accounting_date,
      transaction_date: response.transaction_date,
      authorization_code: response.authorization_code,
      payment_type_code: response.payment_type_code,
      response_code: response.response_code,
      amount: response.amount,
      installments_number: response.installments_number,
      installments_amount: response.installments_amount,
      balance: response.balance
    });

  } catch (error) {
    console.error('Error al consultar estado:', error);
    return NextResponse.json(
      { 
        error: 'Error al consultar estado', 
        details: error instanceof Error ? error.message : 'Error desconocido' 
      },
      { status: 500 }
    );
  }
}
