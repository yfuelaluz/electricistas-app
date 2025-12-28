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
  potenciaKW?: number;
  numeroPaneles?: number;
  tipoInstalacion?: TipoInstalacion;
  incluyeInversor?: boolean;
  incluyeSoportacion?: boolean;
  
  // Pintura
  numeroManos?: number;
  tipoPintura?: TipoPintura;
  
  // Muebles
  tipoMueble?: TipoMueble;
  materialMueble?: MaterialMueble;
  
  // Trámites SEC
  tipoTramiteSEC?: TipoTramiteSEC;
  esExpress?: boolean;
  
  // Gasfitería
  numeroPuntosAgua?: number;
  tipoTrabajoGasfiteria?: TipoTrabajoGasfiteria;
}

// ==================== CARPINTERÍA ====================
function calcularCarpinteria(params: ParametrosCalculo): number {
  const m2 = params.metrosCuadrados || 1;
  let presupuesto = m2 * 430000;
  
  // Multiplicador por tipo de madera
  const multiplicadorMadera: Record<TipoMadera, number> = {
    'pino': 1.2,
    'roble': 1.9,
    'cedro': 2.6
  };
  if (params.tipoMadera) {
    presupuesto *= multiplicadorMadera[params.tipoMadera];
  }
  
  // Multiplicador por urgencia
  const multiplicadorUrgencia: Record<Urgencia, number> = {
    'normal': 1.4,
    'urgente': 2.3,
    'emergencia': 2.9
  };
  if (params.urgencia) {
    presupuesto *= multiplicadorUrgencia[params.urgencia];
  }
  
  return presupuesto;
}

// ==================== PLANOS ====================
function calcularPlanos(params: ParametrosCalculo): number {
  let presupuesto = 150000; // Base
  
  const m2 = params.metrosCuadrados || 0;
  presupuesto += m2 * 15000;
  
  const pisos = params.numeroPisos || 1;
  presupuesto += pisos * 150000;
  
  // Multiplicador por complejidad
  const multiplicadorComplejidad: Record<string, number> = {
    'simple': 1.4,
    'media': 2.1,
    'alta': 2.7
  };
  if (params.complejidad && params.complejidad in multiplicadorComplejidad) {
    presupuesto *= multiplicadorComplejidad[params.complejidad];
  }
  
  return presupuesto;
}

// ==================== CONSTRUCCIONES NUEVAS ====================
function calcularConstrucciones(params: ParametrosCalculo): number {
  let presupuesto = 850000; // Base
  
  const m2 = params.metrosCuadrados || 0;
  presupuesto += m2 * 435000;
  
  const pisos = params.numeroPisos || 1;
  presupuesto += pisos * 250000;
  
  // Multiplicador por material
  const multiplicadorMaterial: Record<MaterialConstruccion, number> = {
    'madera': 1.4,
    'mixto': 2.3,
    'hormigon': 2.8
  };
  if (params.materialConstruccion) {
    presupuesto *= multiplicadorMaterial[params.materialConstruccion];
  }
  
  return presupuesto;
}

// ==================== PROYECTOS FOTOVOLTAICOS ====================
function calcularFotovoltaicos(params: ParametrosCalculo): number {
  let presupuesto = 1500000; // Base
  
  const kw = params.potenciaKW || 0;
  presupuesto += kw * 85000;
  
  const paneles = params.numeroPaneles || 0;
  presupuesto += paneles * 175000;
  
  // Inversor solar
  if (params.incluyeInversor && kw > 0) {
    presupuesto += 3000000 * kw;
  }
  
  // Soportación
  if (params.incluyeSoportacion && paneles > 0) {
    presupuesto += 350000 * paneles;
  }
  
  // Multiplicador por tipo de instalación
  const multiplicadorTipo: Record<TipoInstalacion, number> = {
    'residencial': 1.6,
    'comercial': 2.4,
    'industrial': 3.3
  };
  if (params.tipoInstalacion) {
    presupuesto *= multiplicadorTipo[params.tipoInstalacion];
  }
  
  return presupuesto;
}

// ==================== PINTURA ====================
function calcularPintura(params: ParametrosCalculo): number {
  let presupuesto = 120000; // Base
  
  const m2 = params.metrosCuadrados || 0;
  presupuesto += m2 * 22000;
  
  const manos = params.numeroManos || 1;
  presupuesto += manos * 5500 * m2;
  
  // Multiplicador por tipo de pintura
  const multiplicadorPintura: Record<TipoPintura, number> = {
    'latex': 1.3,
    'esmalte': 1.9,
    'premium': 2.6
  };
  if (params.tipoPintura) {
    presupuesto *= multiplicadorPintura[params.tipoPintura];
  }
  
  return presupuesto;
}

// ==================== SOLDADURA ====================
function calcularSoldadura(params: ParametrosCalculo): number {
  let presupuesto = 250000; // Base
  
  const metros = params.metrosLineales || 0;
  presupuesto += metros * 70000;
  
  // Multiplicador por complejidad
  const multiplicadorComplejidad: Record<string, number> = {
    'basica': 1.4,
    'media': 2.5,
    'alta': 3.8
  };
  if (params.complejidad && params.complejidad in multiplicadorComplejidad) {
    presupuesto *= multiplicadorComplejidad[params.complejidad];
  }
  
  return presupuesto;
}

// ==================== GASFITERÍA ====================
function calcularGasfiteria(params: ParametrosCalculo): number {
  let presupuesto = 130000; // Base
  
  const puntos = params.numeroPuntosAgua || 0;
  presupuesto += puntos * 47500;
  
  // Multiplicador por tipo de trabajo
  const multiplicadorTrabajo: Record<TipoTrabajoGasfiteria, number> = {
    'reparacion': 1.4,
    'instalacion': 2.5,
    'reemplazo': 3.2
  };
  if (params.tipoTrabajoGasfiteria) {
    presupuesto *= multiplicadorTrabajo[params.tipoTrabajoGasfiteria];
  }
  
  // Multiplicador por urgencia
  const multiplicadorUrgencia: Record<Urgencia, number> = {
    'normal': 1.4,
    'urgente': 2.3,
    'emergencia': 3.5
  };
  if (params.urgencia) {
    presupuesto *= multiplicadorUrgencia[params.urgencia];
  }
  
  return presupuesto;
}

// ==================== MUEBLES ====================
function calcularMuebles(params: ParametrosCalculo): number {
  let presupuesto = 25000; // Base
  
  const metros = params.metrosLineales || 0;
  presupuesto += metros * 180000;
  
  // Multiplicador por tipo de mueble
  const multiplicadorMueble: Record<TipoMueble, number> = {
    'estanteria': 1.4,
    'cocina': 2.3,
    'closet': 2.5
  };
  if (params.tipoMueble) {
    presupuesto *= multiplicadorMueble[params.tipoMueble];
  }
  
  // Multiplicador por material
  const multiplicadorMaterial: Record<MaterialMueble, number> = {
    'mdf': 1.3,
    'melamina': 2.3,
    'maciza': 3.3
  };
  if (params.materialMueble) {
    presupuesto *= multiplicadorMaterial[params.materialMueble];
  }
  
  return presupuesto;
}

// ==================== TRÁMITES SEC ====================
function calcularTramitesSEC(params: ParametrosCalculo): number {
  let presupuesto = 200000; // Base
  
  const kw = params.potenciaKW || 0;
  presupuesto += kw * 25000;
  
  // Multiplicador por tipo de trámite
  const multiplicadorTramite: Record<TipoTramiteSEC, number> = {
    'te1': 1.3,
    'te2': 1.5,
    'te3': 1.7,
    'te4': 2.2,
    'te5': 2.5,
    'te6': 2.8
  };
  if (params.tipoTramiteSEC) {
    presupuesto *= multiplicadorTramite[params.tipoTramiteSEC];
  }
  
  // Multiplicador por urgencia
  if (params.esExpress) {
    presupuesto *= 2.5;
  } else {
    presupuesto *= 1.3; // Normal
  }
  
  return presupuesto;
}

// ==================== ELECTRICIDAD (Original) ====================
function calcularElectricidad(params: ParametrosCalculo): number {
  let presupuesto = 150000; // Base
  
  const puntos = params.puntosDeLuz || 0;
  presupuesto += puntos * 25000;
  
  // Multiplicador por urgencia
  const multiplicadorUrgencia: Record<Urgencia, number> = {
    'normal': 1.4,
    'urgente': 1.6,
    'emergencia': 2.5
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
    'construcciones': calcularConstrucciones,
    'fotovoltaico': calcularFotovoltaicos,
    'pintura': calcularPintura,
    'soldadura': calcularSoldadura,
    'gasfiteria': calcularGasfiteria,
    'mueblistas': calcularMuebles,
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
