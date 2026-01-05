'use client';

export default function PreviewPosts() {
  const posts = {
    facebookProfesionales: `🏗️ ¡OFERTA DE LANZAMIENTO! 🏗️

¿Eres profesional de la construcción y servicios? Esta es tu oportunidad

🎁 2 MESES POR EL PRECIO DE 1
Solo para los primeros 25 profesionales

✅ Para todas las especialidades:
⚡ Electricistas
🪵 Carpinteros y Mueblistas
🎨 Pintores
🔧 Gasfitería
⚙️ Soldadores
🏠 Construcciones nuevas
☀️ Proyectos fotovoltaicos
📐 Planos y diseño
📋 Trámites SEC

💼 Lo que obtienes:
• Portfolio digital profesional
• Recibe cotizaciones de clientes reales
• Pagos seguros a través de Webpay
• Gestión completa de tus proyectos
• Dashboard con estadísticas en tiempo real
• Notificaciones automáticas

📊 Planes disponibles:
🌟 Starter: 3 leads/mes
🚀 Pro: 10 leads/mes  
👑 Elite: Leads ilimitados

⏰ Cupos limitados: SOLO 25 PROFESIONALES

👉 Regístrate ahora en: elienai.cl/promo

#Construccion #Profesionales #Electricista #Carpintero #Gasfiter #Pintor #Emprendimiento #Chile`,

    facebookClientes: `🏠 ¿Necesitas un profesional de confianza para tu hogar o negocio?

¡Tenemos una oferta especial para ti!

🎁 2 MESES DE MEMBRESÍA GRATIS
Solo para los primeros 25 clientes

✨ Acceso a profesionales certificados:
⚡ Electricistas
🪵 Carpinteros y Mueblistas
🎨 Pintores
🔧 Gasfiteros
⚙️ Soldadores
🏠 Constructores
☀️ Especialistas en Energía Solar
📐 Diseñadores y Planos
📋 Gestores de Trámites SEC

✅ Beneficios:
✅ Profesionales verificados
✅ Comparar múltiples cotizaciones
✅ Pagos 100% seguros con Webpay
✅ Sistema de valoraciones y reviews
✅ Seguimiento en tiempo real
✅ Soporte especializado

💡 Para todo tipo de proyectos:
• Remodelaciones
• Reparaciones urgentes
• Construcción nueva
• Instalaciones eléctricas y solares
• Muebles a medida
• Certificaciones y trámites

⏰ Cupos limitados: SOLO 25 CLIENTES

👉 Regístrate gratis: elienai.cl/promo

#Construccion #Hogar #Remodelacion #Reparaciones #Chile #Profesionales #Servicios`,

    instagramProfesionales: `🏗️ ¡OFERTA DE LANZAMIENTO! 🏗️

Los primeros 25 profesionales obtienen:
🎁 2 MESES POR EL PRECIO DE 1

✅ Todas las especialidades:
⚡ Electricistas | 🪵 Carpinteros
🎨 Pintores | 🔧 Gasfiteros
⚙️ Soldadores | 🏠 Constructores
☀️ Fotovoltaico | 📐 Planos | 📋 SEC

Impulsa tu negocio con nuestra plataforma:
✨ Portfolio digital
📊 Gestión completa
💰 Pagos seguros
⭐ Sistema de reviews

⏰ Cupos limitados - Link en BIO

#Construccion #Chile #Emprendimiento #Electricista #Carpintero #Gasfiter #Pintor #NegociosDigitales #Profesionales`,

    instagramClientes: `🏠 ¿Necesitas un profesional confiable?

🎁 OFERTA ESPECIAL: 2 MESES GRATIS
(Solo primeros 25 clientes)

Con ELIENAI SPA consigues:
🏗️ Profesionales certificados de:
   ⚡ Electricidad | 🪵 Carpintería
   🎨 Pintura | 🔧 Gasfitería
   ⚙️ Soldadura | 🏠 Construcción
   ☀️ Fotovoltaico | 📋 Trámites

💳 Pagos 100% seguros  
⭐ Reviews verificados
📱 Todo desde tu celular

¡No pierdas tu cupo!
Link en BIO 👆

#Construccion #Hogar #Chile #Remodelacion #Reparaciones #Profesionales #Servicios`
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('¡Texto copiado al portapapeles!');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">
          📱 Preview de Posts para Redes Sociales
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Post 1 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-blue-900">
              📘 Facebook - Profesionales
            </h2>
            <div className="bg-gray-50 p-4 rounded mb-4 whitespace-pre-wrap text-sm max-h-96 overflow-y-auto">
              {posts.facebookProfesionales}
            </div>
            <button
              onClick={() => copyToClipboard(posts.facebookProfesionales)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded"
            >
              📋 Copiar Texto
            </button>
          </div>

          {/* Post 2 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-blue-900">
              📘 Facebook - Clientes
            </h2>
            <div className="bg-gray-50 p-4 rounded mb-4 whitespace-pre-wrap text-sm max-h-96 overflow-y-auto">
              {posts.facebookClientes}
            </div>
            <button
              onClick={() => copyToClipboard(posts.facebookClientes)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded"
            >
              📋 Copiar Texto
            </button>
          </div>

          {/* Post 3 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-pink-600">
              📷 Instagram - Profesionales
            </h2>
            <div className="bg-gray-50 p-4 rounded mb-4 whitespace-pre-wrap text-sm max-h-96 overflow-y-auto">
              {posts.instagramProfesionales}
            </div>
            <button
              onClick={() => copyToClipboard(posts.instagramProfesionales)}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded"
            >
              📋 Copiar Texto
            </button>
          </div>

          {/* Post 4 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-pink-600">
              📷 Instagram - Clientes
            </h2>
            <div className="bg-gray-50 p-4 rounded mb-4 whitespace-pre-wrap text-sm max-h-96 overflow-y-auto">
              {posts.instagramClientes}
            </div>
            <button
              onClick={() => copyToClipboard(posts.instagramClientes)}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded"
            >
              📋 Copiar Texto
            </button>
          </div>
        </div>

        <div className="mt-12 bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
          <h3 className="font-bold text-lg mb-4">💡 Especialidades Incluidas:</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>⚡ Electricistas</div>
            <div>🪵 Carpinteros</div>
            <div>🎨 Pintores</div>
            <div>🔧 Gasfiteros</div>
            <div>⚙️ Soldadores</div>
            <div>🏠 Constructores</div>
            <div>☀️ Fotovoltaico</div>
            <div>📐 Planos</div>
            <div>📋 Trámites SEC</div>
          </div>
        </div>
      </div>
    </div>
  );
}
