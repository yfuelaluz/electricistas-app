"use client";

import { generalServices } from "../../components/services/ServiceList";

export default function ServiciosPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center py-8">
      <section className="w-full max-w-4xl bg-white shadow-md rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-6 text-slate-800">Otros servicios</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {generalServices.map((service) => (
            <button
              key={service.id}
              className="rounded-lg border p-4 shadow hover:shadow-md text-left bg-white transition"
            >
              <h3 className="font-bold text-lg mb-1">{service.title}</h3>
              <p className="text-sm text-gray-600">{service.description}</p>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}