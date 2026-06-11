import React, { useEffect, useState } from 'react';
import { HeroCarousel } from '../components/HeroCarousel';
import { BrandTiles } from '../components/BrandTiles';
import { BrazePersonalizedShowcase } from '../components/BrazePersonalizedShowcase';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { useAppContext } from '../context/AppContext';

export const Home: React.FC = () => {
  const { user } = useAppContext();

  // Select some featured products to show dynamically based on user context
  let featured = [];
  
  if (user.segment === 'premium' || user.interest === 'moda') {
    featured = [
      products.find(p => p.id === 'pre-017'),
      products.find(p => p.id === 'ropa-001'),
      products.find(p => p.id === 'acc-002'),
      products.find(p => p.id === 'pre-018'),
    ].filter(Boolean) as typeof products;
  } else if (user.segment === 'belleza' || user.interest === 'skincare') {
    featured = [
      products.find(p => p.id === 'bel-014'),
      products.find(p => p.id === 'bel-015'),
      products.find(p => p.id === 'bel-016'),
      products.find(p => p.id === 'acc-004'),
    ].filter(Boolean) as typeof products;
  } else {
    featured = [
      products.find(p => p.id === 'ropa-001'),
      products.find(p => p.id === 'acc-002'),
      products.find(p => p.id === 'hog-006'),
      products.find(p => p.id === 'bel-014'),
    ].filter(Boolean) as typeof products;
  }

  return (
    <div className="min-h-screen bg-[#050505]">
      <HeroCarousel />
      <BrandTiles />
      
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tight text-white mb-8">Novedades Destacadas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {featured.map(p => (
              <ProductCard key={`feat-${p.id}`} product={p} />
            ))}
          </div>
        </div>
      </section>

      <BrazePersonalizedShowcase products={products} />
    </div>
  );
};
