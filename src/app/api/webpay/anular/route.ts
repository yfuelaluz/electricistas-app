import { NextRequest, NextResponse } from 'next/server';
import { WebpayPlus, Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } from 'transbank-sdk';

const commerceCode = process.env.WEBPAY_COMMERCE_CODE || IntegrationCommerceCodes.WEBPAY_PLUS;
const apiKey = process.env.WEBPAY_API_KEY || IntegrationApiKeys.WEBPAY;
const ambiente = process.env.WEBPAY_AMBIENTE || 'integracion';

const options = new Options(commerceCode, apiKey, ambiente === 'produccion' ? Environment.Production : Environment.Integration);

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
    const response = await transaction.refund(token, amount);

    return NextResponse.json({
      success: true,
      type: response.type,
      authorization_code: response.authorization_code,
      authorization_date: response.authorization_date,
      nullified_amount: response.nullified_amount,
      balance: response.balance,
      response_code: response.response_code
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
