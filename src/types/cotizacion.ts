export type TipoServicio = 
  | 'instalacion-electrica'
  | 'reparacion-emergencia'
  | 'proyecto-construccion'
  | 'iluminacion'
  | 'panel-solar'
  | 'automatizacion'
  | 'certificacion'
  | 'carpinteria'
  | 'planos'
  | 'construccion'
  | 'fotovoltaico'
  | 'pintura'
  | 'soldadura'
  | 'gasfiteria'
  | 'muebles'
  | 'tramites-sec';

export type Urgencia = 'normal' | 'urgente' | 'emergencia';
export type TipoMadera = 'pino' | 'roble' | 'cedro';
export type Complejidad = 'simple' | 'media' | 'alta';
export type MaterialConstruccion = 'madera' | 'mixto' | 'hormigon';
export type TipoInstalacion = 'residencial' | 'comercial' | 'industrial';
export type TipoPintura = 'latex' | 'esmalte' | 'premium';
export type TipoTrabajoGasfiteria = 'reparacion' | 'instalacion' | 'reemplazo';
export type TipoMueble = 'estanteria' | 'cocina' | 'closet';
export type MaterialMueble = 'mdf' | 'melamina' | 'maciza';
export type TipoTE = 'TE1' | 'TE2' | 'TE3' | 'TE4' | 'TE5' | 'TE6';

export type EstadoCotizacion = 'pendiente' | 'respondida' | 'aprobada' | 'rechazada';

/**
 * Interface para respuestas a cotizaciones
 * NOTA: Aunque internamente usamos snake_case, estas propiedades se transforman
 * a camelCase en el frontend mediante toCamelCase()
 */
export interface RespuestaCotizacion {
  id: string;
  cotizacionId: string; // Mantenido en camelCase para compatibilidad frontend
  profesionalId: number; // Mantenido en camelCase para compatibilidad frontend
  profesional: {
    nombre: string;
    email: string;
    telefono: string;
    especialidad: string;
    valoracion?: number;
  };
  presupuesto: {
    monto: number;
    detalles: string;
    tiempoEstimado: string;
    validezOferta: string;
  };
  fecha: string;
  estado: 'enviada' | 'vista' | 'aceptada' | 'rechazada';
}

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
    metrosCuadrados?: number; // Para proyectos de construcción, carpintería, pintura, etc.
    puntosDeLuz?: number; // Para instalaciones eléctricas
    
    // Carpintería
    tipoMadera?: TipoMadera;
    
    // Planos
    numeroPisos?: number;
    complejidad?: Complejidad;
    
    // Construcción
    materialConstruccion?: MaterialConstruccion;
    
    // Fotovoltaico
    potenciaKw?: number;
    numeroPaneles?: number;
    tipoInstalacion?: TipoInstalacion;
    
    // Pintura
    manosPintura?: number;
    tipoPintura?: TipoPintura;
    
    // Soldadura
    metrosLineales?: number;
    
    // Gasfitería
    puntosTrabajo?: number;
    tipoTrabajoGasfiteria?: TipoTrabajoGasfiteria;
    
    // Muebles
    tipoMueble?: TipoMueble;
    materialMueble?: MaterialMueble;
    
    // Trámites SEC
    tipoTE?: TipoTE;
    express?: boolean;
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
  respuestas?: RespuestaCotizacion[]; // Respuestas de profesionales
  notas?: string; // Notas internas del admin
}

export interface SolicitudCotizacion {
  cliente: Cotizacion['cliente'];
  servicio: Cotizacion['servicio'];
}
