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
  requestPushPermission,
  requestImmediateDataFlush,
  isPushSupported,
  isPushBlocked,
} from '@braze/web-sdk';
import type { ContentCards, Card } from '@braze/web-sdk';

// External ID del usuario con el que pruebas el in-app (al que le das "Send Test").
// El token de push DEBE quedar en este perfil; por eso lo forzamos al activar push.
// Cámbialo si pruebas con otro usuario.
const TEST_PUSH_EXTERNAL_ID = 'luchito_diaz_demo';

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
      manageServiceWorkerExternally: true, // registramos el SW nosotros (obligatorio en GitHub Pages /MindersMall/)
    });
    if (!ok) {
      console.warn('[Braze] initialize() devolvió false. Revisa API key y endpoint.');
      return;
    }
    automaticallyShowInAppMessages();
    openSession();
    isBrazeInitialized = true;
    console.log(`[Braze] SDK inicializado contra ${cleanEndpoint}`);

    registerBrazeServiceWorker();
    mountPushButton();
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

// ============================================================
// Web Push (necesario para que el test de in-app funcione)
// ============================================================

/**
 * Registra el service worker de Braze.
 * En GitHub Pages el sitio vive bajo /MindersMall/, por eso usamos
 * import.meta.env.BASE_URL para que la ruta y el scope sean correctos.
 * El archivo DEBE estar en public/service-worker.js (Vite lo copia al build).
 */
function registerBrazeServiceWorker(): void {
  if (!('serviceWorker' in navigator)) return;
  const swUrl = `${import.meta.env.BASE_URL}service-worker.js`;
  navigator.serviceWorker
    .register(swUrl)
    .then((reg) => console.log('[Braze] Service worker registrado. scope:', reg.scope))
    .catch((err) => console.error('[Braze] Error registrando service worker:', err));
}

/**
 * Pide permiso de push. Si pasas un externalId, primero identifica a ese usuario
 * para que el token quede en SU perfil (clave para que el Send Test funcione).
 */
export const requestBrazePush = (externalId?: string): void => {
  if (!isBrazeInitialized) {
    console.warn('[Braze] No se puede pedir push: el SDK no está inicializado (revisa los Secrets del repo).');
    return;
  }
  if (typeof isPushSupported === 'function' && !isPushSupported()) {
    console.warn('[Braze] Push no soportado en este navegador.');
    return;
  }
  if (typeof isPushBlocked === 'function' && isPushBlocked()) {
    console.warn('[Braze] Push BLOQUEADO para este sitio. Resetéalo en el candado del navegador > Notificaciones > Preguntar.');
  }
  if (externalId) {
    console.log(`[Braze] changeUser("${externalId}") antes de pedir push...`);
    changeUser(externalId);
  }
  requestPushPermission(
    () => {
      console.log('[Braze] Permiso concedido. Token de push registrado en el perfil actual.');
      try { requestImmediateDataFlush(); } catch (e) { /* noop */ }
    },
    () => {
      console.warn('[Braze] Permiso de push denegado o no soportado.');
    }
  );
};

/**
 * Botón flotante "Activar notificaciones".
 * Fuerza la identidad al usuario de prueba (TEST_PUSH_EXTERNAL_ID) para que el token
 * quede en ese perfil. Para comportamiento genérico, pásale el usuario logueado de tu app.
 */
function mountPushButton(): void {
  const create = () => {
    if (document.getElementById('braze-enable-push')) return;

    const btn = document.createElement('button');
    btn.id = 'braze-enable-push';
    btn.textContent = 'Activar notificaciones';
    btn.style.cssText =
      'position:fixed;bottom:20px;right:20px;z-index:99999;' +
      'padding:12px 18px;border-radius:9999px;border:none;' +
      'background:#4f46e5;color:#fff;font-size:14px;' +
      'font-family:system-ui,sans-serif;cursor:pointer;' +
      'box-shadow:0 4px 12px rgba(0,0,0,0.25);';

    if (typeof isPushSupported === 'function' && !isPushSupported()) {
      btn.textContent = 'Push no soportado en este navegador';
      btn.disabled = true;
    } else if (typeof isPushBlocked === 'function' && isPushBlocked()) {
      btn.textContent = 'Push bloqueado — actívalo en ajustes del sitio';
    }

    btn.addEventListener('click', () => {
      if (typeof isPushSupported === 'function' && !isPushSupported()) return;
      console.log(`[Braze] Identificando como "${TEST_PUSH_EXTERNAL_ID}" antes de pedir push...`);
      changeUser(TEST_PUSH_EXTERNAL_ID);
      requestPushPermission(
        () => {
          console.log('[Braze] Permiso concedido. Token registrado en', TEST_PUSH_EXTERNAL_ID);
          btn.textContent = 'Notificaciones activadas ✓';
          try { requestImmediateDataFlush(); } catch (e) { /* noop */ }
        },
        () => {
          console.warn('[Braze] Permiso de push denegado o no soportado.');
          btn.textContent = 'Permiso denegado';
        }
      );
    });

    document.body.appendChild(btn);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', create);
  } else {
    create();
  }
}
