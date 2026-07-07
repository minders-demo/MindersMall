import React, { useState, useEffect, useRef } from 'react';
import {
  requestContentCards,
  subscribeToContentCards,
  logBrazeContentCardClick,
  logBrazeContentCardImpressions,
  handleBrazeCardAction,
  getIsBrazeInitialized,
} from '../lib/braze';
import {
  ClassicCard,
  CaptionedImage,
  ImageOnly,
  ControlCard,
  getCachedContentCards,
} from '@braze/web-sdk';
import type { Card, ContentCards } from '@braze/web-sdk';
import { useAppContext } from '../context/AppContext';

/**
 * Extrae los campos visuales de una Content Card real de Braze.
 * El tipo base `Card` NO tiene title/description/imageUrl: esos campos viven
 * en las subclases. Según el SDK, la forma correcta de detectarlas es:
 * `if (card instanceof ClassicCard) { ... }`
 */
const getCardContent = (card: Card) => {
  if (card instanceof ClassicCard || card instanceof CaptionedImage) {
    return {
      title: card.title || '',
      description: card.description || '',
      imageUrl: card.imageUrl || null,
      url: card.url || null,
      linkText: card.linkText || 'Ver más',
    };
  }
  if (card instanceof ImageOnly) {
    return {
      title: '',
      description: '',
      imageUrl: card.imageUrl || null,
      url: card.url || null,
      linkText: 'Ver más',
    };
  }
  // ControlCard u otro tipo sin contenido visual
  return null;
};

export const Messages: React.FC = () => {
  const { user } = useAppContext();
  const [cards, setCards] = useState<Card[]>([]);
  const impressionsLogged = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!getIsBrazeInitialized()) return;

    // 1. Pintar de inmediato las cards que el SDK ya tiene en caché
    //    (evita el "parpadeo vacío" mientras llega el refresh del servidor).
    try {
      const cached = getCachedContentCards();
      if (cached && cached.cards) {
        setCards(cached.cards);
      }
    } catch (e) {
      console.warn('Braze getCachedContentCards failed', e);
    }

    // 2. Suscribirse PRIMERO y luego pedir refresh: así no se pierde la
    //    respuesta del servidor si llega antes de que exista la suscripción.
    subscribeToContentCards((cc: ContentCards) => {
      setCards(cc.cards);
    });
    requestContentCards();
  }, []);

  // Registrar impresiones (una sola vez por card) cuando se muestran.
  // Incluye las ControlCards: aunque no se pintan, Braze necesita su
  // impresión para medir correctamente los grupos de control.
  useEffect(() => {
    const fresh = cards.filter((c) => c.id && !impressionsLogged.current.has(c.id));
    if (fresh.length > 0) {
      logBrazeContentCardImpressions(fresh);
      fresh.forEach((c) => c.id && impressionsLogged.current.add(c.id));
    }
  }, [cards]);

  const onCardClick = (card: Card, url: string | null) => {
    logBrazeContentCardClick(card);
    if (url) handleBrazeCardAction(url);
  };

  const onCardDismiss = (card: Card) => {
    try {
      card.dismissCard();
    } catch (e) {
      console.warn('Braze dismissCard failed', e);
    }
    setCards((prev) => prev.filter((c) => c.id !== card.id));
  };

  // Cards reales que sí se pintan (las ControlCard se excluyen del render)
  const renderableCards = cards.filter(
    (c) => !(c instanceof ControlCard) && !c.isControl && getCardContent(c) !== null
  );

  const simulatedCards = [];

  if (user.id !== 'anonymous') {
    simulatedCards.push({
      id: 'sim_1',
      title: '¡Tienes 15% DCTO!',
      description: `Hola ${user.name}, usa el código MINDERS15 en tu próxima compra de ${user.interest || 'moda'}.`,
      image: user.segment === 'belleza'
        ? 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
      cta: 'Usar cupón'
    });

    if (user.last_viewed_product) {
      simulatedCards.push({
         id: 'sim_2',
         title: 'Aún lo estás pensando?',
         description: `Vuelve a ver: ${user.last_viewed_product}. ¡Pocas unidades disponibles!`,
         image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80',
         cta: 'Ver producto'
      });
    }
  }

  const hasAnyCard = renderableCards.length > 0 || simulatedCards.length > 0;

  return (
    <div className="min-h-screen bg-[#050505] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-zinc-900 rounded-[2rem] shadow-sm border border-zinc-800 p-8 min-h-[60vh]">
        <div className="flex justify-between items-end border-b border-zinc-800 pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Centro de mensajes</h1>
            <p className="text-zinc-400">Content Card Simulator (Demo B2B)</p>
          </div>
          <p className="text-indigo-400 text-sm font-bold uppercase tracking-widest">{user.id !== 'anonymous' ? 'Identificado' : 'Anónimo'}</p>
        </div>

        {!hasAnyCard ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-zinc-800/50 rounded-full flex items-center justify-center mb-6 border border-zinc-800 text-zinc-500">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No tienes mensajes</h3>
            <p className="text-zinc-400 max-w-sm">Navega e identifícate para ver las Content Cards personalizadas aquí.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Cards REALES de Braze */}
            {renderableCards.map(card => {
              const content = getCardContent(card)!;
              return (
                <div key={card.id} className="bg-[#050505] border border-zinc-800 hover:border-green-500/50 rounded-3xl overflow-hidden transition-all group relative">
                  <div className="absolute top-4 left-4 z-10 text-[9px] font-bold bg-green-600/90 backdrop-blur-md px-2 py-1 text-white rounded-md uppercase tracking-wider">Braze Real Card</div>
                  <button
                    onClick={() => onCardDismiss(card)}
                    className="absolute top-3 right-3 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-black/50 text-zinc-400 hover:text-white hover:bg-black/80 transition-colors text-sm"
                    aria-label="Descartar"
                  >
                    ✕
                  </button>
                  {content.imageUrl && (
                    <div className="h-40 overflow-hidden relative">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-0" />
                      <img src={content.imageUrl} alt={content.title || 'Content Card'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                  )}
                  <div className="p-6">
                    {content.title && <h4 className="text-lg font-bold text-white mb-2">{content.title}</h4>}
                    {content.description && <p className="text-sm text-zinc-400 leading-relaxed mb-6 whitespace-pre-line">{content.description}</p>}
                    {content.url ? (
                      <button
                        onClick={() => onCardClick(card, content.url)}
                        className="text-sm font-bold text-green-400 hover:text-green-300 uppercase tracking-widest"
                      >
                        {content.linkText} →
                      </button>
                    ) : (
                      <button
                        onClick={() => onCardClick(card, null)}
                        className="text-sm font-bold text-green-400 hover:text-green-300 uppercase tracking-widest"
                      >
                        {content.linkText} →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Cards SIMULADAS (demo) */}
            {simulatedCards.map(c => (
              <div key={c.id} className="bg-[#050505] border border-zinc-800 hover:border-indigo-500/50 rounded-3xl overflow-hidden transition-all group relative">
                <div className="absolute top-4 left-4 z-10 text-[9px] font-bold bg-indigo-600/90 backdrop-blur-md px-2 py-1 text-white rounded-md uppercase tracking-wider">BRAZE CONTENT CARD</div>
                <div className="h-40 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-0" />
                  <img src={c.image} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-bold text-white mb-2">{c.title}</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-6">{c.description}</p>
                  <button className="text-sm font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest">{c.cta} →</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
