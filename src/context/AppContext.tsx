import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../data/products';
import { identifyUser, logBrazeEvent, setBrazeUserAttributes, logoutBrazeUser } from '../lib/braze';

export type UserType = string;

export interface UserProfile {
  id: UserType;
  name: string;
  email: string;
  segment?: string;
  interest?: string;
  city?: string;
  phone?: string;
  premium_interest: boolean;
  total_orders: number;
  last_purchase_date?: string;
  last_viewed_product?: string;
  last_viewed_category?: string;
  activation_stage?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface DemoEvent {
  time: string;
  event: string;
  properties?: any;
}

interface AppContextType {
  user: UserProfile;
  cart: CartItem[];
  cartValue: number;
  demoEvents: DemoEvent[];
  premiumViewsCounter: number;
  login: (userId: UserType, customData?: Partial<UserProfile>) => void;
  logout: () => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  checkoutStart: () => void;
  checkoutComplete: () => void;
  viewProduct: (product: Product) => void;
  viewCategory: (category: string) => void;
  interestProduct: (product: Product) => void;
  clickRecommendation: () => void;
  simulateCartAbandonment: () => void;
  simulateDormant: () => void;
}

const defaultUser: UserProfile = {
  id: 'anonymous',
  name: 'Anónimo',
  email: '',
  premium_interest: false,
  total_orders: 0,
};

const predefinedUsers: Record<string, Partial<UserProfile>> = {
  mati_001: {
    name: 'Mati',
    email: 'mati@demo.com',
    segment: 'premium',
    interest: 'moda',
    city: 'Bogotá',
    activation_stage: 'active_customer'
  },
  vale_002: {
    name: 'Vale',
    email: 'vale@demo.com',
    segment: 'belleza',
    interest: 'skincare',
    city: 'Medellín',
    activation_stage: 'active_customer'
  },
  checho_demo: {
    name: 'Checho',
    email: 'checho@demo.com',
    segment: 'premium',
    interest: 'accesorios',
    city: 'Buenos Aires',
    premium_interest: false,
    total_orders: 2,
    last_viewed_product: 'Blazer estructurado arena',
    last_viewed_category: 'ropa',
    activation_stage: 'logged_in'
  },
  lionel_messi_demo: {
    name: 'Lionel Messi',
    email: 'lionel.messi@demo.com',
    segment: 'premium',
    interest: 'athleisure',
    city: 'Rosario',
    premium_interest: true,
    total_orders: 10,
    last_viewed_product: 'Chaqueta active shell',
    last_viewed_category: 'premium',
    activation_stage: 'loyal_customer'
  },
  luchito_diaz_demo: {
    name: 'Luchito Díaz',
    email: 'luchito.diaz@demo.com',
    segment: 'moda',
    interest: 'streetwear',
    city: 'Barrancas',
    premium_interest: false,
    total_orders: 4,
    last_viewed_product: 'Chaqueta denim vintage',
    last_viewed_category: 'ropa',
    activation_stage: 'active_customer'
  },
  cristiano_ronaldo_demo: {
    name: 'Cristiano Ronaldo',
    email: 'cristiano.ronaldo@demo.com',
    segment: 'premium',
    interest: 'wellness',
    city: 'Madeira',
    premium_interest: true,
    total_orders: 12,
    last_viewed_product: 'Set wellness recovery',
    last_viewed_category: 'premium',
    activation_stage: 'vip_customer'
  },
  juan_perez_demo: {
    name: 'Juan Perez',
    email: 'juan.perez@demo.com',
    segment: 'nuevo',
    interest: 'hogar',
    city: 'Bogotá',
    premium_interest: false,
    total_orders: 0,
    last_viewed_product: undefined,
    last_viewed_category: 'hogar',
    activation_stage: 'new_user'
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('demo_user');
    if (saved) {
      let parsedUser = JSON.parse(saved);
      if (parsedUser.id === 'mati_pash_demo') {
        parsedUser = { ...defaultUser, ...predefinedUsers['checho_demo'], id: 'checho_demo' };
      }
      return parsedUser;
    }
    return defaultUser;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('demo_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [premiumViewsCounter, setPremiumViewsCounter] = useState(() => {
    return parseInt(localStorage.getItem('premium_views') || '0', 10);
  });

  const [demoEvents, setDemoEvents] = useState<DemoEvent[]>([]);

  const cartValue = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const [cartId] = useState(() => "cart_" + Math.random().toString(36).substr(2, 9));

  useEffect(() => {
    localStorage.setItem('demo_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('demo_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('premium_views', premiumViewsCounter.toString());
  }, [premiumViewsCounter]);

  const addDemoEvent = (eventName: string, properties?: any) => {
    const newEvent = { time: new Date().toLocaleTimeString(), event: eventName, properties };
    setDemoEvents(prev => [newEvent, ...prev].slice(0, 20));
  };

  const syncBrazeAttributes = (updatedUser: UserProfile, valueOfCart: number = cartValue, hasCart: boolean = cart.length > 0) => {
    const attrs = {
      first_name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      city: updatedUser.city,
      favorite_category: updatedUser.interest,
      last_viewed_product: updatedUser.last_viewed_product,
      last_viewed_category: updatedUser.last_viewed_category,
      customer_segment: updatedUser.segment,
      cart_value: valueOfCart,
      has_active_cart: hasCart,
      premium_interest: updatedUser.premium_interest,
      last_purchase_date: updatedUser.last_purchase_date,
      total_orders: updatedUser.total_orders,
      activation_stage: updatedUser.activation_stage,
      demo_source: 'ai_studio_braze_demo'
    };
    setBrazeUserAttributes(attrs);
    addDemoEvent('Attributes Updated', attrs);
  };

  const login = (userId: UserType, customData?: Partial<UserProfile>) => {
    if (userId === 'anonymous') {
      logout();
      return;
    }
    const extra = customData || predefinedUsers[userId] || {};
    const newUser = { ...user, id: userId, ...extra };
    setUser(newUser);
    identifyUser(userId);
    logBrazeEvent('user_identified');
    addDemoEvent('user_identified', { userId });
    syncBrazeAttributes(newUser);
  };

const logout = () => {
    setUser(defaultUser);
    logoutBrazeUser();
    // No sincronizamos atributos tras logout: evitamos sobrescribir
    // el perfil real del último usuario identificado con datos del defaultUser.
  };

  const addToCart = (product: Product) => {
    let newCartValue = 0;
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      let newCart;
      if (existing) {
        newCart = prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      } else {
        newCart = [...prev, { product, quantity: 1 }];
      }
      
      newCartValue = newCart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
      
      setTimeout(() => {
        syncBrazeAttributes(user, newCartValue, true);
        const props = { cart_id: cartId, total_value: newCartValue, currency: 'USD', products: [{ product_id: product.id, price: product.price }] };
        logBrazeEvent('product_added_to_cart', props);
        addDemoEvent('product_added_to_cart', props);
      }, 0);
      
      return newCart;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const newCart = prev.filter(item => item.product.id !== productId);
      const newVal = newCart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
      
      setTimeout(() => {
         const props = { cart_id: cartId, total_value: newVal, currency: 'USD', products: [] };
         logBrazeEvent('ecommerce.cart_updated', props);
         addDemoEvent('ecommerce.cart_updated', props);
         syncBrazeAttributes(user, newVal, newCart.length > 0);
      }, 0);
      
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    const props = { cart_id: cartId, total_value: 0, currency: 'USD', products: [] };
    logBrazeEvent('ecommerce.cart_updated', props);
    addDemoEvent('ecommerce.cart_updated', props);
    syncBrazeAttributes(user, 0, false);
  };

  const checkoutStart = () => {
    const props = { cart_id: cartId, total_value: cartValue, currency: 'USD', products: cart.map(i => ({ product_id: i.product.id, price: i.product.price, quantity: i.quantity })) };
    logBrazeEvent('checkout_started', props);
    addDemoEvent('checkout_started', props);
  };

  const checkoutComplete = () => {
    const orderId = "order_" + Math.random().toString(36).substr(2, 9);
    const props = { order_id: orderId, total_value: cartValue, currency: 'USD', products: cart.map(i => ({ product_id: i.product.id, price: i.product.price, quantity: i.quantity })) };
    logBrazeEvent('purchase_completed', props);
    addDemoEvent('purchase_completed', props);
    
    const d = new Date().toISOString();
    const newUser = { ...user, last_purchase_date: d, total_orders: user.total_orders + 1 };
    setUser(newUser);
    setCart([]);
    syncBrazeAttributes(newUser, 0, false);
  };

  const viewProduct = (product: Product) => {
    const props = { product_id: product.id, product_name: product.name, category: product.category, brand: product.brand, price: product.price, currency: product.currency, image_url: product.image };
    logBrazeEvent('product_viewed', props);
    addDemoEvent('product_viewed', props);
    
    let isPremium = product.category === 'premium';
    let newCounter = premiumViewsCounter;
    if (isPremium) {
      newCounter += 1;
      setPremiumViewsCounter(newCounter);
    }

    const newUser = { ...user, last_viewed_product: product.name, last_viewed_category: product.category };
    if (newCounter >= 2 && !newUser.premium_interest) {
      newUser.premium_interest = true;
      logBrazeEvent('premium_interest_detected');
      addDemoEvent('premium_interest_detected');
    }
    
    setUser(newUser);
    syncBrazeAttributes(newUser);
  };

  const viewCategory = (category: string) => {
    const props = { category, source: "catalog_filter" };
    logBrazeEvent('category_viewed', props);
    addDemoEvent('category_viewed', props);
  };

  const interestProduct = (product: Product) => {
    const props = { product_id: product.id, product_name: product.name, category: product.category, price: product.price };
    logBrazeEvent('product_interest_clicked', props);
    addDemoEvent('product_interest_clicked', props);
  };

  const clickRecommendation = () => {
    logBrazeEvent('recommendation_clicked');
    addDemoEvent('recommendation_clicked');
  };

  const simulateCartAbandonment = () => {
    logBrazeEvent('cart_abandoned_simulated');
    addDemoEvent('cart_abandoned_simulated');
  };

  const simulateDormant = () => {
    logBrazeEvent('user_dormant_simulated');
    addDemoEvent('user_dormant_simulated');
  };

  return (
    <AppContext.Provider value={{ user, cart, cartValue, demoEvents, premiumViewsCounter, login, logout, addToCart, removeFromCart, clearCart, checkoutStart, checkoutComplete, viewProduct, viewCategory, interestProduct, clickRecommendation, simulateCartAbandonment, simulateDormant }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
