import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { hashPassword } from '@/lib/auth';

const PROFESIONALES_FILE = path.join(process.cwd(), 'data', 'profesionales.json');

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const body = await request.json();

    console.log('🔄 Actualizando profesional:', { id, body });

    // Leer profesionales actuales
    const fileContent = fs.readFileSync(PROFESIONALES_FILE, 'utf-8');
    const profesionales = JSON.parse(fileContent);

    console.log('📄 Total de profesionales:', profesionales.length);

    // Buscar el índice del profesional
    const index = profesionales.findIndex((p: any) => p.id === id);

    console.log('🔍 Índice encontrado:', index);

    if (index === -1) {
      return NextResponse.json(
        { error: 'Profesional no encontrado' },
        { status: 404 }
      );
    }

    // Preparar datos para actualizar
    const datosActualizar: any = {
      nombreCompleto: body.nombreCompleto || profesionales[index].nombreCompleto,
      rut: body.rut || profesionales[index].rut,
      email: body.email || profesionales[index].email,
      telefono: body.telefono || profesionales[index].telefono,
      especialidad: body.especialidad || profesionales[index].especialidad,
      comunas: body.comunas || profesionales[index].comunas,
      experiencia: body.experiencia || profesionales[index].experiencia,
      certificaciones: body.certificaciones || profesionales[index].certificaciones,
      descripcion: body.descripcion || profesionales[index].descripcion,
      fotoPerfil: body.fotoPerfil !== undefined ? body.fotoPerfil : profesionales[index].fotoPerfil,
    };

    // Si se envía nueva contraseña, hashearla
    if (body.password) {
      datosActualizar.passwordHash = await hashPassword(body.password);
    }

    // Actualizar profesional manteniendo otros campos
    profesionales[index] = {
      ...profesionales[index],
      ...datosActualizar
    // Actualizar profesional manteniendo otros campos
    profesionales[index] = {
      ...profesionales[index],
      ...datosActualizar
    };

    console.log('✅ Profesional actualizado');

    // Guardar cambios
    fs.writeFileSync(PROFESIONALES_FILE, JSON.stringify(profesionales, null, 2));

    return NextResponse.json({
      success: true,
      profesional: profesionales[index]
    });

  } catch (error) {
    console.error('Error al actualizar profesional:', error);
    return NextResponse.json(
      { error: 'Error al actualizar profesional' },
      { status: 500 }
    );
  }
}
