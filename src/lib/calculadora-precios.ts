import { TipoServicio, Urgencia } from '@/types/cotizacion';

interface ParametrosCalculo {
  tipo: TipoServicio;
  urgencia: Urgencia;
  metrosCuadrados?: number;
  puntosDeLuz?: number;
}

// Precios base por tipo de servicio (en CLP)
const PRECIOS_BASE: Record<TipoServicio, number> = {
  'instalacion-electrica': 150000,
  'reparacion-emergencia': 50000,
  'proyecto-construccion': 500000,
  'iluminacion': 80000,
  'panel-solar': 800000,
  'automatizacion': 200000,
  'certificacion': 120000,
};

// Multiplicadores por urgencia
const MULTIPLICADOR_URGENCIA: Record<Urgencia, number> = {
  'normal': 1.4,
  'urgente': 1.6,
  'emergencia': 2.5,
};

// Costo por punto de luz adicional
const COSTO_POR_PUNTO_LUZ = 25000;

// Costo por m² en proyectos de construcción
const COSTO_POR_M2_CONSTRUCCION = 15000;

export function calcularPresupuestoEstimado(params: ParametrosCalculo): number {
  let presupuesto = PRECIOS_BASE[params.tipo];
  
  // Aplicar multiplicador de urgencia
  presupuesto *= MULTIPLICADOR_URGENCIA[params.urgencia];
  
  // Agregar costos adicionales según tipo de servicio
  if (params.tipo === 'instalacion-electrica' && params.puntosDeLuz) {
    presupuesto += params.puntosDeLuz * COSTO_POR_PUNTO_LUZ;
  }
  
  if (params.tipo === 'proyecto-construccion' && params.metrosCuadrados) {
    presupuesto += params.metrosCuadrados * COSTO_POR_M2_CONSTRUCCION;
  }
  
  // Redondear a miles
  return Math.round(presupuesto / 1000) * 1000;
}

export function formatearPrecio(precio: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(precio);
}
