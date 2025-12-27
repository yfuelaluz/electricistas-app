import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos y Condiciones - ELIENAI SPA',
  description: 'Términos y condiciones de uso de la plataforma ELIENAI SPA - Electricistas y Carpinteros Profesionales',
};

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <a href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Volver al inicio
          </a>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Términos y Condiciones
          </h1>
          <p className="text-slate-600">
            Última actualización: 27 de diciembre de 2024
          </p>
        </div>

        {/* Contenido */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">1. Aceptación de los Términos</h2>
            <p className="text-slate-700 leading-relaxed">
              Al acceder y utilizar la plataforma de ELIENAI SPA (en adelante "la Plataforma"), 
              usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con 
              alguna parte de estos términos, no debe utilizar nuestros servicios.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">2. Descripción del Servicio</h2>
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

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">3. Registro y Cuentas de Usuario</h2>
            <h3 className="text-xl font-semibold text-slate-700 mb-2 mt-4">3.1 Clientes</h3>
            <p className="text-slate-700 leading-relaxed">
              Para solicitar servicios, los clientes deben registrarse proporcionando información 
              veraz y actualizada. Son responsables de mantener la confidencialidad de sus credenciales.
            </p>
            
            <h3 className="text-xl font-semibold text-slate-700 mb-2 mt-4">3.2 Profesionales</h3>
            <p className="text-slate-700 leading-relaxed">
              Los profesionales deben:
            </p>
            <ul className="list-disc list-inside text-slate-700 ml-4 mt-2 space-y-1">
              <li>Proporcionar certificaciones válidas y vigentes</li>
              <li>Mantener actualizada su información de contacto</li>
              <li>Cumplir con las normativas chilenas aplicables (SEC, etc.)</li>
              <li>Respetar los límites de leads según su plan de suscripción</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">4. Planes y Pagos</h2>
            <h3 className="text-xl font-semibold text-slate-700 mb-2 mt-4">4.1 Planes de Suscripción</h3>
            <p className="text-slate-700 leading-relaxed mb-2">
              Ofrecemos diferentes planes tanto para clientes como para profesionales:
            </p>
            <ul className="list-disc list-inside text-slate-700 ml-4 space-y-1">
              <li><strong>Clientes:</strong> Básico (Gratis), Premium ($14.990/mes), Empresa ($29.990/mes)</li>
              <li><strong>Profesionales:</strong> Starter ($14.990/mes), Pro ($29.990/mes), Elite ($59.990/mes)</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-slate-700 mb-2 mt-4">4.2 Procesamiento de Pagos</h3>
            <p className="text-slate-700 leading-relaxed">
              Los pagos se procesan a través de Webpay Plus de Transbank. ELIENAI SPA no almacena 
              información de tarjetas de crédito. Los reembolsos están sujetos a la política de 
              garantía de 30 días.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">5. Responsabilidades</h2>
            <h3 className="text-xl font-semibold text-slate-700 mb-2 mt-4">5.1 De la Plataforma</h3>
            <p className="text-slate-700 leading-relaxed">
              ELIENAI SPA actúa como intermediario y no se hace responsable por:
            </p>
            <ul className="list-disc list-inside text-slate-700 ml-4 mt-2 space-y-1">
              <li>La calidad del trabajo realizado por los profesionales</li>
              <li>Disputas entre clientes y profesionales</li>
              <li>Daños o perjuicios derivados de los servicios contratados</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-slate-700 mb-2 mt-4">5.2 De los Profesionales</h3>
            <p className="text-slate-700 leading-relaxed">
              Los profesionales son totalmente responsables de:
            </p>
            <ul className="list-disc list-inside text-slate-700 ml-4 mt-2 space-y-1">
              <li>La ejecución profesional de los trabajos contratados</li>
              <li>Contar con seguros y certificaciones vigentes</li>
              <li>Cumplir con las normativas legales aplicables</li>
              <li>La veracidad de la información publicada en su perfil</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">6. Propiedad Intelectual</h2>
            <p className="text-slate-700 leading-relaxed">
              Todo el contenido de la Plataforma, incluyendo diseño, código, logotipos y textos, 
              es propiedad de ELIENAI SPA y está protegido por las leyes de propiedad intelectual 
              de Chile.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">7. Modificaciones</h2>
            <p className="text-slate-700 leading-relaxed">
              ELIENAI SPA se reserva el derecho de modificar estos términos en cualquier momento. 
              Los cambios serán notificados a través de la plataforma y/o por email.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">8. Terminación</h2>
            <p className="text-slate-700 leading-relaxed">
              Podemos suspender o terminar su acceso a la Plataforma si incumple estos términos, 
              sin previo aviso y sin responsabilidad alguna.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">9. Ley Aplicable</h2>
            <p className="text-slate-700 leading-relaxed">
              Estos términos se rigen por las leyes de la República de Chile. Cualquier disputa 
              será resuelta en los tribunales competentes de Valparaíso, Chile.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">10. Contacto</h2>
            <p className="text-slate-700 leading-relaxed">
              Para consultas sobre estos términos, contáctenos en:
            </p>
            <ul className="text-slate-700 mt-2 space-y-1">
              <li><strong>Email:</strong> yfuelaluz@gmail.com</li>
              <li><strong>Teléfono:</strong> +56 9 9574 8162</li>
              <li><strong>Dirección:</strong> Valparaíso, V Región, Chile</li>
            </ul>
          </section>

        </div>

        {/* Footer de navegación */}
        <div className="mt-8 flex justify-between">
          <a 
            href="/privacidad" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Ver Política de Privacidad →
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
