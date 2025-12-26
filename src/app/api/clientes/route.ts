import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { hashPassword, verifyPassword } from '@/lib/auth';

const clientesPath = path.join(process.cwd(), 'data', 'clientes.json');

// GET - Obtener todos los clientes
export async function GET() {
  try {
    const data = fs.readFileSync(clientesPath, 'utf-8');
    const clientes = JSON.parse(data);
    
    // No devolver hashes de contraseñas ni passwords
    const clientesSinPasswords = clientes.map((c: any) => {
      const { password, passwordHash, ...clienteSinPassword } = c;
      return clienteSinPassword;
    });
    
    return NextResponse.json(clientesSinPasswords);
  } catch (error) {
    console.error('Error al leer clientes:', error);
    return NextResponse.json([], { status: 200 });
  }
}

// POST - Registrar nuevo cliente
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Leer clientes existentes
    let clientes = [];
    try {
      const data = fs.readFileSync(clientesPath, 'utf-8');
      clientes = JSON.parse(data);
    } catch (error) {
      console.log('Creando nuevo archivo de clientes');
    }

    // Verificar si el email ya existe
    const emailExiste = clientes.some((c: any) => c.email === body.email);
    if (emailExiste) {
      return NextResponse.json({ 
        success: false, 
        error: 'El email ya está registrado' 
      }, { status: 400 });
    }

    // Hash de la contraseña
    const passwordHash = await hashPassword(body.password);

    // Crear nuevo cliente (sin password plana, solo hash)
    const nuevoCliente = {
      id: Date.now(),
      nombreCompleto: body.nombreCompleto,
      email: body.email,
      telefono: body.telefono,
      passwordHash, // Solo guardar hash
      direccion: body.direccion || '',
      ciudad: body.ciudad || '',
      region: body.region || '',
      plan: body.plan || 'cliente-basico',
      fechaRegistro: new Date().toISOString(),
      estado: 'activo'
    };

    clientes.push(nuevoCliente);

    // Guardar
    fs.writeFileSync(clientesPath, JSON.stringify(clientes, null, 2));

    // No devolver el hash al cliente
    const { passwordHash: _, ...clienteSinPassword } = nuevoCliente;

    return NextResponse.json({ 
      success: true, 
      cliente: clienteSinPassword,
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

    // Leer clientes
    const data = fs.readFileSync(clientesPath, 'utf-8');
    let clientes = JSON.parse(data);

    console.log('Buscando cliente con email:', email);
    const indice = clientes.findIndex((c: any) => c.email === email);
    console.log('Índice encontrado:', indice);
    
    if (indice === -1) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
    }

    console.log('Cliente antes de actualizar:', clientes[indice]);
    console.log('Otros datos a actualizar:', otrosDatos);

    // Si se está cambiando la contraseña, validar la actual con hash
    if (passwordNueva && passwordNueva.trim() !== '') {
      // Verificar contraseña actual (compatible con password plana antigua y hash nuevo)
      let passwordValida = false;
      if (clientes[indice].passwordHash) {
        // Nuevo sistema con hash
        passwordValida = await verifyPassword(passwordActual, clientes[indice].passwordHash);
      } else if (clientes[indice].password) {
        // Sistema antiguo con password plana (migrar)
        passwordValida = clientes[indice].password === passwordActual;
      }

      if (!passwordValida) {
        return NextResponse.json({ error: "Contraseña actual incorrecta" }, { status: 401 });
      }

      // Hashear nueva contraseña
      const nuevoHash = await hashPassword(passwordNueva);
      otrosDatos.passwordHash = nuevoHash;
      
      // Eliminar password plana si existía
      delete clientes[indice].password;
    }

    // Actualizar otros datos preservando id, email, plan, fechaRegistro
    clientes[indice] = {
      ...clientes[indice],
      nombreCompleto: otrosDatos.nombreCompleto !== undefined ? otrosDatos.nombreCompleto : clientes[indice].nombreCompleto,
      telefono: otrosDatos.telefono !== undefined ? otrosDatos.telefono : clientes[indice].telefono,
      direccion: otrosDatos.direccion !== undefined ? otrosDatos.direccion : clientes[indice].direccion,
      ciudad: otrosDatos.ciudad !== undefined ? otrosDatos.ciudad : clientes[indice].ciudad,
      region: otrosDatos.region !== undefined ? otrosDatos.region : clientes[indice].region,
      ...(otrosDatos.passwordHash && { passwordHash: otrosDatos.passwordHash }),
      fechaActualizacion: new Date().toISOString()
    };

    console.log('Cliente actualizado:', clientes[indice]);

    fs.writeFileSync(clientesPath, JSON.stringify(clientes, null, 2));

    // No devolver hash
    const { passwordHash: _, password: __, ...clienteSinPassword } = clientes[indice];

    return NextResponse.json({ success: true, cliente: clienteSinPassword });
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    return NextResponse.json({ error: "Error al actualizar cliente" }, { status: 500 });
  }
}
