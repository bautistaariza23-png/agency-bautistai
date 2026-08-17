/* ==========================================================================
   BA AGENCY — Portero de la insignia 3D
   --------------------------------------------------------------------------
   Este archivo es diminuto y se carga siempre. Su única tarea es decidir SI
   conviene descargar el módulo 3D, que arrastra Three.js (~400 KB).

   Mientras tanto —y si decide que no— el hueco lo ocupa el logo plano en
   PNG, que ya viene cacheado porque lo usa la barra de navegación.

   Todo se sirve desde este mismo dominio: no interviene ningún CDN, así que
   ningún tercero ve la IP del visitante.
   ========================================================================== */

'use strict';

(function () {
  const mount = document.getElementById('hero-logo3d');
  if (!mount) return;

  /* ---- ¿Conviene cargarlo? ---------------------------------------------- */

  /** Devuelve el motivo por el que NO cargar, o null si se puede cargar. */
  function motivoParaSaltar() {
    // Quien pidió menos animación no debería recibir un objeto que se mueve.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return 'prefiere menos movimiento';
    }

    // Sin WebGL2 no hay nada que hacer.
    try {
      const test = document.createElement('canvas');
      if (!test.getContext('webgl2')) return 'sin WebGL2';
    } catch {
      return 'sin WebGL2';
    }

    // Equipos con poca memoria: el costo no compensa para un elemento decorativo.
    if (typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 2) {
      return 'poca memoria en el dispositivo';
    }

    // Ahorro de datos o conexión lenta: 400 KB decorativos no se justifican.
    const conn = navigator.connection;
    if (conn) {
      if (conn.saveData) return 'ahorro de datos activado';
      if (/(^|-)2g$/.test(conn.effectiveType || '')) return 'conexión lenta';
      if (conn.effectiveType === '3g') return 'conexión lenta';
    }

    return null;
  }

  const motivo = motivoParaSaltar();
  if (motivo) {
    // El logo plano ya está en pantalla; no hace falta hacer nada más.
    mount.dataset.logo3d = 'omitido: ' + motivo;
    return;
  }

  /* ---- ¿Cuándo cargarlo? -------------------------------------------------
     Después de que la página terminó de cargar y el navegador está ocioso,
     para no competir nunca con el render inicial ni con el LCP.            */

  function cargar() {
    import('./logo3d.js')
      .then(({ mountLogo3D }) => {
        mount.dataset.logo3d = 'activo';
        mountLogo3D(mount);
      })
      .catch(() => {
        // Si falla la descarga, el logo plano se queda: el hero sigue bien.
        mount.dataset.logo3d = 'error de carga';
      });
  }

  function cuandoEstéOcioso() {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(cargar, { timeout: 3000 });
    } else {
      setTimeout(cargar, 1200);
    }
  }

  if (document.readyState === 'complete') cuandoEstéOcioso();
  else window.addEventListener('load', cuandoEstéOcioso, { once: true });
})();
