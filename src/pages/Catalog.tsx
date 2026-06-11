import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { useAppContext } from '../context/AppContext';

const CATEGORIES = ['ropa', 'accesorios', 'belleza', 'hogar', 'premium'];
const BRANDS = ['Patprimo', 'Seven Seven', 'Ostu', 'Atmos Movement'];

export const Catalog: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { viewCategory } = useAppContext();
  
  const selectedCategory = searchParams.get('category');
  const selectedBrand = searchParams.get('brand');

  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    let filtered = products;
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
      viewCategory(selectedCategory);
    }
    if (selectedBrand) {
      filtered = filtered.filter(p => p.brand === selectedBrand);
    }
    setFilteredProducts(filtered);
  }, [selectedCategory, selectedBrand]);

  const handleFilterChange = (type: 'category' | 'brand', value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(type, value);
    } else {
      newParams.delete(type);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-[#050505] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-8">
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Categorías</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => handleFilterChange('category', null)}
                  className={`text-sm ${!selectedCategory ? 'font-bold text-white' : 'text-zinc-500 hover:text-white'}`}
                >
                  Todas las categorías
                </button>
              </li>
              {CATEGORIES.map(cat => (
                <li key={cat}>
                  <button 
                    onClick={() => handleFilterChange('category', cat)}
                    className={`text-sm capitalize ${selectedCategory === cat ? 'font-bold text-white' : 'text-zinc-500 hover:text-white'}`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-4">Marcas</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => handleFilterChange('brand', null)}
                  className={`text-sm ${!selectedBrand ? 'font-bold text-white' : 'text-zinc-500 hover:text-white'}`}
                >
                  Todas las marcas
                </button>
              </li>
              {BRANDS.map(brand => (
                <li key={brand}>
                  <button 
                    onClick={() => handleFilterChange('brand', brand)}
                    className={`text-sm ${selectedBrand === brand ? 'font-bold text-white' : 'text-zinc-500 hover:text-white'}`}
                  >
                    {brand}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">
              Catálogo {selectedCategory ? `- ${selectedCategory}` : ''}
            </h1>
            <span className="text-sm text-zinc-500">{filteredProducts.length} productos</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-zinc-500">No se encontraron productos con estos filtros.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
