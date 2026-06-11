import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../data/products';
import { ShoppingBag, Eye } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, viewProduct, interestProduct } = useAppContext();

  const handleView = () => {
    viewProduct(product);
    navigate(`/product/${product.id}`);
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleInterest = (e: React.MouseEvent) => {
    e.stopPropagation();
    interestProduct(product);
  };

  return (
    <div 
      onClick={handleView}
      className="group flex flex-col bg-zinc-900/50 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-zinc-800"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-800">
        <img 
          src={product.image} 
          alt={product.name} 
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform flex gap-2">
            <button 
              onClick={handleAdd}
              className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag size={16} /> Añadir
            </button>
            <button 
              onClick={handleInterest}
              className="bg-zinc-800 text-white p-2.5 rounded-xl border border-zinc-700 hover:bg-zinc-700 transition-colors"
              title="Me interesa"
            >
              <Eye size={16} />
            </button>
          </div>
        </div>
        {product.category === 'premium' && (
          <span className="absolute top-4 left-4 bg-indigo-900 border border-indigo-500/50 text-indigo-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
            Premium
          </span>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">{product.brand}</p>
        <h3 className="text-white font-medium leading-tight mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-indigo-400 font-bold mt-auto tabular-nums">${product.price} USD</p>
      </div>
    </div>
  );
};
