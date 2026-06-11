import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export const Checkout: React.FC = () => {
  const { cart, cartValue, checkoutComplete } = useAppContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', city: '' });
  const [submitted, setSubmitted] = useState(false);

  if (cart.length === 0 && !submitted) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-white mb-4">Tu carrito está vacío</h2>
        <button onClick={() => navigate('/catalog')} className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white px-6 py-3 rounded-xl font-medium">
          Volver a comprar
        </button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h2 className="text-3xl font-bold text-white mb-4 text-center">¡Compra Simulada Exitosa!</h2>
        <p className="text-zinc-400 text-center max-w-md mb-8">
          La orden se ha registrado en nuestra demo y el evento `ecommerce.order_placed` ha sido disparado a Braze.
        </p>
        <button onClick={() => { setSubmitted(false); navigate('/') }} className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-500 transition-colors">
          Volver al Home
        </button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkoutComplete();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
        
        {/* Form */}
        <div className="flex-1 bg-zinc-900 p-8 rounded-[2rem] shadow-sm border border-zinc-800">
          <h2 className="text-2xl font-bold text-white mb-6">Datos de envío</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-zinc-300 mb-2">Nombre completo</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-zinc-800/50 text-white" />
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-300 mb-2">Correo electrónico</label>
              <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-zinc-800/50 text-white" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-zinc-300 mb-2">Teléfono</label>
                <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-zinc-800/50 text-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-zinc-300 mb-2">Ciudad</label>
                <input required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-zinc-800/50 text-white" />
              </div>
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-500 shadow-lg mt-4 transition-colors">
              Confirmar compra simulada
            </button>
          </form>
        </div>

        {/* Summary */}
        <div className="w-full md:w-96 shrink-0 space-y-6">
          <div className="bg-zinc-900 p-8 rounded-[2rem] shadow-sm border border-zinc-800">
            <h2 className="text-xl font-bold text-white mb-6">Resumen de compra</h2>
            <div className="space-y-4 mb-6">
              {cart.map(item => (
                <div key={item.product.id} className="flex gap-4">
                  <div className="w-16 h-20 rounded-xl bg-zinc-800 overflow-hidden shrink-0">
                    <img src={item.product.image} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-bold text-white line-clamp-1">{item.product.name}</p>
                    <p className="text-zinc-500 my-1">Cant: {item.quantity}</p>
                    <p className="font-bold text-indigo-400 tabular-nums">${item.product.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-zinc-800 pt-6 flex justify-between items-center text-lg font-bold text-white">
              <p>Total</p>
              <p className="tabular-nums">${cartValue.toFixed(2)} USD</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
