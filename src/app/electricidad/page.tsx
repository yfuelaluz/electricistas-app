"use client";

import { services } from "../../components/services/ServiceList";

export default function ElectricidadPage() {
  const electricidad = services[0];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center py-8">
      <section className="w-full max-w-4xl bg-white shadow-md rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-6 text-blue-800">Electricidad</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Botón principal Electricidad */}
          <button className="rounded-lg border p-4 shadow hover:shadow-md text-left bg-white transition">
            <h3 className="font-bold text-lg mb-1">Electricidad - Servicios generales</h3>
            <p className="text-sm text-gray-600">{electricidad.description}</p>
          </button>
          {/* Subservicios Electricidad */}
          {electricidad.subservices!.map((sub) => (
            <button
              key={sub.id}
              className="rounded-lg border p-4 shadow hover:shadow-md text-left bg-gray-50 transition"
            >
              <h3 className="font-semibold text-base mb-1">{sub.title}</h3>
              <p className="text-sm text-gray-600">{sub.description}</p>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}