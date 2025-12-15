import React from "react";

export type Subservice = {
  id: string;
  title: string;
  description?: string;
};

export type Service = {
  id: string;
  title: string;
  description?: string;
  subservices?: Subservice[];
};

export const services: Service[] = [
  {
    id: "electricidad",
    title: "Electricidad",
    description: "Servicios eléctricos generales y especializados.",
    subservices: [
      { id: "mantenciones", title: "Mantenciones", description: "Prevención y revisión periódica de instalaciones eléctricas." },
      { id: "planos", title: "Planos eléctricos", description: "Diseño y regularización de planos eléctricos." },
      { id: "tramites-sec", title: "Trámites SEC", description: "Gestión de boletines y trámites ante la Superintendencia (SEC)." },
      { id: "asesorias", title: "Asesorías", description: "Consultoría técnica para proyectos eléctricos y normativas." },
      { id: "proyectos-fotovoltaicos", title: "Proyectos fotovoltaicos", description: "Instalación y diseño de paneles solares." },
      { id: "emergencias", title: "Emergencias", description: "Atención 24/7 para averías graves y cortes de energía." },
      { id: "visitas-tecnicas", title: "Visitas técnicas", description: "Inspección en terreno para presupuestos y diagnósticos." },
      { id: "mallas-tierra", title: "Mallas a tierra", description: "Instalación y revisión de sistemas de puesta a tierra." },
    ]
  },
  {
    id: "carpinteria",
    title: "Carpintería",
    description: "Muebles, puertas, pisos, terrazas y restauraciones en madera.",
    subservices: [
      { id: "muebles-medida", title: "Muebles a medida", description: "Diseño y fabricación de muebles personalizados." },
      { id: "puertas-ventanas", title: "Puertas y ventanas", description: "Instalación y reparación de puertas y ventanas de madera." },
      { id: "piso-flotante", title: "Piso flotante/parquet", description: "Colocación y renovación de pisos flotantes y parquet." },
      { id: "closets", title: "Closets y roperos", description: "Diseño y armado de closets y guardarropas." },
      { id: "cocinas", title: "Muebles de cocina", description: "Fabricación e instalación de muebles de cocina." },
      { id: "terrazas-pergolas", title: "Terrazas y pérgolas", description: "Estructuras de exterior en madera." },
      { id: "restauraciones", title: "Restauraciones", description: "Reparación y restauración de muebles antiguos." },
      { id: "otros-carpinteria", title: "Otros trabajos", description: "Consultas, detalles o proyectos especiales en carpintería." },
    ]
  },
];

// Servicios generales sin subservicios
export const generalServices: Service[] = [
  {
    id: "construccion",
    title: "Construcción de casas",
    description: "Obra nueva, ampliaciones, dirección de obra, asesoría integral.",
  },
  {
    id: "remodelaciones",
    title: "Remodelaciones",
    description: "Cocinas, baños, oficinas, renovación de espacios y terminaciones.",
  },
  {
    id: "pisos",
    title: "Cambios de pisos",
    description: "Cerámica, porcelanato, piso flotante, parquet o vinílico.",
  },
  {
    id: "techumbres",
    title: "Techumbres",
    description: "Reparación, mantención o instalación de techos.",
  },
  {
    id: "quinchos",
    title: "Construcción de quinchos y terrazas",
    description: "Espacios de esparcimiento, parrillas, terrazas y obras exteriores.",
  }
];

export function ServiceList({ onSelect }: { onSelect: (serviceId: string) => void }) {
  return (
    <div className="flex flex-col gap-12">
      {/* Sección Electricidad */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-brand-700">Electricidad</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Botón principal Electricidad */}
          <button
            className="btn-principal text-left w-full"
            onClick={() => onSelect("electricidad")}
          >
            <h3 className="font-bold text-lg mb-1">Electricidad - Servicios generales</h3>
            <p className="text-sm text-gray-600">{services[0].description}</p>
          </button>
          {/* Subservicios Electricidad */}
          {services[0].subservices!.map((sub) => (
            <button
              key={sub.id}
              className="rounded-lg border p-4 shadow hover:shadow-lg text-left bg-white transition hover:bg-brand-50"
              onClick={() => onSelect(`electricidad:${sub.id}`)}
            >
              <h3 className="font-semibold text-base mb-1">{sub.title}</h3>
              <p className="text-sm text-gray-600">{sub.description}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Sección Carpintería */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-brand-700">Carpintería</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Botón principal Carpintería */}
          <button
            className="btn-principal text-left w-full"
            onClick={() => onSelect("carpinteria")}
          >
            <h3 className="font-bold text-lg mb-1">Carpintería - Servicios generales</h3>
            <p className="text-sm text-gray-600">{services[1].description}</p>
          </button>
          {/* Subservicios Carpintería */}
          {services[1].subservices!.map((sub) => (
            <button
              key={sub.id}
              className="rounded-lg border p-4 shadow hover:shadow-lg text-left bg-white transition hover:bg-brand-50"
              onClick={() => onSelect(`carpinteria:${sub.id}`)}
            >
              <h3 className="font-semibold text-base mb-1">{sub.title}</h3>
              <p className="text-sm text-gray-600">{sub.description}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Otros servicios generales */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-brand-700">Otros servicios</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {generalServices.map((service) => (
            <button
              key={service.id}
              className="rounded-lg border p-4 shadow hover:shadow-lg text-left bg-white transition hover:bg-brand-50"
              onClick={() => onSelect(service.id)}
            >
              <h3 className="font-bold text-lg mb-1">{service.title}</h3>
              <p className="text-sm text-gray-600">{service.description}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}