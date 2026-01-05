'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface PromoStats {
  profesionales_registrados: number;
  clientes_registrados: number;
  profesionales_restantes: number;
  clientes_restantes: number;
}

export default function PromoLanding() {
  const [stats, setStats] = useState<PromoStats>({
    profesionales_registrados: 0,
    clientes_registrados: 0,
    profesionales_restantes: 25,
    clientes_restantes: 25
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPromoStats();
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchPromoStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchPromoStats = async () => {
    try {
      const response = await fetch('/api/promo/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching promo stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center text-white mb-16">
          <div className="mb-6">
            <span className="inline-block bg-yellow-400 text-blue-900 px-6 py-2 rounded-full font-bold text-sm animate-pulse">
              🎁 OFERTA DE LANZAMIENTO
            </span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-6 drop-shadow-lg">
            2 MESES
            <span className="block text-yellow-400">POR EL PRECIO DE 1</span>
          </h1>

          <p className="text-2xl md:text-3xl mb-8 font-light">
            ¡Solo para los primeros 50 registros!
          </p>

          {/* Contador de Cupos */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Profesionales */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border-2 border-white/20">
                <div className="text-yellow-400 text-lg font-semibold mb-4">
                  ⚡ PROFESIONALES
                </div>
                <div className="text-6xl font-bold mb-4">
                  {loading ? '...' : stats.profesionales_restantes}
                </div>
                <div className="text-xl mb-4">
                  Cupos Restantes
                </div>
                <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-yellow-400 h-full transition-all duration-500 rounded-full"
                    style={{ 
                      width: `${((25 - stats.profesionales_restantes) / 25) * 100}%` 
                    }}
                  />
                </div>
                <div className="text-sm mt-2 opacity-80">
                  {stats.profesionales_registrados} de 25 registrados
                </div>
              </div>

              {/* Clientes */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border-2 border-white/20">
                <div className="text-yellow-400 text-lg font-semibold mb-4">
                  👥 CLIENTES
                </div>
                <div className="text-6xl font-bold mb-4">
                  {loading ? '...' : stats.clientes_restantes}
                </div>
                <div className="text-xl mb-4">
                  Cupos Restantes
                </div>
                <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-yellow-400 h-full transition-all duration-500 rounded-full"
                    style={{ 
                      width: `${((25 - stats.clientes_restantes) / 25) * 100}%` 
                    }}
                  />
                </div>
                <div className="text-sm mt-2 opacity-80">
                  {stats.clientes_registrados} de 25 registrados
                </div>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <Link 
              href="/profesionales/registro?promo=2x1"
              className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold text-xl px-12 py-6 rounded-full shadow-2xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ⚡ Soy Profesional
            </Link>
            
            <Link 
              href="/clientes/registro?promo=2x1"
              className="bg-white hover:bg-gray-100 text-blue-900 font-bold text-xl px-12 py-6 rounded-full shadow-2xl transform hover:scale-105 transition-all"
            >
              👤 Soy Cliente
            </Link>
          </div>
        </div>

        {/* Beneficios - Profesionales */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="bg-white rounded-3xl p-10 shadow-2xl">
            <h2 className="text-4xl font-bold text-blue-900 mb-8 text-center">
              🏗️ Beneficios para Profesionales
            </h2>
            <div className="mb-8 text-center">
              <p className="text-lg text-gray-700 mb-4">Para todas las especialidades:</p>
              <div className="flex flex-wrap justify-center gap-3">
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full">⚡ Electricistas</span>
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full">🪵 Carpinteros</span>
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full">🎨 Pintores</span>
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full">🔧 Gasfiteros</span>
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full">⚙️ Soldadores</span>
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full">🏠 Constructores</span>
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full">☀️ Fotovoltaico</span>
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full">📐 Planos</span>
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full">📋 Trámites SEC</span>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl mb-4">💼</div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">Portfolio Digital</h3>
                <p className="text-gray-600">Muestra tus mejores trabajos y atrae más clientes</p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">Dashboard Completo</h3>
                <p className="text-gray-600">Estadísticas en tiempo real de tus cotizaciones</p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">💰</div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">Pagos Seguros</h3>
                <p className="text-gray-600">Recibe pagos por Webpay directamente</p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">Leads Calificados</h3>
                <p className="text-gray-600">Solo clientes reales buscando tus servicios</p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">⭐</div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">Sistema de Reviews</h3>
                <p className="text-gray-600">Construye tu reputación profesional</p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">📱</div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">Notificaciones</h3>
                <p className="text-gray-600">Alertas instantáneas de nuevas oportunidades</p>
              </div>
            </div>

            <div className="mt-10 p-6 bg-blue-50 rounded-xl">
              <h3 className="text-2xl font-bold text-blue-900 mb-4 text-center">
                📋 Planes Disponibles
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-lg border-2 border-blue-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-900 mb-2">🌟 Starter</div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">3 leads/mes</div>
                    <div className="text-sm text-gray-600">Perfecto para empezar</div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg border-2 border-blue-400 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 px-4 py-1 rounded-full text-xs font-bold">
                    POPULAR
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-900 mb-2">🚀 Pro</div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">10 leads/mes</div>
                    <div className="text-sm text-gray-600">Para crecer tu negocio</div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg border-2 border-yellow-400">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-900 mb-2">👑 Elite</div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">Ilimitado</div>
                    <div className="text-sm text-gray-600">Máximo crecimiento</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Beneficios - Clientes */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="bg-white rounded-3xl p-10 shadow-2xl">
            <h2 className="text-4xl font-bold text-blue-900 mb-8 text-center">
              🏠 Beneficios para Clientes
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">Verificados</h3>
                <p className="text-gray-600">Todos los profesionales están certificados</p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">💵</div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">Compara Precios</h3>
                <p className="text-gray-600">Recibe múltiples cotizaciones y elige la mejor</p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">🔒</div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">Pago Seguro</h3>
                <p className="text-gray-600">Paga con Webpay, 100% protegido</p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">⭐</div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">Reviews Reales</h3>
                <p className="text-gray-600">Lee opiniones de otros clientes</p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">📱</div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">Seguimiento</h3>
                <p className="text-gray-600">Monitorea el estado de tu proyecto</p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">💬</div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">Chat Directo</h3>
                <p className="text-gray-600">Comunícate con los profesionales fácilmente</p>
              </div>
            </div>
          </div>
        </div>

        {/* Urgencia */}
        <div className="text-center text-white mb-12">
          <div className="bg-red-500 inline-block px-8 py-4 rounded-full shadow-2xl animate-pulse">
            <p className="text-2xl font-bold">
              ⏰ ¡La oferta termina cuando se completen los 50 cupos!
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-10 shadow-2xl">
            <h2 className="text-4xl font-bold text-blue-900 mb-8 text-center">
              ❓ Preguntas Frecuentes
            </h2>
            
            <div className="space-y-6">
              <details className="group">
                <summary className="font-bold text-lg text-blue-900 cursor-pointer list-none flex justify-between items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100">
                  ¿Qué especialidades están incluidas?
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 text-gray-600">
                  Todas las especialidades de construcción y servicios: Electricistas, Carpinteros, Mueblistas, Pintores, Gasfiteros, Soldadores, Constructores, Especialistas en Energía Solar/Fotovoltaica, Diseñadores de Planos y Gestores de Trámites SEC.
                </div>
              </details>

              <details className="group">
                <summary className="font-bold text-lg text-blue-900 cursor-pointer list-none flex justify-between items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100">
                  ¿Cómo funciona la promoción 2x1?
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 text-gray-600">
                  Pagas 1 mes y obtienes acceso por 2 meses completos. La promoción aplica solo para los primeros 25 profesionales y 25 clientes que se registren.
                </div>
              </details>

              <details className="group">
                <summary className="font-bold text-lg text-blue-900 cursor-pointer list-none flex justify-between items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100">
                  ¿Cuándo debo pagar?
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 text-gray-600">
                  El pago se realiza al momento del registro. Puedes pagar con tarjeta de crédito o débito a través de Webpay Plus (Transbank).
                </div>
              </details>

              <details className="group">
                <summary className="font-bold text-lg text-blue-900 cursor-pointer list-none flex justify-between items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100">
                  ¿Puedo cancelar en cualquier momento?
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 text-gray-600">
                  Sí, puedes cancelar tu suscripción cuando quieras. No hay permanencia mínima después de los 2 meses promocionales.
                </div>
              </details>

              <details className="group">
                <summary className="font-bold text-lg text-blue-900 cursor-pointer list-none flex justify-between items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100">
                  ¿Qué pasa después de los 2 meses?
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 text-gray-600">
                  Después de los 2 meses, tu suscripción continúa al precio regular mensual del plan que elegiste. Puedes cancelar o cambiar de plan cuando quieras.
                </div>
              </details>

              <details className="group">
                <summary className="font-bold text-lg text-blue-900 cursor-pointer list-none flex justify-between items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100">
                  ¿Los profesionales están verificados?
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 text-gray-600">
                  Sí, todos los profesionales son verificados por nuestro equipo antes de ser activados en la plataforma. Validamos certificaciones, experiencia y documentación.
                </div>
              </details>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center text-white mt-20">
          <h2 className="text-4xl font-bold mb-6">
            ¿Listo para aprovechar la oferta?
          </h2>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <Link 
              href="/profesionales/registro?promo=2x1"
              className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold text-xl px-12 py-6 rounded-full shadow-2xl transform hover:scale-105 transition-all"
            >
              ⚡ Regístrate como Profesional
            </Link>
            
            <Link 
              href="/clientes/registro?promo=2x1"
              className="bg-white hover:bg-gray-100 text-blue-900 font-bold text-xl px-12 py-6 rounded-full shadow-2xl transform hover:scale-105 transition-all"
            >
              👤 Regístrate como Cliente
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
