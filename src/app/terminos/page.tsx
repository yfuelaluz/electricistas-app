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
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors group">
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver al inicio
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            Términos y Condiciones
          </h1>
          <p className="text-white/80 text-base md:text-lg">
            Última actualización: 27 de diciembre de 2024
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 pb-0">
        {/* Contenido */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-10 space-y-8">
          
          <section className="border-l-4 border-primary-500 pl-4 md:pl-6">
            <h2 className="text-xl md:text-3xl font-bold text-slate-800 mb-4 flex items-start gap-3">
              <span className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-primary-100 text-primary-600 rounded-lg font-bold text-sm md:text-base flex-shrink-0">1</span>
              <span>Aceptación de los Términos</span>
            </h2>
            <p className="text-slate-700 leading-relaxed text-base md:text-lg">
              Al acceder y utilizar la plataforma de ELIENAI SPA (en adelante "la Plataforma"), 
              usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con 
              alguna parte de estos términos, no debe utilizar nuestros servicios.
            </p>
          </section>

          <section className="border-l-4 border-accent-500 pl-4 md:pl-6">
            <h2 className="text-xl md:text-3xl font-bold text-slate-800 mb-4 flex items-start gap-3">
              <span className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-accent-100 text-accent-600 rounded-lg font-bold text-sm md:text-base flex-shrink-0">2</span>
              <span>Descripción del Servicio</span>
            </h2>
            <p className="text-slate-700 leading-relaxed text-base md:text-lg mb-4">
              ELIENAI SPA opera como una plataforma digital que conecta clientes con profesionales 
              certificados en los sectores de electricidad y carpintería en Chile, específicamente 
              en la V Región de Valparaíso.
            </p>
            <p className="text-slate-700 font-semibold mb-3">Nuestros servicios incluyen:</p>
            <ul className="space-y-3">
              {[
                'Búsqueda y filtrado de profesionales por especialidad y ubicación',
                'Sistema de cotizaciones y solicitudes de servicio',
                'Gestión de pagos a través de Webpay Plus (Transbank)',
                'Sistema de valoraciones y reseñas',
                'Dashboard para seguimiento de proyectos'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-accent-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="border-l-4 border-primary-500 pl-4 md:pl-6">
            <h2 className="text-xl md:text-3xl font-bold text-slate-800 mb-4 flex items-start gap-3">
              <span className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-primary-100 text-primary-600 rounded-lg font-bold text-sm md:text-base flex-shrink-0">3</span>
              <span>Registro y Cuentas de Usuario</span>
            </h2>
            
            <h3 className="text-lg md:text-xl font-semibold text-slate-800 mb-3 mt-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></span>
              Clientes
            </h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              Para solicitar servicios, los clientes deben registrarse proporcionando información 
              veraz y actualizada. Son responsables de mantener la confidencialidad de sus credenciales.
            </p>
            
            <h3 className="text-lg md:text-xl font-semibold text-slate-800 mb-3 mt-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></span>
              Profesionales
            </h3>
            <p className="text-slate-700 mb-3">Los profesionales deben:</p>
            <ul className="space-y-3">
              {[
                'Proporcionar certificaciones válidas y vigentes',
                'Mantener actualizada su información de contacto',
                'Cumplir con las normativas chilenas aplicables (SEC, etc.)',
                'Respetar los límites de leads según su plan de suscripción'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="border-l-4 border-accent-500 pl-4 md:pl-6">
            <h2 className="text-xl md:text-3xl font-bold text-slate-800 mb-4 flex items-start gap-3">
              <span className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-accent-100 text-accent-600 rounded-lg font-bold text-sm md:text-base flex-shrink-0">4</span>
              <span>Planes y Pagos</span>
            </h2>
            
            <h3 className="text-lg md:text-xl font-semibold text-slate-800 mb-3 mt-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-accent-500 rounded-full flex-shrink-0"></span>
              Planes de Suscripción
            </h3>
            <p className="text-slate-700 mb-3">Ofrecemos diferentes planes tanto para clientes como para profesionales:</p>
            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              <p className="text-slate-700"><strong className="text-primary-600">Clientes:</strong> Básico (Gratis), Premium ($14.990/mes), Empresa ($29.990/mes)</p>
              <p className="text-slate-700"><strong className="text-accent-600">Profesionales:</strong> Starter ($14.990/mes), Pro ($29.990/mes), Elite ($59.990/mes)</p>
            </div>
            
            <h3 className="text-lg md:text-xl font-semibold text-slate-800 mb-3 mt-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-accent-500 rounded-full flex-shrink-0"></span>
              Procesamiento de Pagos
            </h3>
            <p className="text-slate-700 leading-relaxed">
              Los pagos se procesan a través de Webpay Plus de Transbank. ELIENAI SPA no almacena 
              información de tarjetas de crédito. Los reembolsos están sujetos a la política de 
              garantía de 30 días.
            </p>
          </section>

          <section className="border-l-4 border-primary-500 pl-4 md:pl-6">
            <h2 className="text-xl md:text-3xl font-bold text-slate-800 mb-4 flex items-start gap-3">
              <span className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-primary-100 text-primary-600 rounded-lg font-bold text-sm md:text-base flex-shrink-0">5</span>
              <span>Responsabilidades</span>
            </h2>
            
            <h3 className="text-lg md:text-xl font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></span>
              De la Plataforma
            </h3>
            <p className="text-slate-700 mb-3">ELIENAI SPA actúa como intermediario y no se hace responsable por:</p>
            <ul className="space-y-3">
              {[
                'La calidad del trabajo realizado por los profesionales',
                'Disputas entre clientes y profesionales',
                'Daños o perjuicios derivados de los servicios contratados'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
            
            <h3 className="text-lg md:text-xl font-semibold text-slate-800 mb-3 mt-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></span>
              De los Profesionales
            </h3>
            <p className="text-slate-700 mb-3">Los profesionales son totalmente responsables de:</p>
            <ul className="space-y-3">
              {[
                'La ejecución profesional de los trabajos contratados',
                'Contar con seguros y certificaciones vigentes',
                'Cumplir con las normativas legales aplicables',
                'La veracidad de la información publicada en su perfil'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="border-l-4 border-accent-500 pl-4 md:pl-6">
            <h2 className="text-xl md:text-3xl font-bold text-slate-800 mb-4 flex items-start gap-3">
              <span className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-accent-100 text-accent-600 rounded-lg font-bold text-sm md:text-base flex-shrink-0">6</span>
              <span>Propiedad Intelectual</span>
            </h2>
            <p className="text-slate-700 leading-relaxed text-base md:text-lg">
              Todo el contenido de la Plataforma, incluyendo diseño, código, logotipos y textos, 
              es propiedad de ELIENAI SPA y está protegido por las leyes de propiedad intelectual 
              de Chile.
            </p>
          </section>

          <section className="border-l-4 border-primary-500 pl-4 md:pl-6">
            <h2 className="text-xl md:text-3xl font-bold text-slate-800 mb-4 flex items-start gap-3">
              <span className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-primary-100 text-primary-600 rounded-lg font-bold text-sm md:text-base flex-shrink-0">7</span>
              <span>Modificaciones</span>
            </h2>
            <p className="text-slate-700 leading-relaxed text-base md:text-lg">
              ELIENAI SPA se reserva el derecho de modificar estos términos en cualquier momento. 
              Los cambios serán notificados a través de la plataforma y/o por email.
            </p>
          </section>

          <section className="border-l-4 border-accent-500 pl-4 md:pl-6">
            <h2 className="text-xl md:text-3xl font-bold text-slate-800 mb-4 flex items-start gap-3">
              <span className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-accent-100 text-accent-600 rounded-lg font-bold text-sm md:text-base flex-shrink-0">8</span>
              <span>Terminación</span>
            </h2>
            <p className="text-slate-700 leading-relaxed text-base md:text-lg">
              Podemos suspender o terminar su acceso a la Plataforma si incumple estos términos, 
              sin previo aviso y sin responsabilidad alguna.
            </p>
          </section>

          <section className="border-l-4 border-primary-500 pl-4 md:pl-6">
            <h2 className="text-xl md:text-3xl font-bold text-slate-800 mb-4 flex items-start gap-3">
              <span className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-primary-100 text-primary-600 rounded-lg font-bold text-sm md:text-base flex-shrink-0">9</span>
              <span>Ley Aplicable</span>
            </h2>
            <p className="text-slate-700 leading-relaxed text-base md:text-lg">
              Estos términos se rigen por las leyes de la República de Chile. Cualquier disputa 
              será resuelta en los tribunales competentes de Valparaíso, Chile.
            </p>
          </section>

          <section className="border-l-4 border-accent-500 pl-4 md:pl-6">
            <h2 className="text-xl md:text-3xl font-bold text-slate-800 mb-4 flex items-start gap-3">
              <span className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-accent-100 text-accent-600 rounded-lg font-bold text-sm md:text-base flex-shrink-0">10</span>
              <span>Contacto</span>
            </h2>
            <p className="text-slate-700 mb-4">Para consultas sobre estos términos, contáctenos en:</p>
            <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-lg p-5 space-y-3">
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:yfuelaluz@gmail.com" className="text-primary-600 hover:text-primary-700 font-medium">
                  yfuelaluz@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+56995748162" className="text-accent-600 hover:text-accent-700 font-medium">
                  +56 9 9574 8162
                </a>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-slate-700 font-medium">Valparaíso, V Región, Chile</span>
              </div>
            </div>
          </section>

        </div>

        {/* Footer de navegación */}
        <div className="mt-8 pb-8">
          <Link 
            href="/privacidad" 
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-primary-600 hover:text-primary-700 font-semibold px-6 py-3 rounded-lg shadow-lg transition-all group"
          >
            Ver Política de Privacidad
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
