export interface TrabajoPortfolio {
  id: string;
  profesionalId: string;
  titulo: string;
  descripcion: string;
  categoria: 'instalacion' | 'reparacion' | 'proyecto' | 'iluminacion' | 'solar' | 'automatizacion' | 'otro';
  imagenes: string[]; // URLs de las imágenes
  fecha: string; // ISO date
  ubicacion?: string;
  duracion?: string; // "2 días", "1 semana", etc.
  destacado?: boolean; // Para mostrar en perfil principal
}

export interface PortfolioProfesional {
  profesionalId: string;
  trabajos: TrabajoPortfolio[];
  totalTrabajos: number;
}
