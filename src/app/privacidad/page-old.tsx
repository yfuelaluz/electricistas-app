import type { Metadata' from 'next';
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
          
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">1. Introducción</h2>
            <p className="text-slate-700 leading-relaxed">
              En ELIENAI SPA, nos comprometemos a proteger su privacidad y datos personales. 
              Esta política describe cómo recopilamos, usamos, almacenamos y protegemos su 
              información de acuerdo con la Ley N° 19.628 sobre Protección de la Vida Privada 
              de Chile.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">2. Información que Recopilamos</h2>
            
            <h3 className="text-xl font-semibold text-slate-700 mb-2 mt-4">2.1 Información que usted proporciona</h3>
            <ul className="list-disc list-inside text-slate-700 ml-4 space-y-2">
              <li>
                <strong>Datos de registro:</strong> Nombre completo, RUT, email, teléfono, dirección
              </li>
              <li>
                <strong>Datos profesionales:</strong> Certificaciones, especialidades, experiencia, portfolio
              </li>
              <li>
                <strong>Información de pago:</strong> Datos procesados por Transbank (no almacenamos tarjetas)
              </li>
              <li>
                <strong>Contenido del usuario:</strong> Cotizaciones, reseñas, mensajes, fotos de trabajos
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-700 mb-2 mt-4">2.2 Información recopilada automáticamente</h3>
            <ul className="list-disc list-inside text-slate-700 ml-4 space-y-2">
              <li>Dirección IP y datos de navegación</li>
              <li>Tipo de dispositivo y navegador</li>
              <li>Páginas visitadas y tiempo de permanencia</li>
              <li>Cookies y tecnologías similares</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">3. Cómo Usamos su Información</h2>
            <p className="text-slate-700 leading-relaxed mb-2">
              Utilizamos sus datos personales para:
            </p>
            <ul className="list-disc list-inside text-slate-700 ml-4 space-y-2">
              <li>Proporcionar y mejorar nuestros servicios</li>
              <li>Facilitar la conexión entre clientes y profesionales</li>
              <li>Procesar pagos y suscripciones</li>
              <li>Enviar notificaciones sobre cotizaciones y proyectos</li>
              <li>Verificar identidad y prevenir fraudes</li>
              <li>Cumplir con obligaciones legales</li>
              <li>Mejorar la experiencia del usuario mediante análisis</li>
              <li>Enviar comunicaciones de marketing (con su consentimiento)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">4. Compartir Información</h2>
            
            <h3 className="text-xl font-semibold text-slate-700 mb-2 mt-4">4.1 Con quién compartimos</h3>
            <ul className="list-disc list-inside text-slate-700 ml-4 space-y-2">
              <li>
                <strong>Entre usuarios:</strong> Profesionales y clientes ven información básica de contacto 
                cuando hay una cotización activa
              </li>
              <li>
                <strong>Proveedores de servicios:</strong> Supabase (hosting de datos), Transbank (pagos), 
                Resend (emails), Vercel (hosting)
              </li>
              <li>
                <strong>Autoridades:</strong> Cuando sea requerido por ley o para proteger nuestros derechos
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-700 mb-2 mt-4">4.2 No vendemos datos</h3>
            <p className="text-slate-700 leading-relaxed">
              NUNCA vendemos, alquilamos o compartimos sus datos personales con terceros para 
              fines de marketing sin su consentimiento explícito.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">5. Almacenamiento y Seguridad</h2>
            
            <h3 className="text-xl font-semibold text-slate-700 mb-2 mt-4">5.1 Seguridad de datos</h3>
            <p className="text-slate-700 leading-relaxed mb-2">
              Implementamos medidas de seguridad técnicas y organizativas:
            </p>
            <ul className="list-disc list-inside text-slate-700 ml-4 space-y-1">
              <li>Encriptación SSL/TLS para todas las transmisiones</li>
              <li>Contraseñas hasheadas con bcrypt</li>
              <li>Autenticación y control de acceso</li>
              <li>Backups regulares y encriptados</li>
              <li>Hosting en servidores seguros (Supabase/Vercel)</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-700 mb-2 mt-4">5.2 Ubicación de datos</h3>
            <p className="text-slate-700 leading-relaxed">
              Sus datos se almacenan en servidores en la nube gestionados por Supabase, 
              que cumple con estándares internacionales de seguridad (SOC 2, ISO 27001).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">6. Sus Derechos</h2>
            <p className="text-slate-700 leading-relaxed mb-2">
              De acuerdo con la legislación chilena, usted tiene derecho a:
            </p>
            <ul className="list-disc list-inside text-slate-700 ml-4 space-y-2">
              <li><strong>Acceso:</strong> Solicitar una copia de sus datos personales</li>
              <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos</li>
              <li><strong>Eliminación:</strong> Solicitar la eliminación de sus datos (con excepciones legales)</li>
              <li><strong>Oposición:</strong> Oponerse al procesamiento de sus datos</li>
              <li><strong>Portabilidad:</strong> Recibir sus datos en formato estructurado</li>
              <li><strong>Revocación:</strong> Retirar el consentimiento en cualquier momento</li>
            </ul>
            <p className="text-slate-700 leading-relaxed mt-3">
              Para ejercer estos derechos, contáctenos en: <strong>yfuelaluz@gmail.com</strong>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">7. Cookies</h2>
            <p className="text-slate-700 leading-relaxed mb-2">
              Utilizamos cookies y tecnologías similares para:
            </p>
            <ul className="list-disc list-inside text-slate-700 ml-4 space-y-1">
              <li>Mantener su sesión activa</li>
              <li>Recordar sus preferencias</li>
              <li>Analizar el uso de la plataforma</li>
              <li>Mejorar la seguridad</li>
            </ul>
            <p className="text-slate-700 leading-relaxed mt-3">
              Puede configurar su navegador para rechazar cookies, aunque esto puede afectar 
              la funcionalidad de la plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">8. Retención de Datos</h2>
            <p className="text-slate-700 leading-relaxed">
              Conservamos sus datos personales mientras:
            </p>
            <ul className="list-disc list-inside text-slate-700 ml-4 mt-2 space-y-1">
              <li>Mantenga una cuenta activa en la plataforma</li>
              <li>Sea necesario para proporcionar nuestros servicios</li>
              <li>Estemos obligados legalmente a conservarlos</li>
              <li>Existan proyectos o transacciones pendientes</li>
            </ul>
            <p className="text-slate-700 leading-relaxed mt-3">
              Después de la eliminación de la cuenta, conservamos solo los datos necesarios 
              para cumplir con obligaciones legales (registro contable, fiscales, etc.).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">9. Menores de Edad</h2>
            <p className="text-slate-700 leading-relaxed">
              Nuestra plataforma no está dirigida a menores de 18 años. No recopilamos 
              intencionalmente información de menores. Si detectamos datos de un menor, 
              los eliminaremos de inmediato.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">10. Cambios a esta Política</h2>
            <p className="text-slate-700 leading-relaxed">
              Podemos actualizar esta política ocasionalmente. Le notificaremos cambios 
              significativos por email o mediante un aviso destacado en la plataforma. 
              La fecha de "última actualización" al inicio refleja cuándo se modificó por última vez.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">11. Contacto</h2>
            <p className="text-slate-700 leading-relaxed mb-2">
              Para preguntas sobre privacidad o ejercer sus derechos:
            </p>
            <ul className="text-slate-700 mt-2 space-y-1">
              <li><strong>Responsable:</strong> ELIENAI SPA</li>
              <li><strong>Email:</strong> yfuelaluz@gmail.com</li>
              <li><strong>Teléfono:</strong> +56 9 9574 8162</li>
              <li><strong>Dirección:</strong> Valparaíso, V Región, Chile</li>
            </ul>
          </section>

          <section className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              📌 Cumplimiento Legal
            </h3>
            <p className="text-blue-800 text-sm">
              Esta política cumple con la Ley N° 19.628 sobre Protección de la Vida Privada 
              de Chile y mejores prácticas internacionales de protección de datos.
            </p>
          </section>

        </div>

        {/* Footer de navegación */}
        <div className="mt-8 flex justify-between">
          <a 
            href="/terminos" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Ver Términos y Condiciones →
          </a>
          <a 
            href="/" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Volver al inicio →
          </a>
        </div>
      </div>
    </div>
  );
}
