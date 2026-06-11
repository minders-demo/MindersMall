import React, { useEffect, useState } from 'react';
import { Product } from '../data/products';
import { ProductCard } from './ProductCard';
import { useAppContext } from '../context/AppContext';
import { 
  requestContentCards, 
  subscribeToContentCards, 
  logBrazeContentCardClick,
  logBrazeContentCardImpressions,
  handleBrazeCardAction,
  logBrazeEvent
} from '../lib/braze';
import type { Card, ContentCards } from '@braze/web-sdk';
import { RefreshCw, Zap, Tag } from 'lucide-react';

// Help structure card extras
interface CardExtras {
  placement?: string;
  feed?: string;
  card_type?: string;
  brand?: string;
  price?: string | number;
  currency?: string;
  product_id?: string;
  category?: string;
  priority?: string | number;
  badge?: string;
  [key: string]: any;
}

export const BrazePersonalizedShowcase: React.FC<{ products: Product[] }> = ({ products }) => {
  const { user, addDemoEvent } = useAppContext();
  const [brazeCards, setBrazeCards] = useState<Card[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    let unmounted = false;
    
    // Clear state on user change to prevent showing previous user's cards
    setBrazeCards([]);
    setIsInitialLoad(true);
    
    // 1. Subscribe to content card updates
    subscribeToContentCards((updates: ContentCards) => {
      if (unmounted) return;
      
      const allCards = updates.cards || [];
      
      // 2. Filter Content Cards by placement/feed/card_type
      // Soportar cualquiera de estas claves: placement: "home_premium_selection", feed: "home_personalized_showcase", card_type: "product_recommendation"
      const eligibleCards = allCards.filter(card => {
        const extras = (card as any).extras || {};
        return (
          extras.placement === "home_premium_selection" || 
          extras.feed === "home_personalized_showcase" || 
          extras.card_type === "product_recommendation"
        );
      });
      
      // Ordenar por extras.priority si existe
      eligibleCards.sort((a, b) => {
        const priorityA = Number((a as any).extras?.priority || 0);
        const priorityB = Number((b as any).extras?.priority || 0);
        return priorityB - priorityA; // Descending
      });
      
      // Limit to 4 visible cards
      const showcaseCards = eligibleCards.slice(0, 4);
      setBrazeCards(showcaseCards);
      
      // 3. Log impressions safely on the filtered cards
      if (showcaseCards.length > 0) {
         try {
             logBrazeContentCardImpressions(showcaseCards);
         } catch(e) {}
      }
      setIsSyncing(false);
      setIsInitialLoad(false);
    });
    
    // Request content cards directly when user context changes
    handleRefreshCards();

    return () => {
      unmounted = true;
    };
  }, [user.id, user.customer_segment, user.favorite_category, user.premium_interest, user.activation_stage]);

  const handleRefreshCards = () => {
    setIsSyncing(true);
    requestContentCards();
    
    // Fallback UI reset if it takes too long
    setTimeout(() => {
       setIsSyncing(false);
       setIsInitialLoad(false);
    }, 2000);
  };

  const onCardClick = (card: Card) => {
    // 4. Log native click on the card
    logBrazeContentCardClick(card);
    
    // Custom event for demo
    const props = {
       card_id: card.id,
       card_title: card.title || 'Untitled',
       user_id: user.id !== 'anonymous' ? user.id : 'anonymous',
       source: 'braze_content_card'
    };
    logBrazeEvent('showcase_card_clicked', props);
    try {
       addDemoEvent('showcase_card_clicked', props);
    } catch(e) {}

    handleBrazeCardAction(card.url);
  };

  // 5. Fallback local diferenciado por perfil
  const getFallbackProductsForUser = () => {
    const id = user.id;
    let recs: Product[] = [];
    
    if (id === 'mati_001') {
      recs = products.filter(p => ['blazer', 'pantalón tailored', 'camisa oxford', 'reloj minimal'].some(term => p.name.toLowerCase().includes(term) || p.tags.includes('premium') || p.tags.includes('moda')));
    } else if (id === 'vale_002') {
      recs = products.filter(p => ['serum', 'crema', 'protector solar', 'glow'].some(term => p.name.toLowerCase().includes(term) || p.category === 'belleza'));
    } else if (id === 'checho_demo') {
      recs = products.filter(p => ['blazer', 'reloj', 'cinturón', 'gafas'].some(term => p.name.toLowerCase().includes(term) || p.category === 'accesorios' || p.tags.includes('premium')));
    } else if (id === 'lionel_messi_demo') {
      recs = products.filter(p => ['hoodie', 'chaqueta active', 'jogger', 'sneakers'].some(term => p.name.toLowerCase().includes(term) || p.tags.includes('athleisure') || p.tags.includes('performance')));
    } else if (id === 'luchito_diaz_demo') {
      recs = products.filter(p => ['denim', 'camiseta', 'cargo', 'sneakers'].some(term => p.name.toLowerCase().includes(term) || p.tags.includes('streetwear')));
    } else if (id === 'cristiano_ronaldo_demo') {
      recs = products.filter(p => ['recovery', 'training', 'fragancia sport', 'hoodie'].some(term => p.name.toLowerCase().includes(term) || p.tags.includes('wellness') || p.tags.includes('performance')));
    } else if (id === 'juan_perez_demo') {
      recs = products.filter(p => ['lámpara', 'organizador', 'café', 'manta'].some(term => p.name.toLowerCase().includes(term) || p.category === 'hogar'));
    }
    
    // Fill up to 4 items with random products if the filter doesn't find enough
    if (recs.length < 4) {
      const remaining = products.filter(p => !recs.find(r => r.id === p.id)).slice(0, 4 - recs.length);
      recs = [...recs, ...remaining];
    }
    
    return recs.slice(0, 4);
  };

  const getSectionTitle = () => {
    switch (user.id) {
      case 'mati_001': return `Selección para Mati`;
      case 'vale_002': return `Selección beauty para Vale`;
      case 'checho_demo': return `Selección premium para Checho`;
      case 'lionel_messi_demo': return `Performance picks para Lionel`;
      case 'luchito_diaz_demo': return `Streetwear picks para Luchito`;
      case 'cristiano_ronaldo_demo': return `Wellness premium para Cristiano`;
      case 'juan_perez_demo': return `Primeras recomendaciones para Juan`;
      default: return `Descubre productos recomendados`;
    }
  };

  const fallbackRecs = getFallbackProductsForUser();
  const title = getSectionTitle();
  const usingBraze = brazeCards.length > 0;
  
  // Show skeleton if it's the first load and we don't know yet whether we have cards
  const isLoading = isInitialLoad && isSyncing;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-900/10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold tracking-tight text-white mb-0">
                {title}
              </h2>
              {usingBraze && !isLoading ? (
                <span className="bg-indigo-900/50 text-indigo-400 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded flex items-center gap-1 border border-indigo-500/30">
                  <Zap size={10} /> BRAZE CONTENT CARDS
                </span>
              ) : !isLoading ? (
                <span className="bg-zinc-800 text-zinc-400 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border border-zinc-700">
                  FALLBACK LOCAL DEMO
                </span>
              ) : null}
            </div>
            <p className="text-zinc-400 text-sm">
              {usingBraze ? 'Contenido sugerido en vivo por Braze' : isLoading ? 'Obteniendo selecciones...' : 'Sugerencias guardadas para tu perfil.'}
            </p>
          </div>
          
          <button 
             onClick={handleRefreshCards}
             disabled={isSyncing}
             className="text-xs uppercase font-bold tracking-widest text-indigo-400 flex items-center gap-2 hover:text-indigo-300 transition-colors disabled:opacity-50"
          >
             <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} /> 
             {isSyncing ? 'Sincronizando...' : 'Refrescar de Braze'}
          </button>
        </div>
        
        {/* Grid Content */}
        {isLoading ? (
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
             {[1, 2, 3, 4].map(idx => (
                <div key={idx} className="bg-zinc-900/50 animate-pulse rounded-3xl aspect-[3/4]"></div>
             ))}
           </div>
        ) : usingBraze ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
               {brazeCards.map(card => {
                  const extras = (card as any).extras as CardExtras || {};
                  const isAd = extras.badge || 'Recomendado';
                  
                  return (
                     <div 
                         key={card.id || Math.random().toString()} 
                         onClick={() => onCardClick(card)}
                         className="group bg-[#050505] rounded-3xl overflow-hidden border border-zinc-800 hover:border-indigo-500/50 transition-all cursor-pointer flex flex-col"
                     >
                         <div className="aspect-[4/5] bg-zinc-900 overflow-hidden relative">
                             {card.imageUrl ? (
                                <img src={card.imageUrl} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                             ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-700 bg-zinc-800/50">
                                   Recomendado
                                </div>
                             )}
                             <div className="absolute top-3 left-3 bg-indigo-600 font-bold text-[9px] uppercase tracking-widest text-white px-2 py-1 rounded-md z-10 backdrop-blur-md">
                                 {isAd}
                             </div>
                         </div>
                         <div className="p-5 flex-1 flex flex-col">
                             {extras.brand && (
                               <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">{extras.brand}</span>
                             )}
                             <h4 className="font-bold text-white text-base mb-1">{card.title || 'Sugerencia para ti'}</h4>
                             <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{(card as any).description || (card as any).cardDescription}</p>
                             <div className="mt-auto flex items-center justify-between">
                                 <span className="text-sm font-bold text-white">
                                    {extras.currency || '$'}{extras.price || ''}
                                 </span>
                                 <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 group-hover:text-indigo-300 transition-colors flex items-center gap-1">
                                     Ver más &rarr;
                                 </span>
                             </div>
                         </div>
                     </div>
                  );
               })}
            </div>
        ) : (
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
             {fallbackRecs.map(p => (
               <ProductCard key={`cc-fall-${p.id}`} product={p} />
             ))}
           </div>
        )}
      </div>
    </section>
  );
};

