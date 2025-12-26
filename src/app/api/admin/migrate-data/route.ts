import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Datos hardcodeados desde los archivos JSON
const profesionalesData = [
  {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "yfuelaluz@gmail.com",
    "password": "$2b$10$eGvHJZN9VYE0L3JqJp9s1.RY8zY7WPQR0hXrHYjW6nQAJ3dW6v6Jm",
    "telefono": "+56912345678",
    "especialidad": "electricidad",
    "descripcion": "Especialista en instalaciones eléctricas residenciales y comerciales",
    "valoracion": 4.8,
    "totalReviews": 45,
    "plan": "premium",
    "leadsUsados": 12
  }
];

const clientesData = [
  {
    "id": 1,
    "nombre": "Carlos Rodríguez",
    "email": "yfuelaluz@gmail.com",
    "password": "$2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ12",
    "telefono": "+56987654321",
    "plan": "gratis"
  }
];

const cotizacionesData: any[] = [];

export async function POST(request: Request) {
  try {
    const { action } = await request.json();

    if (action === 'migrate-all') {
      const results = {
        profesionales: { insertados: 0, errores: 0 },
        clientes: { insertados: 0, errores: 0 },
        cotizaciones: { insertados: 0, errores: 0 }
      };

      // Migrar profesionales
      for (const prof of profesionalesData) {
        const { data: existente } = await supabase
          .from('profesionales')
          .select('email')
          .eq('email', prof.email)
          .single();

        if (!existente) {
          const { error } = await supabase.from('profesionales').insert([prof]);
          if (error) {
            console.error('Error al insertar profesional:', error);
            results.profesionales.errores++;
          } else {
            results.profesionales.insertados++;
          }
        }
      }

      // Migrar clientes
      for (const cliente of clientesData) {
        const { data: existente } = await supabase
          .from('clientes')
          .select('email')
          .eq('email', cliente.email)
          .single();

        if (!existente) {
          const { error } = await supabase.from('clientes').insert([cliente]);
          if (error) {
            console.error('Error al insertar cliente:', error);
            results.clientes.errores++;
          } else {
            results.clientes.insertados++;
          }
        }
      }

      // Migrar cotizaciones
      for (const cot of cotizacionesData) {
        const { data: existente } = await supabase
          .from('cotizaciones')
          .select('id')
          .eq('id', cot.id)
          .single();

        if (!existente) {
          const { error } = await supabase.from('cotizaciones').insert([cot]);
          if (error) {
            console.error('Error al insertar cotización:', error);
            results.cotizaciones.errores++;
          } else {
            results.cotizaciones.insertados++;
          }
        }
      }

      return NextResponse.json({
        success: true,
        mensaje: 'Migración completada',
        results
      });
    }

    if (action === 'check-data') {
      // Verificar cuántos registros hay en Supabase
      const { data: profesionales } = await supabase.from('profesionales').select('id', { count: 'exact' });
      const { data: clientes } = await supabase.from('clientes').select('id', { count: 'exact' });
      const { data: cotizaciones } = await supabase.from('cotizaciones').select('id', { count: 'exact' });
      const { data: reviews } = await supabase.from('reviews').select('id', { count: 'exact' });
      const { data: portfolio } = await supabase.from('portfolio').select('id', { count: 'exact' });

      return NextResponse.json({
        profesionales: profesionales?.length || 0,
        clientes: clientes?.length || 0,
        cotizaciones: cotizaciones?.length || 0,
        reviews: reviews?.length || 0,
        portfolio: portfolio?.length || 0
      });
    }

    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });

  } catch (error) {
    console.error('Error en migración:', error);
    return NextResponse.json(
      { error: 'Error al procesar migración' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Verificar cuántos registros hay en Supabase
    const { data: profesionales, count: countProf } = await supabase
      .from('profesionales')
      .select('*', { count: 'exact', head: true });
    
    const { data: clientes, count: countCli } = await supabase
      .from('clientes')
      .select('*', { count: 'exact', head: true });
    
    const { data: cotizaciones, count: countCot } = await supabase
      .from('cotizaciones')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      mensaje: 'Estado de la base de datos',
      registros: {
        profesionales: countProf || 0,
        clientes: countCli || 0,
        cotizaciones: countCot || 0
      }
    });
  } catch (error) {
    console.error('Error al verificar datos:', error);
    return NextResponse.json(
      { error: 'Error al verificar datos' },
      { status: 500 }
    );
  }
}
