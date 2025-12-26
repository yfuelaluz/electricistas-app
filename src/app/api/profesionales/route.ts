import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { hashPassword } from '@/lib/auth';

const profesionalesPath = path.join(process.cwd(), 'data', 'profesionales.json');

// GET - Obtener todos los profesionales
export async function GET() {
  try {
    const data = fs.readFileSync(profesionalesPath, 'utf-8');
    const profesionales = JSON.parse(data);
    
    // No devolver hashes de contraseñas
    const profesionalesSinPasswords = profesionales.map((p: any) => {
      const { password, passwordHash, ...profesionalSinPassword } = p;
      return profesionalSinPassword;
    });
    
    return NextResponse.json(profesionalesSinPasswords);
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

    // Verificar si el email ya existe
    const emailExiste = profesionales.some((p: any) => p.email === body.email);
    if (emailExiste) {
      return NextResponse.json({ 
        success: false, 
        error: 'El email ya está registrado' 
      }, { status: 400 });
    }

    // Hash de la contraseña
    const passwordHash = await hashPassword(body.password);

    // Crear nuevo profesional (sin password plana)
    const nuevoProfesional = {
      id: Date.now(),
      nombreCompleto: body.nombreCompleto,
      email: body.email,
      telefono: body.telefono,
      passwordHash, // Solo hash
      especialidad: body.especialidad,
      experiencia: body.experiencia,
      certificaciones: body.certificaciones || '',
      plan: body.plan || 'starter',
      fechaRegistro: new Date().toISOString(),
      estado: 'pendiente',
      valoracion: 0,
      trabajosRealizados: 0
    };

    profesionales.push(nuevoProfesional);

    // Guardar
    fs.writeFileSync(profesionalesPath, JSON.stringify(profesionales, null, 2));

    // No devolver hash
    const { passwordHash: _, ...profesionalSinPassword } = nuevoProfesional;

    return NextResponse.json({ 
      success: true, 
      profesional: profesionalSinPassword,
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
