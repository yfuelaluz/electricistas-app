import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { hashPassword, verifyPassword } from '@/lib/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET - Obtener todos los clientes
export async function GET() {
  try {
    const { data: clientes, error } = await supabase
      .from('clientes')
      .select('id, nombre_completo, email, telefono, direccion, comuna, plan, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al obtener clientes:', error);
      return NextResponse.json([], { status: 200 });
    }
    
    return NextResponse.json(clientes || []);
  } catch (error) {
    console.error('Error al leer clientes:', error);
    return NextResponse.json([], { status: 200 });
  }
}

// POST - Registrar nuevo cliente
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Verificar si el email ya existe
    const { data: existente } = await supabase
      .from('clientes')
      .select('id')
      .eq('email', body.email)
      .single();

    if (existente) {
      return NextResponse.json({ 
        success: false, 
        error: 'El email ya está registrado' 
      }, { status: 400 });
    }

    // Hash de la contraseña
    const passwordHash = await hashPassword(body.password);

    // Crear nuevo cliente
    const { data: nuevoCliente, error } = await supabase
      .from('clientes')
      .insert([{
        nombre_completo: body.nombreCompleto,
        email: body.email,
        telefono: body.telefono,
        password_hash: passwordHash,
        direccion: body.direccion || '',
        comuna: body.comuna || '',
        plan: body.plan || 'cliente-basico',
        estado: 'activo'
      }])
      .select('id, nombre_completo, email, telefono, direccion, comuna, plan, estado')
      .single();

    if (error) {
      console.error('Error al insertar cliente:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Error al registrar cliente' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      cliente: nuevoCliente,
      mensaje: 'Registro completado exitosamente. ¡Bienvenido!'
    });
  } catch (error) {
    console.error('Error al registrar cliente:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Error al registrar cliente' 
    }, { status: 500 });
  }
}

// PUT - Actualizar cliente existente
export async function PUT(req: NextRequest) {
  try {
    const datosActualizados = await req.json();
    console.log('Datos recibidos en PUT:', datosActualizados);
    
    const { email, passwordActual, passwordNueva, passwordConfirmar, ...otrosDatos } = datosActualizados;

    // Buscar cliente
    const { data: cliente, error: errorBuscar } = await supabase
      .from('clientes')
      .select('*')
      .eq('email', email)
      .single();

    if (errorBuscar || !cliente) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
    }

    console.log('Cliente encontrado:', cliente.id);

    const actualizacion: any = {
      nombre_completo: otrosDatos.nombreCompleto !== undefined ? otrosDatos.nombreCompleto : cliente.nombre_completo,
      telefono: otrosDatos.telefono !== undefined ? otrosDatos.telefono : cliente.telefono,
      direccion: otrosDatos.direccion !== undefined ? otrosDatos.direccion : cliente.direccion,
      comuna: otrosDatos.comuna !== undefined ? otrosDatos.comuna : cliente.comuna
    };

    // Si se está cambiando la contraseña
    if (passwordNueva && passwordNueva.trim() !== '') {
      // Verificar contraseña actual
      const passwordValida = await verifyPassword(passwordActual, cliente.password_hash);

      if (!passwordValida) {
        return NextResponse.json({ error: "Contraseña actual incorrecta" }, { status: 401 });
      }

      // Hashear nueva contraseña
      actualizacion.password_hash = await hashPassword(passwordNueva);
    }

    // Actualizar en Supabase
    const { data: clienteActualizado, error: errorActualizar } = await supabase
      .from('clientes')
      .update(actualizacion)
      .eq('id', cliente.id)
      .select('id, nombre_completo, email, telefono, direccion, comuna, plan, estado')
      .single();

    if (errorActualizar) {
      console.error('Error al actualizar:', errorActualizar);
      return NextResponse.json({ error: "Error al actualizar cliente" }, { status: 500 });
    }

    return NextResponse.json({ success: true, cliente: clienteActualizado });
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    return NextResponse.json({ error: "Error al actualizar cliente" }, { status: 500 });
  }
}
