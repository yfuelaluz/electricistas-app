/**
 * Types para Profesionales
 * 
 * IMPORTANTE: Estos types usan camelCase (convención de JavaScript/TypeScript)
 * El backend usa snake_case y las APIs transforman automáticamente usando toCamelCase()
 */

export type EstadoProfesional = 'Pendiente' | 'Activo' | 'Inactivo' | 'Suspendido' | 'pendiente' | 'activo' | 'inactivo' | 'suspendido';

export type PlanProfesional = 
  | 'starter' 
  | 'profesional' 
  | 'profesional-elite'
  | 'profesional-pro'
  | 'empresarial';

export type EspecialidadProfesional = 
  | 'Electricista Residencial'
  | 'Electricista Industrial'
  | 'Electricista Automotriz'
  | 'Instalador de Paneles Solares'
  | 'Técnico en Iluminación'
  | 'Electricista de Emergencias'
  | 'Ingeniero Eléctrico'
  | 'Otro';

/**
 * Interface principal del Profesional
 * Usada en componentes frontend después de la transformación desde snake_case
 */
export interface Profesional {
  id: number;
  nombreCompleto: string;
  rut?: string;
  email: string;
  telefono: string;
  especialidad: string;
  comunas?: string[];
  experiencia?: number;
  certificaciones?: string;
  descripcion?: string;
  fotoPerfil?: string;
  estado: EstadoProfesional;
  valoracion?: number;
  trabajosRealizados?: number;
  plan?: PlanProfesional;
  leadsUsados?: number;
  createdAt?: string;
}

/**
 * Interface para registro de nuevo profesional
 */
export interface RegistroProfesional {
  nombreCompleto: string;
  rut: string;
  email: string;
  telefono: string;
  password: string;
  especialidad: string;
  comunas: string[];
  experiencia: number;
  certificaciones?: string;
  descripcion: string;
  fotoPerfil?: string;
  plan?: PlanProfesional;
}

/**
 * Interface para actualización de perfil
 */
export interface ActualizacionProfesional {
  nombreCompleto?: string;
  telefono?: string;
  especialidad?: string;
  comunas?: string[];
  experiencia?: number;
  certificaciones?: string;
  descripcion?: string;
  fotoPerfil?: string;
  passwordActual?: string;
  passwordNueva?: string;
  passwordConfirmar?: string;
}

/**
 * Interface para login
 */
export interface LoginProfesional {
  email: string;
  password: string;
}

/**
 * Interface para respuesta de login
 */
export interface RespuestaLoginProfesional {
  success: boolean;
  profesional?: Profesional;
  error?: string;
}
