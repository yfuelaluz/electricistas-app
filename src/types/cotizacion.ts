export type TipoServicio = 
  | 'instalacion-electrica'
  | 'reparacion-emergencia'
  | 'proyecto-construccion'
  | 'iluminacion'
  | 'panel-solar'
  | 'automatizacion'
  | 'certificacion';

export type Urgencia = 'normal' | 'urgente' | 'emergencia';

export type EstadoCotizacion = 'pendiente' | 'revisada' | 'cotizada' | 'aprobada' | 'rechazada';

export interface Cotizacion {
  id: string;
  fecha: string;
  
  // Datos del cliente
  cliente: {
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
    comuna: string;
  };
  
  // Detalles del servicio
  servicio: {
    tipo: TipoServicio;
    descripcion: string;
    urgencia: Urgencia;
    fotos?: string[]; // URLs de fotos subidas
    metrosCuadrados?: number; // Para proyectos de construcción
    puntosDeLuz?: number; // Para instalaciones eléctricas
  };
  
  // Presupuesto
  presupuesto: {
    estimadoAutomatico: number; // Cálculo automático inicial
    cotizacionFinal?: number; // Precio final del electricista
    detalleItems?: {
      concepto: string;
      cantidad: number;
      precioUnitario: number;
      subtotal: number;
    }[];
  };
  
  estado: EstadoCotizacion;
  notas?: string; // Notas internas del admin
}

export interface SolicitudCotizacion {
  cliente: Cotizacion['cliente'];
  servicio: Cotizacion['servicio'];
}
