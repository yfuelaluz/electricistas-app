import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Términos y Condiciones - ELIENAI SPA',
  description: 'Términos y condiciones de uso de la plataforma ELIENAI SPA - Electricistas y Carpinteros Profesionales',
};

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900">
      {/* Header con degradado */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver al inicio
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Términos y Condiciones
          </h1>
          <p className="text-white/80 text-lg">
            Última actualización: 27 de diciembre de 2024
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Contenido */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-10 space-y-8">
          
          <section className="border-l-4 border-primary-500 pl-6">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 bg-primary-100 text-primary-600 rounded-lg font-bold">1</span>
              Aceptación de los Términos
            </h2>
            <p className="text-slate-700 leading-relaxed text-lg">
              Al acceder y utilizar la plataforma de ELIENAI SPA (en adelante "la Plataforma"), 
              usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con 
              alguna parte de estos términos, no debe utilizar nuestros servicios.
            </p>
          </section>

          <section className="border-l-4 border-accent-500 pl-6">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 bg-accent-100 text-accent-600 rounded-lg font-bold">2</span>
              Descripción del Servicio
            </h2>
            <p className="text-slate-700 leading-relaxed mb-2">
              ELIENAI SPA opera como una plataforma digital que conecta clientes con profesionales 
              certificados en los sectores de electricidad y carpintería en Chile, específicamente 
              en la V Región de Valparaíso.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Nuestros servicios incluyen:
            </p>
            <ul className="list-disc list-inside text-slate-700 ml-4 mt-2 space-y-1">
              <li>Búsqueda y filtrado de profesionales por especialidad y ubicación</li>
              <li>Sistema de cotizaciones y solicitudes de servicio</li>
              <li>Gestión de pagos a través de Webpay Plus (Transbank)</li>
              <li>Sistema de valoraciones y reseñas</li>
              <li>Dashboard para seguimiento de proyectos</li>
            </ul>
          </section>

          <section className="border-l-4 border-primary-500 pl-6">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 bg-primary-100 text-primary-600 rounded-lg font-bold">3</span>
              Registro y Cuentas de Usuario
            </h2>
            <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
              3.1 Clientes
            </h3>
            <p className="text-slate-700 leading-relaxed">
              Para solicitar servicios, los clientes deben registrarse proporcionando información 
              veraz y actualizada. Son responsables de mantener la confidencialidad de sus credenciales.
            </p>
            
            <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
              3.2 Profesionales
            </h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              Los profesionales deben:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="text-slate-700">Proporcionar certificaciones válidas y vigentes</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="text-slate-700">Mantener actualizada su información de contacto</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="text-slate-700">Cumplir con las normativas chilenas aplicables (SEC, etc.)</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="text-slate-700">Respetar los límites de leads según su plan de suscripción</span>
              </li>
            </ul>
          </section>

          <section className="border-l-4 border-accent-500 pl-6">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 bg-accent-100 text-accent-600 rounded-lg font-bold">4</span>
              Planes y Pagos
            </h2>
            <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-accent-500 rounded-full"></span>
              4.1 Planes de Suscripción
            </h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              Ofrecemos diferentes planes tanto para clientes como para profesionales:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="text-slate-700"><strong>Clientes:</strong> Básico (Gratis), Premium ($14.990/mes), Empresa ($29.990/mes)</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="text-slate-700"><strong>Profesionales:</strong> Starter ($14.990/mes), Pro ($29.990/mes), Elite ($59.990/mes)</span>
              </li>
            </ul>
            
            <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-accent-500 rounded-full"></span>
              4.2 Procesamiento de Pagos
            </h3>
            <p className="text-slate-700 leading-relaxed">
              Los pagos se procesan a través de Webpay Plus de Transbank. ELIENAI SPA no almacena 
              información de tarjetas de crédito. Los reembolsos están sujetos a la política de 
              garantía de 30 días.
            </p>
          </section>

          <section className="border-l-4 border-primary-500 pl-6">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 bg-primary-100 text-primary-600 rounded-lg font-bold">5</span>
              Responsabilidades
            </h2>
            <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
              5.1 De la Plataforma
            </h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              ELIENAI SPA actúa como intermediario y no se hace responsable por:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="text-slate-700">La calidad del trabajo realizado por los profesionales</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="text-slate-700">Disputas entre clientes y profesionales</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="text-slate-700">Daños o perjuicios derivados de los servicios contratados</span>
              </li>
            </ul>
            
            <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
              5.2 De los Profesionales
            </h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              Los profesionales son totalmente responsables de:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="text-slate-700">La ejecución profesional de los trabajos contratados</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="text-slate-700">Contar con seguros y certificaciones vigentes</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="text-slate-700">Cumplir con las normativas legales aplicables</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="text-slate-700">La veracidad de la información publicada en su perfil</span>
              </li>
            </ul>
          </section>

          <section className="border-l-4 border-accent-500 pl-6">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 bg-accent-100 text-accent-600 rounded-lg font-bold">6</span>
              Propiedad Intelectual
            </h2>
            <p className="text-slate-700 leading-relaxed text-lg">
              Todo el contenido de la Plataforma, incluyendo diseño, código, logotipos y textos, 
              es propiedad de ELIENAI SPA y está protegido por las leyes de propiedad intelectual 
              de Chile.
            </p>
          </section>

          <section className="border-l-4 border-primary-500 pl-6">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 bg-primary-100 text-primary-600 rounded-lg font-bold">7</span>
              Modificaciones
            </h2>
            <p className="text-slate-700 leading-relaxed text-lg">
              ELIENAI SPA se reserva el derecho de modificar estos términos en cualquier momento. 
              Los cambios serán notificados a través de la plataforma y/o por email.
            </p>
          </section>

          <section className="border-l-4 border-accent-500 pl-6">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 bg-accent-100 text-accent-600 rounded-lg font-bold">8</span>
              Terminación
            </h2>
            <p className="text-slate-700 leading-relaxed text-lg">
              Podemos suspender o terminar su acceso a la Plataforma si incumple estos términos, 
              sin previo aviso y sin responsabilidad alguna.
            </p>
          </section>

          <section className="border-l-4 border-primary-500 pl-6">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 bg-primary-100 text-primary-600 rounded-lg font-bold">9</span>
              Ley Aplicable
            </h2>
            <p className="text-slate-700 leading-relaxed text-lg">
              Estos términos se rigen por las leyes de la República de Chile. Cualquier disputa 
              será resuelta en los tribunales competentes de Valparaíso, Chile.
            </p>
          </section>

          <section className="border-l-4 border-accent-500 pl-6">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 bg-accent-100 text-accent-600 rounded-lg font-bold">10</span>
              Contacto
            </h2>
            <p className="text-slate-700 leading-relaxed text-lg mb-4">
              Para consultas sobre estos términos, contáctenos en:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="text-slate-700"><strong>Email:</strong> yfuelaluz@gmail.com</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="text-slate-700"><strong>Teléfono:</strong> +56 9 9574 8162</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="text-slate-700"><strong>Dirección:</strong> Valparaíso, V Región, Chile</span>
              </li>
            </ul>
          </section>

        </div>

        {/* Footer de navegación */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
          <Link 
            href="/privacidad" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-colors shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Ver Política de Privacidad
          </Link>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-accent-600 rounded-lg font-medium hover:bg-accent-50 transition-colors shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
