import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, Eye, ArrowLeft } from 'lucide-react';
import { products } from '../data/products';
import { useAppContext } from '../context/AppContext';

export const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, interestProduct } = useAppContext();
  
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="text-center">
          <p className="text-white text-xl font-bold mb-4">Producto no encontrado</p>
          <button onClick={() => navigate('/catalog')} className="text-indigo-400 hover:text-indigo-300 underline">Volver al catálogo</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-sm font-medium text-zinc-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={16} className="mr-2" /> Volver
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          <div className="aspect-[3/4] rounded-[2rem] overflow-hidden bg-zinc-900 border border-zinc-800">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">
            <h2 className="text-sm font-bold tracking-widest text-zinc-500 uppercase mb-4">{product.brand}</h2>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-6">{product.name}</h1>
            <p className="text-2xl font-medium text-indigo-400 mb-8 tabular-nums">${product.price} USD</p>
            
            <p className="text-zinc-400 text-lg leading-relaxed mb-10">
              {product.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button 
                onClick={() => addToCart(product)}
                className="flex-1 flex items-center justify-center bg-indigo-600 text-white py-4 px-8 rounded-xl font-bold hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20"
              >
                <ShoppingBag size={20} className="mr-3" /> Agregar al carrito
              </button>
              <button 
                onClick={() => interestProduct(product)}
                className="flex flex-col sm:flex-row items-center justify-center bg-zinc-900 text-white py-4 px-8 rounded-xl font-bold hover:bg-zinc-800 transition-colors border border-zinc-700"
                title="Mostrar interés (Demo)"
              >
                <Eye size={20} className="mr-reverse mb-1 sm:mb-0 sm:mr-3" /> Me interesa
              </button>
            </div>

            <div className="border-t border-zinc-800 pt-8">
              <h3 className="text-sm font-bold text-white mb-4">Etiquetas:</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map(tag => (
                  <span key={tag} className="px-4 py-1.5 bg-zinc-900 text-zinc-400 text-sm font-medium rounded-full border border-zinc-800">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
