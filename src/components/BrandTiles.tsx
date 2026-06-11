import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export const BrandTiles: React.FC = () => {
  const navigate = useNavigate();
  const { viewCategory } = useAppContext();

  const brands = [
    { title: 'Básicos de siempre', name: 'Patprimo', desc: 'Prendas fáciles para usar todos los días.', query: '?brand=Patprimo', img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80' },
    { title: 'Street vibes', name: 'Seven Seven', desc: 'Looks urbanos con actitud relajada.', query: '?brand=Seven%20Seven', img: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80' },
    { title: 'Self-care diario', name: 'Ostu', desc: 'Cuidado personal simple, práctico y cool.', query: '?brand=Ostu', img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80' },
    { title: 'Move & chill', name: 'Atmos Movement', desc: 'Para entrenar, estirar o simplemente desconectar.', query: '?brand=Atmos%20Movement', img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80' },
  ];

  const handleBrandClick = (query: string, name: string) => {
    viewCategory('brand_' + name);
    navigate(`/catalog${query}`);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 mt-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold tracking-tight text-white mb-4">Elige tu mood</h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">Ropa, cuidado personal y movimiento para acompañar tu día, a tu ritmo y con tu estilo.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <div 
              key={brand.title}
              onClick={() => handleBrandClick(brand.query, brand.name)}
              className="group cursor-pointer relative h-[380px] overflow-hidden rounded-3xl border border-zinc-800"
            >
              <img 
                src={brand.img} 
                alt={brand.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent flex flex-col justify-end p-8">
                <h3 className="text-2xl font-bold text-white mb-2 leading-tight">{brand.title}</h3>
                <p className="text-zinc-300 text-sm opacity-90 leading-relaxed">{brand.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
