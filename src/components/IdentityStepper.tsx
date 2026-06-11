import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { User, ArrowRight, UserCheck, Merge } from 'lucide-react';

export const IdentityStepper: React.FC = () => {
  const { user } = useAppContext();
  const [showDetails, setShowDetails] = useState(false);

  // If user is anonymous, step 1 is active. If logged in, step 3 is active and step 2 acts as transition info.
  const isAnon = user.id === 'anonymous';

  return (
    <section className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 shadow-sm font-sans mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
          Braze Identity Resolution
        </h2>
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
        >
          {showDetails ? 'Ver menos' : 'Ver detalle (Docs)'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative">
        {/* Step 1: Anonymous */}
        <div className={`flex-1 min-w-0 p-4 rounded-xl border ${isAnon ? 'bg-indigo-900/20 border-indigo-500/50' : 'bg-zinc-800/50 border-zinc-700/50 opacity-60'}`}>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isAnon ? 'bg-indigo-500 text-white' : 'bg-zinc-700 text-zinc-400'}`}>
              <User size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">Paso 1: Anónimo</p>
              <p className="text-xs text-zinc-400">Usuario visitante</p>
            </div>
          </div>
          <div className="text-[10px] sm:text-xs text-zinc-300 space-y-1 mt-4">
            <p><span className="text-zinc-500">braze_id:</span> cookied_temp_id_123</p>
            <p><span className="text-zinc-500">external_id:</span> <span className="text-zinc-500 italic">null</span></p>
          </div>
        </div>

        {/* Step 2: changeUser */}
        <div className="flex flex-col items-center">
          <ArrowRight className={`hidden md:block ${!isAnon ? 'text-indigo-500' : 'text-zinc-700'}`} size={24} />
          <div className={`mt-2 p-2 rounded-lg text-center ${!isAnon ? 'text-indigo-400' : 'text-zinc-600'}`}>
            <Merge size={20} className="mx-auto mb-1" />
            <p className="text-[10px] font-mono whitespace-nowrap">changeUser(ext_id)</p>
          </div>
        </div>

        {/* Step 3: Identified */}
        <div className={`flex-1 min-w-0 p-4 rounded-xl border ${!isAnon ? 'bg-indigo-900/20 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.15)]' : 'bg-zinc-800/50 border-zinc-700/50 opacity-60'}`}>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${!isAnon ? 'bg-indigo-500 text-white' : 'bg-zinc-700 text-zinc-400'}`}>
              <UserCheck size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">Paso 3: Conocido</p>
              <p className="text-xs text-zinc-400">Perfil unificado</p>
            </div>
          </div>
          <div className="text-[10px] sm:text-xs text-zinc-300 space-y-1 mt-4">
            <p><span className="text-zinc-500">braze_id:</span> merged_known_id_456</p>
            <p className="truncate"><span className="text-zinc-500">external_id:</span> {isAnon ? 'pendente...' : user.id}</p>
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="mt-6 p-4 bg-[#050505] rounded-xl border border-zinc-800 text-xs text-zinc-300 leading-relaxed shadow-inner">
          <p className="font-bold text-indigo-400 mb-2">¿Qué sucede al identificar al usuario? (Merge Behavior)</p>
          <ul className="list-disc pl-4 space-y-2 mt-2 font-mono text-[11px]">
            <li><strong>Mantiene:</strong> Push tokens y el historial de mensajes del perfil anónimo se trasladan al perfil conocido.</li>
            <li><strong>Custom Attributes:</strong> Si el perfil conocido <em>no tiene</em> un valor para un atributo, el valor del perfil anónimo (si existe) se conserva. Si ambos tienen valor, gana el del perfil conocido.</li>
            <li><strong>Eventos de la sesión:</strong> Acciones del usuario (ver un producto, agregar al carrito) realizadas como anónimo justo antes de loguearse quedan unidas al perfil conocido resultando en un histórico de conversión preciso.</li>
          </ul>
        </div>
      )}
    </section>
  );
};
