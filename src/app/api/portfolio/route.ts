import { NextResponse } from 'next/server';
import { TrabajoPortfolio } from '@/types/portfolio';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET - Obtener portfolio de un profesional
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const profesionalId = searchParams.get('profesionalId');

    if (!profesionalId) {
      return NextResponse.json(
        { error: 'profesionalId es requerido' },
        { status: 400 }
      );
    }

    const { data: portfolio, error } = await supabase
      .from('portfolio')
      .select('*')
      .eq('profesionalId', profesionalId);

    if (error) {
      console.error('Error al obtener portfolio:', error);
      return NextResponse.json({ error: 'Error al obtener portfolio' }, { status: 500 });
    }

    const trabajosProfesional = portfolio || [];

    return NextResponse.json({
      trabajos: trabajosProfesional,
      total: trabajosProfesional.length,
    });
  } catch (error: any) {
    console.error('Error al obtener portfolio:', error);
    return NextResponse.json(
      { error: 'Error al obtener portfolio' },
      { status: 500 }
    );
  }
}

// POST - Agregar trabajo al portfolio
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { profesionalId, titulo, descripcion, categoria, imagenes, ubicacion, duracion, destacado } = body;

    // Validar campos requeridos
    if (!profesionalId || !titulo || !descripcion || !categoria) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    const nuevoTrabajo: TrabajoPortfolio = {
      id: `WORK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      profesionalId,
      titulo,
      descripcion,
      categoria,
      imagenes: imagenes || [],
      fecha: new Date().toISOString(),
      ubicacion,
      duracion,
      destacado: destacado || false,
    };

    const { error: errorInsert } = await supabase
      .from('portfolio')
      .insert([nuevoTrabajo]);

    if (errorInsert) {
      console.error('Error al insertar trabajo:', errorInsert);
      return NextResponse.json({ error: 'Error al crear trabajo' }, { status: 500 });
    }

    return NextResponse.json(nuevoTrabajo, { status: 201 });
  } catch (error: any) {
    console.error('Error al crear trabajo:', error);
    return NextResponse.json(
      { error: 'Error al crear trabajo' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar trabajo
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID del trabajo es requerido' },
        { status: 400 }
      );
    }

    const { data: trabajoExistente, error: errorBusqueda } = await supabase
      .from('portfolio')
      .select('*')
      .eq('id', id)
      .single();

    if (errorBusqueda || !trabajoExistente) {
      return NextResponse.json(
        { error: 'Trabajo no encontrado' },
        { status: 404 }
      );
    }

    const trabajoActualizado = { ...trabajoExistente, ...updates };

    const { error: errorUpdate } = await supabase
      .from('portfolio')
      .update(trabajoActualizado)
      .eq('id', id);

    if (errorUpdate) {
      console.error('Error al actualizar trabajo:', errorUpdate);
      return NextResponse.json({ error: 'Error al actualizar trabajo' }, { status: 500 });
    }

    return NextResponse.json(trabajoActualizado);
  } catch (error: any) {
    console.error('Error al actualizar trabajo:', error);
    return NextResponse.json(
      { error: 'Error al actualizar trabajo' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar trabajo
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID del trabajo es requerido' },
        { status: 400 }
      );
    }

    const { data: trabajoExistente, error: errorBusqueda } = await supabase
      .from('portfolio')
      .select('*')
      .eq('id', id)
      .single();

    if (errorBusqueda || !trabajoExistente) {
      return NextResponse.json(
        { error: 'Trabajo no encontrado' },
        { status: 404 }
      );
    }

    const { error: errorDelete } = await supabase
      .from('portfolio')
      .delete()
      .eq('id', id);

    if (errorDelete) {
      console.error('Error al eliminar trabajo:', errorDelete);
      return NextResponse.json({ error: 'Error al eliminar trabajo' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Trabajo eliminado' });
  } catch (error: any) {
    console.error('Error al eliminar trabajo:', error);
    return NextResponse.json(
      { error: 'Error al eliminar trabajo' },
      { status: 500 }
    );
  }
}
