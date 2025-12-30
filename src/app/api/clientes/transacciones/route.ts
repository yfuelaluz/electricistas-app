import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('email');
    const userId = searchParams.get('user_id');

    // Validar que se proporcione al menos un parámetro
    if (!userEmail && !userId) {
      return NextResponse.json(
        { error: 'Se requiere email o user_id' },
        { status: 400 }
      );
    }

    // Construir la consulta
    let query = supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

    // Filtrar por email o user_id
    if (userEmail) {
      query = query.eq('user_email', userEmail);
    } else if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error al consultar transacciones:', error);
      return NextResponse.json(
        { error: 'Error al obtener transacciones', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      transactions: data,
      count: data?.length || 0
    });

  } catch (error) {
    console.error('Excepción en /api/clientes/transacciones:', error);
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
