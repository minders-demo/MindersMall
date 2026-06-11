import {
  initialize,
  automaticallyShowInAppMessages,
  openSession,
  changeUser,
  logCustomEvent,
  getUser,
  requestContentCardsRefresh,
  subscribeToContentCardsUpdates,
  logContentCardClick,
  logContentCardImpressions,
} from '@braze/web-sdk';
import type { ContentCards, Card } from '@braze/web-sdk';

let isBrazeInitialized = false;

export const getIsBrazeInitialized = () => isBrazeInitialized;

export const initBraze = () => {
  // Guard: evita doble inicialización (React StrictMode ejecuta useEffect 2 veces en dev)
  if (isBrazeInitialized) return;

  const apiKey = import.meta.env.VITE_BRAZE_API_KEY;
  const sdkEndpoint = import.meta.env.VITE_BRAZE_SDK_ENDPOINT;

  const isPlaceholderKey = !apiKey || String(apiKey).includes('your_') || apiKey === 'YOUR_API_KEY';
  const isPlaceholderEndpoint = !sdkEndpoint || String(sdkEndpoint).includes('your_') || String(sdkEndpoint).includes('XX');

  if (isPlaceholderKey || isPlaceholderEndpoint) {
    // Aviso SIEMPRE visible (también en producción) para diagnosticar builds sin credenciales
    console.warn(
      '[Braze] SDK NO inicializado: faltan VITE_BRAZE_API_KEY y/o VITE_BRAZE_SDK_ENDPOINT en el build. ' +
      'Si esto es GitHub Pages, configura los Secrets del repositorio y el bloque env: en deploy.yml.'
    );
    return;
  }

  const cleanEndpoint = String(sdkEndpoint).replace(/^https?:\/\//, '').replace(/\/$/, '');

  try {
    const ok = initialize(String(apiKey), {
      baseUrl: cleanEndpoint,
      enableLogging: true, // visible en consola: ideal para demos y para verificar el flush de eventos
    });
    if (!ok) {
      console.warn('[Braze] initialize() devolvió false. Revisa API key y endpoint.');
      return;
    }
    automaticallyShowInAppMessages();
    openSession();
    isBrazeInitialized = true;
    console.log(`[Braze] SDK inicializado contra ${cleanEndpoint}`);
  } catch (e) {
    console.error('[Braze] Falló la inicialización del SDK', e);
  }
};

export const identifyUser = (externalId: string, attributes?: Record<string, any>) => {
  if (!isBrazeInitialized) return;
  // Nunca identificar con IDs genéricos/compartidos (antipatrón según docs de Braze)
  if (!externalId || externalId === 'anonymous') {
    console.warn('[Braze] identifyUser ignorado: external_id genérico o vacío.');
    return;
  }
  try {
    console.log(`[Braze SDK] Identify User: ${externalId}`);
    changeUser(externalId);
    if (attributes) {
      setBrazeUserAttributes(attributes);
    }
  } catch (e) {
    console.warn('Braze changeUser failed', e);
  }
};

/**
 * Logout seguro para la demo: NO llama changeUser('anonymous').
 * El Web SDK no permite "des-identificar" una sesión; reutilizar un external_id
 * compartido como "anonymous" mezclaría datos de todos los visitantes en un solo perfil.
 */
export const logoutBrazeUser = () => {
  if (!isBrazeInitialized) return;
  console.log('[Braze SDK] Logout local: se mantiene el último perfil identificado en el dispositivo.');
};

export const logBrazeEvent = (eventName: string, properties?: Record<string, any>) => {
  if (!isBrazeInitialized) return;
  try {
    console.log(`[Braze SDK] Log Event: ${eventName}`, properties || {});
    logCustomEvent(eventName, properties);
  } catch (e) {
    console.warn('Braze logCustomEvent failed', e);
  }
};

export const setBrazeUserAttributes = (attributes: Record<string, any>) => {
  if (!isBrazeInitialized) return;
  try {
    const user = getUser();
    if (user) {
      for (const [key, value] of Object.entries(attributes)) {
        if (key === 'email') {
          user.setEmail(value ? value : null);
        } else if (key === 'first_name' && typeof value === 'string') {
          user.setFirstName(value);
        } else if (key === 'phone' && typeof value === 'string') {
          user.setPhoneNumber(value);
        } else if (key === 'city' && typeof value === 'string') {
          user.setHomeCity(value);
        } else {
          user.setCustomUserAttribute(key, value);
        }
      }
    }
  } catch (e) {
    console.warn('Braze setBrazeUserAttributes failed', e);
  }
};

export const requestContentCards = () => {
  if (!isBrazeInitialized) return;
  try {
    requestContentCardsRefresh();
  } catch (e) {
    console.warn('Braze requestContentCards failed', e);
  }
};

export const subscribeToContentCards = (callback: (cards: ContentCards) => void) => {
  if (!isBrazeInitialized) return;
  try {
    subscribeToContentCardsUpdates(callback);
  } catch (e) {
    console.warn('Braze subscribeToContentCardsUpdates failed', e);
  }
};

export const logBrazeContentCardClick = (card: Card) => {
  if (!isBrazeInitialized) return;
  try {
    logContentCardClick(card);
  } catch (e) {
    console.warn('Braze logContentCardClick failed', e);
  }
};

export const logBrazeContentCardImpressions = (cards: Card[]) => {
  if (!isBrazeInitialized) return;
  try {
    logContentCardImpressions(cards);
  } catch (e) {
    console.warn('Braze logContentCardImpressions failed', e);
  }
};

export const handleBrazeCardAction = (url?: string) => {
  if (url) {
    if (url.startsWith('http')) {
      window.open(url, '_blank');
    } else {
      window.location.href = url;
    }
  }
};
