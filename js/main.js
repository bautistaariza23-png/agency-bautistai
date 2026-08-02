/* ==========================================================================
   BA AGENCY — Comportamiento del sitio
   --------------------------------------------------------------------------
   Cada bloque es independiente y se inicializa al final del archivo.
   Contenido:
     1. Configuración
     2. Idioma (ES / EN)
     3. Titular rotativo
     4. Menú móvil
     5. Barra de progreso de scroll
     6. Aparición al hacer scroll
     7. Contador animado de precios
     8. Píldoras de objetivo (WhatsApp / email)
     9. Formulario de feedback
   ========================================================================== */

'use strict';

/* ==========================================================================
   1. CONFIGURACIÓN
   ========================================================================== */

const CONFIG = {
  email: 'bautistaariza23@gmail.com',
  whatsapp: '5491162626302',
  formEndpoint: 'https://formsubmit.co/ajax/bautistaariza23@gmail.com',
  rotatorDelay: 2600,
  countDuration: 900,
};

const WORDS = {
  es: ['landing pages', 'sitios web', 'e-commerce', 'flujos con IA'],
  en: ['landing pages', 'websites', 'e-commerce', 'AI workflows'],
};

const TEXT = {
  es: {
    namePlaceholder: 'Tu nombre',
    commentPlaceholder: 'Escribí tu comentario acá…',
    missingFields: 'Completá tu nombre, correo y comentario antes de enviar.',
    invalidEmail: 'Ingresá un correo electrónico válido.',
    sendFailed: 'No se pudo enviar. Intentá de nuevo en unos minutos.',
    mailSubject: 'Quiero empezar mi proyecto',
  },
  en: {
    namePlaceholder: 'Your name',
    commentPlaceholder: 'Write your comment here…',
    missingFields: 'Please fill in your name, email and comment before sending.',
    invalidEmail: 'Please enter a valid email address.',
    sendFailed: 'Could not send. Please try again in a few minutes.',
    mailSubject: 'I want to start my project',
  },
};

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Idioma activo, leído del atributo data-lang del documento. */
function currentLang() {
  return document.documentElement.dataset.lang === 'en' ? 'en' : 'es';
}

/** Textos de la interfaz para el idioma activo. */
function t() {
  return TEXT[currentLang()];
}

/* ==========================================================================
   2. IDIOMA
   ==========================================================================
   El CSS se encarga de mostrar u ocultar los .lang-es / .lang-en según el
   atributo data-lang. Acá solo cambiamos el atributo y actualizamos lo que
   no puede resolverse con CSS (placeholders y enlaces generados).
   ========================================================================== */

const langListeners = [];

/** Registra una función que debe ejecutarse cada vez que cambia el idioma. */
function onLanguageChange(fn) {
  langListeners.push(fn);
  fn(currentLang());
}

function initLanguageToggle() {
  const toggle = document.getElementById('lang-toggle');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const next = currentLang() === 'es' ? 'en' : 'es';
    document.documentElement.dataset.lang = next;
    document.documentElement.lang = next;
    langListeners.forEach((fn) => fn(next));
  });
}

/* ==========================================================================
   3. TITULAR ROTATIVO
   ========================================================================== */

function initRotator() {
  const rotators = document.querySelectorAll('[data-rotator]');
  if (!rotators.length || prefersReducedMotion) return;

  let index = 0;

  setInterval(() => {
    index = (index + 1) % WORDS.es.length;

    rotators.forEach((el) => {
      const lang = el.dataset.rotator;
      el.textContent = WORDS[lang][index];

      // Reinicia la animación de entrada sin tocar el resto de los estilos.
      el.style.animation = 'none';
      void el.offsetWidth; // fuerza un reflow para que el navegador la reinicie
      el.style.animation = '';
    });
  }, CONFIG.rotatorDelay);
}

/* ==========================================================================
   4. MENÚ MÓVIL
   ========================================================================== */

function initMobileMenu() {
  const burger = document.getElementById('nav-burger');
  const menu = document.getElementById('nav-mobile');
  if (!burger || !menu) return;

  const close = () => {
    menu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  };

  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
  });

  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
}

/* ==========================================================================
   5. BARRA DE PROGRESO DE SCROLL
   ========================================================================== */

function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  let ticking = false;

  const update = () => {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - doc.clientHeight;
    const progress = scrollable > 0 ? Math.min(Math.max(window.scrollY / scrollable, 0), 1) : 0;
    bar.style.transform = `scaleX(${progress})`;
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    },
    { passive: true }
  );

  update();
}

/* ==========================================================================
   6. APARICIÓN AL HACER SCROLL
   ========================================================================== */

function initReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('rv-in'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('rv-in');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   7. CONTADOR ANIMADO DE PRECIOS
   ========================================================================== */

function animateCount(el) {
  const match = el.textContent.trim().match(/^(\D*)(\d+)(\D*)$/);
  if (!match) return;

  const [, prefix, digits, suffix] = match;
  const target = parseInt(digits, 10);
  const start = performance.now();
  const easeOutCubic = (progress) => 1 - Math.pow(1 - progress, 3);

  const step = (now) => {
    const progress = Math.min((now - start) / CONFIG.countDuration, 1);
    el.textContent = prefix + Math.round(easeOutCubic(progress) * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length || prefersReducedMotion || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   8. PÍLDORAS DE OBJETIVO
   ==========================================================================
   Al elegir un objetivo se arma un mensaje editable que el visitante puede
   enviar por WhatsApp o por email.
   ========================================================================== */

function initGoalPills() {
  const group = document.getElementById('goal-pills');
  const box = document.getElementById('goal-box');
  const textarea = document.getElementById('goal-msg');
  const whatsapp = document.getElementById('goal-whatsapp');
  const email = document.getElementById('goal-email');
  if (!group || !box || !textarea || !whatsapp || !email) return;

  let selected = null;

  const refreshLinks = () => {
    const message = encodeURIComponent(textarea.value || '');
    whatsapp.href = `https://wa.me/${CONFIG.whatsapp}?text=${message}`;
    email.href =
      `mailto:${CONFIG.email}` +
      `?subject=${encodeURIComponent(t().mailSubject)}` +
      `&body=${message}`;
  };

  group.querySelectorAll('.pill-choice').forEach((pill) => {
    pill.addEventListener('click', () => {
      group.querySelectorAll('.pill-choice').forEach((p) => p.classList.remove('is-active'));
      pill.classList.add('is-active');

      selected = pill;
      textarea.value = pill.dataset[currentLang() === 'es' ? 'msgEs' : 'msgEn'];
      box.hidden = false;
      refreshLinks();
    });
  });

  textarea.addEventListener('input', refreshLinks);

  // Al cambiar de idioma se reescribe el mensaje sugerido, salvo que el
  // visitante ya lo haya editado a mano.
  onLanguageChange((lang) => {
    if (selected) {
      const other = lang === 'es' ? 'msgEn' : 'msgEs';
      if (textarea.value === selected.dataset[other]) {
        textarea.value = selected.dataset[lang === 'es' ? 'msgEs' : 'msgEn'];
      }
    }
    refreshLinks();
  });
}

/* ==========================================================================
   9. FORMULARIO DE FEEDBACK
   ========================================================================== */

function initFeedback() {
  const form = document.getElementById('feedback-form');
  const good = document.getElementById('fb-good');
  const bad = document.getElementById('fb-bad');
  const name = document.getElementById('fb-name');
  const email = document.getElementById('fb-email');
  const comment = document.getElementById('fb-comment');
  const promptLabel = document.querySelector('label[for="fb-comment"]');
  const error = document.getElementById('fb-error');
  const success = document.getElementById('fb-success');
  const submit = document.getElementById('fb-submit');
  const submitIdle = document.getElementById('fb-submit-idle');
  const submitSending = document.getElementById('fb-submit-sending');
  if (!form || !good || !bad || !promptLabel) return;

  let experience = null;
  let sending = false;

  /** Escribe la pregunta que corresponde según la experiencia elegida. */
  const refreshPrompt = () => {
    if (!experience) return;
    const key = experience === 'good' ? 'promptGood' : 'promptBad';
    promptLabel.querySelectorAll('[data-prompt-good]').forEach((span) => {
      span.textContent = span.dataset[key];
    });
  };

  const choose = (button, value) => {
    experience = value;
    [good, bad].forEach((b) => b.classList.remove('is-active'));
    button.classList.add('is-active');
    form.hidden = false;
    success.hidden = true;
    error.hidden = true;
    refreshPrompt();
  };

  good.addEventListener('click', () => choose(good, 'good'));
  bad.addEventListener('click', () => choose(bad, 'bad'));

  const showError = (message) => {
    error.textContent = message;
    error.hidden = false;
    success.hidden = true;
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (sending) return;

    const strings = t();
    const nameValue = name.value.trim();
    const emailValue = email.value.trim();
    const commentValue = comment.value.trim();

    if (!nameValue || !emailValue || !commentValue) {
      showError(strings.missingFields);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      showError(strings.invalidEmail);
      return;
    }

    sending = true;
    error.hidden = true;
    success.hidden = true;
    submit.disabled = true;
    submitIdle.hidden = true;
    submitSending.hidden = false;

    fetch(CONFIG.formEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        _subject:
          experience === 'good'
            ? 'Feedback portafolio — Buena experiencia'
            : 'Feedback portafolio — Mala experiencia',
        Nombre: nameValue,
        Correo: emailValue,
        Experiencia: experience === 'good' ? 'Buena' : 'Mala',
        Comentario: commentValue,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (!result || (result.success !== 'true' && result.success !== true)) {
          throw new Error('send failed');
        }
        success.hidden = false;
        form.reset();
      })
      .catch(() => showError(t().sendFailed))
      .finally(() => {
        sending = false;
        submit.disabled = false;
        submitIdle.hidden = false;
        submitSending.hidden = true;
      });
  });

  // Placeholders y textos que dependen del idioma activo.
  onLanguageChange(() => {
    const strings = t();
    name.placeholder = strings.namePlaceholder;
    comment.placeholder = strings.commentPlaceholder;
    refreshPrompt();
  });
}

/* ==========================================================================
   INICIALIZACIÓN
   ========================================================================== */

initLanguageToggle();
initRotator();
initMobileMenu();
initScrollProgress();
initReveal();
initCounters();
initGoalPills();
initFeedback();
