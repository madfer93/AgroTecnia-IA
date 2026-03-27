import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { 
  Check, ChevronLeft, HelpCircle, 
  MessageCircle, Zap, Shield, 
  ChevronRight, Calendar
} from 'lucide-react';

const PricingPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      const { data, error } = await supabase
        .from('config_precios')
        .select('*')
        .order('orden', { ascending: true });
      
      if (!error) setPlans(data);
      setLoading(false);
    };
    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-24">
      {/* Simple Nav */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 h-20 flex items-center px-6">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition font-bold uppercase text-xs tracking-widest">
            <ChevronLeft className="h-4 w-4" /> Inicio
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-black text-xl tracking-tighter uppercase">AgroTecnia <span className="text-primary-600 italic">IA</span></span>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="py-20 text-center px-6">
        <span className="text-[10px] font-black text-primary-600 uppercase tracking-[0.3em] mb-4 inline-block">Planes y Precios</span>
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase mb-6 leading-none">
          Inversión <span className="text-primary-600 italic">Inteligente</span>
        </h1>
        <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto">
          Elige el plan que mejor se adapte al tamaño de tu producción. Sin contratos ocultos, solo tecnología que rinde.
        </p>
      </header>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative bg-white rounded-[3rem] p-10 shadow-sm border ${
                plan.es_recomendado 
                  ? 'border-primary-600 shadow-2xl shadow-green-100 ring-4 ring-primary-50' 
                  : 'border-gray-100'
              } transition-all hover:scale-[1.02] flex flex-col`}
            >
              {plan.es_recomendado && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Zap className="h-3 w-3 fill-current" /> El más popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-2">{plan.nombre}</h3>
                <p className="text-sm text-gray-400 font-medium leading-tight">{plan.descripcion}</p>
              </div>

              <div className="mb-10 flex items-baseline gap-1">
                <span className="text-sm font-black text-gray-400">$</span>
                <span className="text-5xl font-black text-gray-900 tracking-tighter">{plan.precio}</span>
                <span className="text-sm font-bold text-gray-400">/ {plan.periodo}</span>
              </div>

              <div className="space-y-4 mb-12 flex-grow">
                {plan.caracteristicas?.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="mt-1 bg-green-50 rounded-full p-1">
                      <Check className="h-3 w-3 text-green-600 stroke-[4px]" />
                    </div>
                    <span className="text-sm font-semibold text-gray-600 leading-tight">{feature}</span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                plan.es_recomendado
                  ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-xl shadow-green-200'
                  : plan.color_clase === 'dark' 
                    ? 'bg-gray-900 text-white hover:bg-black' 
                    : 'bg-gray-50 text-gray-900 border border-gray-100 hover:bg-gray-100'
              }`}>
                {plan.boton_texto} <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security Info */}
      <section className="mt-24 max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex gap-4 items-center bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
           <div className="bg-primary-50 p-3 rounded-2xl text-primary-600">
              <Shield className="h-6 w-6" />
           </div>
           <div>
              <h4 className="font-black uppercase text-xs tracking-wider">Pago Seguro</h4>
              <p className="text-xs text-gray-400 font-medium">Cifrado de grado bancario para todas tus transacciones.</p>
           </div>
        </div>
        <div className="flex gap-4 items-center bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
           <div className="bg-gray-50 p-3 rounded-2xl text-gray-400">
              <HelpCircle className="h-6 w-6" />
           </div>
           <div>
              <h4 className="font-black uppercase text-xs tracking-wider">Soporte Humano</h4>
              <p className="text-xs text-gray-400 font-medium">Estamos en Villavicencio para ayudarte siempre.</p>
           </div>
        </div>
      </section>

      {/* WhatsApp Floating */}
      <a 
        href="https://wa.me/573100000000" 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-8 right-8 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition group z-50 flex items-center gap-3"
      >
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-black uppercase text-[10px] tracking-widest whitespace-nowrap">Hablar con un asesor</span>
        <MessageCircle className="h-6 w-6 fill-current" />
      </a>
    </div>
  );
};

export default PricingPage;
