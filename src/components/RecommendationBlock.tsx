import React from 'react';
import { Product } from '../data/products';
import { ProductCard } from './ProductCard';
import { useAppContext } from '../context/AppContext';

export const RecommendationBlock: React.FC<{ products: Product[] }> = ({ products }) => {
  const { user, clickRecommendation } = useAppContext();

  let recs = [...products];
  let title = 'Recomendaciones';
  let subtitle = 'Sugerencias para ti';

  // Logic based on user profile and behavior
  const isPremium = user.segment === 'premium' || user.interest === 'moda';
  const isBeauty = user.segment === 'belleza' || user.interest === 'skincare';

  if (isPremium) {
    recs = products.filter(p => p.tags.includes('premium') || p.tags.includes('moda') || p.category === 'accesorios').slice(0, 4);
    title = `Selección Premium, ${user.name}`;
    subtitle = "Piezas elegantes que elevan tu estilo.";
  } else if (isBeauty) {
    recs = products.filter(p => p.category === 'belleza' || p.tags.includes('wellness')).slice(0, 4);
    title = `Tu rutina de Skincare, ${user.name}`;
    subtitle = "Ingredientes activos para tu mejor versión.";
  } else if (user.last_viewed_category) {
    recs = products.filter(p => p.category === user.last_viewed_category).slice(0, 4);
    title = `Basado en tus visitas`;
    subtitle = "Vuelve a ver lo que te interesó.";
  } else {
    recs = products.slice(0, 4);
    title = "Recomendaciones destacadas";
    subtitle = user.id === 'anonymous' ? "Inicia sesión para recibir sugerencias personalizadas." : "Novedades populares hoy.";
  }

  // Ensure 4 max
  recs = recs.slice(0, 4);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-900/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
              {title}
            </h2>
            <p className="text-zinc-400 text-sm">
              {subtitle}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6" onClick={clickRecommendation}>
          {recs.map(p => (
            <ProductCard key={`rec-${p.id}`} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
};
