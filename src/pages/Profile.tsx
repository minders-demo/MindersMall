import React from 'react';
import { useAppContext, UserType } from '../context/AppContext';
import { User, LogOut, CheckCircle2 } from 'lucide-react';
import { BrazeSimulator } from '../components/BrazeSimulator';
import { Vista360Braze } from '../components/Vista360Braze';

export const Profile: React.FC = () => {
  const { user, login, logout, cartValue, premiumViewsCounter } = useAppContext();

  return (
    <div className="min-h-screen bg-[#050505] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Auth Picker always visible for demo purposes */}
        <section className="bg-zinc-900 p-8 rounded-[2rem] shadow-sm border border-zinc-800">
          <h2 className="text-xl font-bold tracking-tight text-white mb-6 border-b border-zinc-800 pb-4">Simulador de Identidad Comercial</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[
              { id: 'mati_001', name: 'Mati', email: 'mati@demo.com', tag: 'Premium • Moda' },
              { id: 'vale_002', name: 'Vale', email: 'vale@demo.com', tag: 'Belleza • Skincare' },
              { id: 'checho_demo', name: 'Checho', email: 'checho@demo.com', tag: 'Premium • Accesorios' },
              { id: 'lionel_messi_demo', name: 'Lionel Messi', email: 'lionel.messi@demo.com', tag: 'Premium • Athleisure' },
              { id: 'luchito_diaz_demo', name: 'Luchito Díaz', email: 'luchito.diaz@demo.com', tag: 'Moda • Streetwear' },
              { id: 'cristiano_ronaldo_demo', name: 'Cristiano Ronaldo', email: 'cristiano.ronaldo@demo.com', tag: 'Premium • Wellness' },
              { id: 'juan_perez_demo', name: 'Juan Perez', email: 'juan.perez@demo.com', tag: 'Nuevo • Hogar' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => login(p.id)}
                className={`p-4 rounded-xl border text-left flex flex-col transition-colors ${user.id === p.id ? 'border-indigo-500 bg-zinc-900 ring-1 ring-indigo-500' : 'border-zinc-800 hover:border-zinc-600 bg-zinc-900/50'}`}
              >
                <div className="font-bold text-white mb-1 flex justify-between w-full">
                  {p.name}
                  {user.id === p.id && <CheckCircle2 size={18} className="text-indigo-400" />}
                </div>
                <span className="text-sm text-zinc-500">{p.email}</span>
                <span className="text-[10px] uppercase font-bold text-indigo-400 mt-2">{p.tag}</span>
              </button>
            ))}
          </div>
        </section>

        {user.id !== 'anonymous' && (
          <section className="bg-zinc-900 p-8 rounded-[2rem] shadow-sm border border-zinc-800">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-6 mb-6">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mr-4 border border-zinc-700">
                  <User size={32} className="text-indigo-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-white">{user.name}</h1>
                  <p className="text-zinc-400">{user.email}</p>
                </div>
              </div>
              <button 
                onClick={logout}
                className="text-zinc-400 hover:text-white flex items-center transition-colors font-medium border border-transparent hover:bg-zinc-800 px-4 py-2 rounded-xl"
              >
                <LogOut size={16} className="mr-2" /> Salir
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-indigo-500 pl-3">Detalles</h3>
                <dl className="space-y-4 text-sm bg-zinc-900 p-4 rounded-xl border border-zinc-800/50">
                  <div className="flex justify-between items-center bg-zinc-800 p-3 rounded-lg shadow-sm border border-zinc-800">
                    <dt className="text-zinc-400">Ciudad</dt>
                    <dd className="font-bold text-white text-right">{user.city || '-'}</dd>
                  </div>
                  <div className="flex justify-between items-center bg-zinc-800 p-3 rounded-lg shadow-sm border border-zinc-800">
                    <dt className="text-zinc-400">Segmento CRM</dt>
                    <dd className="font-bold text-white text-right capitalize">{user.segment || '-'}</dd>
                  </div>
                  <div className="flex justify-between items-center bg-zinc-800 p-3 rounded-lg shadow-sm border border-zinc-800">
                    <dt className="text-zinc-400">Interés Principal</dt>
                    <dd className="font-bold text-white text-right capitalize">{user.interest || '-'}</dd>
                  </div>
                </dl>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-zinc-500 pl-3">Comportamiento en Demo</h3>
                <dl className="space-y-4 text-sm bg-zinc-900 p-4 rounded-xl border border-zinc-800/50">
                  <div className="flex justify-between">
                    <dt className="text-zinc-400">Último prod. visto</dt>
                    <dd className="font-bold text-white text-right line-clamp-1 w-1/2">{user.last_viewed_product || '-'}</dd>
                  </div>
                  <div className="flex justify-between border-t border-zinc-800 pt-3">
                    <dt className="text-zinc-400">Última categoría v.</dt>
                    <dd className="font-bold text-white capitalize text-right">{user.last_viewed_category || '-'}</dd>
                  </div>
                  <div className="flex justify-between border-t border-zinc-800 pt-3">
                    <dt className="text-zinc-400">Valor Carrito Activo</dt>
                    <dd className="font-bold text-indigo-400 tabular-nums text-right">${cartValue.toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between border-t border-zinc-800 pt-3">
                    <dt className="text-zinc-400">Interés Premium</dt>
                    <dd className="font-bold text-white text-right">
                      {user.premium_interest ? <span className="text-indigo-400 font-bold">Sí ({premiumViewsCounter} vistas)</span> : 'No'}
                    </dd>
                  </div>
                  <div className="flex justify-between border-t border-zinc-800 pt-3">
                    <dt className="text-zinc-400">Órdenes (Simuladas)</dt>
                    <dd className="font-bold text-white text-right">{user.total_orders}</dd>
                  </div>
                </dl>
              </div>
            </div>
            
            <Vista360Braze />
          </section>
        )}
        
        <BrazeSimulator />
      </div>
    </div>
  );
};
