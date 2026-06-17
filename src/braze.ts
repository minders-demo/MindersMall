// src/braze.ts
// Configuración de Braze para MindersMall (Vite + React, GitHub Pages).
import * as braze from "@braze/web-sdk";

const API_KEY = "e92f1ba3-6066-4a51-b242-c59c4d4d78d5";
const BASE_URL = "sdk.iad-06.braze.com";

// Llama esto UNA sola vez al arrancar la app (desde main.tsx).
export function initBraze(): void {
  braze.initialize(API_KEY, {
    baseUrl: BASE_URL,
    manageServiceWorkerExternally: true, // controlamos el service worker nosotros (clave en GitHub Pages)
    enableLogging: true,                  // pon false en producción
  });

  braze.automaticallyShowInAppMessages();

  // Identifica el navegador como el usuario de prueba, para que el token de push
  // quede en SU perfil (al que le envías el Send Test).
  braze.changeUser("luchito_diaz_demo");

  braze.openSession();

  // Registra el service worker en la ruta correcta (respeta el base de Vite).
  if ("serviceWorker" in navigator) {
    const swUrl = `${import.meta.env.BASE_URL}service-worker.js`;
    navigator.serviceWorker
      .register(swUrl)
      .then((reg) => console.log("[Braze] Service worker listo. scope:", reg.scope))
      .catch((err) => console.error("[Braze] Error registrando service worker:", err));
  }

  mountPushButton();
}

// Crea un botón flotante "Activar notificaciones" (así no tocas tu JSX).
function mountPushButton(): void {
  const create = () => {
    if (document.getElementById("braze-enable-push")) return;

    const btn = document.createElement("button");
    btn.id = "braze-enable-push";
    btn.textContent = "Activar notificaciones";
    btn.style.cssText =
      "position:fixed;bottom:20px;right:20px;z-index:99999;" +
      "padding:12px 18px;border-radius:9999px;border:none;" +
      "background:#5b21b6;color:#fff;font-size:14px;" +
      "font-family:system-ui,sans-serif;cursor:pointer;" +
      "box-shadow:0 4px 12px rgba(0,0,0,0.2);";

    if (typeof braze.isPushSupported === "function" && !braze.isPushSupported()) {
      btn.textContent = "Push no soportado en este navegador";
      btn.disabled = true;
    } else if (typeof braze.isPushBlocked === "function" && braze.isPushBlocked()) {
      btn.textContent = "Push bloqueado — actívalo en ajustes del sitio";
    }

    btn.addEventListener("click", () => {
      braze.requestPushPermission(
        () => {
          console.log("[Braze] Permiso concedido. Token de push registrado.");
          btn.textContent = "Notificaciones activadas ✓";
        },
        () => {
          console.warn("[Braze] Permiso denegado o no soportado.");
        }
      );
    });

    document.body.appendChild(btn);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", create);
  } else {
    create();
  }
}
