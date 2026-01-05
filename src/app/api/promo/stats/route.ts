import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
}

export async function GET() {
  try {
    const supabase = getSupabaseClient();

    // Contar profesionales con promo_code = '2x1'
    const { count: countProfesionales, error: errorProfesionales } = await supabase
      .from('profesionales')
      .select('*', { count: 'exact', head: true })
      .eq('promo_code', '2x1');

    if (errorProfesionales) {
      console.error('Error contando profesionales:', errorProfesionales);
      throw errorProfesionales;
    }

    // Contar clientes con promo_code = '2x1'
    const { count: countClientes, error: errorClientes } = await supabase
      .from('clientes')
      .select('*', { count: 'exact', head: true })
      .eq('promo_code', '2x1');

    if (errorClientes) {
      console.error('Error contando clientes:', errorClientes);
      throw errorClientes;
    }

    const profesionalesRegistrados = countProfesionales || 0;
    const clientesRegistrados = countClientes || 0;

    return NextResponse.json({
      profesionales_registrados: profesionalesRegistrados,
      profesionales_restantes: 25 - profesionalesRegistrados,
      clientes_registrados: clientesRegistrados,
      clientes_restantes: 25 - clientesRegistrados,
      total_registrados: profesionalesRegistrados + clientesRegistrados,
      total_restantes: 50 - (profesionalesRegistrados + clientesRegistrados)
    });

  } catch (error) {
    console.error('Error en /api/promo/stats:', error);
    return NextResponse.json(
      { error: 'Error al obtener estadísticas de promoción' },
      { status: 500 }
    );
  }
}
