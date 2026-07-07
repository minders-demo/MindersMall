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
  isPushPermissionGranted,
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
      enableLogging: true,

      // ⚠️ FIX DEFINITIVO ⚠️
      // El SDK busca el service worker en "/service-worker.js" (la RAÍZ del
      // dominio) por defecto. En GitHub Pages el sitio vive bajo /MindersMall/,
      // así que nunca lo encontraba y lanzaba "No service worker registration".
      // Según docs de Braze: si el service worker no está en la ubicación por
      // defecto, es OBLIGATORIO indicar serviceWorkerLocation.
      // BASE_URL = '/MindersMall/' → '/MindersMall/service-worker.js'
      serviceWorkerLocation: `${import.meta.env.BASE_URL}service-worker.js`,

      // Ya NO usamos manageServiceWorkerExternally: dejamos que el propio SDK
      // registre el service worker (patrón recomendado en docs). El SDK espera
      // a que esté activo antes de suscribir el token — se acabó la carrera.
    });
    if (!ok) {
      console.warn('[Braze] initialize() devolvió false. Revisa API key y endpoint.');
      return;
    }
    automaticallyShowInAppMessages();
    openSession();
    isBrazeInitialized = true;
    console.log(`[Braze] SDK inicializado contra ${cleanEndpoint}`);

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
    // Según docs de Braze: "Only the most recent user on a particular browser
    // will receive push notifications". El token de push viaja con el ÚLTIMO
    // usuario identificado. Si el permiso ya fue concedido, re-suscribimos el
    // token al usuario actual — así push funciona con CUALQUIER usuario que
    // esté activo en la demo, sin volver a mostrar el prompt.
    resubscribePushIfGranted(externalId);
  } catch (e) {
    console.warn('Braze changeUser failed', e);
  }
};

/**
 * Si el navegador ya concedió permiso de notificaciones, vuelve a suscribir
 * el token de push al perfil actualmente identificado, sin mostrar prompt
 * (según docs, requestPushPermission no pregunta de nuevo cuando
 * isPushPermissionGranted() es true).
 */
const resubscribePushIfGranted = (externalId: string) => {
  if (typeof isPushSupported === 'function' && !isPushSupported()) return;
  if (typeof isPushPermissionGranted === 'function' && !isPushPermissionGranted()) return;

  requestPushPermission(
    () => {
      console.log(`[Braze] Token de push re-suscrito al perfil actual: ${externalId}`);
      try { requestImmediateDataFlush(); } catch (e) { /* noop */ }
    },
    () => {
      console.warn('[Braze] No se pudo re-suscribir el token de push al perfil actual.');
    }
  );
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
// Web Push
// ============================================================

/**
 * Pide permiso de push para el usuario ACTUALMENTE identificado.
 * El SDK registra el service worker por sí mismo (serviceWorkerLocation)
 * y suscribe el token al perfil activo. Funciona con cualquier usuario.
 */
export const requestBrazePush = (): void => {
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
    return;
  }

  requestPushPermission(
    () => {
      const user = getUser();
      if (user && typeof user.getUserId === 'function') {
        user.getUserId((id) => {
          console.log(`[Braze] Permiso concedido. Token de push registrado en el perfil: ${id || '(anónimo)'}`);
        });
      } else {
        console.log('[Braze] Permiso concedido. Token de push registrado en el perfil actual.');
      }
      try { requestImmediateDataFlush(); } catch (e) { /* noop */ }
    },
    (temporary) => {
      console.warn(
        temporary
          ? '[Braze] El usuario cerró el prompt sin decidir (denegación temporal). Puede volver a intentarlo.'
          : '[Braze] Permiso de push DENEGADO permanentemente. Hay que reactivarlo en los ajustes del sitio (candado > Notificaciones).'
      );
    }
  );
};

/**
 * Botón flotante "Activar notificaciones".
 * Registra el token de push en el perfil del usuario que esté identificado
 * en ese momento en la demo (Luchito, Checho, Juan... el que sea).
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
      if (typeof isPushBlocked === 'function' && isPushBlocked()) {
        btn.textContent = 'Push bloqueado — actívalo en ajustes del sitio';
        return;
      }

      btn.textContent = 'Activando...';

      requestPushPermission(
        () => {
          const user = getUser();
          if (user && typeof user.getUserId === 'function') {
            user.getUserId((id) => {
              console.log(`[Braze] Permiso concedido. Token registrado en el perfil: ${id || '(anónimo)'}`);
            });
          }
          btn.textContent = 'Notificaciones activadas ✓';
          try { requestImmediateDataFlush(); } catch (e) { /* noop */ }
        },
        (temporary) => {
          console.warn('[Braze] Permiso de push denegado.', { temporal: temporary });
          btn.textContent = temporary ? 'Prompt cerrado — intenta de nuevo' : 'Permiso denegado';
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
