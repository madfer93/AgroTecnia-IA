import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate,
  Link
} from 'react-router-dom';
import { 
  Menu, X, Leaf, Sprout, ShieldCheck, 
  Settings, Camera, CloudSun, CheckCircle, 
  MapPin, Phone, Mail, Wheat, ChevronRight,
  MessageSquare, Globe, BarChart3, Database,
  Zap, Tent, Radio
} from 'lucide-react';
import { supabase } from './lib/supabase';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import LegalPage from './components/LegalPage';
import AboutPage from './components/AboutPage';
import PricingPage from './components/PricingPage';
import AiAssistant from './components/AiAssistant';

// --- Componente LandingPage (UI Principal) ---
const LandingPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    whatsapp: '',
    ubicacion: '',
    produccion: 'Agronomía (Cultivos, frutales, cacao)',
    tamano_produccion: '',
    gestion_actual: 'Manual (Cuaderno/Papel)',
    uso_tecnologia: 'Bajo (Solo lo básico)',
    necesita_ia_medicina: 'No, por ahora no',
    problematica: '',
    autorizacion: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.autorizacion) {
      alert("Debes autorizar el tratamiento de datos (Habeas Data) para continuar.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('diagnosticos')
        .insert([{
          ...formData,
          autorizacion_datos: formData.autorizacion,
          estado: 'nuevo',
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;
      alert('¡Diagnóstico enviado con éxito! Te contactaremos pronto por WhatsApp.');
      setFormData({
        nombre: '',
        whatsapp: '',
        ubicacion: '',
        produccion: 'Agronomía (Cultivos, frutales, cacao)',
        tamano_produccion: '',
        gestion_actual: 'Manual (Cuaderno/Papel)',
        uso_tecnologia: 'Bajo (Solo lo básico)',
        necesita_ia_medicina: 'No, por ahora no',
        problematica: '',
        autorizacion: false
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al enviar el formulario. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen font-sans bg-gray-50 text-gray-800 scroll-smooth">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3">
              <img src="/logo-agrotecnia.png" alt="AgroTecnia Logo" className="h-12 w-12 rounded-xl shadow-lg shadow-green-100" />
              <div>
                <span className="font-black text-2xl text-gray-900 leading-none block tracking-tighter uppercase">AgroTecnia <span className="text-primary-600 text-lg italic">IA</span></span>
                <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">By JyM Tech Solutions</span>
              </div>
            </div>

            <div className="hidden md:flex space-x-8 items-center">
              <a href="#inicio" className="text-gray-600 hover:text-primary-600 font-medium transition">Inicio</a>
               <a href="#servicios" className="text-gray-600 hover:text-primary-600 font-medium transition">Servicios</a>
               <a href="#ia-satelital" className="text-gray-600 hover:text-primary-600 font-medium transition">IA Satelital</a>
               <Link to="/nosotros" className="text-gray-600 hover:text-primary-600 font-medium transition">Nosotros</Link>
               <Link to="/precios" className="text-gray-600 hover:text-primary-600 font-medium transition">Precios</Link>
               <a href="#diagnostico" className="bg-primary-600 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary-700 transition shadow-lg shadow-green-100">
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
            <a href="#ia-satelital" onClick={() => setIsMenuOpen(false)} className="mx-2 text-gray-700 font-medium">IA Satelital</a>
            <Link to="/nosotros" onClick={() => setIsMenuOpen(false)} className="mx-2 text-gray-700 font-medium font-bold text-primary-600">Nosotros & Estrategia</Link>
            <Link to="/precios" onClick={() => setIsMenuOpen(false)} className="mx-2 text-gray-700 font-medium font-bold text-primary-600">Precios</Link>
            <a href="#diagnostico" onClick={() => setIsMenuOpen(false)} className="mx-2 bg-primary-600 text-white text-center px-4 py-2 rounded-lg font-medium">Diagnóstico Gratuito</a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="inicio" className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 pt-20">
            <main className="mx-auto max-w-7xl text-center lg:text-left">
              <div>
                <span className="text-[10px] font-black text-primary-600 uppercase tracking-[0.3em] bg-primary-50 px-3 py-1 rounded-full mb-4 inline-block font-mono">Agrotecnia 4.0</span>
                <h1 className="text-5xl tracking-tighter font-black text-gray-900 sm:text-6xl md:text-7xl mb-6 uppercase">
                  <span className="block">El Futuro del Campo</span>
                  <span className="block text-primary-600 italic">es Inteligente</span>
                </h1>
                <p className="mt-3 text-lg text-gray-500 sm:mt-5 sm:text-xl sm:max-w-xl sm:mx-auto md:mt-5 lg:mx-0 font-medium">
                  Optimiza tu producción con <strong>Inteligencia Artificial</strong>. Monitorea salud de cultivos y clima desde el espacio, sin hardware costoso.
                </p>
                <div className="mt-10 sm:flex sm:justify-center lg:justify-start gap-4">
                  <a href="#diagnostico" className="w-full sm:w-auto flex items-center justify-center px-8 py-4 border border-transparent text-xs font-black uppercase tracking-widest rounded-2xl text-white bg-primary-600 hover:bg-primary-700 transition shadow-xl shadow-green-200">
                    Realizar Diagnóstico Gratuito
                  </a>
                  <a href="#servicios" className="mt-3 sm:mt-0 w-full sm:w-auto flex items-center justify-center px-8 py-4 border border-gray-200 text-xs font-black uppercase tracking-widest rounded-2xl text-gray-700 bg-white hover:bg-gray-50 transition">
                    Ver Funciones
                  </a>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 hidden lg:block">
          <img
            className="h-full w-full object-cover"
            src="/hero-agrotecnia.png"
            alt="Futuro de la Agricultura Inteligente"
          />
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent" />
        </div>
      </section>

      {/* IA Satelital Section */}
      <section id="ia-satelital" className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-primary-100/50 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-500" />
              <img
                src="/ia-satelital.png"
                alt="IA Satelital en acción"
                className="relative rounded-3xl shadow-2xl border-4 border-white object-cover aspect-video lg:aspect-square w-full"
              />
              <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-primary-100 max-w-[200px]">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Estado: Online</span>
                </div>
                <p className="text-xs font-bold text-gray-900 leading-tight text-left">Monitoreo Sentinel-2 activo sobre tu finca</p>
              </div>
            </div>

            <div className="mt-12 lg:mt-0">
               <div className="flex items-center gap-4 mb-6">
                 <div className="bg-primary-600 p-3 rounded-2xl shadow-lg shadow-green-200">
                   <CloudSun className="h-8 w-8 text-white" />
                 </div>
                 <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">IA Satelital: <br/>Tu Finca desde el Espacio</h2>
               </div>
               <p className="text-lg text-gray-600 mb-8 leading-relaxed font-medium">
                 ¿Sabías que no necesitas enterrar equipos costosos para conocer la salud de tu suelo? Nuestra IA interpreta datos de los satélites <strong>Sentinel</strong> para monitorear cada metro cuadrado de tu producción.
               </p>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 hover:border-primary-200 transition group">
                   <Zap className="h-8 w-8 text-primary-600 mb-4 group-hover:scale-110 transition" />
                   <h4 className="font-black text-gray-900 uppercase text-[10px] mb-2 tracking-widest leading-none">Cero Inversión Física</h4>
                   <p className="text-xs text-gray-500 leading-relaxed font-medium">Olvídate de cables, baterías y mantenimiento costoso. Todo es 100% digital.</p>
                 </div>
                 <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 hover:border-primary-200 transition group">
                   <BarChart3 className="h-8 w-8 text-secondary-600 mb-4 group-hover:scale-110 transition" />
                   <h4 className="font-black text-gray-900 uppercase text-[10px] mb-2 tracking-widest leading-none">Precisión Histórica</h4>
                   <p className="text-xs text-gray-500 leading-relaxed font-medium">Analizamos años de datos históricos para entender el ciclo real de tu suelo.</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios Section */}
      <section id="servicios" className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">Cerebros Especializados</h2>
            <p className="mt-4 text-lg text-gray-500 font-medium italic">Un ecosistema de IAs diseñadas para la ruralidad real.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white flex flex-col md:flex-row overflow-hidden rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl transition group">
              <div className="md:w-1/3 overflow-hidden">
                <img src="/ia-medicina.png" alt="Medicina Agro" className="h-full w-full object-cover group-hover:scale-110 transition duration-700" />
              </div>
              <div className="p-10 md:w-2/3 flex flex-col justify-center">
                <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
                  <Camera className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3 tracking-widest uppercase italic">IA de Medicina</h3>
                <p className="text-sm text-gray-600 font-medium leading-relaxed">
                  Envía una foto de tu planta enferma por WhatsApp. Nuestra IA identifica la plaga o deficiencia nutricional al instante.
                </p>
              </div>
            </div>

            <div className="bg-white flex flex-col md:flex-row-reverse overflow-hidden rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl transition group">
              <div className="md:w-1/3 overflow-hidden">
                <img src="/ia-mercado.png" alt="Precios Mercado" className="h-full w-full object-cover group-hover:scale-110 transition duration-700" />
              </div>
              <div className="p-10 md:w-2/3 flex flex-col justify-center">
                <div className="w-10 h-10 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                  <Globe className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3 tracking-widest uppercase italic">Precios del Mercado</h3>
                <p className="text-sm text-gray-600 font-medium leading-relaxed">
                  Consulta precios reales del SIPSA para negociar mejor tu cosecha. Información real para decisiones inteligentes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formulario Section */}
      <section id="diagnostico" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 p-8 md:p-12 rounded-[3rem] shadow-sm border border-gray-200">
            <div className="mb-10 text-center">
              <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Piloto AgroTecnia</h2>
              <p className="mt-2 text-gray-600 font-medium italic">Completa este diagnóstico para evaluar la viabilidad de tu finca.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="nombre" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    id="nombre"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-500 transition-shadow bg-white font-bold"
                    placeholder="Daniel Ramirez"
                  />
                </div>
                <div>
                  <label htmlFor="whatsapp" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">WhatsApp de Contacto</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-4.5 h-5 w-5 text-gray-300" />
                    <input
                      type="tel"
                      id="whatsapp"
                      required
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                      className="w-full pl-12 pr-5 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-500 bg-white font-bold"
                      placeholder="+57 304..."
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="ubicacion" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Ubicación de la Finca</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4.5 h-5 w-5 text-gray-300" />
                    <input
                      type="text"
                      id="ubicacion"
                      required
                      value={formData.ubicacion}
                      onChange={(e) => setFormData({...formData, ubicacion: e.target.value})}
                      className="w-full pl-12 pr-5 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-500 bg-white font-bold"
                      placeholder="Vereda Apiay, Villavicencio"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="tamano_produccion" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tamaño de Producción</label>
                  <input
                    type="text"
                    id="tamano_produccion"
                    required
                    value={formData.tamano_produccion}
                    onChange={(e) => setFormData({...formData, tamano_produccion: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-500 bg-white font-bold"
                    placeholder="Ej. 10 Hectáreas / 40 Vacas"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="produccion" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tipo de Producción</label>
                  <select
                    id="produccion"
                    value={formData.produccion}
                    onChange={(e) => setFormData({...formData, produccion: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-500 bg-white font-bold"
                  >
                    <option>Agronomía (Cultivos, frutales, cacao)</option>
                    <option>Zootecnia (Ganadería, cerdos, aves)</option>
                    <option>Mixto (Agro y Animales)</option>
                    <option>Piscicultura</option>
                    <option>Otro</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="gestion_actual" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Gestión de Datos Hoy</label>
                  <select
                    id="gestion_actual"
                    value={formData.gestion_actual}
                    onChange={(e) => setFormData({...formData, gestion_actual: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-500 bg-white font-bold"
                  >
                    <option>Manual (Cuaderno/Papel)</option>
                    <option>Digital Básico (Excel/WhatsApp)</option>
                    <option>Software Especializado</option>
                    <option>Ninguna</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="problematica" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Problema Actual a Resolver</label>
                <textarea
                  id="problematica"
                  required
                  rows="3"
                  value={formData.problematica}
                  onChange={(e) => setFormData({...formData, problematica: e.target.value})}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-500 bg-white font-bold"
                  placeholder="Ej. Se me pierden datos de producción o el clima me afecta el control de abonos..."
                ></textarea>
              </div>

              {/* Checkbox Habitual de Datos (Habeas Data) */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-start gap-4">
                <div className="flex items-center h-5">
                  <input
                    id="autorizacion"
                    type="checkbox"
                    required
                    checked={formData.autorizacion}
                    onChange={(e) => setFormData({...formData, autorizacion: e.target.checked})}
                    className="h-5 w-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 transition cursor-pointer"
                  />
                </div>
                <div className="text-sm">
                  <label htmlFor="autorizacion" className="font-bold text-gray-700 cursor-pointer">
                    Autorizo el tratamiento de mis datos personales
                  </label>
                  <p className="text-gray-400 font-medium">
                    Declaro que la información es verídica y autorizo a AgroTecnia IA (JyM Tech Solutions) a contactarme vía WhatsApp. Mis datos serán usados exclusivamente para la creación del sistema inteligente solicitado.
                    <Link to="/legal" className="text-primary-600 hover:underline ml-1">Ver Política Habeas Data</Link>
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full ${isSubmitting ? 'bg-gray-400' : 'bg-primary-600 hover:bg-primary-700'} text-xs font-black uppercase tracking-[0.2em] text-white py-5 px-8 rounded-2xl transition shadow-xl shadow-green-100 flex justify-center items-center gap-3`}
              >
                {isSubmitting ? 'Procesando...' : 'Solicitar Viabilidad Tecnológica'}
                <ChevronRight className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 pt-24 pb-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <img src="/logo-agrotecnia.png" alt="AgroTecnia Logo" className="h-10 w-10 rounded-lg shadow-lg" />
                <span className="font-black text-2xl text-white uppercase tracking-tighter">AgroTecnia <span className="text-primary-500 italic text-base">IA</span></span>
              </div>
              <p className="text-gray-400 max-w-sm mb-8 font-medium leading-relaxed">
                Soberanía tecnológica para el campo colombiano. Inteligencia Artificial aplicada a la producción real para decisiones inteligentes.
              </p>
              <div className="flex items-start gap-3 text-gray-400 text-sm">
                <ShieldCheck className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">Propiedad estratégica de **JyM Tech Solutions**. Villavicencio, Meta. Empresa registrada formalmente ante la Cámara de Comercio. Matrícula No. 495502.</p>
              </div>
            </div>

            <div>
              <h4 className="text-white font-black mb-6 uppercase text-[10px] tracking-widest">Contacto Directo</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-gray-400 hover:text-white transition">
                  <Phone className="w-4 h-4" />
                  <a href="https://wa.me/573045788873" className="font-bold">+57 304 578 8873</a>
                </li>
                <li className="flex items-center gap-3 text-gray-400 hover:text-white transition">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:madfer1993@gmail.com" className="font-bold">Ventas & Integraciones</a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-black mb-6 uppercase text-[10px] tracking-widest">Legal & SaaS</h4>
              <ul className="space-y-4">
                <li><Link to="/legal" className="text-gray-400 hover:text-white transition text-xs font-bold uppercase tracking-widest">Política de Privacidad</Link></li>
                <li><Link to="/legal" className="text-gray-400 hover:text-white transition text-xs font-bold uppercase tracking-widest">Habeas Data (1581)</Link></li>
                <li><Link to="/legal" className="text-gray-400 hover:text-white transition text-xs font-bold uppercase tracking-widest">Términos del Servicio</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest text-center md:text-left">
              &copy; {new Date().getFullYear()} AgroTecnia IA. Un producto de alto impacto por JyM Tech Solutions.
            </p>
            <div className="flex bg-gray-800 rounded-full px-5 py-2 text-[9px] font-black uppercase tracking-widest text-gray-400 items-center border border-gray-700 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse shadow-lg shadow-green-500/50"></span>
              Operación Satelital Activa
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- Main App Component with Routing ---
function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Escuchar cambios en la sesión
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/legal" element={<LegalPage />} />
        <Route path="/nosotros" element={<AboutPage />} />
        <Route path="/precios" element={<PricingPage />} />
        <Route 
          path="/admin"
          element={
            session ? (
              <AdminPanel onLogout={handleLogout} />
            ) : (
              <Login />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <AiAssistant />
    </Router>
  );
}

export default App;
