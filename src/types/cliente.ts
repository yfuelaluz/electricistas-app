/**
 * Types para Clientes
 * 
 * IMPORTANTE: Estos types usan camelCase (convención de JavaScript/TypeScript)
 * El backend usa snake_case y las APIs transforman automáticamente usando toCamelCase()
 */

export type EstadoCliente = 'activo' | 'inactivo' | 'suspendido';

export type PlanCliente = 
  | 'cliente-basico'
  | 'cliente-plus'
  | 'cliente-premium'
  | 'cliente-empresa';

/**
 * Interface principal del Cliente
 * Usada en componentes frontend después de la transformación desde snake_case
 */
export interface Cliente {
  id: number;
  nombreCompleto: string;
  email: string;
  telefono: string;
  direccion?: string;
  comuna?: string;
  ciudad?: string;
  region?: string;
  plan?: PlanCliente;
  tipoPlan?: string;
  estado?: EstadoCliente;
  fechaRegistro?: string;
  createdAt?: string;
}

/**
 * Interface para registro de nuevo cliente
 */
export interface RegistroCliente {
  nombreCompleto: string;
  email: string;
  telefono: string;
  password: string;
  direccion?: string;
  comuna?: string;
  plan?: PlanCliente;
}

/**
 * Interface para actualización de perfil
 */
export interface ActualizacionCliente {
  nombreCompleto?: string;
  telefono?: string;
  direccion?: string;
  comuna?: string;
  passwordActual?: string;
  passwordNueva?: string;
  passwordConfirmar?: string;
}

/**
 * Interface para login
 */
export interface LoginCliente {
  email: string;
  password: string;
}

/**
 * Interface para respuesta de login
 */
export interface RespuestaLoginCliente {
  success: boolean;
  cliente?: Cliente;
  error?: string;
}

/**
 * Interface para datos básicos del cliente en cotizaciones
 */
export interface ClienteCotizacion {
  nombre: string;
  email: string;
  telefono: string;
  direccion?: string;
  comuna?: string;
}
