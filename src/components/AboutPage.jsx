import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, Sprout, Target, 
  Rocket, ShieldCheck, Globe, 
  ArrowRight, Users, MessageSquare 
} from 'lucide-react';

const AboutPage = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNosotros = async () => {
      const { data, error } = await supabase
        .from('config_nosotros')
        .select('*')
        .order('orden', { ascending: true });
      
      if (!error) setContent(data);
      setLoading(false);
    };
    fetchNosotros();
  }, []);

  const getSection = (category) => {
    const section = content.find(c => c.categoria === category);
    return section || { titulo: '', contenido: '', valor: '' };
  };
  const getRoadmap = () => content.filter(c => c.categoria === 'roadmap');

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const historia = getSection('nosotros');
  const mision = getSection('mision');
  const vision = getSection('vision');
  const roadmap = getRoadmap();

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Simple Nav */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition font-bold uppercase text-xs tracking-widest">
            <ChevronLeft className="h-4 w-4" /> Volver al Inicio
          </Link>
          <div className="flex items-center gap-3">
            <img src="/logo-agrotecnia.png" alt="Logo" className="h-10 w-10 rounded-xl" />
            <span className="font-black text-xl tracking-tighter uppercase">AgroTecnia <span className="text-primary-600 italic">IA</span></span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center lg:text-left lg:max-w-2xl">
            <span className="text-[10px] font-black text-primary-600 uppercase tracking-[0.3em] mb-4 inline-block">Innovación para la Orinoquía</span>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[0.9] tracking-tighter uppercase mb-8">
              Soberanía <span className="text-primary-600 italic text-4xl md:text-6xl block mt-2">Tecnológica Rural</span>
            </h1>
            <p className="text-xl text-gray-500 font-medium leading-relaxed mb-10">
              En **JyM Tech Solutions**, creemos que el agricultor no solo merece mejores herramientas, sino el control total de su futuro productivo.
            </p>
          </div>
        </div>
        <div className="lg:absolute lg:top-0 lg:right-0 lg:w-1/2 lg:h-full mt-12 lg:mt-0">
          <img 
            src="/agrotecnia-vision.png" 
            alt="Visión de AgroTecnia" 
            className="w-full h-full object-cover lg:rounded-l-[4rem] shadow-2xl shadow-green-100"
          />
        </div>
      </section>

      {/* Misión & Visión */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Misión */}
            <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-gray-100 hover:shadow-xl transition group">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition">
                <Target className="h-8 w-8 text-primary-600" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-6">
                {mision?.titulo || 'Nuestra Misión'}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed font-medium">
                {mision?.contenido || 'Cargando misión...'}
              </p>
            </div>

            {/* Visión */}
            <div className="bg-gray-900 p-12 rounded-[3.5rem] shadow-2xl group">
              <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition">
                <Rocket className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-6">
                {vision?.titulo || 'Nuestra Visión'}
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed font-medium">
                {vision?.contenido || 'Cargando visión...'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Historia */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
           <Sprout className="h-12 w-12 text-primary-600 mx-auto mb-8" />
           <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-8">{historia?.titulo || '¿Quiénes Somos?'}</h2>
           <p className="text-xl text-gray-600 leading-relaxed font-medium italic">
             "{historia?.contenido || 'Cargando historia...'}"
           </p>
           <div className="mt-12 flex items-center justify-center gap-8">
              <div>
                 <p className="text-3xl font-black text-primary-600 leading-none">495502</p>
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Matrícula Mercantil</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div>
                 <p className="text-3xl font-black text-primary-600 leading-none">Meta</p>
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Origen Local</p>
              </div>
           </div>
        </div>
      </section>

      {/* Roadmap (Timeline) */}
      <section className="py-32 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full blur-[120px] -mr-48 -mt-48" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-black uppercase tracking-tighter">Hoja de Ruta Estratégica</h2>
            <p className="text-gray-400 mt-4 font-medium">Nuestros hitos para transformar la agricultura nacional.</p>
          </div>

          <div className="relative">
            {/* Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-800 hidden md:block" />

            <div className="space-y-24">
              {roadmap.map((item, index) => (
                <div key={item.id} className={`flex flex-col md:flex-row items-center gap-12 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="flex-1 text-center md:text-right">
                    {index % 2 === 0 ? (
                      <div>
                        <span className="text-primary-500 font-black text-6xl tracking-tighter opacity-20">{item.valor}</span>
                        <h3 className="text-2xl font-black uppercase mb-4">{item.titulo}</h3>
                        <p className="text-gray-400 font-medium leading-relaxed max-w-md ml-auto">{item.contenido}</p>
                      </div>
                    ) : (
                      <div className="md:text-left">
                        <span className="text-primary-500 font-black text-6xl tracking-tighter opacity-20">{item.valor}</span>
                        <h3 className="text-2xl font-black uppercase mb-4">{item.titulo}</h3>
                        <p className="text-gray-400 font-medium leading-relaxed max-w-md">{item.contenido}</p>
                      </div>
                    )}
                  </div>

                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-primary-600 rounded-full border-4 border-gray-900 flex items-center justify-center shadow-2xl">
                       <Sprout className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 bg-white text-center">
        <div className="max-w-3xl mx-auto px-6">
           <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-8">
             ¿Listo para ser parte de la revolución tecnológica?
           </h2>
           <Link to="/#diagnostico" className="inline-flex items-center gap-3 bg-primary-600 text-white px-10 py-5 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-primary-700 transition shadow-xl shadow-green-100">
             Iniciar Diagnóstico IA <ArrowRight className="h-5 w-5" />
           </Link>
        </div>
      </section>

      {/* Mini Footer */}
      <footer className="py-12 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
           <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">&copy; {new Date().getFullYear()} AgroTecnia IA by JyM Tech Solutions</p>
           <div className="flex items-center gap-6">
              <Link to="/legal" className="text-[10px] text-gray-400 font-black uppercase tracking-widest hover:text-primary-600">Privacidad</Link>
              <Link to="/legal" className="text-[10px] text-gray-400 font-black uppercase tracking-widest hover:text-primary-600">Legal</Link>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
