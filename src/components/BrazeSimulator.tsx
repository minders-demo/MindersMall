import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { logBrazeEvent, setBrazeUserAttributes } from '../lib/braze';
import { CheckCircle2, AlertCircle, Cpu } from 'lucide-react';
import { getIsBrazeInitialized } from '../lib/braze';
import { CanvasVisualizer } from './CanvasVisualizer';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const BrazeSimulator: React.FC = () => {
  const { user, login } = useAppContext();
  const isBrazeActive = getIsBrazeInitialized();
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');

  // Create Account State
  const [createStep, setCreateStep] = useState(1);
  const [createName, setCreateName] = useState('');
  const [createEmail, setCreateEmail] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [createCity, setCreateCity] = useState('');
  const [createCategories, setCreateCategories] = useState<string[]>([]);
  const [createGoal, setCreateGoal] = useState('');
  const [createError, setCreateError] = useState('');

  // Journey State
  const [journeyStage, setJourneyStage] = useState<'Pendiente' | 'Ejecutado' | 'Convertido' | 'Abandoned'>('Pendiente');
  const [lastEvent, setLastEvent] = useState<any>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess('');

    if (!EMAIL_REGEX.test(loginEmail)) {
      setLoginError('Formato de correo inválido');
      return;
    }
    if (!loginPassword || loginPassword.length < 4) {
      setLoginError('Contraseña debe tener al menos 4 caracteres');
      return;
    }
    
    // Simulate login
    const safeEmail = loginEmail.toLowerCase().trim();
    const externalId = `demo_user_${btoa(safeEmail).replace(/=/g, '').substring(0, 10)}`;
    const firstName = safeEmail.split('@')[0];

    // NOTE: In production, never send the password to Braze. The externalId should come from the backend.
    
    const attrs = {
      email: safeEmail,
      first_name: firstName,
      demo_source: 'minders_mall_ai_studio',
      login_method: 'fake_email_password',
      user_status: 'identified',
      activation_stage: 'logged_in',
      last_login_date: new Date().toISOString(),
    };
    
    login(externalId, {
      name: firstName,
      email: safeEmail,
    });
    
    setBrazeUserAttributes(attrs);
    
    const eventProps = {
      login_method: 'fake_email_password',
      email_domain: safeEmail.split('@')[1],
      source_page: 'profile',
      is_demo_user: true
    };
    logBrazeEvent('user_logged_in', eventProps);
    setLastEvent({ event: 'user_logged_in', properties: eventProps, attributes: attrs });
    setLoginSuccess('Login exitoso.');
    setLoginEmail('');
    setLoginPassword('');
  };

  const handleToggleCategory = (category: string) => {
    setCreateCategories(prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]);
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');

    if (!createName) { setCreateError('Nombre obligatorio'); return; }
    if (!EMAIL_REGEX.test(createEmail)) { setCreateError('Correo inválido'); return; }
    if (!createPassword || createPassword.length < 4) { setCreateError('Contraseña mínimo 4 chars'); return; }
    if (!createCity) { setCreateError('Ciudad obligatoria'); return; }
    if (createCategories.length === 0) { setCreateError('Selecciona una categoría'); return; }
    if (!createGoal) { setCreateError('Selecciona un objetivo'); return; }

    const safeEmail = createEmail.toLowerCase().trim();
    const externalId = `demo_user_${btoa(safeEmail).replace(/=/g, '').substring(0, 10)}`;

    const attrs: any = {
      first_name: createName,
      email: safeEmail,
      home_city: createCity,
      preferred_categories: createCategories,
      shopping_goal: createGoal,
      user_status: 'new_account',
      activation_stage: 'account_created',
      account_created_at: new Date().toISOString(),
      demo_source: 'minders_mall_ai_studio',
      has_active_cart: false,
      total_orders: 0
    };
    if (createCategories.includes('Premium')) {
      attrs.premium_interest = true;
    }

    login(externalId, {
      name: createName,
      email: safeEmail,
      city: createCity,
      premium_interest: attrs.premium_interest || false,
      total_orders: 0
    });

    setBrazeUserAttributes(attrs);

    const eventProps = {
      source_page: 'profile',
      preferred_categories: createCategories,
      shopping_goal: createGoal,
      is_demo_user: true
    };

    logBrazeEvent('account_created', eventProps);
    setLastEvent({ event: 'account_created', properties: eventProps, attributes: attrs });
    setJourneyStage('Ejecutado');
    
    // reset form
    setCreateStep(1);
    setCreateName('');
    setCreateEmail('');
    setCreatePassword('');
    setCreateCity('');
    setCreateCategories([]);
    setCreateGoal('');
  };

  const runActivationJourney = () => {
    if (user.id === 'anonymous') {
      alert('Debes identificarte primero para correr el journey');
      return;
    }
    
    setJourneyStage('Ejecutado');
    
    // Simulate journey steps slowly
    setTimeout(() => {
      logBrazeEvent('activation_journey_started');
      setBrazeUserAttributes({ activation_stage: 'journey_started' });
      setLastEvent({ event: 'activation_journey_started', attributes: { activation_stage: 'journey_started'} });
    }, 500);

    setTimeout(() => {
      const prefs = { preferred_categories: ['Moda'], shopping_goal: 'Ver novedades' };
      logBrazeEvent('onboarding_preferences_completed', prefs);
      setBrazeUserAttributes({ activation_stage: 'preferences_completed' });
      setLastEvent({ event: 'onboarding_preferences_completed', properties: prefs, attributes: { activation_stage: 'preferences_completed'} });
    }, 1500);
    
    setTimeout(() => {
      const p = { category: 'Moda', source: 'activation_journey' };
      logBrazeEvent('category_viewed', p);
      setBrazeUserAttributes({ last_viewed_category: 'Moda', favorite_category: 'Moda' });
      setLastEvent({ event: 'category_viewed', properties: p, attributes: { last_viewed_category: 'Moda', favorite_category: 'Moda'} });
    }, 2500);
    
    setTimeout(() => {
      const p = { product_id: 'p-001', product_name: 'Camisa Blanca Demo', category: 'Moda', brand: 'Patprimo', price: 25, currency: 'USD', source: 'activation_journey' };
      logBrazeEvent('ecommerce.product_viewed', p);
      setBrazeUserAttributes({ last_viewed_product: 'Camisa Blanca Demo', activation_stage: 'product_viewed' });
      setLastEvent({ event: 'ecommerce.product_viewed', properties: p, attributes: { last_viewed_product: 'Camisa Blanca Demo', activation_stage: 'product_viewed'} });
    }, 3500);
    
    setTimeout(() => {
      const p = { product_id: 'p-001', product_name: 'Camisa Blanca Demo', category: 'Moda', price: 25 };
      logBrazeEvent('product_interest_clicked', p);
      setBrazeUserAttributes({ activation_stage: 'interest_detected', product_interest: true });
      setLastEvent({ event: 'product_interest_clicked', properties: p, attributes: { activation_stage: 'interest_detected', product_interest: true} });
    }, 4500);
    
    setTimeout(() => {
      const p = { cart_id: 'journey_cart_123', total_value: 25, currency: 'USD', products: [{ product_id: 'p-001', price: 25}], source: 'activation_journey' };
      logBrazeEvent('ecommerce.cart_updated', p);
      setBrazeUserAttributes({ has_active_cart: true, cart_value: 25, activation_stage: 'cart_created' });
      setLastEvent({ event: 'ecommerce.cart_updated', properties: p, attributes: { has_active_cart: true, cart_value: 25, activation_stage: 'cart_created'} });
    }, 5500);
    
    setTimeout(() => {
      const p = { cart_id: 'journey_cart_123', total_value: 25, currency: 'USD', products: [{ product_id: 'p-001', price: 25}] };
      logBrazeEvent('ecommerce.checkout_started', p);
      setBrazeUserAttributes({ activation_stage: 'checkout_started' });
      setLastEvent({ event: 'ecommerce.checkout_started', properties: p, attributes: { activation_stage: 'checkout_started'} });
    }, 6500);
  };
  
  const handlePurchase = () => {
    const p = { order_id: 'ord_demo_999', total_value: 25, currency: 'USD', products: [{ product_id: 'p-001', price: 25}], source: 'activation_journey' };
    logBrazeEvent('ecommerce.order_placed', p);
    setBrazeUserAttributes({ has_active_cart: false, cart_value: 0, total_orders: user.total_orders + 1, last_purchase_date: new Date().toISOString(), activation_stage: 'first_purchase_completed', customer_segment: 'activated_buyer' });
    setLastEvent({ event: 'ecommerce.order_placed', properties: p, attributes: { has_active_cart: false, cart_value: 0, total_orders: user.total_orders + 1, activation_stage: 'first_purchase_completed', customer_segment: 'activated_buyer'} });
    setJourneyStage('Convertido');
  };
  
  const handleAbandon = () => {
    const p = { cart_id: 'journey_cart_123', total_value: 25, currency: 'USD', products: [{ product_id: 'p-001', price: 25}] };
    logBrazeEvent('cart_abandoned_simulated', p);
    setBrazeUserAttributes({ has_active_cart: true, activation_stage: 'cart_abandoned', customer_segment: 'cart_abandoner' });
    setLastEvent({ event: 'cart_abandoned_simulated', properties: p, attributes: { has_active_cart: true, activation_stage: 'cart_abandoned', customer_segment: 'cart_abandoner'} });
    setJourneyStage('Abandoned');
  };

  return (
    <div className="space-y-8 mt-8">
      {/* Status Bar */}
      <div className="flex items-center justify-end">
        <div className={`px-4 py-2 border rounded-full text-xs font-bold uppercase tracking-widest flex items-center shadow-lg ${isBrazeActive ? 'bg-indigo-900/30 border-indigo-500/50 text-indigo-400' : 'bg-red-900/30 border-red-500/50 text-red-400'}`}>
          <Cpu size={14} className="mr-2" />
          {isBrazeActive ? 'Braze SDK activo' : 'Braze SDK no configurado'}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* LOGIN CARD */}
        <section className="bg-zinc-900 p-8 rounded-[2rem] shadow-sm border border-zinc-800">
          <h2 className="text-xl font-bold tracking-tight text-white mb-6 border-b border-zinc-800 pb-4">Login con correo</h2>
          <form onSubmit={handleLogin} className="space-y-4 text-sm mt-4">
            {loginError && (
              <div className="bg-red-900/40 border border-red-500/50 text-red-200 p-3 rounded-lg flex items-center">
                <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                {loginError}
              </div>
            )}
            {loginSuccess && (
              <div className="bg-green-900/40 border border-green-500/50 text-green-200 p-3 rounded-lg flex items-center">
                <CheckCircle2 size={16} className="mr-2 flex-shrink-0" />
                {loginSuccess}
              </div>
            )}
            <div>
              <label className="block text-zinc-400 mb-1">Correo electrónico</label>
              <input 
                type="email" 
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="usuario@demo.com"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1">Contraseña (Fake)</label>
              <input 
                type="password" 
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors uppercase tracking-widest text-xs mt-2"
            >
              Ingresar
            </button>
          </form>

          {/* Current State Indicator */}
          <div className="mt-6 p-4 bg-[#050505] rounded-xl border border-zinc-800 text-xs text-zinc-400 space-y-2">
            <p><span className="text-zinc-500 font-bold">ESTADO:</span> {user.id === 'anonymous' ? 'Anónimo' : 'Identificado'}</p>
            {user.id !== 'anonymous' && (
              <>
                <p><span className="text-zinc-500 font-bold">EMAIL:</span> {user.email}</p>
                <p><span className="text-zinc-500 font-bold">BRAZE ID:</span> <span className="text-indigo-400 break-all">{user.id}</span></p>
              </>
            )}
          </div>
        </section>

        {/* CREATE ACCOUNT CARD */}
        <section className="bg-zinc-900 p-8 rounded-[2rem] shadow-sm border border-zinc-800 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white mb-6 border-b border-zinc-800 pb-4">Crear cuenta demo</h2>
            
            {createError && (
              <div className="bg-red-900/40 border border-red-500/50 text-red-200 p-3 rounded-lg flex items-center mb-4 text-sm">
                <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                {createError}
              </div>
            )}

            {createStep === 1 && (
              <div className="space-y-4 text-sm">
                <div>
                  <label className="block text-zinc-400 mb-1">Nombre</label>
                  <input type="text" value={createName} onChange={e => setCreateName(e.target.value)} className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-indigo-500" placeholder="Tu nombre" />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Correo electrónico</label>
                  <input type="email" value={createEmail} onChange={e => setCreateEmail(e.target.value)} className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-indigo-500" placeholder="nuevo@demo.com" />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Contraseña (fake)</label>
                  <input type="password" value={createPassword} onChange={e => setCreatePassword(e.target.value)} className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-indigo-500" placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Ciudad</label>
                  <input type="text" value={createCity} onChange={e => setCreateCity(e.target.value)} className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-indigo-500" placeholder="Ciudad" />
                </div>
              </div>
            )}
            
            {createStep === 2 && (
              <div className="space-y-4 text-sm">
                <p className="text-zinc-400">Preferencias (selecciona una o varias):</p>
                <div className="flex flex-wrap gap-2">
                  {['Moda', 'Belleza', 'Skincare', 'Activewear', 'Accesorios', 'Premium'].map(cat => (
                    <button 
                      key={cat} 
                      onClick={() => handleToggleCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors ${createCategories.includes(cat) ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-transparent border-zinc-700 text-zinc-400 hover:border-zinc-500'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {createStep === 3 && (
              <div className="space-y-4 text-sm">
                <p className="text-zinc-400">Objetivo de compra:</p>
                <div className="flex flex-col gap-2">
                  {['Ver novedades', 'Comprar para mí', 'Comprar regalo', 'Buscar ofertas', 'Explorar productos premium'].map(goal => (
                    <button 
                      key={goal} 
                      onClick={() => setCreateGoal(goal)}
                      className={`text-left px-4 py-3 rounded-lg border text-sm font-bold transition-colors ${createGoal === goal ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' : 'bg-[#050505] border-zinc-800 text-zinc-400 hover:border-zinc-600'}`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-8">
            <div className="flex justify-between items-center bg-[#050505] p-2 rounded-xl mb-4">
               {[1,2,3].map(step => (
                 <div key={step} className={`flex-1 h-1 mx-1 rounded-full ${step <= createStep ? 'bg-indigo-500' : 'bg-zinc-800'}`} />
               ))}
            </div>
            {createStep < 3 ? (
              <button onClick={() => setCreateStep(s => s + 1)} className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-colors uppercase tracking-widest text-xs">Siguiente Paso</button>
            ) : (
              <button onClick={handleCreateAccount} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors uppercase tracking-widest text-xs">Crear cuenta y activar journey</button>
            )}
          </div>
        </section>
      </div>

      {/* ACTIVATION JOURNEY SIMULATOR */}
      <section className="bg-zinc-900 p-8 rounded-[2rem] shadow-sm border border-zinc-800">
        <h2 className="text-xl font-bold tracking-tight text-white mb-6 border-b border-zinc-800 pb-4">Activation Journey Simulator</h2>
        
        <div className="flex justify-between items-center mb-8">
           <button 
             onClick={runActivationJourney}
             disabled={journeyStage === 'Ejecutado'}
             className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl uppercase tracking-widest transition-colors font-mono shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50"
           >
             ▶ Ejecutar journey de activación
           </button>
           <div className="flex items-center gap-4">
             <span className="text-sm text-zinc-400">ESTADO JOURNEY:</span>
             <span className={`px-3 py-1 text-xs font-bold rounded-full border border-zinc-700 ${journeyStage === 'Convertido' ? 'bg-green-500/20 text-green-400' : journeyStage === 'Abandoned' ? 'bg-red-500/20 text-red-400' : 'bg-zinc-800 text-zinc-300'}`}>
               {journeyStage}
             </span>
             <button onClick={() => login('anonymous')} className="px-4 py-2 border border-zinc-700 hover:border-zinc-500 hover:bg-[#050505] text-zinc-400 text-xs font-bold rounded-xl uppercase tracking-widest transition-colors ml-4">
               Reset Demo
             </button>
           </div>
        </div>

        {journeyStage === 'Ejecutado' && (
          <div className="flex gap-4 p-4 bg-[#050505] rounded-2xl border border-zinc-800 mb-8 justify-center">
            <button onClick={handlePurchase} className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl uppercase tracking-widest text-xs transition-colors">Completar Compra</button>
            <button onClick={handleAbandon} className="flex-1 py-4 border border-zinc-700 hover:border-red-500 hover:text-red-400 hover:bg-red-500/10 text-zinc-400 font-bold rounded-xl uppercase tracking-widest text-xs transition-colors">Simular abandono</button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-[#050505] p-6 rounded-2xl border border-zinc-800/50">
          <div>
            <h3 className="text-sm font-bold text-zinc-400 mb-4 tracking-widest uppercase">Último Log Evento</h3>
            {lastEvent ? (
              <pre className="text-xs text-indigo-300 font-mono overflow-auto max-h-[300px]">
                {JSON.stringify(lastEvent, null, 2)}
              </pre>
            ) : (
              <p className="text-zinc-600 text-sm italic">Esperando evento...</p>
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-400 mb-4 tracking-widest uppercase">Canvas Specs Sugeridas</h3>
            <CanvasVisualizer lastEvent={lastEvent} journeyStage={journeyStage} />
          </div>
        </div>
      </section>
    </div>
  );
};
