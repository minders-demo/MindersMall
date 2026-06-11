import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { User, Mail, Hash, MapPin, Calendar, Smartphone, Inbox, MousePointerClick } from 'lucide-react';

export const Vista360Braze: React.FC = () => {
  const { user } = useAppContext();
  const [activeTab, setActiveTab] = useState<'attributes' | 'campaigns'>('attributes');

  if (user.id === 'anonymous') return null;

  const mockBrazeId = `brz_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString(36)}`;
  
  const customAttributes = {
    customer_segment: user.segment || 'N/A',
    premium_interest: user.premium_interest ? 'true' : 'false',
    last_viewed_product: user.last_viewed_product || 'N/A',
    cart_value: user.last_viewed_product ? '25.00' : '0.00', // Mock representation
    total_orders: user.total_orders || 0,
    activation_stage: user.activation_stage || 'logged_in'
  };

  const getCampaigns = () => {
    const s = user.segment || '';
    const i = user.interest || '';
    if (s === 'premium' || i === 'wellness' || i === 'athleisure') {
      return [
        { channel: 'Email', subject: 'Llegó la nueva colección Premium', status: 'Opened', date: 'Hace 2 horas', icon: <Mail size={16} /> },
        { channel: 'Push', subject: '¡Tienes acceso anticipado VIP!', status: 'Clicked', date: 'Ayer', icon: <Smartphone size={16} /> },
        { channel: 'In-App', subject: 'Outfit exclusivo recomendado', status: 'Sent', date: 'Hace 3 días', icon: <Inbox size={16} /> }
      ];
    }
    if (s === 'moda' || i === 'streetwear') {
      return [
        { channel: 'Email', subject: 'Streetwear essentials just dropped', status: 'Opened', date: 'Hace 4 horas', icon: <Mail size={16} /> },
        { channel: 'Push', subject: 'Asegura tu denim jacket', status: 'Clicked', date: 'Ayer', icon: <Smartphone size={16} /> },
        { channel: 'In-App', subject: 'Completa tu look urbano', status: 'Sent', date: 'Hace 2 días', icon: <Inbox size={16} /> }
      ];
    }
    if (s === 'belleza' || i === 'skincare') {
      return [
        { channel: 'Email', subject: 'Rutina de Skincare perfecta', status: 'Opened', date: 'Hace 5 horas', icon: <Mail size={16} /> },
        { channel: 'Push', subject: 'Restock de tus favoritos', status: 'Sent', date: 'Ayer', icon: <Smartphone size={16} /> },
        { channel: 'In-App', subject: 'Tip: Cómo usar el sérum', status: 'Clicked', date: 'Hace 2 días', icon: <Inbox size={16} /> }
      ];
    }
    return [
      { channel: 'Email', subject: 'Bienvenido a Minders Mall', status: 'Opened', date: 'Hace 1 hora', icon: <Mail size={16} /> },
      { channel: 'Push', subject: 'Completa tu perfil y obtén -10%', status: 'Sent', date: 'Hace 3 horas', icon: <Smartphone size={16} /> }
    ];
  };

  const campaigns = getCampaigns();

  return (
    <section className="bg-[#f2f4f8] text-gray-800 p-1 md:p-6 rounded-[2rem] shadow-xl border border-gray-200 mt-8 font-sans">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col md:flex-row">
        
        {/* Left Panel: User Profile */}
        <div className="md:w-1/3 bg-gray-50 p-6 border-r border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <User size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user.name || 'Usuario'}</h2>
              <p className="text-sm text-gray-500">Known Profile</p>
            </div>
          </div>
          
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <Mail className="text-gray-400 mt-0.5" size={16} />
              <div className="overflow-hidden">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-0.5">Email Contact</p>
                <p className="font-medium text-gray-900 truncate" title={user.email}>{user.email || 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Hash className="text-gray-400 mt-0.5" size={16} />
              <div className="overflow-hidden">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-0.5">External ID</p>
                <p className="font-medium text-gray-900 truncate text-xs font-mono" title={user.id}>{user.id}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Hash className="text-blue-400 mt-0.5" size={16} />
              <div className="overflow-hidden">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-0.5">Braze ID</p>
                <p className="font-medium text-gray-900 truncate text-xs font-mono" title={mockBrazeId}>{mockBrazeId}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="text-gray-400 mt-0.5" size={16} />
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-0.5">City</p>
                <p className="font-medium text-gray-900">{user.city || 'Desconocida'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Area: Tabs structure representing Braze UI */}
        <div className="md:w-2/3 flex flex-col">
          <div className="flex border-b border-gray-200 px-6 pt-4 gap-6 bg-white">
            <button 
              onClick={() => setActiveTab('attributes')}
              className={`pb-4 border-b-2 font-semibold text-sm transition-colors ${activeTab === 'attributes' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
            >
              Custom Attributes
            </button>
            <button 
              onClick={() => setActiveTab('campaigns')}
              className={`pb-4 border-b-2 font-semibold text-sm transition-colors ${activeTab === 'campaigns' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
            >
              Engagement
            </button>
          </div>

          <div className="p-6 bg-white flex-1 min-h-[300px]">
            {activeTab === 'attributes' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {Object.entries(customAttributes).map(([key, val]) => (
                  <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-600 font-mono">{key}</span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded font-medium text-xs font-mono max-w-[150px] truncate text-right">
                      {val.toString()}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'campaigns' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-semibold text-gray-800">Recientes (Simulado)</h3>
                </div>
                {campaigns.map((camp, idx) => (
                   <div key={idx} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 shadow-sm">
                         {camp.icon}
                       </div>
                       <div>
                         <p className="text-sm font-semibold text-gray-900">{camp.subject}</p>
                         <p className="text-xs text-gray-500">{camp.date}</p>
                       </div>
                     </div>
                     <span className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${
                       camp.status === 'Opened' ? 'bg-green-100 text-green-700' : 
                       camp.status === 'Clicked' ? 'bg-purple-100 text-purple-700' : 
                       'bg-gray-200 text-gray-700'
                     }`}>
                       {camp.status === 'Clicked' && <MousePointerClick size={12} />}
                       {camp.status}
                     </span>
                   </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
