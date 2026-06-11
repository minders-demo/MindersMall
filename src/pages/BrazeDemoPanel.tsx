import React from 'react';
import { useAppContext } from '../context/AppContext';
import { IdentityStepper } from '../components/IdentityStepper';

export const BrazeDemoPanel: React.FC = () => {
  const { user, cartValue, clearCart, simulateCartAbandonment, simulateDormant, demoEvents, premiumViewsCounter } = useAppContext();

  return (
    <div className="min-h-screen bg-[#050505] text-white py-12 px-4 sm:px-6 lg:px-8 font-mono">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        
        <header className="border-b border-zinc-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-widest uppercase flex items-center">
              <span className="w-3 h-3 rounded-full bg-indigo-500 mr-3 inline-block shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
              Braze Web SDK Demo Panel
            </h1>
            <p className="text-zinc-500 mt-2 text-sm">Visualización del flujo de eventos hacia Braze en tiempo real</p>
          </div>
          <div className="mt-4 md:mt-0 text-right text-xs text-zinc-500">
            <p className="text-indigo-400"><strong>ESTADO:</strong> ONLINE</p>
            <p><strong>SDK:</strong> INITIALIZED</p>
          </div>
        </header>

        <IdentityStepper />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Controls & Quick Info */}
          <div className="space-y-6">
            <section className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 shadow-sm">
              <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Estado Actual</h2>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-500">Usuario Identificado:</span>
                  <span className={`font-bold ${user.id !== 'anonymous' ? 'text-indigo-400' : 'text-zinc-500'}`}>
                    {user.id !== 'anonymous' ? user.id : 'ANONÍMO'}
                  </span>
                </li>
                <li className="flex justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-500">Segmento Minders Mall:</span>
                  <span className="text-zinc-300 font-bold">{user.segment || 'N/A'}</span>
                </li>
                <li className="flex justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-500">Valor Carrito:</span>
                  <span className="text-zinc-300 font-bold tabular-nums">${cartValue.toFixed(2)} USD</span>
                </li>
                <li className="flex justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-500">Intención Premium:</span>
                  <span className={user.premium_interest ? 'text-indigo-400 font-bold' : 'text-zinc-500'}>
                    {user.premium_interest ? 'VERDADERO' : 'FALSO'} ({premiumViewsCounter}/2)
                  </span>
                </li>
              </ul>
            </section>

            <section className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 shadow-sm">
              <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Simular Eventos</h2>
              <div className="space-y-3">
                <button 
                  onClick={simulateCartAbandonment}
                  disabled={cartValue === 0}
                  className={`w-full py-3 px-4 text-xs font-bold uppercase rounded-xl border transition-colors ${cartValue > 0 ? 'bg-indigo-600 text-white hover:bg-indigo-500 border-indigo-500 hover:shadow-[0_0_15px_-3px_rgba(99,102,241,0.5)]' : 'bg-zinc-900 text-zinc-600 border-zinc-800 cursor-not-allowed'}`}
                >
                  Disparar Abandono Carrito
                </button>
                <button 
                  onClick={simulateDormant}
                  className="w-full py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase rounded-xl border border-zinc-700 transition-colors"
                >
                  Disparar Usuario Dormido
                </button>
                <button 
                  onClick={clearCart}
                  className="w-full py-3 px-4 bg-transparent hover:bg-red-900/30 text-zinc-500 hover:text-red-400 text-xs font-bold uppercase rounded-xl border border-zinc-800 hover:border-red-900 transition-colors"
                >
                  Vaciar Carrito Local
                </button>
              </div>
            </section>
          </div>

          {/* Event Log */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 h-[600px] flex flex-col shadow-sm">
              <div className="flex justify-between items-end border-b border-zinc-800 pb-4 mb-4">
                 <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Logs enviados a Braze via Web SDK</h2>
                 <span className="text-xs text-zinc-500 font-bold">Listando últimos {demoEvents.length}</span>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {demoEvents.length === 0 ? (
                  <p className="text-zinc-600 text-sm text-center py-12">Navega la tienda para generar eventos.</p>
                ) : (
                  demoEvents.map((evt, idx) => (
                    <div key={idx} className="bg-[#050505] border border-zinc-800 rounded-xl p-4 border-l-2 border-l-indigo-600">
                      <div className="flex justify-between mb-2">
                        <span className="text-xs font-bold text-indigo-400">{evt.event}</span>
                        <span className="text-xs text-zinc-500 font-bold">{evt.time}</span>
                      </div>
                      {evt.properties && (
                        <pre className="text-[10px] text-zinc-400 bg-zinc-900 p-3 rounded-lg overflow-x-auto border border-zinc-800">
                          {JSON.stringify(evt.properties, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
};
