export interface Review {
  id: string;
  profesional_id: number;
  cliente_id: number;
  cotizacion_id: string;
  cliente_nombre: string;
  valoracion: number; // 1-5 estrellas
  comentario: string;
  fecha: string;
  respuesta_profesional?: string;
}

export interface ValoracionProfesional {
  total_reviews: number;
  promedio_valoracion: number;
  distribucion: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}
