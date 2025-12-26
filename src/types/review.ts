export interface Review {
  id: string;
  profesionalId: number;
  clienteId: number;
  cotizacionId: string;
  clienteNombre: string;
  valoracion: number; // 1-5 estrellas
  comentario: string;
  fecha: string;
  respuestaProfesional?: string;
}

export interface ValoracionProfesional {
  totalReviews: number;
  promedioValoracion: number;
  distribucion: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}
