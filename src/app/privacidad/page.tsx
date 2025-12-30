import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Privacidad - ELIENAI SPA',
  description: 'Política de privacidad y protección de datos de ELIENAI SPA',
};

export default function PrivacidadPage() {
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
            Política de Privacidad
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
              <span>Introducción</span>
            </h2>
            <p className="text-slate-700 leading-relaxed text-base md:text-lg">
              En ELIENAI SPA, nos comprometemos a proteger su privacidad y datos personales. 
              Esta política describe cómo recopilamos, usamos, almacenamos y protegemos su 
              información de acuerdo con la <strong>Ley N° 19.628 sobre Protección de la Vida Privada 
              de Chile</strong>.
            </p>
          </section>

          <section className="border-l-4 border-accent-500 pl-4 md:pl-6">
            <h2 className="text-xl md:text-3xl font-bold text-slate-800 mb-4 flex items-start gap-3">
              <span className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-accent-100 text-accent-600 rounded-lg font-bold text-sm md:text-base flex-shrink-0">2</span>
              <span>Información que Recopilamos</span>
            </h2>
            
            <h3 className="text-lg md:text-xl font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-accent-500 rounded-full flex-shrink-0"></span>
              Información que usted proporciona
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Datos de registro', desc: 'Nombre completo, RUT, email, teléfono, dirección' },
                { label: 'Datos profesionales', desc: 'Certificaciones, especialidades, experiencia, portfolio' },
                { label: 'Información de pago', desc: 'Datos procesados por Transbank (no almacenamos tarjetas)' },
                { label: 'Contenido del usuario', desc: 'Cotizaciones, reseñas, mensajes, fotos de trabajos' }
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-accent-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-slate-700"><strong>{item.label}:</strong> {item.desc}</span>
                </li>
              ))}
            </ul>

            <h3 className="text-lg md:text-xl font-semibold text-slate-800 mb-3 mt-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-accent-500 rounded-full flex-shrink-0"></span>
              Información recopilada automáticamente
            </h3>
            <ul className="space-y-3">
              {[
                'Dirección IP y datos de navegación',
                'Tipo de dispositivo y navegador',
                'Páginas visitadas y tiempo de permanencia',
                'Cookies y tecnologías similares'
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
              <span>Cómo Usamos su Información</span>
            </h2>
            <p className="text-slate-700 mb-3 font-semibold">Utilizamos sus datos personales para:</p>
            <ul className="space-y-3">
              {[
                'Proporcionar y mejorar nuestros servicios',
                'Facilitar la conexión entre clientes y profesionales',
                'Procesar pagos y suscripciones',
                'Enviar notificaciones sobre cotizaciones y proyectos',
                'Verificar identidad y prevenir fraudes',
                'Cumplir con obligaciones legales',
                'Mejorar la experiencia del usuario mediante análisis',
                'Enviar comunicaciones de marketing (con su consentimiento)'
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
              <span>Compartir Información</span>
            </h2>
            
            <h3 className="text-lg md:text-xl font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-accent-500 rounded-full flex-shrink-0"></span>
              Con quién compartimos
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 text-accent-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="text-slate-700"><strong>Entre usuarios:</strong> Profesionales y clientes ven información básica de contacto cuando hay una cotización activa</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 text-accent-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="text-slate-700"><strong>Proveedores de servicios:</strong> Supabase (hosting de datos), Transbank (pagos), Resend (emails), Vercel (hosting)</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 text-accent-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="text-slate-700"><strong>Autoridades:</strong> Cuando sea requerido por ley o para proteger nuestros derechos</span>
              </li>
            </ul>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mt-6 rounded-r-lg">
              <h3 className="text-lg font-bold text-amber-900 mb-2 flex items-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                No vendemos datos
              </h3>
              <p className="text-amber-800">
                NUNCA vendemos, alquilamos o compartimos sus datos personales con terceros para fines de marketing sin su consentimiento explícito.
              </p>
            </div>
          </section>

          <section className="border-l-4 border-primary-500 pl-4 md:pl-6">
            <h2 className="text-xl md:text-3xl font-bold text-slate-800 mb-4 flex items-start gap-3">
              <span className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-primary-100 text-primary-600 rounded-lg font-bold text-sm md:text-base flex-shrink-0">5</span>
              <span>Almacenamiento y Seguridad</span>
            </h2>
            
            <h3 className="text-lg md:text-xl font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></span>
              Seguridad de datos
            </h3>
            <p className="text-slate-700 mb-3">Implementamos medidas de seguridad técnicas y organizativas:</p>
            <ul className="space-y-3">
              {[
                'Encriptación SSL/TLS para todas las transmisiones',
                'Contraseñas hasheadas con bcrypt',
                'Autenticación y control de acceso',
                'Backups regulares y encriptados',
                'Hosting en servidores seguros (Supabase/Vercel)'
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
              Ubicación de datos
            </h3>
            <p className="text-slate-700 leading-relaxed">
              Sus datos se almacenan en servidores en la nube gestionados por Supabase, 
              que cumple con estándares internacionales de seguridad (SOC 2, ISO 27001).
            </p>
          </section>

          <section className="border-l-4 border-accent-500 pl-4 md:pl-6">
            <h2 className="text-xl md:text-3xl font-bold text-slate-800 mb-4 flex items-start gap-3">
              <span className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-accent-100 text-accent-600 rounded-lg font-bold text-sm md:text-base flex-shrink-0">6</span>
              <span>Sus Derechos</span>
            </h2>
            <p className="text-slate-700 mb-4 font-semibold">De acuerdo con la legislación chilena, usted tiene derecho a:</p>
            <div className="grid gap-4">
              {[
                { title: 'Acceso', desc: 'Solicitar una copia de sus datos personales' },
                { title: 'Rectificación', desc: 'Corregir datos inexactos o incompletos' },
                { title: 'Eliminación', desc: 'Solicitar la eliminación de sus datos (con excepciones legales)' },
                { title: 'Oposición', desc: 'Oponerse al procesamiento de sus datos' },
                { title: 'Portabilidad', desc: 'Recibir sus datos en formato estructurado' },
                { title: 'Revocación', desc: 'Retirar el consentimiento en cualquier momento' }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-slate-50 p-4 rounded-lg">
                  <svg className="w-4 h-4 text-accent-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <div>
                    <p className="font-bold text-slate-800">{item.title}</p>
                    <p className="text-slate-600 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-slate-700 mt-4 bg-accent-50 p-4 rounded-lg">
              Para ejercer estos derechos, contáctenos en: <strong className="text-accent-600">yfuelaluz@gmail.com</strong>
            </p>
          </section>

          <section className="border-l-4 border-primary-500 pl-4 md:pl-6">
            <h2 className="text-xl md:text-3xl font-bold text-slate-800 mb-4 flex items-start gap-3">
              <span className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-primary-100 text-primary-600 rounded-lg font-bold text-sm md:text-base flex-shrink-0">7</span>
              <span>Cookies</span>
            </h2>
            <p className="text-slate-700 mb-3">Utilizamos cookies y tecnologías similares para:</p>
            <ul className="space-y-3">
              {[
                'Mantener su sesión activa',
                'Recordar sus preferencias',
                'Analizar el uso de la plataforma',
                'Mejorar la seguridad'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-slate-700 mt-4 leading-relaxed">
              Puede configurar su navegador para rechazar cookies, aunque esto puede afectar la funcionalidad de la plataforma.
            </p>
          </section>

          <section className="border-l-4 border-accent-500 pl-4 md:pl-6">
            <h2 className="text-xl md:text-3xl font-bold text-slate-800 mb-4 flex items-start gap-3">
              <span className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-accent-100 text-accent-600 rounded-lg font-bold text-sm md:text-base flex-shrink-0">8</span>
              <span>Retención de Datos</span>
            </h2>
            <p className="text-slate-700 mb-3">Conservamos sus datos personales mientras:</p>
            <ul className="space-y-3">
              {[
                'Mantenga una cuenta activa en la plataforma',
                'Sea necesario para proporcionar nuestros servicios',
                'Estemos obligados legalmente a conservarlos',
                'Existan proyectos o transacciones pendientes'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-accent-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-slate-700 mt-4 leading-relaxed">
              Después de la eliminación de la cuenta, conservamos solo los datos necesarios para cumplir con obligaciones legales (registro contable, fiscales, etc.).
            </p>
          </section>

          <section className="border-l-4 border-primary-500 pl-4 md:pl-6">
            <h2 className="text-xl md:text-3xl font-bold text-slate-800 mb-4 flex items-start gap-3">
              <span className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-primary-100 text-primary-600 rounded-lg font-bold text-sm md:text-base flex-shrink-0">9</span>
              <span>Menores de Edad</span>
            </h2>
            <p className="text-slate-700 leading-relaxed text-base md:text-lg">
              Nuestra plataforma no está dirigida a menores de 18 años. No recopilamos intencionalmente información de menores. Si detectamos datos de un menor, los eliminaremos de inmediato.
            </p>
          </section>

          <section className="border-l-4 border-accent-500 pl-4 md:pl-6">
            <h2 className="text-xl md:text-3xl font-bold text-slate-800 mb-4 flex items-start gap-3">
              <span className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-accent-100 text-accent-600 rounded-lg font-bold text-sm md:text-base flex-shrink-0">10</span>
              <span>Cambios a esta Política</span>
            </h2>
            <p className="text-slate-700 leading-relaxed text-base md:text-lg">
              Podemos actualizar esta política ocasionalmente. Le notificaremos cambios significativos por email o mediante un aviso destacado en la plataforma. La fecha de "última actualización" al inicio refleja cuándo se modificó por última vez.
            </p>
          </section>

          <section className="border-l-4 border-primary-500 pl-4 md:pl-6">
            <h2 className="text-xl md:text-3xl font-bold text-slate-800 mb-4 flex items-start gap-3">
              <span className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-primary-100 text-primary-600 rounded-lg font-bold text-sm md:text-base flex-shrink-0">11</span>
              <span>Contacto</span>
            </h2>
            <p className="text-slate-700 mb-4">Para preguntas sobre privacidad o ejercer sus derechos:</p>
            <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-lg p-5 space-y-4">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="text-slate-700"><strong>Responsable:</strong> ELIENAI SPA</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:yfuelaluz@gmail.com" className="text-primary-600 hover:text-primary-700 font-medium">
                  yfuelaluz@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+56995748162" className="text-accent-600 hover:text-accent-700 font-medium">
                  +56 9 9574 8162
                </a>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-slate-700 font-medium">Valparaíso, V Región, Chile</span>
              </div>
            </div>
          </section>

          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-start gap-4">
              <svg className="w-8 h-8 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <div>
                <h3 className="text-xl font-bold mb-2">Cumplimiento Legal</h3>
                <p className="text-blue-100">
                  Esta política cumple con la <strong>Ley N° 19.628 sobre Protección de la Vida Privada de Chile</strong> y mejores prácticas internacionales de protección de datos.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer de navegación */}
        <div className="mt-8 pb-8">
          <Link 
            href="/terminos" 
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-primary-600 hover:text-primary-700 font-semibold px-6 py-3 rounded-lg shadow-lg transition-all group"
          >
            Ver Términos y Condiciones
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
