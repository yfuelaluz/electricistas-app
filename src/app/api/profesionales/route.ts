import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const profesionalesPath = path.join(process.cwd(), 'data', 'profesionales.json');

// GET - Obtener todos los profesionales
export async function GET() {
  try {
    const data = fs.readFileSync(profesionalesPath, 'utf-8');
    const profesionales = JSON.parse(data);
    return NextResponse.json(profesionales);
  } catch (error) {
    console.error('Error al leer profesionales:', error);
    return NextResponse.json([], { status: 200 });
  }
}

// POST - Registrar nuevo profesional
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Leer profesionales existentes
    let profesionales = [];
    try {
      const data = fs.readFileSync(profesionalesPath, 'utf-8');
      profesionales = JSON.parse(data);
    } catch (error) {
      console.log('Creando nuevo archivo de profesionales');
    }

    // Crear nuevo profesional
    const nuevoProfesional = {
      id: Date.now(),
      ...body,
      fechaRegistro: new Date().toISOString(),
      estado: 'pendiente', // pendiente, activo, inactivo
      valoracion: 0,
      trabajosRealizados: 0
    };

    profesionales.push(nuevoProfesional);

    // Guardar
    fs.writeFileSync(profesionalesPath, JSON.stringify(profesionales, null, 2));

    return NextResponse.json({ 
      success: true, 
      profesional: nuevoProfesional,
      mensaje: 'Profesional registrado exitosamente. Pronto recibirás un correo de confirmación.'
    });
  } catch (error) {
    console.error('Error al registrar profesional:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Error al registrar profesional' 
    }, { status: 500 });
  }
}
