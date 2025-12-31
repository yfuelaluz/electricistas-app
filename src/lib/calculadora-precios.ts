import { TipoServicio, Urgencia } from '@/types/cotizacion';

// Tipos para materiales y complejidades
export type TipoMadera = 'pino' | 'roble' | 'cedro';
export type Complejidad = 'simple' | 'media' | 'alta' | 'basica';
export type MaterialConstruccion = 'madera' | 'mixto' | 'hormigon';
export type TipoInstalacion = 'residencial' | 'comercial' | 'industrial';
export type TipoPintura = 'latex' | 'esmalte' | 'premium';
export type TipoMueble = 'estanteria' | 'cocina' | 'closet';
export type MaterialMueble = 'mdf' | 'melamina' | 'maciza';
export type TipoTramiteSEC = 'te1' | 'te2' | 'te3' | 'te4' | 'te5' | 'te6';
export type TipoTrabajoGasfiteria = 'reparacion' | 'instalacion' | 'reemplazo';

interface ParametrosCalculo {
  tipo: TipoServicio;
  urgencia?: Urgencia;
  
  // Parámetros comunes
  metrosCuadrados?: number;
  metrosLineales?: number;
  
  // Electricidad
  puntosDeLuz?: number;
  
  // Carpintería
  tipoMadera?: TipoMadera;
  
  // Planos y Construcción
  numeroPisos?: number;
  complejidad?: Complejidad;
  materialConstruccion?: MaterialConstruccion;
  
  // Fotovoltaicos
  potenciaKw?: number;
  numeroPaneles?: number;
  tipoInstalacion?: TipoInstalacion;
  incluyeInversor?: boolean;
  incluyeSoportacion?: boolean;
  
  // Pintura
  manosPintura?: number;
  tipoPintura?: TipoPintura;
  
  // Muebles
  tipoMueble?: TipoMueble;
  materialMueble?: MaterialMueble;
  
  // Trámites SEC
  tipoTE?: string;
  express?: boolean;
  
  // Gasfitería
  puntosTrabajo?: number;
  tipoTrabajoGasfiteria?: TipoTrabajoGasfiteria;
}

// ==================== CARPINTERÍA ====================
function calcularCarpinteria(params: ParametrosCalculo): number {
  const m2 = params.metrosCuadrados || 1;
  let presupuesto = m2 * 150000;
  
  // Multiplicador por tipo de madera
  const multiplicadorMadera: Record<TipoMadera, number> = {
    'pino': 1.2,
    'roble': 1.4,
    'cedro': 1.9
  };
  if (params.tipoMadera) {
    presupuesto *= multiplicadorMadera[params.tipoMadera];
  }
  
  // Multiplicador por urgencia
  const multiplicadorUrgencia: Record<Urgencia, number> = {
    'normal': 1.2,
    'urgente': 1.4,
    'emergencia': 1.9
  };
  if (params.urgencia) {
    presupuesto *= multiplicadorUrgencia[params.urgencia];
  }
  
  return presupuesto;
}

// ==================== PLANOS ====================
function calcularPlanos(params: ParametrosCalculo): number {
  let presupuesto = 70000; // Base
  
  const m2 = params.metrosCuadrados || 0;
  presupuesto += m2 * 8000;
  
  const pisos = params.numeroPisos || 1;
  presupuesto += pisos * 30000;
  
  // Multiplicador por complejidad
  const multiplicadorComplejidad: Record<string, number> = {
    'simple': 1.2,
    'media': 1.4,
    'alta': 1.9
  };
  if (params.complejidad && params.complejidad in multiplicadorComplejidad) {
    presupuesto *= multiplicadorComplejidad[params.complejidad];
  }
  
  return presupuesto;
}

// ==================== CONSTRUCCIONES NUEVAS ====================
function calcularConstrucciones(params: ParametrosCalculo): number {
  let presupuesto = 200000; // Base
  
  const m2 = params.metrosCuadrados || 0;
  presupuesto += m2 * 430000;
  
  const pisos = params.numeroPisos || 1;
  presupuesto += pisos * 150000;
  
  // Multiplicador por material
  const multiplicadorMaterial: Record<MaterialConstruccion, number> = {
    'madera': 1.2,
    'mixto': 1.5,
    'hormigon': 2.2
  };
  if (params.materialConstruccion) {
    presupuesto *= multiplicadorMaterial[params.materialConstruccion];
  }
  
  return presupuesto;
}

// ==================== PROYECTOS FOTOVOLTAICOS ====================
function calcularFotovoltaicos(params: ParametrosCalculo): number {
  let presupuesto = 250000; // Base
  
  const kw = params.potenciaKw || 0;
  presupuesto += kw * 50000;
  
  const paneles = params.numeroPaneles || 0;
  presupuesto += paneles * 100000;
  
  // Inversor solar (siempre incluido)
  if (kw > 0) {
    presupuesto += 2000000 * kw;
  }
  
  // Soportación (siempre incluida)
  if (paneles > 0) {
    presupuesto += 200000 * paneles;
  }
  
  // Multiplicador por tipo de instalación
  const multiplicadorTipo: Record<TipoInstalacion, number> = {
    'residencial': 1.2,
    'comercial': 1.6,
    'industrial': 2.2
  };
  if (params.tipoInstalacion) {
    presupuesto *= multiplicadorTipo[params.tipoInstalacion];
  }
  
  return presupuesto;
}

// ==================== PINTURA ====================
function calcularPintura(params: ParametrosCalculo): number {
  let presupuesto = 70000; // Base
  
  const m2 = params.metrosCuadrados || 0;
  presupuesto += m2 * 12000;
  
  const manos = params.manosPintura || 1;
  presupuesto += manos * 3000 * m2;
  
  // Multiplicador por tipo de pintura
  const multiplicadorPintura: Record<TipoPintura, number> = {
    'latex': 1.2,
    'esmalte': 1.5,
    'premium': 1.9
  };
  if (params.tipoPintura) {
    presupuesto *= multiplicadorPintura[params.tipoPintura];
  }
  
  return presupuesto;
}

// ==================== SOLDADURA ====================
function calcularSoldadura(params: ParametrosCalculo): number {
  let presupuesto = 100000; // Base
  
  const metros = params.metrosLineales || 0;
  presupuesto += metros * 50000;
  
  // Multiplicador por complejidad
  const multiplicadorComplejidad: Record<string, number> = {
    'basica': 1.2,
    'media': 1.5,
    'alta': 2.2
  };
  if (params.complejidad && params.complejidad in multiplicadorComplejidad) {
    presupuesto *= multiplicadorComplejidad[params.complejidad];
  }
  
  return presupuesto;
}

// ==================== GASFITERÍA ====================
function calcularGasfiteria(params: ParametrosCalculo): number {
  let presupuesto = 70000; // Base
  
  const puntos = params.puntosTrabajo || 0;
  presupuesto += puntos * 15000;
  
  // Multiplicador por tipo de trabajo
  const multiplicadorTrabajo: Record<TipoTrabajoGasfiteria, number> = {
    'reparacion': 1.2,
    'instalacion': 1.5,
    'reemplazo': 1.9
  };
  if (params.tipoTrabajoGasfiteria) {
    presupuesto *= multiplicadorTrabajo[params.tipoTrabajoGasfiteria];
  }
  
  // Multiplicador por urgencia
  const multiplicadorUrgencia: Record<Urgencia, number> = {
    'normal': 1.2,
    'urgente': 1.5,
    'emergencia': 2.2
  };
  if (params.urgencia) {
    presupuesto *= multiplicadorUrgencia[params.urgencia];
  }
  
  return presupuesto;
}

// ==================== MUEBLES ====================
function calcularMuebles(params: ParametrosCalculo): number {
  let presupuesto = 50000; // Base
  
  const metros = params.metrosLineales || 0;
  presupuesto += metros * 80000;
  
  // Multiplicador por tipo de mueble
  const multiplicadorMueble: Record<TipoMueble, number> = {
    'estanteria': 1.2,
    'cocina': 1.5,
    'closet': 2.2
  };
  if (params.tipoMueble) {
    presupuesto *= multiplicadorMueble[params.tipoMueble];
  }
  
  // Multiplicador por material
  const multiplicadorMaterial: Record<MaterialMueble, number> = {
    'mdf': 1.2,
    'melamina': 1.5,
    'maciza': 2.2
  };
  if (params.materialMueble) {
    presupuesto *= multiplicadorMaterial[params.materialMueble];
  }
  
  return presupuesto;
}

// ==================== TRÁMITES SEC ====================
function calcularTramitesSEC(params: ParametrosCalculo): number {
  let presupuesto = 90000; // Base
  
  const kw = params.potenciaKw || 0;
  presupuesto += kw * 25000;
  
  // Multiplicador por tipo de trámite
  const multiplicadorTramite: Record<string, number> = {
    'TE1': 1.2,
    'TE2': 1.4,
    'TE3': 1.6,
    'TE4': 1.8,
    'TE5': 2.0,
    'TE6': 2.2
  };
  if (params.tipoTE && params.tipoTE in multiplicadorTramite) {
    presupuesto *= multiplicadorTramite[params.tipoTE];
  }
  
  // Multiplicador por urgencia
  if (params.express) {
    presupuesto *= 1.5;
  } else {
    presupuesto *= 1.2; // Normal
  }
  
  return presupuesto;
}

// ==================== ELECTRICIDAD (Original) ====================
function calcularElectricidad(params: ParametrosCalculo): number {
  let presupuesto = 70000; // Base
  
  const puntos = params.puntosDeLuz || 0;
  presupuesto += puntos * 25000;
  
  // Multiplicador por urgencia
  const multiplicadorUrgencia: Record<Urgencia, number> = {
    'normal': 1.2,
    'urgente': 1.4,
    'emergencia': 1.9
  };
  if (params.urgencia) {
    presupuesto *= multiplicadorUrgencia[params.urgencia];
  }
  
  return presupuesto;
}

// ==================== FUNCIÓN PRINCIPAL ====================
export function calcularPresupuestoEstimado(params: ParametrosCalculo): number {
  let presupuesto = 0;
  
  // Mapeo de servicios a funciones de cálculo
  const calculadoras: Record<string, (p: ParametrosCalculo) => number> = {
    'carpinteria': calcularCarpinteria,
    'planos': calcularPlanos,
    'construccion': calcularConstrucciones,
    'fotovoltaico': calcularFotovoltaicos,
    'pintura': calcularPintura,
    'soldadura': calcularSoldadura,
    'gasfiteria': calcularGasfiteria,
    'muebles': calcularMuebles,
    'tramites-sec': calcularTramitesSEC,
    
    // Servicios eléctricos (mantener compatibilidad)
    'instalacion-electrica': calcularElectricidad,
    'reparacion-emergencia': calcularElectricidad,
    'proyecto-construccion': calcularElectricidad,
    'iluminacion': calcularElectricidad,
    'panel-solar': calcularElectricidad,
    'automatizacion': calcularElectricidad,
    'certificacion': calcularElectricidad,
    'electricidad': calcularElectricidad
  };
  
  const calculadora = calculadoras[params.tipo];
  if (calculadora) {
    presupuesto = calculadora(params);
  } else {
    // Fallback para servicios no implementados
    presupuesto = 100000;
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
