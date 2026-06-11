import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, MessageSquare, Activity, Menu, X, Sparkles, Sun, Moon } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { CartDrawer } from './CartDrawer';

export const Header: React.FC = () => {
  const { user, cart } = useAppContext();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    // Check if body has light mode manually applied earlier or just load state
    const isLight = document.documentElement.classList.contains('light-theme');
    setIsLightMode(isLight);
  }, []);

  const toggleTheme = () => {
    if (isLightMode) {
      document.documentElement.classList.remove('light-theme');
    } else {
      document.documentElement.classList.add('light-theme');
    }
    setIsLightMode(!isLightMode);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-zinc-900/50 backdrop-blur-md border-b border-zinc-800 p-4 sm:p-6 mb-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button className="sm:hidden p-2 text-zinc-400" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="hidden sm:flex w-8 h-8 bg-indigo-600 rounded-lg items-center justify-center">
                <div className="w-4 h-4 border-2 border-white rotate-45"></div>
              </div>
              <Link to="/" className="text-xl font-bold tracking-tight uppercase italic text-white flex items-center gap-2">
                Minders <span className="text-indigo-500">Mall</span>
              </Link>
            </div>
            
            <nav className="hidden sm:flex gap-6 text-sm font-medium text-zinc-400">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <Link to="/catalog" className="hover:text-white transition-colors">Catálogo</Link>
            </nav>

            <div className="flex items-center gap-4">
              <button onClick={toggleTheme} className="text-zinc-400 hover:text-white transition-colors" title="Cambiar tema">
                {isLightMode ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              <Link to="/braze-demo-panel" className="text-zinc-400 hover:text-white transition-colors" title="Braze Demo Panel">
                <Activity size={20} />
              </Link>
              <Link to="/messages" className="text-zinc-400 hover:text-white transition-colors relative" title="Centro de mensajes">
                <MessageSquare size={20} />
              </Link>
              <Link to="/profile" className="text-zinc-400 hover:text-white transition-colors flex items-center space-x-1" title="Mi perfil">
                <User size={20} />
                <span className="hidden md:block text-sm font-medium">{user.id !== 'anonymous' ? user.name : 'Ingresar'}</span>
              </Link>
              <button 
                onClick={() => setIsCartOpen(true)} 
                className="text-zinc-400 hover:text-white transition-colors relative"
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="sm:hidden bg-zinc-900 border-t border-zinc-800 mt-4 px-4 py-4 space-y-4 rounded-xl">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block text-zinc-300 font-medium">Home</Link>
            <Link to="/catalog" onClick={() => setIsMenuOpen(false)} className="block text-zinc-300 font-medium">Catálogo</Link>
          </div>
        )}
      </header>
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
