'use client';
import React, { useState } from 'react';
import Navigation from '../../components/ui/Navigation';
import Footer from '../../components/ui/Footer';
import MapLocation from '../../components/services/MapLocation';
import RatingSystem from '../../components/services/RatingSystem';
import PaymentGateway from '../../components/services/PaymentGateway';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/Badge';

export default function ServiciosPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  
  // Datos de ejemplo para las valoraciones
  const exampleReviews = [
    {
      id: '1',
      userName: 'María González',
      userType: 'client' as const,
      rating: 5,
      comment: 'Excelente servicio, muy profesional y rápido. Recomendado 100%.',
      date: new Date('2024-12-15'),
      verified: true,
    },
    {
      id: '2',
      userName: 'Carlos Pérez',
      userType: 'client' as const,
      rating: 4,
      comment: 'Muy buen trabajo, llegó puntual y solucionó el problema rápidamente.',
      date: new Date('2024-12-10'),
      verified: true,
    },
    {
      id: '3',
      userName: 'Ana Martínez',
      userType: 'client' as const,
      rating: 5,
      comment: 'Súper profesional, explicó todo claramente y dejó todo impecable.',
      date: new Date('2024-12-05'),
      verified: false,
    },
  ];
  
  const services = [
    {
      id: 'electrical-installation',
      name: 'Instalación Eléctrica Completa',
      category: 'Electricidad',
      price: 85000,
      duration: '4-6 horas',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      description: 'Instalación eléctrica profesional para tu hogar o negocio, con certificación SEC incluida.',
      features: ['Certificación SEC', 'Materiales incluidos', 'Garantía 1 año', 'Soporte post-instalación'],
    },
    {
      id: 'emergency-repair',
      name: 'Reparación de Emergencia',
      category: 'Electricidad',
      price: 45000,
      duration: '1-2 horas',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      description: 'Servicio de emergencia 24/7 para solucionar problemas eléctricos urgentes.',
      features: ['Disponible 24/7', 'Respuesta rápida', 'Diagnóstico incluido', 'Sin cargo por visita'],
    },
    {
      id: 'solar-installation',
      name: 'Sistema Fotovoltaico',
      category: 'Energía Solar',
      price: 1250000,
      duration: '2-3 días',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      description: 'Instalación completa de paneles solares con equipos de última generación.',
      features: ['Paneles premium', 'Inversores de calidad', 'Monitoreo online', 'Garantía 10 años'],
    },
    {
      id: 'carpentry-custom',
      name: 'Carpintería a Medida',
      category: 'Carpintería',
      price: 120000,
      duration: '3-5 días',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      description: 'Muebles y estructuras de madera personalizadas según tus necesidades.',
      features: ['Diseño personalizado', 'Madera de calidad', 'Instalación incluida', 'Garantía artesanal'],
    },
  ];
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <Badge variant="primary" size="lg" className="mb-6">
              Servicios Profesionales
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">Servicios de calidad</span>
              <br />
              <span className="text-secondary-900">certificados y garantizados</span>
            </h1>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Conectamos a los mejores profesionales con clientes que necesitan servicios de electricidad y carpintería.
            </p>
          </div>
        </section>
        
        {/* Servicios Grid */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
              {services.map((service) => (
                <Card key={service.id} hover className="flex flex-col">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-button">
                      {service.icon}
                    </div>
                    <div className="flex-1">
                      <Badge variant="info" size="sm" className="mb-2">
                        {service.category}
                      </Badge>
                      <h3 className="text-2xl font-bold text-secondary-900 mb-2">
                        {service.name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-secondary-600">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {service.duration}
                        </span>
                        <span className="text-2xl font-bold text-primary-600">
                          ${service.price.toLocaleString('es-CL')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-secondary-700 mb-4">
                    {service.description}
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-secondary-700">
                        <svg className="w-5 h-5 text-primary-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    variant="primary"
                    className="w-full mt-auto"
                    onClick={() => setSelectedService(service.id)}
                  >
                    Solicitar servicio
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Ubicación */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 gradient-text">
                Encuéntranos fácilmente
              </h2>
              <p className="text-xl text-secondary-600">
                Usa nuestra geolocalización para obtener direcciones exactas
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <MapLocation
                address="Valparaíso, V Región de Valparaíso, Chile"
                lat={-33.047}
                lng={-71.627}
              />
            </div>
          </div>
        </section>
        
        {/* Sistema de valoraciones */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 gradient-text">
                Lo que dicen nuestros clientes
              </h2>
              <p className="text-xl text-secondary-600">
                Valoraciones reales de clientes satisfechos
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <RatingSystem
                targetId="professional-1"
                targetType="professional"
                currentUserType="client"
                reviews={exampleReviews}
                averageRating={4.7}
                totalReviews={exampleReviews.length}
                onSubmitReview={(review) => {
                  console.log('Nueva valoración:', review);
                  alert('¡Gracias por tu valoración!');
                }}
              />
            </div>
          </div>
        </section>
        
        {/* Demostración de pago */}
        {selectedService && (
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4 gradient-text">
                  Pago seguro y protegido
                </h2>
                <p className="text-xl text-secondary-600">
                  Tu dinero está protegido hasta que el trabajo esté completo
                </p>
              </div>
              
              <div className="max-w-2xl mx-auto">
                <PaymentGateway
                  amount={services.find(s => s.id === selectedService)?.price || 0}
                  serviceName={services.find(s => s.id === selectedService)?.name || ''}
                  professionalName="Juan Electricista Pro"
                  onPaymentSuccess={(paymentId) => {
                    console.log('Pago exitoso:', paymentId);
                    alert(`¡Pago procesado exitosamente! ID: ${paymentId}`);
                    setSelectedService(null);
                  }}
                  onPaymentCancel={() => {
                    setSelectedService(null);
                  }}
                />
              </div>
            </div>
          </section>
        )}
        
        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="text-center p-12 bg-gradient-to-br from-primary-600 to-accent-600 text-white">
              <h2 className="text-4xl font-bold mb-6">
                ¿Eres profesional?
              </h2>
              <p className="text-xl mb-8 text-white/90">
                Únete a nuestra plataforma y consigue más clientes hoy mismo
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  className="bg-white text-primary-600 hover:bg-white/90 px-8 py-3 text-lg"
                >
                  Registrarse como profesional
                </Button>
                <Button
                  className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg border"
                >
                  Ver planes
                </Button>
              </div>
            </Card>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
