import React, { useEffect, useState } from 'react';
import { supabaseAdmin } from '../lib/supabase';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Users, Calendar, MapPin, 
  Phone, Globe, BarChart3, 
  LayoutDashboard, LogOut, Search,
  RefreshCw, CheckCircle2, Clock,
  Settings, ChevronRight, ShieldCheck,
  MessageSquare, Eye, Tablet, Info, Leaf, X, Wheat
} from 'lucide-react';

const AdminPanel = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('diagnosticos');
  const [diagnosticos, setDiagnosticos] = useState([]);
  const [aiConfigs, setAiConfigs] = useState([]);
  const [legalConfigs, setLegalConfigs] = useState([]);
  const [nosotrosConfigs, setNosotrosConfigs] = useState([]);
  const [precios, setPrecios] = useState([]); // Added precios state
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingConfig, setEditingConfig] = useState(null);
  const [editingLegal, setEditingLegal] = useState(null);
  const [editingNosotros, setEditingNosotros] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null); // Added for details modal

  const fetchData = async () => {
    setLoading(true);
    // Fetch Diagnósticos (Clientes)
    const { data: diagData, error: diagError } = await supabaseAdmin
      .from('diagnosticos')
      .select('*')
      .order('created_at', { ascending: false });

    // Fetch IA Configs
    const { data: configData, error: configError } = await supabaseAdmin
      .from('config_ia')
      .select('*')
      .order('rol', { ascending: true });

    // Fetch Legal Configs
    const { data: legalData, error: legalError } = await supabaseAdmin
      .from('config_legal')
      .select('*')
      .order('id', { ascending: true });

    // Fetch Nosotros Configs
    const { data: nosotrosData, error: nosotrosError } = await supabaseAdmin
      .from('config_nosotros')
      .select('*')
      .order('orden', { ascending: true });

    // Fetch Precios Configs
    const { data: preciosData, error: preciosError } = await supabaseAdmin
      .from('config_precios')
      .select('*')
      .order('orden', { ascending: true });

    if (diagError) console.error('Error diag:', diagError);
    if (configError) console.error('Error config:', configError);
    if (legalError) console.error('Error legal:', legalError);
    if (nosotrosError) console.error('Error nosotros:', nosotrosError);
    if (preciosError) console.error('Error precios:', preciosError);
    
    setDiagnosticos(diagData || []);
    setAiConfigs(configData || []);
    setLegalConfigs(legalData || []);
    setNosotrosConfigs(nosotrosData || []);
    setPrecios(preciosData || []); // Set precios data
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateConfig = async () => {
    if (!editingConfig) return;
    setSaving(true);
    const { error } = await supabaseAdmin
      .from('config_ia')
      .update({ instrucciones: editingConfig.instrucciones })
      .eq('rol', editingConfig.rol);

    if (error) {
      alert('Error al actualizar: ' + error.message);
    } else {
      alert('Configuración de ' + editingConfig.rol + ' actualizada con éxito');
      setAiConfigs(aiConfigs.map(c => c.rol === editingConfig.rol ? editingConfig : c));
      setEditingConfig(null);
    }
    setSaving(false);
  };

  const handleUpdateLegal = async () => {
    if (!editingLegal) return;
    setSaving(true);
    const { error } = await supabaseAdmin
      .from('config_legal')
      .update({ 
        titulo: editingLegal.titulo,
        contenido: editingLegal.contenido 
      })
      .eq('id', editingLegal.id);

    if (error) {
      alert('Error al actualizar legal: ' + error.message);
    } else {
      alert('Contenido legal actualizado con éxito');
      setLegalConfigs(legalConfigs.map(l => l.id === editingLegal.id ? editingLegal : l));
      setEditingLegal(null);
      setShowPreview(false);
    }
    setSaving(false);
  };

  const handleUpdateNosotros = async () => {
    if (!editingNosotros) return;
    setSaving(true);
    const { error } = await supabaseAdmin
      .from('config_nosotros')
      .update({ 
        titulo: editingNosotros.titulo,
        contenido: editingNosotros.contenido 
      })
      .eq('id', editingNosotros.id);

    if (error) {
      alert('Error al actualizar marca: ' + error.message);
    } else {
      alert('Contenido de marca actualizado con éxito');
      setNosotrosConfigs(nosotrosConfigs.map(n => n.id === editingNosotros.id ? editingNosotros : n));
      setEditingNosotros(null);
      setShowPreview(false);
    }
    setSaving(false);
  };

  const handleUpdatePrecio = async (id, field, value) => {
    setSaving(true);
    const { error } = await supabaseAdmin
      .from('config_precios')
      .update({ [field]: value })
      .eq('id', id);
    
    if (error) {
      alert('Error al actualizar precio: ' + error.message);
    } else {
      alert('Precio actualizado con éxito');
      setPrecios(precios.map(p => p.id === id ? { ...p, [field]: value } : p));
    }
    setSaving(false);
  };

  const updateLeadStatus = async (id, newStatus) => {
    const { error } = await supabaseAdmin
      .from('diagnosticos')
      .update({ estado: newStatus })
      .eq('id', id);

    if (error) {
      alert('Error al actualizar estado: ' + error.message);
    } else {
      setDiagnosticos(diagnosticos.map(d => d.id === id ? {...d, estado: newStatus} : d));
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead({...selectedLead, estado: newStatus});
      }
    }
  };

  const handleContact = (lead) => {
    // 1. Update status to 'contactado' if it was 'nuevo'
    if (lead.status === 'nuevo' || lead.estado === 'nuevo') {
      updateLeadStatus(lead.id, 'contactado');
    }
    // 2. Construct professional message
    const message = `Hola *${lead.nombre}*, ¡un gusto saludarte! 👋✨\n\nTe escribo desde *AgroTecnia IA* (JyM Tech Solutions). Recibimos tu diagnóstico para tu producción de *${lead.produccion}* (${lead.tamano_produccion}) en *${lead.ubicacion}*.\n\nEntendemos que buscas resolver: _"${lead.problematica}"_.\n\n¿Te parece si conversamos un momento para ver cómo nuestra IA puede ayudarte a optimizar esos resultados? 🚜🌾`;
    
    // 3. Open WhatsApp with template
    const waLink = `https://wa.me/${(lead.whatsapp || '').replace(/\+/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(waLink, '_blank');
  };

  const filteredData = diagnosticos.filter(item => 
    (item.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.ubicacion || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.whatsapp || '').includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-800 flex items-center gap-2">
          <RefreshCw className="h-6 w-6 text-primary-500" />
          <span className="font-bold text-xl uppercase tracking-tighter">SuperAdmin</span>
        </div>
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <button 
            onClick={() => setActiveTab('diagnosticos')}
            className={`flex items-center gap-3 w-full p-3 rounded-lg transition ${activeTab === 'diagnosticos' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="font-medium">Diagnósticos</span>
          </button>
          <button 
            onClick={() => setActiveTab('clientes')}
            className={`flex items-center gap-3 w-full p-3 rounded-lg transition ${activeTab === 'clientes' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            <Users className="h-5 w-5" />
            <span className="font-medium">Gestión Clientes</span>
          </button>
          <button 
            onClick={() => setActiveTab('nosotros')}
            className={`flex items-center gap-3 w-full p-3 rounded-lg transition ${activeTab === 'nosotros' ? 'bg-amber-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            <Info className="h-5 w-5" />
            <span className="font-medium">Gestión de Marca</span>
          </button>
          <button 
            onClick={() => setActiveTab('precios')}
            className={`flex items-center gap-3 w-full p-3 rounded-lg transition ${activeTab === 'precios' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            <BarChart3 className="h-5 w-5" />
            <span className="font-medium">Gestión de Precios</span>
          </button>
          <button 
            onClick={() => setActiveTab('config')}
            className={`flex items-center gap-3 w-full p-3 rounded-lg transition ${activeTab === 'config' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            <Settings className="h-5 w-5" />
            <span className="font-medium">Configuración IA</span>
          </button>
          <button 
            onClick={() => setActiveTab('legal')}
            className={`flex items-center gap-3 w-full p-3 rounded-lg transition ${activeTab === 'legal' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            <ShieldCheck className="h-5 w-5" />
            <span className="font-medium">Contenido Legal</span>
          </button>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 p-3 w-full rounded-lg text-gray-400 hover:bg-red-900 hover:text-white transition"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8 z-10">
          <h1 className="text-xl font-extrabold text-gray-900">
            {activeTab === 'diagnosticos' ? 'Consola de Recepción' : 
             activeTab === 'clientes' ? 'CRM de Clientes' :
             activeTab === 'nosotros' ? 'Nuestra Marca' :
             activeTab === 'config' ? 'Cerebro de AgroTecnia' : 'Gestión Legal'}
          </h1>
          <div className="flex items-center gap-4">
            {(activeTab === 'diagnosticos' || activeTab === 'clientes') && (
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-primary-500 outline-none w-64 transition-all focus:w-80"
                />
              </div>
            )}
            <button 
              onClick={fetchData}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <RefreshCw className={`h-5 w-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        {/* content Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          {activeTab === 'diagnosticos' ? (
            <>
              {/* Stats Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-2">Total Prospectos</p>
                  <h3 className="text-3xl font-black text-gray-900">{diagnosticos.length}</h3>
                  <div className="flex items-center gap-2 mt-4 text-green-600 text-sm font-bold">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>En crecimiento</span>
                  </div>
                </div>
                {/* ... existing stats ... */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-2">Interés en Web</p>
                  <h3 className="text-3xl font-black text-gray-900">
                    {diagnosticos.filter(d => d.interes_web === 'Sí, la necesito').length}
                  </h3>
                  <div className="flex items-center gap-2 mt-4 text-blue-600 text-sm font-bold">
                    <Globe className="h-4 w-4" />
                    <span>Alta conversión</span>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-2">Casos Pendientes</p>
                  <h3 className="text-3xl font-black text-amber-500">
                    {diagnosticos.filter(d => d.estado === 'nuevo').length}
                  </h3>
                  <div className="flex items-center gap-2 mt-4 text-amber-600 text-sm font-bold">
                    <Clock className="h-4 w-4" />
                    <span>Requieren Atención</span>
                  </div>
                </div>
              </div>

              {/* Table Container */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    {/* ... existing table header ... */}
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha/Nombre</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contacto</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Producción</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Intereses Tech</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {loading ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-12 text-center text-gray-500 italic">Consultando base de datos...</td>
                        </tr>
                      ) : filteredData.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-12 text-center text-gray-500 italic">No se encontraron reportes.</td>
                        </tr>
                      ) : filteredData.map((item) => (
                        <tr key={item.id} className="hover:bg-primary-50/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                               <span className="text-sm font-bold text-gray-900">{item.nombre}</span>
                               <span className="text-[10px] text-gray-400 font-medium">
                                 {new Date(item.created_at).toLocaleString()}
                               </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-gray-900 flex items-center gap-1">
                                <Phone className="h-3 w-3 text-green-500" /> {item.whatsapp}
                              </span>
                              <span className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                                <MapPin className="h-3 w-3 text-primary-500" /> {item.ubicacion}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-gray-900">{item.produccion}</span>
                              <span className="text-xs text-gray-500 font-medium">{item.tamano_produccion}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                              {(item.tecnologia_interes || '').split(',').map((tech, i) => (
                                <span key={i} className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[9px] font-black uppercase whitespace-nowrap tracking-wider">
                                  {tech.trim()}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <select 
                              value={item.estado}
                              onChange={(e) => updateLeadStatus(item.id, e.target.value)}
                              className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border outline-none ${
                                item.estado === 'nuevo' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                item.estado === 'contactado' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                'bg-green-50 text-green-600 border-green-200'
                              }`}
                            >
                              <option value="nuevo">Nuevo</option>
                              <option value="contactado">En Proceso</option>
                              <option value="completado">Cerrado</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-2">
                               <a 
                                 href={`https://wa.me/${(item.whatsapp || '').replace(/\+/g, '')}`}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="bg-primary-600 text-white px-3 py-1.5 rounded-lg font-black text-[10px] uppercase flex items-center justify-center gap-1 hover:bg-primary-700 transition shadow-sm"
                               >
                                 <MessageSquare className="h-3 w-3" /> Contactar
                               </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : activeTab === 'clientes' ? (
            /* CRM VIEW */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {filteredData.map(lead => (
                 <div key={lead.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-4">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center font-black text-primary-600">
                             {lead.nombre.charAt(0)}
                          </div>
                          <div>
                             <h4 className="font-black text-gray-900">{lead.nombre}</h4>
                             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{lead.ubicacion}</p>
                          </div>
                       </div>
                       <span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter ${
                          lead.estado === 'nuevo' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'
                       }`}>
                          {lead.estado}
                       </span>
                    </div>
                    <div className="space-y-3 mb-6">
                       <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                          <Leaf className="h-4 w-4 text-amber-500" />
                          <span>{lead.produccion} ({lead.tamano_produccion})</span>
                       </div>
                       <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                          <Phone className="h-4 w-4 text-green-500" />
                          <span>{lead.whatsapp}</span>
                       </div>
                    </div>
                    <div className="flex gap-2">
                       <button 
                         onClick={() => handleContact(lead)}
                         className="flex-1 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest py-2 rounded-xl text-center hover:bg-gray-800 transition"
                       >
                         WhatsApp
                       </button>
                        <button 
                          onClick={() => setSelectedLead(lead)}
                          className="flex-1 bg-gray-900 border border-gray-900 text-white hover:bg-white hover:text-gray-900 text-[10px] font-black uppercase tracking-widest py-2 rounded-xl transition-all"
                        >
                          Detalles
                        </button>
                    </div>
                 </div>
               ))}
            </div>
          ) : activeTab === 'nosotros' ? (
            /* NOSOTROS CONFIGURATION TAB */
            <div className="max-w-5xl mx-auto">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
                <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-100">
                  <div className="bg-amber-100 p-4 rounded-2xl">
                    <Info className="h-8 w-8 text-amber-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">Gestión de Identidad de Marca</h2>
                    <p className="text-gray-500 font-medium">Personaliza el mensaje, misión y roadmap de AgroTecnia IA.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                   <div className="space-y-3">
                      {nosotrosConfigs.map((cfg) => (
                        <button
                          key={cfg.id}
                          onClick={() => setEditingNosotros(cfg)}
                          className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                            editingNosotros?.id === cfg.id 
                              ? 'border-amber-500 bg-amber-50 shadow-md' 
                              : 'border-transparent bg-gray-50 hover:bg-white hover:border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between pointer-events-none">
                            <span className="font-black text-xs uppercase tracking-wider text-gray-900">{cfg.titulo}</span>
                            <ChevronRight className={`h-4 w-4 ${editingNosotros?.id === cfg.id ? 'text-amber-600' : 'text-gray-300'}`} />
                          </div>
                          <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest">{cfg.categoria} {cfg.valor ? `(${cfg.valor})` : ''}</p>
                        </button>
                      ))}
                   </div>

                   <div className="lg:col-span-2">
                      {editingNosotros ? (
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
                           <div className="mb-6 flex items-center justify-between">
                             <div className="flex-1 mr-4">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Título de Sección</label>
                                <input 
                                  type="text"
                                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-900 focus:ring-2 focus:ring-amber-500 outline-none"
                                  value={editingNosotros.titulo}
                                  onChange={(e) => setEditingNosotros({...editingNosotros, titulo: e.target.value})}
                                />
                             </div>
                             <button
                               onClick={() => setShowPreview(!showPreview)}
                               className={`mt-6 px-4 py-3 rounded-xl flex items-center gap-2 transition-all border ${
                                 showPreview ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-gray-400 border-gray-200'
                               }`}
                             >
                               <Eye className="h-4 w-4" />
                               <span className="text-[10px] font-black uppercase tracking-widest">Preview</span>
                             </button>
                           </div>

                           <div className="mb-6">
                              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Contenido</label>
                              {showPreview ? (
                                <div className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-6 prose prose-amber prose-sm max-w-none min-h-[320px]">
                                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {(editingNosotros.contenido || '').replace(/\\n/g, '\n')}
                                  </ReactMarkdown>
                                </div>
                              ) : (
                                <textarea 
                                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-6 text-gray-700 font-medium text-sm leading-relaxed focus:ring-2 focus:ring-amber-500 h-80 transition-all outline-none"
                                  value={(editingNosotros.contenido || '').replace(/\\n/g, '\n')}
                                  onChange={(e) => setEditingNosotros({...editingNosotros, contenido: e.target.value})}
                                />
                              )}
                           </div>

                           <div className="flex justify-end">
                              <button
                                onClick={handleUpdateNosotros}
                                disabled={saving}
                                className={`px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition shadow-lg ${
                                  saving ? 'bg-gray-400 cursor-not-allowed opacity-50' : 'bg-amber-600 text-white hover:bg-amber-700'
                                }`}
                              >
                                {saving ? 'Actualizando...' : 'Actualizar Marca'}
                              </button>
                           </div>
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 p-12 text-center">
                           <Info className="h-16 w-16 text-gray-200 mb-6" />
                           <h3 className="font-black text-gray-400 uppercase tracking-widest text-sm italic">Configura tu mensaje de marca</h3>
                        </div>
                      )}
                   </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'precios' ? (
            /* PRECIOS CONFIGURATION TAB */
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
                <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-100">
                  <div className="bg-purple-100 p-4 rounded-2xl">
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">Gestión de Planes y Precios</h2>
                    <p className="text-gray-500 font-medium">Modifica los costos, características y visibilidad de los planes SaaS.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {precios.map((plan) => (
                    <div key={plan.id} className={`p-6 rounded-[2.5rem] border-2 transition-all ${plan.es_recomendado ? 'border-primary-500 bg-primary-50/30' : 'border-gray-100 bg-white'}`}>
                      <div className="mb-6">
                         <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Nombre del Plan</label>
                         <input 
                           type="text"
                           className="w-full bg-transparent border-none p-0 text-xl font-black uppercase tracking-tighter text-gray-900 focus:ring-0"
                           value={plan.nombre}
                           onChange={(e) => handleUpdatePrecio(plan.id, 'nombre', e.target.value)}
                         />
                      </div>

                      <div className="mb-6">
                         <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Precio (COP)</label>
                         <div className="flex items-baseline gap-1">
                            <span className="text-sm font-black text-primary-600">$</span>
                            <input 
                              type="text"
                              className="w-full bg-transparent border-none p-0 text-3xl font-black tracking-tighter text-primary-600 focus:ring-0"
                              value={plan.precio}
                              onChange={(e) => handleUpdatePrecio(plan.id, 'precio', e.target.value)}
                            />
                         </div>
                      </div>

                      <div className="mb-6">
                         <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Descripción</label>
                         <textarea 
                           className="w-full bg-white/50 border border-gray-100 rounded-xl p-3 text-[11px] font-medium text-gray-500 h-20 outline-none focus:ring-1 focus:ring-primary-200"
                           value={plan.descripcion}
                           onChange={(e) => handleUpdatePrecio(plan.id, 'descripcion', e.target.value)}
                         />
                      </div>

                      <div className="mb-6">
                         <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex justify-between">
                            Características <span>(Separa por comas)</span>
                         </label>
                         <textarea 
                           className="w-full bg-white/50 border border-gray-100 rounded-xl p-3 text-[11px] font-medium text-gray-500 h-24 outline-none focus:ring-1 focus:ring-primary-200"
                           value={plan.caracteristicas?.join(', ')}
                           onChange={(e) => handleUpdatePrecio(plan.id, 'caracteristicas', e.target.value.split(',').map(s => s.trim()))}
                         />
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                         <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recomendado</span>
                         <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer"
                              checked={plan.es_recomendado}
                              onChange={(e) => handleUpdatePrecio(plan.id, 'es_recomendado', e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                         </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : activeTab === 'config' ? (
            /* IA CONFIGURATION TAB */
            <div className="max-w-5xl mx-auto">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
                <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-100">
                  <div className="bg-primary-100 p-4 rounded-2xl">
                    <Settings className="h-8 w-8 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">Control de Roles IA</h2>
                    <p className="text-gray-500 font-medium">Define las instrucciones maestras para cada cerebro del sistema.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                   <div className="space-y-3">
                      {aiConfigs.map((cfg) => (
                        <button
                          key={cfg.rol}
                          onClick={() => setEditingConfig(cfg)}
                          className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                            editingConfig?.rol === cfg.rol 
                              ? 'border-primary-500 bg-primary-50 shadow-md' 
                              : 'border-transparent bg-gray-50 hover:bg-white hover:border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between pointer-events-none">
                            <span className="font-black text-sm uppercase tracking-wider text-gray-900">{cfg.rol}</span>
                            <ChevronRight className={`h-4 w-4 ${editingConfig?.rol === cfg.rol ? 'text-primary-600' : 'text-gray-300'}`} />
                          </div>
                          <p className="text-[11px] text-gray-500 mt-1 line-clamp-1">Instrucciones configuradas</p>
                        </button>
                      ))}
                   </div>

                   <div className="lg:col-span-2">
                      {editingConfig ? (
                        <div className="bg-gray-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                           <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
                              <div className="flex items-center gap-3">
                                 <RefreshCw className="h-5 w-5 text-primary-400 rotate-12" />
                                 <h3 className="font-black text-lg uppercase tracking-tighter">Editando: {editingConfig.rol}</h3>
                              </div>
                              <span className="bg-primary-600/30 text-primary-400 px-3 py-1 rounded-full text-[10px] font-black border border-primary-600/50">
                                 LIVE CONFIG
                              </span>
                           </div>

                           <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 px-1">
                              System Master Prompt
                           </label>
                           <textarea 
                             className="w-full bg-gray-800 border-none rounded-2xl p-6 text-primary-50 font-mono text-sm leading-relaxed focus:ring-2 focus:ring-primary-500 h-80 transition-all outline-none"
                             value={(editingConfig.instrucciones || '').replace(/\\n/g, '\n')}
                             onChange={(e) => setEditingConfig({...editingConfig, instrucciones: e.target.value})}
                           />

                           <div className="mt-8 flex items-center justify-between gap-4">
                              <p className="text-[10px] text-gray-500 font-medium italic max-w-[200px]">
                                Los cambios afectan la precisión de los reportes generados.
                              </p>
                              <button
                                onClick={handleUpdateConfig}
                                disabled={saving}
                                className={`px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition shadow-lg ${
                                  saving ? 'bg-gray-400 cursor-not-allowed opacity-50' : 'bg-primary-600 hover:bg-primary-700'
                                }`}
                              >
                                {saving ? 'Sincronizando...' : 'Guardar y Desplegar'}
                              </button>
                           </div>
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 p-12 text-center">
                           <RefreshCw className="h-16 w-16 text-gray-200 mb-6" />
                           <h3 className="font-black text-gray-400 uppercase tracking-widest text-sm italic">Selecciona un Cerebro</h3>
                        </div>
                      )}
                   </div>
                </div>
              </div>
            </div>
          ) : (
            /* LEGAL CONFIGURATION TAB */
            <div className="max-w-5xl mx-auto">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
                <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-100">
                  <div className="bg-primary-100 p-4 rounded-2xl">
                    <ShieldCheck className="h-8 w-8 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">Gestión Legal</h2>
                    <p className="text-gray-500 font-medium">Cumplimiento Habeas Data y Políticas.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                   <div className="space-y-3">
                      {legalConfigs.map((cfg) => (
                        <button
                          key={cfg.id}
                          onClick={() => setEditingLegal(cfg)}
                          className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                            editingLegal?.id === cfg.id 
                              ? 'border-primary-500 bg-primary-50 shadow-md' 
                              : 'border-transparent bg-gray-50 hover:bg-white hover:border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between pointer-events-none">
                            <span className="font-black text-xs uppercase tracking-wider text-gray-900">{cfg.titulo}</span>
                            <ChevronRight className={`h-4 w-4 ${editingLegal?.id === cfg.id ? 'text-primary-600' : 'text-gray-300'}`} />
                          </div>
                          <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest">{cfg.seccion}</p>
                        </button>
                      ))}
                   </div>

                   <div className="lg:col-span-2">
                      {editingLegal ? (
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
                           <div className="mb-6 flex items-center justify-between">
                             <div className="flex-1 mr-4">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Título</label>
                                <input 
                                  type="text"
                                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-900 focus:ring-2 focus:ring-primary-500 outline-none"
                                  value={editingLegal.titulo}
                                  onChange={(e) => setEditingLegal({...editingLegal, titulo: e.target.value})}
                                />
                             </div>
                             <button
                               onClick={() => setShowPreview(!showPreview)}
                               className={`mt-6 px-4 py-3 rounded-xl flex items-center gap-2 transition-all border ${
                                 showPreview ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-400 border-gray-200'
                               }`}
                             >
                               <Eye className="h-4 w-4" />
                               <span className="text-[10px] font-black uppercase tracking-widest">Preview</span>
                             </button>
                           </div>

                           <div className="mb-6">
                              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Contenido (Markdown)</label>
                              {showPreview ? (
                                <div className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-6 prose prose-green prose-sm max-w-none min-h-[320px] overflow-y-auto max-h-[500px]">
                                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {(editingLegal.contenido || '').replace(/\\n/g, '\n')}
                                  </ReactMarkdown>
                                </div>
                              ) : (
                                <textarea 
                                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-6 text-gray-700 font-medium text-sm leading-relaxed focus:ring-2 focus:ring-primary-500 h-80 transition-all outline-none"
                                  value={(editingLegal.contenido || '').replace(/\\n/g, '\n')}
                                  onChange={(e) => setEditingLegal({...editingLegal, contenido: e.target.value})}
                                />
                              )}
                           </div>

                           <div className="flex justify-end">
                              <button
                                onClick={handleUpdateLegal}
                                disabled={saving}
                                className={`px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition shadow-lg ${
                                  saving ? 'bg-gray-400 cursor-not-allowed opacity-50' : 'bg-primary-600 text-white hover:bg-primary-700'
                                }`}
                              >
                                {saving ? 'Publicando...' : 'Publicar cambios'}
                              </button>
                           </div>
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 p-12 text-center">
                           <ShieldCheck className="h-16 w-16 text-gray-200 mb-6" />
                           <h3 className="font-black text-gray-400 uppercase tracking-widest text-sm italic">Seleccione una política</h3>
                        </div>
                      )}
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Lead Details Modal */}
        {selectedLead && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
              onClick={() => setSelectedLead(null)}
            />
            <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
               <div className="bg-gray-900 p-8 text-white flex justify-between items-start">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center text-2xl font-black">
                        {selectedLead.nombre.charAt(0)}
                     </div>
                     <div>
                        <h2 className="text-2xl font-black tracking-tighter uppercase">{selectedLead.nombre}</h2>
                        <p className="text-primary-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                           <MapPin className="h-3 w-3" /> {selectedLead.ubicacion}
                        </p>
                     </div>
                  </div>
                  <button 
                    onClick={() => setSelectedLead(null)}
                    className="p-2 hover:bg-white/10 rounded-full transition"
                  >
                    <X className="h-6 w-6" />
                  </button>
               </div>
               
               <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-6">
                     <div className="bg-gray-50 p-4 rounded-2xl">
                        <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Producción</span>
                        <p className="font-bold text-gray-900">{selectedLead.produccion}</p>
                        <p className="text-xs text-gray-500">{selectedLead.tamano_produccion}</p>
                     </div>
                     <div className="bg-gray-50 p-4 rounded-2xl">
                        <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Gestión Actual</span>
                        <p className="font-bold text-gray-900">{selectedLead.gestion_actual}</p>
                        <p className="text-xs text-gray-500">Tecnología: {selectedLead.uso_tecnologia}</p>
                     </div>
                  </div>

                  <div>
                     <span className="block text-[10px] font-black text-primary-600 uppercase tracking-widest mb-2">Problemática Detectada</span>
                     <div className="bg-primary-50 p-6 rounded-3xl border border-primary-100">
                        <p className="text-gray-700 font-medium leading-relaxed italic">
                           "{selectedLead.problematica || 'Sin detalles adicionales.'}"
                        </p>
                     </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                     <div>
                        <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Requiere IA Medicina</span>
                        <p className="font-bold text-gray-900 uppercase text-xs">{selectedLead.necesita_ia_medicina}</p>
                     </div>
                     <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        selectedLead.estado === 'nuevo' ? 'bg-amber-100 text-amber-600' :
                        selectedLead.estado === 'contactado' ? 'bg-blue-100 text-blue-600' :
                        'bg-green-100 text-green-600'
                     }`}>
                        {selectedLead.estado}
                     </div>
                  </div>
               </div>

               <div className="p-8 bg-gray-50 flex gap-4">
                  <button 
                    onClick={() => handleContact(selectedLead)}
                    className="flex-1 bg-primary-600 text-white text-xs font-black uppercase tracking-widest py-4 rounded-2xl text-center hover:bg-primary-700 transition shadow-lg shadow-green-100 flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4" /> Abrir WhatsApp
                  </button>
                  <button 
                    onClick={() => setSelectedLead(null)}
                    className="px-8 py-4 bg-white border border-gray-200 text-gray-400 text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-gray-100 transition"
                  >
                    Cerrar
                  </button>
               </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
