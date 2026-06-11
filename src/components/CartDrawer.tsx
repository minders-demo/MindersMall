import React from 'react';
import { X, Trash2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export const CartDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { cart, cartValue, removeFromCart, checkoutStart, clearCart } = useAppContext();
  const navigate = useNavigate();

  const handleCheckout = () => {
    checkoutStart();
    onClose();
    navigate('/checkout');
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-zinc-900 shadow-2xl border-l border-zinc-800 z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-6 border-b border-zinc-800">
          <h2 className="text-2xl font-semibold tracking-tight text-white">Tu Carrito</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="text-center text-zinc-500 py-12">
              <p>Tu carrito está vacío.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="flex gap-4">
                <div className="h-24 w-20 overflow-hidden rounded-xl bg-zinc-800 shrink-0 border border-zinc-700">
                  <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover object-center" />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex justify-between text-base font-medium text-white">
                      <h3 className="line-clamp-2 leading-tight">{item.product.name}</h3>
                      <p className="ml-4 tabular-nums">${item.product.price}</p>
                    </div>
                    <p className="mt-1 text-sm text-zinc-500">{item.product.brand}</p>
                  </div>
                  <div className="flex items-end justify-between text-sm">
                    <p className="text-zinc-400">Cant: {item.quantity}</p>
                    <button 
                      type="button" 
                      onClick={() => removeFromCart(item.product.id)}
                      className="font-medium text-zinc-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-zinc-800 p-6 bg-zinc-900/50">
            <div className="flex justify-between text-base font-medium text-white mb-4">
              <p>Subtotal</p>
              <p className="tabular-nums">${cartValue.toFixed(2)} USD</p>
            </div>
            <p className="mt-0.5 text-sm text-zinc-500 mb-6">Envío e impuestos calculados en el checkout.</p>
            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-transparent bg-indigo-600 px-6 py-4 text-base font-bold text-white shadow-sm hover:bg-indigo-500 focus:outline-none transition-colors"
              >
                Iniciar checkout <ArrowRight size={20} />
              </button>
              <button
                onClick={clearCart}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-zinc-700 focus:outline-none transition-colors"
              >
                Vaciar carrito
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
