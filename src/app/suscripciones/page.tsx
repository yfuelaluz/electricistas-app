'use client';
import React, { useState } from 'react';
import Navigation from '../../components/ui/Navigation';
import Footer from '../../components/ui/Footer';
import SubscriptionPlans from '../../components/services/SubscriptionPlans';
import { Button } from '../../components/ui/button';

export default function SuscripcionesPage() {
  const [userType, setUserType] = useState<'client' | 'professional'>('client');
  
  const handleSelectPlan = (planId: string) => {
    console.log('Plan seleccionado:', planId);
    // Aquí irá la lógica de selección de plan
    alert(`Has seleccionado el plan: ${planId}`);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 opacity-70" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzYjgyZjYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgOC44MzctNy4xNjMgMTYtMTYgMTZTNCAxNi44MzcgNCA4czMuMTYzLTE2IDE2LTE2IDE2IDcuMTYzIDE2IDE2em0tMTYgMGMwIDQuNDE4LTMuNTgyIDgtOCA4cy04LTMuNTgyLTgtOCAzLjU4Mi04IDgtOCA4IDMuNTgyIDggOHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">Elige el plan perfecto</span>
              <br />
              <span className="text-secondary-900">para ti</span>
            </h1>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto mb-8">
              Comienza gratis o potencia tu experiencia con nuestros planes premium.
              Sin compromisos, cancela cuando quieras.
            </p>
            
            {/* Toggle usuario */}
            <div className="inline-flex items-center gap-1 bg-white p-1.5 rounded-2xl shadow-card">
              <button
                onClick={() => setUserType('client')}
                className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                  userType === 'client'
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-button'
                    : 'text-secondary-600 hover:bg-secondary-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Soy Cliente
                </div>
              </button>
              <button
                onClick={() => setUserType('professional')}
                className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                  userType === 'professional'
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-button'
                    : 'text-secondary-600 hover:bg-secondary-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Soy Profesional
                </div>
              </button>
            </div>
          </div>
        </section>
        
        {/* Planes */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <SubscriptionPlans
            userType={userType}
            onSelectPlan={handleSelectPlan}
          />
        </section>
        
        {/* Features adicionales */}
        <section className="py-20 bg-gradient-to-br from-primary-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-4 gradient-text">
              Todo lo que necesitas
            </h2>
            <p className="text-center text-secondary-600 mb-16 text-lg">
              Herramientas profesionales para hacer crecer tu negocio
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="card-modern text-center p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-secondary-900 mb-3">
                  Pagos Seguros
                </h3>
                <p className="text-secondary-600">
                  Procesamiento de pagos encriptado y protección contra fraudes para todas las transacciones.
                </p>
              </div>
              
              <div className="card-modern text-center p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-secondary-900 mb-3">
                  Análisis Avanzado
                </h3>
                <p className="text-secondary-600">
                  Estadísticas detalladas sobre tus servicios, ganancias y rendimiento en la plataforma.
                </p>
              </div>
              
              <div className="card-modern text-center p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-secondary-900 mb-3">
                  Soporte 24/7
                </h3>
                <p className="text-secondary-600">
                  Equipo de soporte disponible todo el día para ayudarte con cualquier consulta o problema.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Final */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="card-modern p-12 bg-gradient-to-br from-primary-600 to-accent-600 text-white">
              <h2 className="text-4xl font-bold mb-6">
                ¿Listo para comenzar?
              </h2>
              <p className="text-xl mb-8 text-white/90">
                Únete a miles de profesionales y clientes que confían en nuestra plataforma
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-white text-primary-600 hover:bg-white/90"
                >
                  Registrarse gratis
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                >
                  Hablar con ventas
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
