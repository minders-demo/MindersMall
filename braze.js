// braze.js — configuración de Braze para MindersMall.
// Este archivo reemplaza tu inicialización de Braze. Solo debe existir UNA.
(function () {
  // Inicializa Braze con los datos de tu app Web (Settings > Web)
  braze.initialize("e92f1ba3-6066-4a51-b242-c59c4d4d78d5", {
    baseUrl: "sdk.iad-06.braze.com",
    manageServiceWorkerExternally: true,  // necesario en GitHub Pages para que el push funcione
    enableLogging: true                    // útil para ver mensajes en la consola del navegador
  });

  // Muestra los in-app messages automáticamente cuando llegan
  braze.automaticallyShowInAppMessages();

  // Identifica el navegador como tu usuario de prueba,
  // para que el token de push quede en SU perfil (al que le envías el test).
  braze.changeUser("luchito_diaz_demo");

  // Abre la sesión
  braze.openSession();

  // Registra el service worker (archivo que habilita el push en el navegador)
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./service-worker.js")
      .then(function (reg) { console.log("[Braze] Service worker listo. scope:", reg.scope); })
      .catch(function (err) { console.error("[Braze] Error en service worker:", err); });
  }

  // Conecta el botón "Activar notificaciones"
  function activarBotonPush() {
    var btn = document.getElementById("enable-push");
    if (!btn) return;

    if (typeof braze.isPushSupported === "function" && !braze.isPushSupported()) {
      btn.disabled = true;
      btn.textContent = "Tu navegador no soporta notificaciones";
      return;
    }
    if (typeof braze.isPushBlocked === "function" && braze.isPushBlocked()) {
      btn.textContent = "Notificaciones bloqueadas — actívalas en ajustes del sitio";
    }

    btn.addEventListener("click", function () {
      braze.requestPushPermission(
        function () {
          console.log("[Braze] Permiso concedido. Token de push registrado.");
          btn.textContent = "Notificaciones activadas ✓";
        },
        function () {
          console.warn("[Braze] Permiso denegado.");
        }
      );
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", activarBotonPush);
  } else {
    activarBotonPush();
  }
})();
