/* ==========================================================================
   BA AGENCY — Animación del acordeón de preguntas frecuentes
   --------------------------------------------------------------------------
   El <details>/<summary> nativo abre y cierra de golpe: el navegador no
   anima el salto entre display:none y el alto real del contenido. Esta
   mejora progresiva intercepta el clic y anima la altura con la Web
   Animations API, sin perder nada de lo que el elemento nativo ya regala
   gratis (teclado, lectores de pantalla, buscador del navegador con Ctrl+F).

   Con prefers-reduced-motion no se engancha nada: el <details> se abre y
   cierra instantáneo, como corresponde.
   ========================================================================== */

'use strict';

(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const DURATION = 400; // ms — coincide con --dur-slow
  const EASING = 'cubic-bezier(0.16, 1, 0.3, 1)'; // coincide con --ease-out

  class FaqAccordion {
    constructor(details) {
      this.details = details;
      this.summary = details.querySelector('summary');
      this.answer = details.querySelector('.faq-answer');
      this.heightAnimation = null;
      this.isExpanding = false;
      this.isClosing = false;

      this.summary.addEventListener('click', (event) => this.onClick(event));
    }

    onClick(event) {
      event.preventDefault();

      // El icono +/- se sincroniza con la intención del clic, no con el
      // final de la animación de alto — así responde al instante.
      this.details.classList.toggle('is-open', !this.details.open);

      if (this.isClosing || !this.details.open) {
        this.expand();
      } else {
        this.shrink();
      }
    }

    expand() {
      this.details.style.overflow = 'hidden';
      this.isExpanding = true;
      this.details.open = true;

      // Leer offsetHeight fuerza un reflow síncrono: no hace falta esperar
      // un requestAnimationFrame para que el layout esté al día.
      const startHeight = `${this.summary.offsetHeight}px`;
      const endHeight = `${this.summary.offsetHeight + this.answer.offsetHeight}px`;

      this.runHeightAnimation(startHeight, endHeight, true);
      this.answer.animate(
        { opacity: [0, 1], transform: ['translateY(-6px)', 'translateY(0)'] },
        { duration: DURATION, easing: EASING }
      );
    }

    shrink() {
      this.details.style.overflow = 'hidden';
      this.isClosing = true;

      const startHeight = `${this.details.offsetHeight}px`;
      const endHeight = `${this.summary.offsetHeight}px`;

      this.runHeightAnimation(startHeight, endHeight, false);
      this.answer.animate({ opacity: [1, 0] }, { duration: DURATION * 0.6, easing: EASING });
    }

    runHeightAnimation(from, to, willBeOpen) {
      if (this.heightAnimation) this.heightAnimation.cancel();
      clearTimeout(this.finishTimer);

      this.heightAnimation = this.details.animate(
        { height: [from, to] },
        { duration: DURATION, easing: EASING }
      );

      // El cierre se resuelve con setTimeout, no con el evento 'finish' de la
      // animación: ese evento se despacha junto con el pintado de frames, y
      // en pestañas en segundo plano el navegador puede posponerlo
      // indefinidamente. setTimeout usa el reloj real y no depende de eso.
      this.finishTimer = setTimeout(() => this.onAnimationFinish(willBeOpen), DURATION);
    }

    onAnimationFinish(open) {
      this.details.open = open;
      this.heightAnimation = null;
      this.isExpanding = false;
      this.isClosing = false;
      this.details.style.height = '';
      this.details.style.overflow = '';
    }
  }

  document.querySelectorAll('#faq .faq-item').forEach((el) => new FaqAccordion(el));
})();
