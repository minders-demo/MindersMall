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
let initPromise: Promise<void> | null = null;

export const getIsBrazeInitialized = () => isBrazeInitialized;

const getBasePath = (): string => {
  const base = import.meta.env.BASE_URL || '/';
  return base.endsWith('/') ? base : `${base}/`;
};

const getPersistedDemoExternalId = (): string | null => {
  try {
    const raw = localStorage.getItem('demo_user');
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    const id = parsed?.id;

    if (!id || id === 'anonymous') return null;
    return String(id);
  } catch {
    return null;
  }
};

const waitForServiceWorkerActivation = async (
  registration: ServiceWorkerRegistration,
): Promise<void> => {
  if (registration.active) return;

  const worker = registration.installing ?? registration.waiting;
  if (!worker) return;

  await new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      reject(
        new Error(
          'Timeout esperando la activación del service worker de Braze.',
        ),
      );
    }, 10000);

    const finish = () => {
      window.clearTimeout(timeout);
      worker.removeEventListener('statechange', onStateChange);
      resolve();
    };

    const onStateChange = () => {
      if (worker.state === 'activated') {
        finish();
      } else if (worker.state === 'redundant') {
        window.clearTimeout(timeout);
        worker.removeEventListener('statechange', onStateChange);
        reject(
          new Error(
            'El service worker de Braze quedó en estado redundant.',
          ),
        );
      }
    };

    worker.addEventListener('statechange', onStateChange);
    onStateChange();
  });
};

/**
 * Registra explícitamente el service worker dentro de /MindersMall/.
 */
const ensureBrazeServiceWorker =
  async (): Promise<ServiceWorkerRegistration | null> => {
    if (!('serviceWorker' in navigator)) {
      console.warn(
        '[Braze] Service Workers no están soportados en este navegador.',
      );
      return null;
    }

    const basePath = getBasePath();
    const swPath = `${basePath}service-worker.js`;

    const expectedScope = new URL(
      basePath,
      window.location.origin,
    ).href;

    const expectedScriptUrl = new URL(
      swPath,
      window.location.origin,
    ).href;

    const registrations =
      await navigator.serviceWorker.getRegistrations();

    const exactRegistration = registrations.find(
      (registration) =>
        registration.scope === expectedScope,
    );

    let registration = exactRegistration;

    if (
      !registration ||
      registration.active?.scriptURL !== expectedScriptUrl
    ) {
      registration =
        await navigator.serviceWorker.register(swPath, {
          scope: basePath,
        });
    }

    await waitForServiceWorkerActivation(registration);

    console.log('[Braze] Service worker listo', {
      scope: registration.scope,
      scriptURL: registration.active?.scriptURL,
    });

    const rootScope = `${window.location.origin}/`;

    const rootRegistration = registrations.find(
      (item) =>
        item.scope === rootScope &&
        item.scope !== expectedScope,
    );

    if (rootRegistration) {
      console.warn(
        '[Braze] Hay un service worker registrado en la raíz del dominio. ' +
          'Si una prueba IAM abre https://minders-demo.github.io/ ' +
          'en vez de /MindersMall/, revisa este registro en ' +
          'DevTools > Application > Service Workers.',
        {
          scope: rootRegistration.scope,
          scriptURL:
            rootRegistration.active?.scriptURL,
        },
      );
    }

    return registration;
  };

const initBrazeInternal = async (): Promise<void> => {
  const apiKey = import.meta.env.VITE_BRAZE_API_KEY;
  const sdkEndpoint =
    import.meta.env.VITE_BRAZE_SDK_ENDPOINT;

  const isPlaceholderKey =
    !apiKey ||
    String(apiKey).includes('your_') ||
    apiKey === 'YOUR_API_KEY';

  const isPlaceholderEndpoint =
    !sdkEndpoint ||
    String(sdkEndpoint).includes('your_') ||
    String(sdkEndpoint).includes('XX');

  if (isPlaceholderKey || isPlaceholderEndpoint) {
    console.warn(
      '[Braze] SDK NO inicializado: faltan ' +
        'VITE_BRAZE_API_KEY y/o VITE_BRAZE_SDK_ENDPOINT ' +
        'en el build.',
    );
    return;
  }

  const cleanEndpoint = String(sdkEndpoint)
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '');

  const basePath = getBasePath();

  const serviceWorkerLocation =
    `${basePath}service-worker.js`;

  try {
    /**
     * Registramos nosotros mismos el SW.
     */
    await ensureBrazeServiceWorker();

    const ok = initialize(String(apiKey), {
      baseUrl: cleanEndpoint,

      enableLogging: true,

      /**
       * Minders Mall vive en:
       * /MindersMall/
       */
      serviceWorkerLocation,

      /**
       * El SW solo debe controlar Minders Mall.
       */
      serviceWorkerScope: basePath,

      /**
       * Nosotros registramos explícitamente
       * el service worker.
       */
      manageServiceWorkerExternally: true,

      /**
       * Evita problemas con overlays propios
       * de la web.
       */
      inAppMessageZIndex: 999999,

      /**
       * Permite usar IAM HTML / Drag & Drop
       * con JavaScript en la demo.
       */
      allowUserSuppliedJavascript: true,
    });

    if (!ok) {
      console.warn(
        '[Braze] initialize() devolvió false. ' +
          'Revisa API key y endpoint.',
      );
      return;
    }

    /**
     * IMPORTANTE:
     * restauramos el usuario de la demo ANTES
     * de abrir la sesión.
     */
    const persistedExternalId =
      getPersistedDemoExternalId();

    if (persistedExternalId) {
      changeUser(persistedExternalId);

      console.log(
        `[Braze] Usuario restaurado antes de openSession(): ${persistedExternalId}`,
      );
    }

    /**
     * Debe ejecutarse ANTES de openSession().
     */
    automaticallyShowInAppMessages();

    /**
     * Las IAM se descargan / evalúan
     * durante la sesión.
     */
    openSession();

    isBrazeInitialized = true;

    console.log(
      `[Braze] SDK inicializado contra ${cleanEndpoint}`,
      {
        basePath,
        serviceWorkerLocation,
      },
    );

    mountPushButton();
  } catch (e) {
    console.error(
      '[Braze] Falló la inicialización del SDK',
      e,
    );
  }
};

export const initBraze = (): Promise<void> => {
  /**
   * React StrictMode puede ejecutar
   * useEffect dos veces.
   */
  if (isBrazeInitialized) {
    return Promise.resolve();
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = initBrazeInternal().finally(() => {
    if (!isBrazeInitialized) {
      initPromise = null;
    }
  });

  return initPromise;
};

export const identifyUser = (
  externalId: string,
  attributes?: Record<string, any>,
) => {
  if (!isBrazeInitialized) return;

  if (
    !externalId ||
    externalId === 'anonymous'
  ) {
    console.warn(
      '[Braze] identifyUser ignorado: external_id genérico o vacío.',
    );
    return;
  }

  try {
    console.log(
      `[Braze SDK] Identify User: ${externalId}`,
    );

    changeUser(externalId);

    if (attributes) {
      setBrazeUserAttributes(attributes);
    }

    resubscribePushIfGranted(externalId);
  } catch (e) {
    console.warn(
      'Braze changeUser failed',
      e,
    );
  }
};

const resubscribePushIfGranted = (
  externalId: string,
) => {
  if (
    typeof isPushSupported === 'function' &&
    !isPushSupported()
  ) {
    return;
  }

  if (
    typeof isPushPermissionGranted === 'function' &&
    !isPushPermissionGranted()
  ) {
    return;
  }

  requestPushPermission(
    () => {
      console.log(
        `[Braze] Token de push re-suscrito al perfil actual: ${externalId}`,
      );

      try {
        requestImmediateDataFlush();
      } catch {
        // noop
      }
    },

    () => {
      console.warn(
        '[Braze] No se pudo re-suscribir el token de push al perfil actual.',
      );
    },
  );
};

export const logoutBrazeUser = () => {
  if (!isBrazeInitialized) return;

  console.log(
    '[Braze SDK] Logout local: se mantiene el último perfil identificado en el dispositivo.',
  );
};

export const logBrazeEvent = (
  eventName: string,
  properties?: Record<string, any>,
) => {
  if (!isBrazeInitialized) return;

  try {
    console.log(
      `[Braze SDK] Log Event: ${eventName}`,
      properties || {},
    );

    logCustomEvent(
      eventName,
      properties,
    );
  } catch (e) {
    console.warn(
      'Braze logCustomEvent failed',
      e,
    );
  }
};

export const setBrazeUserAttributes = (
  attributes: Record<string, any>,
) => {
  if (!isBrazeInitialized) return;

  try {
    const user = getUser();

    if (user) {
      for (
        const [key, value]
        of Object.entries(attributes)
      ) {
        if (key === 'email') {
          user.setEmail(
            value ? value : null,
          );
        } else if (
          key === 'first_name' &&
          typeof value === 'string'
        ) {
          user.setFirstName(value);
        } else if (
          key === 'phone' &&
          typeof value === 'string'
        ) {
          user.setPhoneNumber(value);
        } else if (
          key === 'city' &&
          typeof value === 'string'
        ) {
          user.setHomeCity(value);
        } else {
          user.setCustomUserAttribute(
            key,
            value,
          );
        }
      }
    }
  } catch (e) {
    console.warn(
      'Braze setBrazeUserAttributes failed',
      e,
    );
  }
};

export const requestContentCards = () => {
  if (!isBrazeInitialized) return;

  try {
    requestContentCardsRefresh();
  } catch (e) {
    console.warn(
      'Braze requestContentCards failed',
      e,
    );
  }
};

export const subscribeToContentCards = (
  callback: (cards: ContentCards) => void,
) => {
  if (!isBrazeInitialized) return;

  try {
    subscribeToContentCardsUpdates(
      callback,
    );
  } catch (e) {
    console.warn(
      'Braze subscribeToContentCardsUpdates failed',
      e,
    );
  }
};

export const logBrazeContentCardClick = (
  card: Card,
) => {
  if (!isBrazeInitialized) return;

  try {
    logContentCardClick(card);
  } catch (e) {
    console.warn(
      'Braze logContentCardClick failed',
      e,
    );
  }
};

export const logBrazeContentCardImpressions = (
  cards: Card[],
) => {
  if (!isBrazeInitialized) return;

  try {
    logContentCardImpressions(
      cards,
    );
  } catch (e) {
    console.warn(
      'Braze logContentCardImpressions failed',
      e,
    );
  }
};

export const handleBrazeCardAction = (
  url?: string,
) => {
  if (!url) return;

  if (url.startsWith('http')) {
    window.open(
      url,
      '_blank',
    );
  } else {
    window.location.href = url;
  }
};

// ============================================================
// WEB PUSH
// ============================================================

export const requestBrazePush = (): void => {
  if (!isBrazeInitialized) {
    console.warn(
      '[Braze] No se puede pedir push: SDK no inicializado.',
    );
    return;
  }

  if (
    typeof isPushSupported === 'function' &&
    !isPushSupported()
  ) {
    console.warn(
      '[Braze] Push no soportado en este navegador.',
    );
    return;
  }

  if (
    typeof isPushBlocked === 'function' &&
    isPushBlocked()
  ) {
    console.warn(
      '[Braze] Push BLOQUEADO para este sitio.',
    );
    return;
  }

  requestPushPermission(
    () => {
      const user = getUser();

      if (
        user &&
        typeof user.getUserId === 'function'
      ) {
        user.getUserId((id) => {
          console.log(
            `[Braze] Permiso concedido. Token registrado en: ${id || '(anónimo)'}`,
          );
        });
      }

      try {
        requestImmediateDataFlush();
      } catch {
        // noop
      }
    },

    (temporary) => {
      console.warn(
        temporary
          ? '[Braze] Prompt cerrado temporalmente.'
          : '[Braze] Permiso de push denegado.',
      );
    },
  );
};

function mountPushButton(): void {
  const create = () => {
    if (
      document.getElementById(
        'braze-enable-push',
      )
    ) {
      return;
    }

    const btn =
      document.createElement('button');

    btn.id = 'braze-enable-push';

    btn.textContent =
      'Activar notificaciones';

    btn.style.cssText =
      'position:fixed;' +
      'bottom:20px;' +
      'right:20px;' +
      'z-index:99999;' +
      'padding:12px 18px;' +
      'border-radius:9999px;' +
      'border:none;' +
      'background:#4f46e5;' +
      'color:#fff;' +
      'font-size:14px;' +
      'font-family:system-ui,sans-serif;' +
      'cursor:pointer;' +
      'box-shadow:0 4px 12px rgba(0,0,0,0.25);';

    if (
      typeof isPushSupported === 'function' &&
      !isPushSupported()
    ) {
      btn.textContent =
        'Push no soportado';

      btn.disabled = true;
    } else if (
      typeof isPushBlocked === 'function' &&
      isPushBlocked()
    ) {
      btn.textContent =
        'Push bloqueado — actívalo en ajustes';
    }

    btn.addEventListener(
      'click',
      () => {
        if (
          typeof isPushSupported ===
            'function' &&
          !isPushSupported()
        ) {
          return;
        }

        if (
          typeof isPushBlocked ===
            'function' &&
          isPushBlocked()
        ) {
          btn.textContent =
            'Push bloqueado — actívalo en ajustes';

          return;
        }

        btn.textContent =
          'Activando...';

        requestPushPermission(
          () => {
            const user =
              getUser();

            if (
              user &&
              typeof user.getUserId ===
                'function'
            ) {
              user.getUserId(
                (id) => {
                  console.log(
                    `[Braze] Token registrado en perfil: ${id || '(anónimo)'}`,
                  );
                },
              );
            }

            btn.textContent =
              'Notificaciones activadas ✓';

            try {
              requestImmediateDataFlush();
            } catch {
              // noop
            }
          },

          (temporary) => {
            console.warn(
              '[Braze] Permiso de push denegado.',
              {
                temporal:
                  temporary,
              },
            );

            btn.textContent =
              temporary
                ? 'Prompt cerrado — intenta de nuevo'
                : 'Permiso denegado';
          },
        );
      },
    );

    document.body.appendChild(
      btn,
    );
  };

  if (
    document.readyState ===
    'loading'
  ) {
    document.addEventListener(
      'DOMContentLoaded',
      create,
    );
  } else {
    create();
  }
}
