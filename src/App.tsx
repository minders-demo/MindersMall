/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { initBraze } from './lib/braze';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { ProductDetail } from './pages/ProductDetail';
import { Profile } from './pages/Profile';
import { Checkout } from './pages/Checkout';
import { BrazeDemoPanel } from './pages/BrazeDemoPanel';
import { Messages } from './pages/Messages';

export default function App() {
  const basename = import.meta.env.BASE_URL === '/' ? undefined : import.meta.env.BASE_URL;

  useEffect(() => {
    initBraze();
  }, []);

  return (
    <AppProvider>
      <BrowserRouter basename={basename}>
        <div className="min-h-screen flex flex-col font-sans bg-[#050505] text-white selection:bg-indigo-500 selection:text-white">
          <Header />
          <main className="flex-1 flex flex-col">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/braze-demo-panel" element={<BrazeDemoPanel />} />
              <Route path="/messages" element={<Messages />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
