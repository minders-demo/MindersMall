import React from 'react';
import { Mail, Smartphone, Activity, CheckCircle2, User, Gift, Clock, LogIn, ShoppingCart } from 'lucide-react';

interface CanvasVisualizerProps {
  lastEvent: any;
  journeyStage: string;
}

export const CanvasVisualizer: React.FC<CanvasVisualizerProps> = ({ lastEvent, journeyStage }) => {
  const activeEventName = lastEvent?.event || null;

  const isActive = (events: string[]) => events.includes(activeEventName);

  return (
    <div className="bg-[#050505] p-6 rounded-3xl border border-zinc-800 font-sans mt-4 relative overflow-hidden">
      <div className="absolute top-4 left-4 z-10 text-[9px] font-bold bg-indigo-600/90 backdrop-blur-md px-2 py-1 text-white rounded-md uppercase tracking-wider">BRAZE CANVAS LIVE VIEW</div>
      
      <div className="flex flex-col items-center pt-8">
        {/* Entry */}
        <div className={`w-56 p-3 rounded-xl border-2 text-center transition-all ${
          activeEventName === 'account_created' || activeEventName === 'user_logged_in' 
          ? 'border-indigo-500 bg-indigo-900/30' 
          : 'border-zinc-700 bg-zinc-800'
        }`}>
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest block mb-1">Entry Audience</span>
          <span className="text-xs text-white flex items-center justify-center gap-1"><User size={14} className="text-indigo-400" /> New or Logged In User</span>
        </div>

        <div className="h-8 w-px bg-zinc-600 relative">
          <div className="absolute bottom-0 left-1/2 -ml-1 border-t-8 border-t-zinc-600 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent"></div>
        </div>

        {/* Action: Onboard preference */}
        <div className={`w-56 p-3 rounded-xl border-2 text-center transition-all ${
          isActive(['activation_journey_started', 'onboarding_preferences_completed']) 
          ? 'border-sky-500 bg-sky-900/30' 
          : 'border-zinc-700 bg-zinc-800'
        }`}>
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest block mb-1">Action Path</span>
          <span className="text-xs text-white">Wait for: Preferences setup</span>
        </div>

        <div className="h-8 w-px bg-zinc-600 relative">
          <div className="absolute bottom-0 left-1/2 -ml-1 border-t-8 border-t-zinc-600 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent"></div>
        </div>

        {/* Message: Email */}
        <div className={`w-56 p-3 rounded-xl border-2 text-center transition-all ${
          activeEventName === 'category_viewed' || activeEventName === 'product_viewed' 
          ? 'border-indigo-500 bg-indigo-900/30' 
          : 'border-zinc-700 bg-zinc-800'
        }`}>
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest block mb-1">Message Step</span>
          <span className="text-xs text-white font-bold flex items-center justify-center gap-1 mb-1 border-b border-zinc-700 pb-1"><Mail size={12} className="text-indigo-400" /> Email: Bienvenido</span>
          <span className="text-[10px] text-zinc-400">Recomendaciones personalizadas</span>
        </div>

        <div className="h-8 w-px bg-zinc-600 relative">
          <div className="absolute bottom-0 left-1/2 -ml-1 border-t-8 border-t-zinc-600 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent"></div>
        </div>

        <div className={`w-56 p-3 rounded-xl border-2 text-center transition-all ${
          activeEventName === 'product_interest_clicked' || activeEventName === 'product_added_to_cart' || activeEventName === 'checkout_started' 
          ? 'border-amber-500 bg-amber-900/30' 
          : 'border-zinc-700 bg-zinc-800'
        }`}>
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest block mb-1">Action Path</span>
          <span className="text-xs text-white">Wait for: Add to Cart</span>
        </div>

        {/* Split branch for Purchase vs Abandon */}
        <div className="w-full max-w-sm flex justify-between relative px-12 mt-4">
          <div className="absolute top-0 left-[25%] w-[50%] h-px bg-zinc-600"></div>
          <div className="w-px h-8 bg-zinc-600 relative -mt-0 left-[25%]">
            <div className="absolute bottom-0 left-1/2 -ml-1 border-t-8 border-t-zinc-600 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent"></div>
          </div>
          <div className="w-px h-8 bg-zinc-600 relative -mt-0 right-[25%]">
            <div className="absolute bottom-0 left-1/2 -ml-1 border-t-8 border-t-zinc-600 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent"></div>
          </div>
        </div>

        <div className="w-full max-w-md flex justify-between -mt-2 px-4 gap-4">
          {/* Purchase Path */}
          <div className="flex flex-col items-center w-1/2">
            <div className={`w-full p-3 rounded-xl border-2 text-center transition-all ${
              journeyStage === 'Convertido' ? 'border-emerald-500 bg-emerald-900/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'border-zinc-700 bg-zinc-800'
            }`}>
              <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">order_placed</span>
              <span className="text-xs text-white font-bold flex flex-col items-center gap-1"><Gift size={16} className="text-emerald-400" /> Conversión Exitosa</span>
            </div>
            
            {journeyStage === 'Convertido' && (
              <span className="mt-2 text-[10px] bg-emerald-900/50 text-emerald-400 px-2 py-1 rounded font-bold uppercase tracking-widest animate-pulse">Usuario Activado</span>
            )}
          </div>
          
          {/* Abandon Path */}
          <div className="flex flex-col items-center w-1/2">
             <div className={`w-full p-3 rounded-xl border-2 text-center transition-all ${
               journeyStage === 'Abandoned' || activeEventName === 'cart_abandoned_simulated' ? 'border-red-500 bg-red-900/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-zinc-700 bg-zinc-800'
             }`}>
               <span className="text-[10px] uppercase font-bold text-red-400 block mb-1">Time Lapsed / Abandon</span>
               <span className="text-xs text-white font-bold flex flex-col items-center gap-1"><ShoppingCart size={16} className="text-red-400" /> Remarketing Push</span>
             </div>
             
             {(journeyStage === 'Abandoned' || activeEventName === 'cart_abandoned_simulated') && (
               <span className="mt-2 text-[10px] bg-red-900/50 text-red-400 px-2 py-1 rounded font-bold uppercase tracking-widest animate-pulse">En Riesgo</span>
             )}
          </div>
        </div>

      </div>
    </div>
  );
};
