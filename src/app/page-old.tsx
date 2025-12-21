"use client";
import Image from 'next/image';
import OptimizedImage from '../components/ui/OptimizedImage';
import { useState, useEffect } from "react";

const endpoint = "https://formspree.io/f/xgvgnpna";
const whatsappNumber = "56995748162";

export default function HomePage() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(true);
  }, []);

  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    email: "",
    mensaje: "",
  });
  const [categoria, setCategoria] = useState("electricidad"); 
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);
  const [error, setError] = useState<string | null>(null);
const imagenesElectricidad = [
  "/galeria/Tablero Electrico.jpg",
  "/galeria/Iluminacion Pared tipo Rack.jpg",
  // Puedes agregar más rutas aquí
];

const imagenesCarpinteria = [
  "/galeria/Ampliacion tipo Cabaña.jpg",
  "/galeria/Cambio de Techumbre.jpg",
  // Puedes agregar más rutas aquí
];

const imagenesOtros = [
  "/galeria/Sistema Fotovoltaico.jpg",
  "/galeria/Plano Alumbrado.jpg",
  // Puedes agregar más rutas aquí
];
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEnviando(true);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.ok) {
        setExito(true);
        setError(null);
      } else if (data.errors) {
        setError(data.errors[0].message || "Error al enviar.");
      } else {
        setError("Error al enviar.");
      }
    } catch (err) {
      setError("No se pudo enviar el mensaje.");
    }

    // WhatsApp
    const text =
      `Hola! Quiero solicitar presupuesto.\n` +
      `*Nombre:* ${form.nombre}\n` +
      `*Teléfono:* ${form.telefono}\n` +
      `*Email:* ${form.email}\n` +
      `*Mensaje:* ${form.mensaje}`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");

    setForm({
      nombre: "",
      telefono: "",
      email: "",
      mensaje: "",
    });
    setEnviando(false);

    setTimeout(() => setExito(false), 3500);
  }

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const redes = [
    {
      nombre: "WhatsApp",
      url: "https://wa.me/56995748162",
      bg: "#25D366",
      svg: (
        <svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#25D366"/><path d="M17.5 10.5a6 6 0 0 0-6 6c0 1.0705.3875 2.0834 1.0492 2.8842l-1.0266 3.5089a.5.5 0 0 0 .618.618l3.5089-1.0266A6 6 0 1 0 17.5 10.5Z" fill="#fff"/><path d="M20.9787 18.0802c-.2465-.1232-1.4533-.7183-1.6783-.7994-.225-.081-0.3887-.122-0.5527.1232-0.164.2465-.6329.7995-.7754.9638-.143.1643-.286.1842-.5324.0611-.2466-.1233-.9268-.3411-1.7671-1.0876-.6535-.5826-1.0943-1.2995-1.2236-1.546-.1289-.2466-.0136-.3792.108-.5012.1115-.1105.2467-.2876.3703-.4312.1231-.1433.1642-.2463.2466-.4103.082-.1639.041-.3085-.0205-.4313-.062-.1233-.5528-1.3373-.7572-1.8259-.2003-.4823-.4027-.4162-.5527-.4251l-.4701-.0094c-.1648-.023-.3554-.023-.5441.0256-.1887.048-.5831.2276-.8921.5408-.6383.6491-0.9457 1.802-.5145 2.637.4279.8312 1.6539 2.0711 3.131 2.5809a4.7284 4.7284 0 0 0 1.7747.3398c.2855 0 .5481-.023 .7549-.0559.2063-.0326.634-.2591.7237-.5094.0897-.2502.0897-.4625.0627-.5092-.0271-.0467-.2465-.1234-.4929-.2466Z" fill="#25D366"/></svg>
      ),
    },
    {
      nombre: "Facebook",
      url: "https://facebook.com/",
      bg: "#1877F3",
      svg: (
        <svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#1877F3"/><path d="M19.58 16h-2v8h-3v-8h-1.5v-2.6h1.5v-1.49c0-1.85.6925-3.11 2.93-3.11h2.07V12h-1.45c-.63 0-.76.24-.76.75V13.4h2.3l-.3 2.6Z" fill="#fff"/></svg>
      ),
    },
    {
      nombre: "Instagram",
      url: "https://instagram.com/",
      bg: "linear-gradient(120deg,#fd5949,#d6249f,#285AEB)",
      svg: (
        <svg width="32" height="32" viewBox="0 0 32 32"><defs><linearGradient id="ig" x1="0" x2="0.9" y1="0" y2="1"><stop stopColor="#fd5949"/><stop offset="0.5" stopColor="#d6249f"/><stop offset="1" stopColor="#285AEB"/></linearGradient></defs><circle cx="16" cy="16" r="16" fill="url(#ig)"/><rect x="10" y="10" width="12" height="12" rx="4" fill="#fff"/><circle cx="16" cy="16" r="4.8" fill="url(#ig)"/><circle cx="21.1" cy="10.9" r="1.3" fill="url(#ig)"/></svg>
      ),
    },
   
  ];

  const faqInicial = [
    {
      pregunta: "¿Atienden emergencias eléctricas fuera de horario?",
      respuesta: "¡Sí! Estamos disponibles 24/7 para emergencias eléctricas en Valparaíso y alrededores.",
    },
    {
      pregunta: "¿Entregan certificación SEC?",
      respuesta: "Contamos con técnicos autorizados SEC. Te ayudamos con toda la regularización y entrega de boletines.",
    },
    {
      pregunta: "¿Realizan proyectos industriales y grandes?",
      respuesta: "Sí, realizamos desde instalaciones domiciliarias hasta industriales y fotovoltaicos.",
    },
    {
      pregunta: "¿Cómo solicito presupuesto?",
      respuesta: "Puedes completar el formulario, escribirnos por WhatsApp, o llamarnos directamente para atención inmediata.",
    },
  ];
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // use OptimizedImage component to pick avif/webp/ original at runtime

  return (
    <main id="main" className="min-h-screen w-full flex flex-col items-center transition-opacity duration-700">
      {/* Hero Section Moderno */}
      <section className="w-full bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 py-16 px-6 shadow-2xl">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-xl animate-fade-in">
            Ingeniería y Construcciones
            <span className="block text-cyan-200 mt-2">ELIENAI SPA</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-50 mb-8 font-light max-w-3xl mx-auto leading-relaxed">
            Expertos en electricidad, carpintería y soluciones integrales en la V Región de Valparaíso
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <button
              onClick={() => scrollToId('contacto')}
              className="px-8 py-4 bg-white text-indigo-700 font-bold text-lg rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Solicitar Presupuesto
            </button>
            <a
              href="https://wa.me/56995748162"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-green-500 text-white font-bold text-lg rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-.04.223-.174.075s-.298-.372-.446-.52c-.149-.149-.396-.223-.644-.075-.297.15-.792.223-1.238.223-.347 0-.595.074-.792.223-.198.148-.446.446-.446.867 0 .421.446 1.19 1.04 1.785.594.595 2.22 2.22 3.85 2.97 1.63.75 1.63.5 1.926.446.297-.074.965-.372 1.114-.743.149-.372.149-.669.099-.743-.074-.074-.272-.148-.57-.297z"/>
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="w-full max-w-6xl px-6 py-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">
          Nuestros Servicios
        </h2>
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            className={categoria === "electricidad" ?
              "group px-8 py-4 rounded-2xl shadow-xl font-bold text-lg transition-all duration-300 bg-gradient-to-r from-indigo-600 to-blue-600 text-white scale-105 hover:shadow-2xl"
              : "group px-8 py-4 rounded-2xl shadow-lg font-bold text-lg transition-all duration-300 bg-white text-indigo-700 border-2 border-indigo-200 hover:border-indigo-400 hover:shadow-xl hover:scale-105"
            }
            onClick={() => setCategoria("electricidad")}
          >
            ⚡ Electricidad
          </button>
          
          <button
            className={categoria === "carpinteria" ?
              "group px-8 py-4 rounded-2xl shadow-xl font-bold text-lg transition-all duration-300 bg-gradient-to-r from-green-600 to-emerald-600 text-white scale-105 hover:shadow-2xl"
              : "group px-8 py-4 rounded-2xl shadow-lg font-bold text-lg transition-all duration-300 bg-white text-green-700 border-2 border-green-200 hover:border-green-400 hover:shadow-xl hover:scale-105"
            }
            onClick={() => setCategoria("carpinteria")}
          >
            🪚 Carpintería
          </button>

          <button
            className={categoria === "otros" ?
              "group px-8 py-4 rounded-2xl shadow-xl font-bold text-lg transition-all duration-300 bg-gradient-to-r from-amber-500 to-orange-500 text-white scale-105 hover:shadow-2xl"
              : "group px-8 py-4 rounded-2xl shadow-lg font-bold text-lg transition-all duration-300 bg-white text-amber-700 border-2 border-amber-200 hover:border-amber-400 hover:shadow-xl hover:scale-105"
            }
            onClick={() => setCategoria("otros")}
          >
            ☀️ Otros
          </button>
        </div>

        {/* Galería de Trabajos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {
            (categoria === "electricidad" ? imagenesElectricidad
              : categoria === "carpinteria" ? imagenesCarpinteria
              : imagenesOtros
            ).map((src, idx) => (
              <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105" key={idx}>
                <div className="relative w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  <OptimizedImage 
                    original={src} 
                    alt="Trabajo realizado" 
                    className="object-cover transition-transform duration-500 group-hover:scale-110" 
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" 
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white font-semibold text-sm">
                    {categoria === "electricidad" ? "Instalación Eléctrica" : categoria === "carpinteria" ? "Trabajo de Carpintería" : "Proyecto Especializado"}
                  </p>
                </div>
              </div>
            ))
          }
        </div>
      </section>
  
  {/* WhatsApp FAB Mejorado */}
      <a
        href="https://wa.me/56995748162"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 group"
        aria-label="WhatsApp"
      >
        <div className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-green-500/50">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <path d="M17.5 10.5a6 6 0 0 0-6 6c0 1.0705.3875 2.0834 1.0492 2.8842l-1.0266 3.5089a.5.5 0 0 0 .618.618l3.5089-1.0266A6 6 0 1 0 17.5 10.5Z" fill="#fff" />
            <path d="M20.9787 18.0802c-.2465-.1232-1.4533-.7183-1.6783-.7994-.225-.081-0.3887-.122-0.5527.1232-0.164.2465-.6329.7995-.7754.9638-.143.1643-.286.1842-.5324.0611-.2466-.1233-.9268-.3411-1.7671-1.0876-.6535-.5826-1.0943-1.2995-1.2236-1.546-.1289-.2466-.0136-.3792.108-.5012.1115-.1105.2467-.2876.3703-.4312.1231-.1433.1642-.2463.2466-.4103.082-.1639.041-.3085-.0205-.4313-.062-.1233-.5528-1.3373-.7572-1.8259-.2003-.4823-.4027-.4162-.5527-.4251l-.4701-.0094c-.1648-.023-.3554-.023-.5441.0256-.1887.048-.5831.2276-.8921.5408-.6383.6491-0.9457 1.802-.5145 2.637.4279.8312 1.6539 2.0711 3.131 2.5809a4.7284 4.7284 0 0 0 1.7747.3398c.2855 0 .5481-.023 .7549-.0559.2063-.0326.634-.2591.7237-.5094.0897-.2502.0897-.4625.0627-.5092-.0271-.0467-.2465-.1234-.4929-.2466Z" fill="#fff" />
          </svg>
          <span className="font-bold text-base hidden sm:block">Chatea con nosotros</span>
        </div>
      </a>
      
      <footer className="w-full bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 text-white py-12 mt-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-cyan-200">ELIENAI SPA</h3>
              <p className="text-blue-100 leading-relaxed">
                Ingeniería y construcciones de excelencia en la V Región de Valparaíso
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-3 text-cyan-200">Contacto</h4>
              <ul className="space-y-2 text-blue-100">
                <li>📞 +56 9 9574 8162</li>
                <li>✉️ yfuelaluz@gmail.com</li>
                <li>📍 V Región, Valparaíso</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-3 text-cyan-200">Síguenos</h4>
              <div className="flex gap-4">
                {redes.map((red, idx) => (
                  <a
                    key={idx}
                    href={red.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 transition-transform duration-300"
                  >
                    {red.svg}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-blue-700/30 pt-6 text-center text-blue-200">
            <p>&copy; {new Date().getFullYear()} Ingeniería y Construcciones ELIENAI SPA - Todos los derechos reservados</p>
          </div>
        </div>
      </footer>
      {/* Barra de navegación fija */}
      <nav className="sticky top-0 z-40 w-full bg-white/80 shadow flex justify-center py-3 mb-6 backdrop-blur rounded-b-lg">
        <ul className="flex gap-4 text-blue-700 font-semibold text-sm sm:text-base">
          <li>
            <button onClick={() => scrollToId("contacto")} className="hover:text-blue-900 transition">Contacto</button>
          </li>
          <li>
            <button onClick={() => scrollToId("servicios")} className="hover:text-blue-900 transition">Servicios</button>
          </li>
          <li>
            <button onClick={() => scrollToId("cotiza")} className="hover:text-blue-900 transition">Solicita Presupuesto</button>
          </li>
        </ul>
      </nav>

      {/* Toast de éxito */}
      <div>
        {exito && (
          <div className="toast-success">
            <span>✅ Enviado: revisa WhatsApp y tu correo</span>
          </div>
        )}
      </div>

      {/* NOSOTROS */}
      <section className="max-w-3xl w-full mb-1 fadeIn" id="nosotros"
        style={{ animation: visible ? "fadein 0.8s 0.05s both" : "none", opacity: visible ? 1 : 0 }}>
        <div className="rounded-2xl bg-gradient-to-br from-blue-200 via-white to-blue-50 shadow px-8 py-7 border border-blue-100 flex flex-col sm:flex-row items-center gap-8">
            <div className="overflow-hidden w-full sm:w-[280px] h-[170px] rounded-xl bg-blue-300 border-4 border-blue-100 shadow flex items-center justify-center shrink-0 relative">
            <Image src="/galeria/Tablero Electrico.jpg" alt="Instalación eléctrica" fill className="object-cover" />
          </div>
          <div className="w-full">
            <h3 className="text-xl font-bold text-blue-800 mb-2">Quienes somos</h3>
            <div className="text-blue-900/90 leading-relaxed font-medium">
              <span className="block mb-1">Somos un equipo de técnicos eléctricos con +10 años de experiencia, brindando soluciones rápidas y seguras tanto para hogares como empresas.</span>
              <span className="block mb-1">Nos destacamos por la honestidad, el profesionalismo y la atención personalizada en cada trabajo.</span>
              <span className="block">¡Cotiza con nosotros en Valparaíso y alrededores!</span>
            </div>
          </div>
        </div>
      </section>

      {/* CERTIFICACIONES Y MARCAS */}
      <section className="max-w-3xl w-full mb-2 fadeIn" id="certificaciones"
        style={{ animation: visible ? 'fadein 0.8s 0.1s both' : 'none', opacity: visible ? 1 : 0 }}>
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 via-blue-100 to-white shadow px-8 py-6 border border-blue-100 flex flex-col items-center">
          <h3 className="text-lg font-bold text-blue-800 mb-3">Certificaciones y Marcas</h3>
          <div className="flex gap-6 flex-wrap justify-center items-center">
            <img src="https://www.sec.cl/wp-content/uploads/2021/02/logo-SEC_horizontal.png"
              alt="Técnico Certificado SEC" className="h-12 w-auto rounded bg-white shadow border" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Schneider_Electric_logo.svg/2560px-Schneider_Electric_logo.svg.png"
              alt="Marca Schneider Electric" className="h-12 w-auto rounded bg-white shadow border" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Legrand_logo.svg/2560px-Legrand_logo.svg.png"
              alt="Marca Legrand" className="h-12 w-auto rounded bg-white shadow border" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/ABB_logo.svg/2560px-ABB_logo.svg.png"
              alt="Marca ABB" className="h-9 w-auto rounded bg-white shadow border" />
          </div>
          <div className="mt-3 text-blue-700/85 text-sm text-center">
            Certificación SEC &mdash; solo materiales originales y garantizados.
          </div>
        </div>
      </section>

      {/* BOTÓN COTIZACIÓN EXPRESS */}
      <div className="w-full flex justify-center mb-5">
        <a
          href={`https://wa.me/${whatsappNumber}?text=Hola,%20quiero%20una%20cotización%20express%20de%20servicio%20eléctrico`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-accent-gradient flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-base shadow-lg hover:scale-105 transition focus:outline-none"
          style={{ fontSize: "1.10em" }}
        >
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="#25D366" />
            <path
              d="M17.5 10.5a6 6 0 0 0-6 6c0 1.0705.3875 2.0834 1.0492 2.8842l-1.0266 3.5089a.5.5 0 0 0 .618.618l3.5089-1.0266A6 6 0 1 0 17.5 10.5Z"
              fill="#fff"
            />
            <path
              d="M20.9787 18.0802c-.2465-.1232-1.4533-.7183-1.6783-.7994-.225-.081-0.3887-.122-0.5527.1232-0.164.2465-.6329.7995-.7754.9638-.143.1643-.286.1842-.5324.0611-.2466-.1233-.9268-.3411-1.7671-1.0876-.6535-.5826-1.0943-1.2995-1.2236-1.546-.1289-.2466-.0136-.3792.108-.5012.1115-.1105.2467-.2876.3703-.4312.1231-.1433.1642-.2463.2466-.4103.082-.1639.041-.3085-.0205-.4313-.062-.1233-.5528-1.3373-.7572-1.8259-.2003-.4823-.4027-.4162-.5527-.4251l-.4701-.0094c-.1648-.023-.3554-.023-.5441.0256-.1887.048-.5831.2276-.8921.5408-.6383.6491-0.9457 1.802-.5145 2.637.4279.8312 1.6539 2.0711 3.131 2.5809a4.7284 4.7284 0 0 0 1.7747.3398c.2855 0 .5481-.023 .7549-.0559.2063-.0326.634-.2591.7237-.5094.0897-.2502.0897-.4625.0627-.5092-.0271-.0467-.2465-.1234-.4929-.2466Z"
              fill="#25D366"
            />
          </svg>
          Cotización express por WhatsApp
        </a>
      </div>

      {/* --- FORMULARIO COTIZACIÓN --- */}
      <section className="max-w-3xl w-full my-8" id="cotiza">
        <div className="rounded-2xl bg-gradient-to-br from-white via-blue-50 to-blue-100 shadow-md px-8 py-8 mb-7 border border-blue-200">
          <form
            className="rounded-xl px-6 py-6 bg-blue-50 shadow-lg max-w-md mx-auto flex flex-col gap-4 border border-blue-200"
            onSubmit={handleSubmit}
            style={{ animation: visible ? "fadein 0.9s 0.2s both" : "none", opacity: visible ? 1 : 0 }}
          >
            <h2 className="mb-2 text-blue-700 font-bold text-lg">Solicita tu presupuesto o consulta:</h2>
            <div>
              <label htmlFor="nombre" className="block font-semibold text-blue-900 mb-1">Nombre</label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                required
                value={form.nombre}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                placeholder="Tu nombre"
                autoComplete="name"
              />
            </div>
            <div>
              <label htmlFor="telefono" className="block font-semibold text-blue-900 mb-1">Teléfono</label>
              <input
                id="telefono"
                name="telefono"
                type="tel"
                required
                value={form.telefono}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                placeholder="+56 9 ... "
                autoComplete="tel"
              />
            </div>
            <div>
              <label htmlFor="email" className="block font-semibold text-blue-900 mb-1">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                placeholder="correo@contacto.cl"
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="mensaje" className="block font-semibold text-blue-900 mb-1">Mensaje</label>
              <textarea
                id="mensaje"
                name="mensaje"
                rows={3}
                required
                value={form.mensaje}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300 transition resize-none"
                placeholder="¿Qué necesitas?"
              />
            </div>
            <button
              className="btn-accent-gradient mt-2 disabled:opacity-60 flex items-center justify-center gap-2"
              type="submit"
              disabled={enviando}
            >
              {enviando ? (
                <>
                  <span className="loader"></span>
                  {"Enviando..."}
                </>
              ) : (
                "Enviar"
              )}
            </button>
            {error && (
              <div className="text-red-700 text-sm font-semibold text-center pt-3 fadeIn">
                {error}
              </div>
            )}
          </form>
        </div>
      </section>

      {/* --- SERVICIOS --- */}
      <section className="max-w-3xl w-full mb-8" id="servicios">
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 shadow-md px-8 py-8 mb-7 border border-blue-200">
          <h2 className="text-3xl font-bold mb-4 text-blue-700">
            Servicio eléctrico rápido y seguro
          </h2>
          <p className="mb-6 text-base text-[#184780]">
            Instalaciones, reparaciones, emergencias 24/7 y mantenimiento preventivo.
            Técnicos certificados y materiales de calidad.
          </p>
          <h3 className="text-lg font-semibold mb-2">
            Selecciona el servicio que necesitas:
          </h3>
          <h4 className="text-lg font-bold mb-3 text-blue-800">
            Electricidad
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: "Electricidad - Servicios generales",
                desc: "Servicios eléctricos generales y especializados.",
              },
              {
                title: "Mantenciones",
                desc: "Prevención y revisión periódica de instalaciones eléctricas.",
              },
              {
                title: "Planos eléctricos",
                desc: "Diseño y regularización de planos eléctricos.",
              },
              {
                title: "Trámites SEC",
                desc: "Gestión de boletines y trámites ante la Superintendencia (SEC).",
              },
              {
                title: "Asesorías",
                desc: "Consultoría técnica para proyectos eléctricos y normativas.",
              },
              {
                title: "Proyectos fotovoltaicos",
                desc: "Instalación y diseño de paneles solares.",
              },
              {
                title: "Emergencias",
                desc: "Atención 24/7 para averías graves y cortes de energía.",
              },
              {
                title: "Visitas técnicas",
                desc: "Inspección en terreno para presupuestos y diagnósticos.",
              },
              {
                title: "Mallas a tierra",
                desc: "Instalación y revisión de sistemas de puesta a tierra.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="service-card"
                style={{
                  animation: visible
                    ? `fadein 0.8s ease ${(i + 1) * 0.1}s both`
                    : "none",
                  opacity: visible ? 1 : 0,
                  borderRadius: "16px",
                  background: "linear-gradient(120deg, #e0e7ff 0%, #bfdbfe 100%)",
                  boxShadow: "0 2px 12px 0 rgba(37,99,235,0.09)",
                }}
              >
                <h5 className="font-bold text-base mb-1 text-blue-700">{item.title}</h5>
                <p className="text-sm text-blue-900">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- MAPA --- */}
      <section className="max-w-3xl w-full mb-8" id="ubicacion">
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 via-blue-100 to-white shadow px-8 py-7 border border-blue-100 flex flex-col items-center">
          <h3 className="text-2xl font-bold mb-4 text-blue-700 text-center">¿Dónde nos encuentras?</h3>
          <div className="w-full flex flex-col items-center">
            <iframe
              title="Ubicación Electricistas Profesionales"
              style={{ borderRadius: "16px", border: "0", width: "100%", maxWidth: 480, height: 260 }}
              loading="lazy"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3306.330240774613!2d-71.62700928479095!3d-33.04723877113605!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9689de17ff90edc3%3A0x7b6752b7e2a9227e!2sValpara%C3%ADso!5e0!3m2!1ses-419!2scl!4v1701759565836!5m2!1ses-419!2scl"
              allowFullScreen
            ></iframe>
            <div className="mt-2 text-blue-900 text-sm opacity-90 text-center">
              Valparaíso, Región de Valparaíso<br />
              Atención en todo Valparaíso y alrededores
            </div>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIOS --- */}
      <section className="max-w-3xl w-full mb-5" id="testimonios">
        <div className="rounded-2xl bg-gradient-to-br from-blue-200 via-blue-50 to-white shadow px-8 py-8 border border-blue-100">
          <h3 className="text-2xl font-bold mb-4 text-blue-700 text-center">Testimonios de clientes</h3>
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              {
                nombre: "Carla Gómez",
                comentario: "¡Excelente atención! Resolvieron mi problema eléctrico en menos de una hora.",
              },
              {
                nombre: "Juan Soto",
                comentario: "Rápidos y profesionales. Los recomiendo totalmente.",
              },
              {
                nombre: "Marcela P.",
                comentario: "Me asesoraron en mi proyecto solar y me ahorraron mucho dinero.",
              },
              {
                nombre: "Pedro M.",
                comentario: "Honestos y confiables. No venden servicios innecesarios, solo lo que uno necesita.",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="rounded-xl bg-white border border-blue-100 shadow p-5 flex flex-col gap-2 fadeIn"
                style={{
                  animation: visible ? `fadein 0.8s ease ${i * 0.12 + 0.1}s both` : "none",
                  opacity: visible ? 1 : 0,
                  minHeight: "125px",
                }}
              >
                <div className="font-semibold text-blue-800">{t.nombre}</div>
                <div className="text-blue-900 text-[1.05em] font-medium">{t.comentario}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FAQ --- */}
      <section className="max-w-3xl w-full mb-5" id="faq">
        <div className="rounded-2xl bg-gradient-to-br from-white via-blue-50 to-blue-100 shadow px-8 py-8 border border-blue-100">
          <h3 className="text-2xl font-bold mb-5 text-blue-700 text-center">Preguntas Frecuentes</h3>
          <div className="faq-bloc grid gap-4">
            {faqInicial.map((item, i) => (
              <div
                key={i}
                className={`rounded-xl border border-blue-100 shadow px-4 py-2 bg-white cursor-pointer transition hover:border-blue-300`}
                style={{
                  animation: visible ? `fadein 0.6s ease ${i * 0.04 + 0.12}s both` : "none",
                  opacity: visible ? 1 : 0,
                  background: faqOpen === i ? "linear-gradient(85deg,#dbeafe,#f1f5f9 80%)" : "white",
                }}
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}
              >
                <div className="flex justify-between items-center gap-3">
                  <span className="font-semibold text-blue-900">{item.pregunta}</span>
                  <span className="text-blue-700 text-xl">{faqOpen === i ? "−" : "+"}</span>
                </div>
                {faqOpen === i && (
                  <div className="mt-2 text-blue-900/90 text-sm font-medium">
                    {item.respuesta}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- REDES SOCIALES --- */}
      <section className="max-w-3xl w-full mb-3" id="redes">
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-200 px-8 py-6 shadow border border-blue-100 flex flex-col items-center">
          <h3 className="text-xl font-semibold mb-3 text-blue-700 text-center">Síguenos o contáctanos en redes sociales</h3>
          <div className="flex gap-7 flex-wrap justify-center">
            {redes.map((r, i) => (
              <a
                href={r.url}
                key={i}
                target="_blank"
                rel="noopener noreferrer"
                title={r.nombre}
                style={{ boxShadow: "0 2px 10px 0 rgba(30,64,175,.08)", background: r.bg, borderRadius: "100px" }}
                className="w-14 h-14 flex items-center justify-center hover:scale-105 outline outline-2 outline-blue-200 transition-all"
              >
                {r.svg}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full py-6 px-4 mt-8 bg-blue-700 text-white flex flex-col items-center text-center rounded-t-2xl shadow-lg">
        <div className="mb-2 font-bold">
          Electricistas Profesionales &copy; {new Date().getFullYear()}
        </div>
        <div className="flex gap-4 mb-2 flex-wrap justify-center">
          <a
            href="mailto:yfuelaluz@gmail.com"
            className="underline hover:text-blue-300 transition-colors"
          >
            yfuelaluz@gmail.com
          </a>
          <a
            href="https://wa.me/56995748162"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-300 transition-colors"
          >
            WhatsApp
          </a>
          <a
            href="tel:+56995748162"
            className="underline hover:text-blue-300 transition-colors"
          >
            Teléfono: +56 9 9574 8162
          </a>
        </div>
        <div className="text-xs text-blue-200">
          Diseño y desarrollo &mdash; {new Date().getFullYear()}.
        </div>
      </footer>
      {/* --- GALERÍA DE TRABAJOS --- */}
<section className="max-w-3xl w-full mb-7" id="galeria">
  <div className="rounded-2xl bg-gradient-to-br from-white via-blue-50 to-blue-100 shadow px-8 py-8 border border-blue-100">
    <h3 className="text-2xl font-bold mb-4 text-blue-700 text-center">
      Trabajos realizados
    </h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    <div className="group rounded-xl overflow-hidden border border-blue-100 bg-white shadow hover:shadow-lg transition relative">
      <div className="relative w-full h-48">
        <Image src="/galeria/Ampliacion tipo Cabaña.jpg" alt="Ampliación tipo Cabaña" fill className="object-cover transition scale-100 group-hover:scale-105" />
      </div>
      <div className="absolute bottom-0 left-0 w-full bg-blue-900/80 text-white px-3 py-2 text-sm font-semibold text-center opacity-90">
        Ampliación tipo Cabaña
      </div>
    </div>
    <div className="group rounded-xl overflow-hidden border border-blue-100 bg-white shadow hover:shadow-lg transition relative">
      <div className="relative w-full h-48">
        <Image src="/galeria/Cambio de Techumbre.jpg" alt="Cambio de Techumbre" fill className="object-cover transition scale-100 group-hover:scale-105" />
      </div>
      <div className="absolute bottom-0 left-0 w-full bg-blue-900/80 text-white px-3 py-2 text-sm font-semibold text-center opacity-90">
        Cambio de Techumbre
      </div>
    </div>
    <div className="group rounded-xl overflow-hidden border border-blue-100 bg-white shadow hover:shadow-lg transition relative">
      <div className="relative w-full h-48">
        <Image src="/galeria/Casa 2 pisos.jpg" alt="Casa 2 pisos" fill className="object-cover transition scale-100 group-hover:scale-105" />
      </div>
      <div className="absolute bottom-0 left-0 w-full bg-blue-900/80 text-white px-3 py-2 text-sm font-semibold text-center opacity-90">
        Casa 2 pisos
      </div>
    </div>
    <div className="group rounded-xl overflow-hidden border border-blue-100 bg-white shadow hover:shadow-lg transition relative">
      <div className="relative w-full h-48">
        <Image src="/galeria/Casa para Soltero.jpg" alt="Casa para Soltero" fill className="object-cover transition scale-100 group-hover:scale-105" />
      </div>
      <div className="absolute bottom-0 left-0 w-full bg-blue-900/80 text-white px-3 py-2 text-sm font-semibold text-center opacity-90">
        Casa para Soltero
      </div>
    </div>
    <div className="group rounded-xl overflow-hidden border border-blue-100 bg-white shadow hover:shadow-lg transition relative">
      <div className="relative w-full h-48">
        <Image src="/galeria/Casa Soltero 2.jpg" alt="Casa Soltero 2" fill className="object-cover transition scale-100 group-hover:scale-105" />
      </div>
      <div className="absolute bottom-0 left-0 w-full bg-blue-900/80 text-white px-3 py-2 text-sm font-semibold text-center opacity-90">
        Casa Soltero 2
      </div>
    </div>
    <div className="group rounded-xl overflow-hidden border border-blue-100 bg-white shadow hover:shadow-lg transition relative">
      <div className="relative w-full h-48">
        <Image src="/galeria/Iluminacion Pared tipo Rack.jpg" alt="Iluminacion Pared tipo Rack" fill className="object-cover transition scale-100 group-hover:scale-105" />
      </div>
      <div className="absolute bottom-0 left-0 w-full bg-blue-900/80 text-white px-3 py-2 text-sm font-semibold text-center opacity-90">
        Iluminacion Pared tipo Rack
      </div>
    </div>
    <div className="group rounded-xl overflow-hidden border border-blue-100 bg-white shadow hover:shadow-lg transition relative">
      <div className="relative w-full h-48">
        <Image src="/galeria/Iluminacion Pared.jpg" alt="Iluminacion Pared" fill className="object-cover transition scale-100 group-hover:scale-105" />
      </div>
      <div className="absolute bottom-0 left-0 w-full bg-blue-900/80 text-white px-3 py-2 text-sm font-semibold text-center opacity-90">
        Iluminacion Pared
      </div>
    </div>
    <div className="group rounded-xl overflow-hidden border border-blue-100 bg-white shadow hover:shadow-lg transition relative">
      <div className="relative w-full h-48">
        <Image src="/galeria/Montaje EPC.jpg" alt="Montaje EPC" fill className="object-cover transition scale-100 group-hover:scale-105" />
      </div>
      <div className="absolute bottom-0 left-0 w-full bg-blue-900/80 text-white px-3 py-2 text-sm font-semibold text-center opacity-90">
        Montaje EPC
      </div>
    </div>
    <div className="group rounded-xl overflow-hidden border border-blue-100 bg-white shadow hover:shadow-lg transition relative">
      <div className="relative w-full h-48">
        <Image src="/galeria/Plano Alumbrado.jpg" alt="Plano Alumbrado" fill className="object-cover transition scale-100 group-hover:scale-105" />
      </div>
      <div className="absolute bottom-0 left-0 w-full bg-blue-900/80 text-white px-3 py-2 text-sm font-semibold text-center opacity-90">
        Plano Alumbrado
      </div>
    </div>
    <div className="group rounded-xl overflow-hidden border border-blue-100 bg-white shadow hover:shadow-lg transition relative">
      <div className="relative w-full h-48">
        <Image src="/galeria/Plano casa 3 Dor. y 2 Bañ. .jpg" alt="Plano casa 3 Dor. y 2 Baños" fill className="object-cover transition scale-100 group-hover:scale-105" />
      </div>
      <div className="absolute bottom-0 left-0 w-full bg-blue-900/80 text-white px-3 py-2 text-sm font-semibold text-center opacity-90">
        Plano casa 3 Dor. y 2 Baños
      </div>
    </div>
    <div className="group rounded-xl overflow-hidden border border-blue-100 bg-white shadow hover:shadow-lg transition relative">
      <div className="relative w-full h-48">
        <Image src="/galeria/Sistema Fotovoltaico.jpg" alt="Sistema Fotovoltaico" fill className="object-cover transition scale-100 group-hover:scale-105" />
      </div>
      <div className="absolute bottom-0 left-0 w-full bg-blue-900/80 text-white px-3 py-2 text-sm font-semibold text-center opacity-90">
        Sistema Fotovoltaico
      </div>
    </div>
    <div className="group rounded-xl overflow-hidden border border-blue-100 bg-white shadow hover:shadow-lg transition relative">
      <div className="relative w-full h-48">
        <Image src="/galeria/Tablero Electrico.jpg" alt="Tablero Eléctrico" fill className="object-cover transition scale-100 group-hover:scale-105" />
      </div>
      <div className="absolute bottom-0 left-0 w-full bg-blue-900/80 text-white px-3 py-2 text-sm font-semibold text-center opacity-90">
        Tablero Eléctrico
      </div>
    </div>
  </div>
  </div>
</section>
      <style>{`
        html { scroll-behavior: smooth; }
        @keyframes fadein {
          0% { opacity:0; transform: translateY(20px);}
          100% { opacity:1; transform: translateY(0);}
        }
        .btn-accent-gradient {
          background: linear-gradient(90deg, #2563eb 0%, #1e40af 100%);
          color: #fff;
          border: none;
          border-radius: 0.7rem;
          padding: 0.7rem 1.6rem;
          font-weight: 600;
          font-size: 1.06rem;
          box-shadow: 0 2px 12px 0 rgba(37,99,235,0.12);
          cursor: pointer;
          transition: transform 0.12s, box-shadow 0.18s, background 0.18s;
        }
        .btn-accent-gradient:hover, .btn-accent-gradient:active {
          background: linear-gradient(90deg, #1e40af 0%, #2563eb 100%);
          box-shadow: 0 6px 18px 0 rgba(37,99,235,0.25);
          transform: scale(1.04);
        }
        .fadeIn {
          animation: fadein 0.9s 0.2s both;
        }
        .loader {
          display: inline-block;
          width: 1.09em;
          height: 1.09em;
          border: 2.7px solid #fff;
          border-radius: 50%;
          border-top: 2.7px solid #2563eb;
          animation: spin 0.78s linear infinite;
          vertical-align: middle;
          margin-right: 0.22em;
        }
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
        .toast-success {
          position: fixed;
          right: 24px;
          bottom: 86px;
          z-index: 90;
          min-width: 230px;
          max-width: 310px;
          background: linear-gradient(95deg, #4ade80 0%, #16a34a 100%);
          color: #fff;
          padding: 0.95em 1.2em;
          border-radius: 1em;
          font-size: 1.07em;
          font-weight: 600;
          box-shadow: 0 2px 16px 0 rgba(22,163,74,0.16);
          opacity: 0.95;
          display: flex;
          align-items: center;
          gap: 0.9em;
          animation: fadein 0.45s 0.06s both;
        }
     `}</style>
    </main>
  );
}