/* ==========================================================================
   BA AGENCY — Brillo de borde en las tarjetas
   --------------------------------------------------------------------------
   Versión sin React de React Bits <BorderGlow /> (David Haz, MIT + Commons
   Clause). Los estilos viven en css/border-glow.css.

   - Tarjetas de servicios, proceso y precios (no las del FAQ).
   - En dispositivos con mouse, el brillo sigue al cursor: se calcula qué
     tan cerca del borde está (--edge-proximity, 0–100) y en qué ángulo
     (--cursor-angle).
   - "Nuevo proyecto" (.price-card-featured) queda siempre encendida; su
     giro lo anima el CSS, así que no escucha al mouse.
   ========================================================================== */

'use strict';

(function () {
  const cards = document.querySelectorAll('.card, .price-card');
  const hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /** Cercanía del punto (x, y) al borde: 0 en el centro, 1 en el borde. */
  function edgeProximity(width, height, x, y) {
    const cx = width / 2;
    const cy = height / 2;
    const dx = x - cx;
    const dy = y - cy;
    const kx = dx !== 0 ? cx / Math.abs(dx) : Infinity;
    const ky = dy !== 0 ? cy / Math.abs(dy) : Infinity;
    return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
  }

  /** Ángulo del cursor respecto del centro, con 0° hacia arriba. */
  function cursorAngle(width, height, x, y) {
    const dx = x - width / 2;
    const dy = y - height / 2;
    if (dx === 0 && dy === 0) return 0;
    let degrees = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    if (degrees < 0) degrees += 360;
    return degrees;
  }

  function onPointerMove(event) {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const edge = edgeProximity(rect.width, rect.height, x, y);
    const angle = cursorAngle(rect.width, rect.height, x, y);

    card.style.setProperty('--edge-proximity', (edge * 100).toFixed(3));
    card.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`);
  }

  cards.forEach((card) => {
    card.classList.add('border-glow');

    const light = document.createElement('span');
    light.className = 'edge-light';
    light.setAttribute('aria-hidden', 'true');
    card.append(light);

    if (card.classList.contains('price-card-featured')) {
      card.classList.add('border-glow--active');
    } else if (hasMouse) {
      card.addEventListener('pointermove', onPointerMove);
    }
  });
})();
