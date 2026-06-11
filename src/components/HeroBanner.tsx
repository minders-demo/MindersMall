import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export const HeroBanner: React.FC = () => {
  const { user } = useAppContext();

  const isPremiumDetected = user.premium_interest;
  
  const bgImage = isPremiumDetected 
    ? "url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=80')"
    : "url('https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=2000&q=80')";

  const title = isPremiumDetected ? "Selección premium para ti" : "Nueva Colección Minders Mall";
  const subtitle = isPremiumDetected 
    ? "Descubre artículos exclusivos diseñados para elevar tu estilo." 
    : "Descubre las últimas tendencias en moda, belleza y estilo de vida.";

  return (
    <div className="relative w-full h-[60vh] min-h-[500px] bg-zinc-900 rounded-[2rem] overflow-hidden shadow-2xl mb-8 border border-zinc-800 mx-auto max-w-[95%]">
      <div className="absolute inset-0 z-0">
         <img src={bgImage} className="w-full h-full object-cover opacity-60 transition-transform duration-1000 ease-in-out hover:scale-105" />
         <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent mix-blend-multiply" />
      </div>
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto h-full flex flex-col justify-end items-center pb-16">
        <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-white mb-6 drop-shadow-md">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-zinc-300 font-medium mb-10 max-w-2xl drop-shadow-sm">
          {subtitle}
        </p>
        <Link 
          to="/catalog" 
          className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-colors shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)]"
        >
          Explorar catálogo
        </Link>
      </div>
    </div>
  );
};
