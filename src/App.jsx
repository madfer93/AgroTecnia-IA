import React, { useState } from 'react';
import { 
  Menu, X, Leaf, Sprout, ShieldCheck, 
  Settings, Camera, CloudSun, CheckCircle, 
  MapPin, Phone, Mail, Wheat, ChevronRight
} from 'lucide-react';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    ubicacion: '',
    produccion: 'Agronomía',
    problematica: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar a Supabase/Dashboard
    alert('Diagnóstico enviado. Pronto un especialista de JyM Tech Solutions te contactará.');
    // Integración pendiente con el backend/Supabase.
  };

  return (
    <div className="min-h-screen font-sans bg-gray-50 text-gray-800">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2">
              <Leaf className="h-8 w-8 text-primary-600" />
              <div>
                <span className="font-bold text-xl text-gray-900 leading-tight block">JyM Tech Solutions</span>
                <span className="text-xs text-primary-600 font-semibold tracking-wide uppercase">AgroTecnia IA</span>
              </div>
            </div>
            
            <div className="hidden md:flex space-x-8 items-center">
              <a href="#inicio" className="text-gray-600 hover:text-primary-600 font-medium">Inicio</a>
              <a href="#servicios" className="text-gray-600 hover:text-primary-600 font-medium">Servicios</a>
              <a href="#dolores" className="text-gray-600 hover:text-primary-600 font-medium">¿Por qué IA?</a>
              <a href="#diagnostico" className="bg-primary-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition">
                Diagnóstico Gratuito
              </a>
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t p-4 flex flex-col space-y-4 shadow-lg absolute w-full left-0">
            <a href="#inicio" onClick={() => setIsMenuOpen(false)} className="mx-2 text-gray-700 font-medium">Inicio</a>
            <a href="#servicios" onClick={() => setIsMenuOpen(false)} className="mx-2 text-gray-700 font-medium">Servicios</a>
            <a href="#dolores" onClick={() => setIsMenuOpen(false)} className="mx-2 text-gray-700 font-medium">¿Por qué IA?</a>
            <a href="#diagnostico" onClick={() => setIsMenuOpen(false)} className="mx-2 bg-primary-600 text-white text-center px-4 py-2 rounded-lg font-medium">Diagnóstico Gratuito</a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="inicio" className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 pt-20 px-4 sm:px-6 lg:px-8">
            <main className="mx-auto max-w-7xl sm:mt-12 md:mt-16 lg:mt-20 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <span className="text-sm font-bold text-secondary-500 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mb-4 inline-block">Agrotecnia 4.0</span>
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl mb-6">
                  <span className="block">El Futuro del Campo</span>
                  <span className="block text-primary-600">es Inteligente</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Integramos <strong>Inteligencia Artificial y Automatización WhatsApp</strong> para el sector rural en Villavicencio y los Llanos Orientales. Controla tus insumos, fechas críticas y cosechas desde tu celular, sin internet complejo.
                </p>
                <div className="mt-8 sm:flex sm:justify-center lg:justify-start gap-4">
                  <a href="#diagnostico" className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10 shadow-lg shadow-green-200 transition">
                    Realizar Diagnóstico Gratuito
                  </a>
                  <a href="#servicios" className="mt-3 sm:mt-0 w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition">
                    Ver Funciones
                  </a>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-gray-100 hidden lg:block overflow-hidden">
             {/* Un patrón decorativo o color plano tecnológico agrario */}
             <div className="h-full w-full bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-12">
                <div className="grid grid-cols-2 gap-4 opacity-20">
                    {[...Array(16)].map((_, i) => <Leaf key={i} className="w-16 h-16 text-primary-700" />)}
                </div>
             </div>
        </div>
      </section>

      {/* Dolores del Campo Section */}
      <section id="dolores" className="py-16 bg-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center max-w-3xl mx-auto">
            <h2 className="text-base text-primary-400 font-semibold tracking-wide uppercase">Comprendemos tu Realidad</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight sm:text-4xl text-white">
              Dejemos el cuaderno y las suposiciones
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-300 lg:mx-auto">
              Sabemos el dolor de cabeza que es perder el cuaderno de apuntes, olvidar la fecha exacta de la última fumigación, o depender de un clima inestable. El agro moderno no puede basarse en la memoria. Nosotros estructuramos tu información automáticamente para que tú solo te enfoques en producir.
            </p>
          </div>
        </div>
      </section>

      {/* Servicios Section */}
      <section id="servicios" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900">Soluciones de IA al Servicio del Agro</h2>
            <p className="mt-4 text-xl text-gray-500">Un ecosistema de herramientas diseñadas para la ruralidad real.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <Wheat className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Gestión de Cultivos (Agronomía)</h3>
              <p className="text-gray-600">
                Control de bitácoras por voz. Registra por WhatsApp las fechas exactas de fumigación, abonos y control de inventarios sin usar sistemas complejos.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-secondary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Control Ganadero (Zootecnia)</h3>
              <p className="text-gray-600">
                Lleva el rastro histórico de tu hato. Seguimiento digital de calendarios de vacunación, nutrición y alertas sanitarias automáticas.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Camera className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">IA de Visión & Botánica</h3>
              <p className="text-gray-600">
                Toma una foto a una planta enferma y envíala por nuestro canal de WhatsApp. La inteligencia artificial identificará la plaga y te sugerirá el insumo adecuado al instante.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-6">
                <CloudSun className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Asistente Climático</h3>
              <p className="text-gray-600">
                Integramos APIs satelitales agropecuarias para darte predicciones mucho más estables y alertas proactivas para evitar pérdidas por lluvias inesperadas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Formulario Section */}
      <section id="diagnostico" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 p-8 md:p-12 rounded-3xl shadow-sm border border-gray-200">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-extrabold text-gray-900">Piloto AgroTecnia</h2>
              <p className="mt-2 text-gray-600">Completa este breve diagnóstico y evaluaremos la viabilidad técnica de tu finca gratuita.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    id="nombre"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Ej. Daniel ..."
                  />
                </div>
                <div>
                  <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700 mb-1">Ubicación de la Finca</label>
                  <input
                    type="text"
                    id="ubicacion"
                    required
                    value={formData.ubicacion}
                    onChange={(e) => setFormData({...formData, ubicacion: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Ej. Vereda X, Villavicencio"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="produccion" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Producción Principal</label>
                <select
                  id="produccion"
                  value={formData.produccion}
                  onChange={(e) => setFormData({...formData, produccion: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white"
                >
                  <option>Agronomía (Cultivos, frutales, cacao)</option>
                  <option>Zootecnia (Ganadería, cerdos, aves)</option>
                  <option>Mixto (Agro y Animales)</option>
                  <option>Piscicultura</option>
                  <option>Otro</option>
                </select>
              </div>

              <div>
                <label htmlFor="problematica" className="block text-sm font-medium text-gray-700 mb-1">Cuéntanos tu problemática actual</label>
                <textarea
                  id="problematica"
                  required
                  rows="4"
                  value={formData.problematica}
                  onChange={(e) => setFormData({...formData, problematica: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="Ej. Se me pierden las fechas de abono y el clima me arruina la fumigación..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-primary-600 text-white font-bold py-4 px-8 rounded-lg hover:bg-primary-700 transition flex justify-center items-center gap-2"
              >
                Solicitar Viabilidad Tecnológica <ChevronRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 pt-16 pb-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="h-6 w-6 text-primary-500" />
                <span className="font-bold text-xl text-white">JyM Tech Solutions</span>
              </div>
              <p className="text-gray-400 max-w-sm mb-6">
                Desarrollo B2B e integraciones inteligentes para la automatización de procesos operativos en Colombia.
              </p>
              <div className="flex items-start gap-2 text-gray-400 text-sm">
                <ShieldCheck className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <p>Empresa registrada formalmente ante la Cámara de Comercio de Villavicencio. <br/> Matrícula Mercantil No. 495502 (CIIU 6201).</p>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Contacto Directo</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-400 hover:text-white transition">
                  <Phone className="w-4 h-4" />
                  <a href="https://wa.me/573045788873">+57 304 578 8873</a>
                </li>
                <li className="flex items-center gap-3 text-gray-400 hover:text-white transition">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:madfer1993@gmail.com">Ventas & Integraciones</a>
                </li>
                <li className="flex items-center gap-3 text-gray-400 hover:text-white transition">
                  <MapPin className="w-4 h-4" />
                  <span>Villavicencio, Meta, Colombia</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Política de Privacidad (Ley 1581)</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Aviso Legal</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Términos del Servicio SaaS</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} JyM Tech Solutions. Todos los derechos reservados.
            </p>
            <div className="flex bg-gray-800 rounded-full px-4 py-1 text-xs text-gray-400 items-center border border-gray-700">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
              Sistemas Operativos 100% en Nube
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
