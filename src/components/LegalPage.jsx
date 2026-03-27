import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Leaf, ChevronLeft, ShieldCheck, FileText, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const LegalPage = () => {
  const [legalSections, setLegalSections] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLegal = async () => {
      const { data, error } = await supabase
        .from('config_legal')
        .select('*')
        .order('id', { ascending: true });

      if (data) {
        setLegalSections(data);
        if (data.length > 0) setActiveId(data[0].id);
      }
      setLoading(false);
    };

    fetchLegal();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const currentContent = legalSections.find(s => s.id === activeId);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Mini Nav */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <ChevronLeft className="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition" />
              <span className="text-sm font-bold text-gray-500 group-hover:text-gray-900 transition tracking-widest uppercase">Volver al Inicio</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="bg-primary-600 p-1 rounded-lg shadow-sm">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="font-black text-xl text-gray-900 tracking-tighter uppercase leading-none">AgroTecnia <span className="text-primary-600 italic text-sm">IA</span></span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-3 mb-8 lg:mb-0">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 px-2">Documentación Legal</h3>
              <nav className="space-y-2">
                {legalSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveId(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition flex items-center gap-3 ${
                      activeId === section.id
                        ? 'bg-primary-50 text-primary-700 border border-primary-100'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {section.titulo.toLowerCase().includes('datos') || section.titulo.toLowerCase().includes('habeas') ? <ShieldCheck className="h-4 w-4" /> : null}
                    {section.titulo.toLowerCase().includes('términos') || section.titulo.toLowerCase().includes('uso') ? <FileText className="h-4 w-4" /> : null}
                    {section.titulo.toLowerCase().includes('privacidad') || section.titulo.toLowerCase().includes('cookies') ? <Lock className="h-4 w-4" /> : null}
                    <span className="truncate">{section.titulo}</span>
                  </button>
                ))}
              </nav>

              <div className="mt-8 pt-8 border-t border-gray-50 px-2">
                <p className="text-[10px] font-medium text-gray-400 leading-relaxed uppercase tracking-widest">
                  Ultima actualización: <br/> {currentContent ? new Date(currentContent.updated_at).toLocaleDateString() : '---'}
                </p>
              </div>
            </div>
          </aside>

          {/* Content */}
          <main className="lg:col-span-9">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-16">
              {currentContent ? (
                <article className="prose prose-green prose-lg max-w-none">
                  {/* Título de la sección */}
                  <div className="mb-10 text-center lg:text-left">
                    <span className="text-[10px] font-black text-primary-600 uppercase tracking-[0.3em] bg-primary-50 px-3 py-1 rounded-full mb-4 inline-block font-mono">Documento Oficial</span>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase mb-4 leading-tight">{currentContent.titulo}</h1>
                    <div className="h-1 w-20 bg-primary-600 rounded-full" />
                  </div>

                  {/* Texto Legal (Renderizado con ReactMarkdown) */}
                  <div className="markdown-content text-gray-600 leading-relaxed font-medium">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {currentContent.contenido.replace(/\\n/g, '\n')}
                    </ReactMarkdown>
                  </div>
                </article>
              ) : (
                <div className="text-center py-20">
                  <p className="text-gray-400 italic">Seleccione un documento legal para visualizarlo.</p>
                </div>
              )}
              
              <div className="mt-16 pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                    <Leaf className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Desarrollado por</span>
                    <span className="text-sm font-bold text-gray-900">JyM Tech Solutions</span>
                  </div>
                </div>
                <button 
                  onClick={() => window.print()} 
                  className="text-xs font-black uppercase tracking-widest text-primary-600 hover:text-primary-700 transition"
                >
                  Descargar o Imprimir Documento
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
