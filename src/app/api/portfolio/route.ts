import { NextResponse } from 'next/server';
import { TrabajoPortfolio } from '@/types/portfolio';
import fs from 'fs/promises';
import path from 'path';

const PORTFOLIO_FILE = path.join(process.cwd(), 'data', 'portfolio.json');

async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

async function leerPortfolio(): Promise<TrabajoPortfolio[]> {
  try {
    const data = await fs.readFile(PORTFOLIO_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function guardarPortfolio(trabajos: TrabajoPortfolio[]) {
  await ensureDataDir();
  await fs.writeFile(PORTFOLIO_FILE, JSON.stringify(trabajos, null, 2));
}

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

    const portfolio = await leerPortfolio();
    const trabajosProfesional = portfolio.filter(
      t => t.profesionalId === profesionalId
    );

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

    const portfolio = await leerPortfolio();
    portfolio.unshift(nuevoTrabajo);
    await guardarPortfolio(portfolio);

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

    const portfolio = await leerPortfolio();
    const index = portfolio.findIndex(t => t.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: 'Trabajo no encontrado' },
        { status: 404 }
      );
    }

    portfolio[index] = { ...portfolio[index], ...updates };
    await guardarPortfolio(portfolio);

    return NextResponse.json(portfolio[index]);
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

    const portfolio = await leerPortfolio();
    const trabajosFiltrados = portfolio.filter(t => t.id !== id);

    if (trabajosFiltrados.length === portfolio.length) {
      return NextResponse.json(
        { error: 'Trabajo no encontrado' },
        { status: 404 }
      );
    }

    await guardarPortfolio(trabajosFiltrados);

    return NextResponse.json({ success: true, message: 'Trabajo eliminado' });
  } catch (error: any) {
    console.error('Error al eliminar trabajo:', error);
    return NextResponse.json(
      { error: 'Error al eliminar trabajo' },
      { status: 500 }
    );
  }
}
