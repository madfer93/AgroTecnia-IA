import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Loader2, Sparkles, ShieldCheck, User, Bot, ArrowRight, Phone } from 'lucide-react';
import { supabase } from '../lib/supabase';

const AiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '¡Hola! Soy el asistente inteligente de AgroTecnia. ¿En qué puedo ayudarte hoy con tu cultivo o producción?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('chat'); // chat, auth, lead
  const [userData, setUserData] = useState({ nombre: '', whatsapp: '', autorizacion: false });
  const [knowledgeBase, setKnowledgeBase] = useState(''); // Added for real knowledge
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchPublicData = async () => {
      // Fetch prices for context
      const { data: prices } = await supabase.from('config_precios').select('plan, valor, descripcion');
      // Fetch nosostros for context
      const { data: about } = await supabase.from('config_nosotros').select('titulo, contenido');
      
      const pText = prices?.map(p => `Plan: ${p.plan}, Precio: ${p.valor}, Características: ${p.descripcion}`).join(' | ');
      const aText = about?.map(a => `${a.titulo}: ${a.contenido}`).join(' | ');
      
      setKnowledgeBase(`PRECIOS: ${pText}\nSOBRE NOSOTROS: ${aText}`);
    };
    if (isOpen) fetchPublicData();
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Fetch system prompt for the assistant
      const { data: config } = await supabase
        .from('config_ia')
        .select('instrucciones')
        .eq('rol', 'Especialista SAT')
        .single();

      const systemPrompt = config?.instrucciones || "Eres un asistente agrícola experto.";

      // Mock AI response - Now mentioning knowledge base if needed
      setTimeout(() => {
        let content = `Entiendo perfectamente tu inquietud sobre "${userMessage.content}". Basado en los patrones de la Orinoquía, te recomendaría revisar los niveles de humedad del suelo y considerar un manejo preventivo biológico. \n\n¿Te gustaría que generáramos un reporte técnico completo y te lo enviara un especialista por WhatsApp?`;
        
        // If user asks for prices
        if (input.toLowerCase().includes('precio') || input.toLowerCase().includes('plan') || input.toLowerCase().includes('cuanto vale')) {
           const prices = knowledgeBase.split('\n')[0];
           content = `Nuestros planes actuales son los siguientes: ${prices.replace('PRECIOS: ', '')}. ¿Cuál se ajusta más a tu producción actual?`;
        } 
        // If user asks about the company/mission
        else if (input.toLowerCase().includes('quienes') || input.toLowerCase().includes('mision') || input.toLowerCase().includes('vision') || input.toLowerCase().includes('somos')) {
           const about = knowledgeBase.split('\n')[1];
           content = `AgroTecnia IA es una iniciativa enfocada en la soberanía tecnológica. ${about.replace('SOBRE NOSOTROS: ', '')}. ¿Qué más te gustaría saber sobre nuestro equipo?`;
        }

        const aiResponse = { role: 'assistant', content };
        setMessages(prev => [...prev, aiResponse]);
        setLoading(false);
        
        // After 2 messages, suggest lead capture
        if (messages.length >= 2 && step === 'chat') {
           setTimeout(() => setStep('auth'), 1000);
        }
      }, 1500);

    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const handleLeadSubmit = async () => {
    if (!userData.autorizacion) return;
    
    setLoading(true);
    const { error } = await supabase
      .from('diagnosticos')
      .insert([{
        nombre: userData.nombre,
        whatsapp: userData.whatsapp,
        problematica: `Consulta IA: ${messages.map(m => m.content).join(' | ')}`,
        autorizacion_datos: true,
        estado: 'nuevo'
      }]);

    if (!error) {
      setMessages(prev => [...prev, { role: 'assistant', content: '¡Excelente! He enviado tu consulta a nuestro equipo técnico. Un especialista se contactará contigo vía WhatsApp muy pronto.' }]);
      setStep('chat');
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[90vw] md:w-[400px] h-[600px] bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
          {/* Header */}
          <div className="bg-gray-900 p-6 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
               </div>
               <div>
                  <h3 className="font-black text-sm uppercase tracking-tighter">Asistente AgroTecnia</h3>
                  <div className="flex items-center gap-1.5">
                     <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">IA Especializada</span>
                  </div>
               </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition">
               <MessageSquare className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-primary-600 text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                }`}>
                   <div className="flex items-center gap-2 mb-1 opacity-50">
                      {m.role === 'user' ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                      <span className="text-[10px] font-black uppercase tracking-tighter">{m.role === 'user' ? 'Tú' : 'IA'}</span>
                   </div>
                   {m.content}
                </div>
              </div>
            ))}
            {loading && step === 'chat' && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm animate-pulse">
                   <Loader2 className="h-4 w-4 text-primary-600 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Interactive Steps */}
          <div className="bg-white border-t border-gray-100">
             {step === 'chat' ? (
                <div className="p-4 flex gap-2">
                   <input 
                     type="text" 
                     value={input}
                     onChange={(e) => setInput(e.target.value)}
                     onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                     placeholder="Describe tu cultivo o problema..."
                     className="flex-1 bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none"
                   />
                   <button 
                     onClick={handleSendMessage}
                     disabled={loading}
                     className="bg-primary-600 text-white p-3 rounded-2xl hover:bg-primary-700 transition"
                   >
                     <Send className="h-5 w-5" />
                   </button>
                </div>
             ) : step === 'auth' ? (
                <div className="p-6 space-y-4 animate-in fade-in duration-500">
                   <div className="text-center mb-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                         <ShieldCheck className="h-6 w-6 text-primary-600" />
                      </div>
                      <h4 className="font-black text-gray-900 uppercase text-xs tracking-widest">Autorización de Datos</h4>
                      <p className="text-[10px] text-gray-500 font-medium mt-1">Para darte una asesoría personalizada, necesitamos tu autorización.</p>
                   </div>
                   <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-start gap-3">
                      <input 
                        id="auth-ia"
                        type="checkbox" 
                        checked={userData.autorizacion}
                        onChange={(e) => setUserData({...userData, autorizacion: e.target.checked})}
                        className="mt-1 h-4 w-4 text-primary-600 rounded"
                      />
                      <label htmlFor="auth-ia" className="text-[10px] text-gray-600 font-medium leading-tight cursor-pointer">
                        Autorizo a AgroTecnia IA a procesar mis datos para enviarme asesoría técnica y contactarme vía WhatsApp.
                      </label>
                   </div>
                   <button 
                     onClick={() => userData.autorizacion && setStep('lead')}
                     disabled={!userData.autorizacion}
                     className={`w-full py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition shadow-lg ${
                       userData.autorizacion ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-gray-200 text-gray-400'
                     }`}
                   >
                     Continuar <ArrowRight className="h-4 w-4 inline ml-1" />
                   </button>
                </div>
             ) : (
                <div className="p-6 space-y-4 animate-in fade-in duration-500">
                   <div className="space-y-3">
                      <div>
                         <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Tu Nombre</label>
                         <input 
                           type="text" 
                           value={userData.nombre}
                           onChange={(e) => setUserData({...userData, nombre: e.target.value})}
                           className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-bold outline-none ring-1 ring-gray-100 focus:ring-2 focus:ring-primary-500"
                           placeholder="Juan Pérez"
                         />
                      </div>
                      <div>
                         <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 block">WhatsApp</label>
                         <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-300" />
                            <input 
                              type="tel" 
                              value={userData.whatsapp}
                              onChange={(e) => setUserData({...userData, whatsapp: e.target.value})}
                              className="w-full bg-gray-50 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold outline-none ring-1 ring-gray-100 focus:ring-2 focus:ring-primary-500"
                              placeholder="+57 3..."
                            />
                         </div>
                      </div>
                   </div>
                   <button 
                     onClick={handleLeadSubmit}
                     disabled={loading || !userData.nombre || !userData.whatsapp}
                     className="w-full bg-gray-900 text-white py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-800 transition shadow-xl"
                   >
                     {loading ? 'Sincronizando...' : 'Recibir Reporte en WhatsApp'}
                   </button>
                </div>
             )}
          </div>
        </div>
      )}

      {/* Bubble Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 group ${
          isOpen ? 'bg-white text-gray-900 border border-gray-100' : 'bg-primary-600 text-white shadow-primary-500/50'
        }`}
      >
        <div className="relative">
           {isOpen ? <MessageSquare className="h-6 w-6" /> : <Sparkles className="h-8 w-8 text-white group-hover:rotate-12 transition-all duration-500" />}
           {!isOpen && <span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span></span>}
        </div>
      </button>
    </div>
  );
};

export default AiAssistant;
