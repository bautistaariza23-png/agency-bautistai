/* ==========================================================================
   BA AGENCY — Chatbot widget
   Simple rule-based decision tree. No backend, no external AI calls.
   Scheduling -> Calendly popup (host already gets a Calendly email on booking).
   Fallback contact -> pre-filled mailto: to bautistaariza23@gmail.com.
   ========================================================================== */
(function () {
  'use strict';

  var EMAIL = 'bautistaariza23@gmail.com';
  var WHATSAPP_URL = 'https://wa.me/5491162626302';
  var LINKEDIN_URL = 'https://www.linkedin.com/in/bautista-ariza-518144189/';
  var CALENDLY_URL = 'https://calendly.com/bautistaariza23/30min';
  var TYPING_DELAY = 500;

  function bi(es, en) {
    return '<span class="lang-es">' + es + '</span><span class="lang-en">' + en + '</span>';
  }

  function isEN() {
    return wrap.getAttribute('data-lang') === 'en';
  }

  // ---- Screen tree ------------------------------------------------------
  var SCREENS = {
    root: {
      bubbles: [
        bi('¡Hola! 👋 Soy <strong>BautistAI</strong>, el asistente de Bautista.', "Hi! 👋 I'm <strong>BautistAI</strong>, Bautista's assistant."),
        bi('¿En qué puedo ayudarte? Puedo contarte sobre mis servicios, precios, cómo trabajo, o ayudarte a agendar una llamada.', "How can I help you? I can tell you about my services, pricing, how I work, or help you book a call.")
      ],
      options: [
        { label: bi('🎨 Servicios', '🎨 Services'), to: 'servicios' },
        { label: bi('💰 Precios', '💰 Pricing'), to: 'precios' },
        { label: bi('⚙️ Cómo trabajo', '⚙️ How I work'), to: 'proceso' },
        { label: bi('🙋 Sobre Bautista', '🙋 About Bautista'), to: 'sobre' },
        { label: bi('📅 Agendar una llamada', '📅 Book a call'), to: 'agendar', primary: true },
        { label: bi('💬 Hablar directo', '💬 Contact directly'), to: 'contacto' }
      ]
    },

    servicios: {
      bubbles: [bi('Estos son los servicios que ofrezco:', 'Here are the services I offer:')],
      options: [
        { label: bi('Landing pages', 'Landing pages'), to: 'svc-landing' },
        { label: bi('Sitios corporativos', 'Corporate websites'), to: 'svc-corp' },
        { label: bi('E-commerce', 'E-commerce'), to: 'svc-ecom' },
        { label: bi('Automatización con IA', 'AI automation'), to: 'svc-auto' },
        { label: bi('⬅ Menú principal', '⬅ Main menu'), to: 'root' }
      ]
    },
    'svc-landing': {
      bubbles: [bi(
        '<span class="ba-msg-strong">Landing pages</span><br>Una sola página pensada para una sola acción: que tu visitante haga clic. Mensaje claro, CTA visible y carga instantánea.',
        '<span class="ba-msg-strong">Landing pages</span><br>A single page built for a single action: getting your visitor to click. Clear message, visible CTA, instant load.'
      )],
      options: 'svcFollow'
    },
    'svc-corp': {
      bubbles: [bi(
        '<span class="ba-msg-strong">Sitios web corporativos</span><br>Tu presencia digital completa. Diseño en Figma, desarrollo en Framer o a medida con código (HTML, CSS, JS, Tailwind CSS) según lo que tu proyecto necesite.',
        '<span class="ba-msg-strong">Corporate websites</span><br>Your complete digital presence. Designed in Figma, built in Framer or hand-coded (HTML, CSS, JS, Tailwind CSS) — whichever your project needs.'
      )],
      options: 'svcFollow'
    },
    'svc-ecom': {
      bubbles: [bi(
        '<span class="ba-msg-strong">E-commerce</span><br>Tu tienda desde cero en Shopify o Tienda Nube. Lista para vender, con medios de pago configurados y experiencia de compra optimizada.',
        '<span class="ba-msg-strong">E-commerce</span><br>Your store from scratch on Shopify or Tienda Nube. Ready to sell, with payments configured and an optimized buying experience.'
      )],
      options: 'svcFollow'
    },
    'svc-auto': {
      bubbles: [bi(
        '<span class="ba-msg-strong">Automatización con IA</span><br>Flujos con Make y N8N que agilizan y resuelven rápidamente los objetivos de tus usuarios en tu negocio.',
        "<span class=\"ba-msg-strong\">AI automation</span><br>Make and N8N workflows that streamline your business and solve your users' goals fast."
      )],
      options: 'svcFollow'
    },

    precios: {
      bubbles: [
        bi('Elegí la opción que mejor se adapta a lo que tenés en mente — esto me ayuda a preparar una propuesta que tenga sentido para vos:', 'Pick the option that best fits what you have in mind — it helps me prepare a proposal that makes sense for you:'),
        bi(
          '<ul>' +
            '<li><span class="ba-msg-strong">Nuevo proyecto</span> — desde $600 USD. Diseño + desarrollo de punta a punta, 6 revisiones + CMS.</li>' +
            '<li><span class="ba-msg-strong">Tienda online</span> — desde $500 USD. Shopify o Tienda Nube, lista para vender.</li>' +
            '<li><span class="ba-msg-strong">Desarrollo a medida</span> — desde $400 USD. Si ya tenés el diseño en Figma, 4 revisiones + CMS.</li>' +
            '<li><span class="ba-msg-strong">Automatización</span> — desde $350 USD. Flujos de automatización con Make.</li>' +
          '</ul>',
          '<ul>' +
            '<li><span class="ba-msg-strong">New project</span> — from $600 USD. End-to-end design + build, 6 revisions + CMS.</li>' +
            '<li><span class="ba-msg-strong">Online store</span> — from $500 USD. Shopify or Tienda Nube, ready to sell.</li>' +
            '<li><span class="ba-msg-strong">Custom development</span> — from $400 USD. If you already have the Figma design, 4 revisions + CMS.</li>' +
            '<li><span class="ba-msg-strong">Automation</span> — from $350 USD. Automation workflows with Make.</li>' +
          '</ul>'
        ),
        bi('Los precios son un punto de partida: la propuesta final depende del alcance del proyecto.', 'Prices are a starting point — the final quote depends on project scope.')
      ],
      options: [
        { label: bi('📅 Agendar una llamada', '📅 Book a call'), to: 'agendar', primary: true },
        { label: bi('🎨 Ver servicios', '🎨 See services'), to: 'servicios' },
        { label: bi('⬅ Menú principal', '⬅ Main menu'), to: 'root' }
      ]
    },

    proceso: {
      bubbles: [
        bi('Trabajo en <span class="ba-msg-strong">tres pasos</span>, en unas <span class="ba-msg-strong">dos semanas</span>:', 'I work in <span class="ba-msg-strong">three steps</span>, over about <span class="ba-msg-strong">two weeks</span>:'),
        bi(
          '<ul>' +
            '<li><span class="ba-msg-strong">Día 1–3 · Entiendo tu negocio</span> — una llamada de 45 minutos para entender a tus clientes y objetivos.</li>' +
            '<li><span class="ba-msg-strong">Día 4–11 · Construyo la solución</span> — diseño en Figma y desarrollo en Framer o código a medida. Ves el avance en tiempo real.</li>' +
            '<li><span class="ba-msg-strong">Día 11–14 · Tu sitio sale al mundo</span> — revisamos juntos, ajustamos detalles y publicamos.</li>' +
          '</ul>',
          '<ul>' +
            '<li><span class="ba-msg-strong">Day 1–3 · I learn your business</span> — a 45-minute call to understand your clients and goals.</li>' +
            '<li><span class="ba-msg-strong">Day 4–11 · I build the solution</span> — Figma design and development in Framer or custom code. You see progress in real time.</li>' +
            '<li><span class="ba-msg-strong">Day 11–14 · Your site goes live</span> — we review together, fine-tune details and publish.</li>' +
          '</ul>'
        )
      ],
      options: [
        { label: bi('📅 Agendar una llamada', '📅 Book a call'), to: 'agendar', primary: true },
        { label: bi('⬅ Menú principal', '⬅ Main menu'), to: 'root' }
      ]
    },

    sobre: {
      bubbles: [
        bi(
          'Soy Bautista, diseñador UX/UI y desarrollador web, especialista en flujos con IA. Trabajo con pymes y profesionales que pierden clientes por una web confusa, lenta o desactualizada — no hago sitios bonitos, hago sitios que funcionan.',
          "I'm Bautista, a UX/UI designer and web developer specialized in AI workflows. I work with SMBs and professionals losing clients to a confusing, slow or outdated site — I don't make pretty sites, I make sites that work."
        ),
        bi('Con base en Buenos Aires, Argentina 🇦🇷', 'Based in Buenos Aires, Argentina 🇦🇷')
      ],
      options: [
        { label: bi('📅 Agendar una llamada', '📅 Book a call'), to: 'agendar', primary: true },
        { label: bi('💼 Ver LinkedIn', '💼 See LinkedIn'), to: 'contacto-li' },
        { label: bi('⬅ Menú principal', '⬅ Main menu'), to: 'root' }
      ]
    },

    agendar: {
      bubbles: [bi(
        'Puedo ayudarte a reservar una <span class="ba-msg-strong">llamada de 45 minutos</span> directo en mi calendario. ¿Cómo preferís seguir?',
        'I can help you book a <span class="ba-msg-strong">45-minute call</span> directly on my calendar. How would you like to continue?'
      )],
      options: [
        { label: bi('📆 Elegir día y hora', '📆 Pick a day & time'), to: 'agendar-calendly', primary: true },
        { label: bi('✍️ Prefiero dejar mis datos', '✍️ I\'d rather leave my info'), to: 'agendar-form' },
        { label: bi('⬅ Menú principal', '⬅ Main menu'), to: 'root' }
      ]
    },
    'agendar-calendly': {
      bubbles: [bi(
        'Abriendo mi calendario para que elijas el día y horario que prefieras. Al confirmar, me llega la reunión directo por correo. 📬',
        'Opening my calendar so you can pick your preferred day and time. Once confirmed, I get the meeting straight to my email. 📬'
      )],
      onEnter: function () { openCalendly(); },
      options: [
        { label: bi('✍️ Prefiero dejar mis datos', "✍️ I'd rather leave my info"), to: 'agendar-form' },
        { label: bi('⬅ Menú principal', '⬅ Main menu'), to: 'root' }
      ]
    },
    'agendar-form': {
      bubbles: [bi(
        'Dejame tu nombre, email y un mensaje breve — se lo hago llegar a Bautista por correo:',
        "Leave me your name, email and a short message — I'll get it to Bautista by email:"
      )],
      options: [],
      onEnter: function () { showContactForm(); }
    },
    'agendar-form-sent': {
      bubbles: [
        bi('¡Listo! Tu mensaje llegó directo a mi correo. Te respondo en menos de 24 horas. 📨', 'All set! Your message went straight to my inbox. I\'ll reply within 24 hours. 📨')
      ],
      options: [
        { label: bi('⬅ Menú principal', '⬅ Main menu'), to: 'root' }
      ]
    },
    'agendar-form-error': {
      bubbles: [
        bi('No pude enviarlo automáticamente, pero se abrió tu cliente de correo con el mensaje listo — solo tenés que darle enviar. Si tampoco se abrió, escribinos directo a <strong>' + EMAIL + '</strong>.', "I couldn't send it automatically, but your email client opened with the message ready — just hit send. If that didn't open either, write to us directly at <strong>" + EMAIL + '</strong>.')
      ],
      options: [
        { label: bi('⬅ Menú principal', '⬅ Main menu'), to: 'root' }
      ]
    },

    contacto: {
      bubbles: [bi('Podés escribirle directo a Bautista por:', 'You can reach Bautista directly via:')],
      options: [
        { label: bi('🟢 WhatsApp', '🟢 WhatsApp'), to: 'contacto-wa', primary: true },
        { label: bi('✉️ Email', '✉️ Email'), to: 'contacto-email' },
        { label: bi('💼 LinkedIn', '💼 LinkedIn'), to: 'contacto-li' },
        { label: bi('⬅ Menú principal', '⬅ Main menu'), to: 'root' }
      ]
    },
    'contacto-wa': {
      bubbles: [bi('Se abrió WhatsApp en una pestaña nueva 🟢', 'WhatsApp opened in a new tab 🟢')],
      onEnter: function () { window.open(WHATSAPP_URL, '_blank', 'noopener'); },
      options: 'contactoFollow'
    },
    'contacto-email': {
      bubbles: [bi('Se abrió tu cliente de correo, listo para escribirle a Bautista ✉️', 'Your email client opened, ready to write to Bautista ✉️')],
      onEnter: function () { window.location.href = 'mailto:' + EMAIL; },
      options: 'contactoFollow'
    },
    'contacto-li': {
      bubbles: [bi('Se abrió el LinkedIn de Bautista en una pestaña nueva 💼', "Bautista's LinkedIn opened in a new tab 💼")],
      onEnter: function () { window.open(LINKEDIN_URL, '_blank', 'noopener'); },
      options: 'contactoFollow'
    }
  };

  var SHARED_OPTIONS = {
    svcFollow: [
      { label: bi('📅 Agendar sobre esto', '📅 Book about this'), to: 'agendar', primary: true },
      { label: bi('🎨 Ver otro servicio', '🎨 See another service'), to: 'servicios' },
      { label: bi('⬅ Menú principal', '⬅ Main menu'), to: 'root' }
    ],
    contactoFollow: [
      { label: bi('📅 Agendar una llamada', '📅 Book a call'), to: 'agendar', primary: true },
      { label: bi('⬅ Menú principal', '⬅ Main menu'), to: 'root' }
    ]
  };

  // Resolve string option-set references to arrays
  Object.keys(SCREENS).forEach(function (k) {
    if (typeof SCREENS[k].options === 'string') {
      SCREENS[k].options = SHARED_OPTIONS[SCREENS[k].options];
    }
  });

  // ---- DOM build ----------------------------------------------------------
  // Appended as a sibling of the site's <x-dc> app root (not inside it) so the
  // site's own re-render/diffing never touches or wipes the widget.
  var wrap = document.createElement('div');
  wrap.id = 'ba-chat';
  wrap.innerHTML =
    '<div id="ba-chat-teaser" class="ba-chat-hidden">' +
      '<button type="button" id="ba-chat-teaser-close" aria-label="Cerrar">✕</button>' +
      bi('¿Tenés dudas sobre tu proyecto? Preguntame 👋', 'Have questions about your project? Ask me 👋') +
    '</div>' +
    '<div id="ba-chat-panel" role="dialog" aria-label="Chat">' +
      '<div id="ba-chat-header">' +
        '<img src="uploads/LOGOBA4.png" alt="">' +
        '<div>' +
          '<p class="ba-chat-title">BautistAI</p>' +
          '<p class="ba-chat-status"><i></i>' + bi('Asistente virtual', 'Virtual assistant') + '</p>' +
        '</div>' +
        '<div id="ba-chat-header-actions">' +
          '<button type="button" id="ba-chat-restart" title="Reiniciar" aria-label="Reiniciar">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7"></path><path d="M21 3v6h-6"></path></svg>' +
          '</button>' +
          '<button type="button" id="ba-chat-close" title="Cerrar" aria-label="Cerrar">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="M6 6l12 12"></path></svg>' +
          '</button>' +
        '</div>' +
      '</div>' +
      '<div id="ba-chat-messages"></div>' +
      '<div id="ba-chat-options"></div>' +
      '<form id="ba-chat-form" novalidate>' +
        '<div class="ba-chat-field"><label for="ba-chat-name">' + bi('Nombre', 'Name') + '</label><input id="ba-chat-name" type="text" autocomplete="name" required></div>' +
        '<div class="ba-chat-field"><label for="ba-chat-email">Email</label><input id="ba-chat-email" type="email" autocomplete="email" required></div>' +
        '<div class="ba-chat-field"><label for="ba-chat-message">' + bi('Mensaje', 'Message') + '</label><textarea id="ba-chat-message" rows="3" required></textarea></div>' +
        '<p id="ba-chat-form-error">' + bi('Completá tu nombre, un email válido y un mensaje.', 'Please fill in your name, a valid email and a message.') + '</p>' +
        '<div class="ba-chat-form-actions">' +
          '<button type="button" id="ba-chat-form-cancel" class="ba-chat-opt">' + bi('Cancelar', 'Cancel') + '</button>' +
          '<button type="submit" id="ba-chat-form-submit" class="ba-chat-opt ba-chat-opt-primary">' + bi('Enviar', 'Send') + '</button>' +
        '</div>' +
      '</form>' +
      '<footer id="ba-chat-footer"><p>' + bi('Respuesta en menos de 24 horas.', 'Reply within 24 hours.') + '</p></footer>' +
    '</div>' +
    '<button type="button" id="ba-chat-toggle" aria-label="Abrir chat" aria-expanded="false">' +
      '<svg class="ba-chat-icon-open" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>' +
      '<svg class="ba-chat-icon-close" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="M6 6l12 12"></path></svg>' +
    '</button>';
  document.body.appendChild(wrap);

  // The site's framework replaces the [data-lang] node on re-render (e.g. on
  // every toggle), which would orphan a MutationObserver bound to one node
  // instance. Re-querying on a light interval is what actually stays in sync.
  function syncLang() {
    var site = document.querySelector('[data-lang]');
    var val = site && site.getAttribute('data-lang');
    var next = val === 'en' ? 'en' : 'es';
    if (wrap.getAttribute('data-lang') !== next) wrap.setAttribute('data-lang', next);
  }
  syncLang();
  setInterval(syncLang, 400);

  var messagesEl = wrap.querySelector('#ba-chat-messages');
  var optionsEl = wrap.querySelector('#ba-chat-options');
  var formEl = wrap.querySelector('#ba-chat-form');
  var nameInput = wrap.querySelector('#ba-chat-name');
  var emailInput = wrap.querySelector('#ba-chat-email');
  var msgInput = wrap.querySelector('#ba-chat-message');
  var formError = wrap.querySelector('#ba-chat-form-error');
  var teaser = wrap.querySelector('#ba-chat-teaser');

  var state = { current: null, started: false };

  function appendBotMsg(html) {
    var el = document.createElement('div');
    el.className = 'ba-msg ba-msg-bot';
    el.innerHTML = html;
    messagesEl.appendChild(el);
    scrollBottom();
  }
  function appendUserMsg(html) {
    var el = document.createElement('div');
    el.className = 'ba-msg ba-msg-user';
    el.innerHTML = html;
    messagesEl.appendChild(el);
    scrollBottom();
  }
  function scrollBottom() {
    requestAnimationFrame(function () { messagesEl.scrollTop = messagesEl.scrollHeight; });
  }
  function showTyping() {
    var el = document.createElement('div');
    el.className = 'ba-typing';
    el.id = 'ba-chat-typing';
    el.innerHTML = '<span></span><span></span><span></span>';
    messagesEl.appendChild(el);
    scrollBottom();
  }
  function hideTyping() {
    var el = document.getElementById('ba-chat-typing');
    if (el) el.remove();
  }
  function clearOptions() { optionsEl.innerHTML = ''; }
  function hideForm() { formEl.classList.remove('ba-chat-form-open'); formError.style.display = 'none'; }

  function renderOptions(options) {
    clearOptions();
    (options || []).forEach(function (opt) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ba-chat-opt' + (opt.primary ? ' ba-chat-opt-primary' : '');
      btn.innerHTML = opt.label;
      btn.addEventListener('click', function () {
        var picked = isEN() ? extractLang(opt.label, 'en') : extractLang(opt.label, 'es');
        clearOptions();
        goTo(opt.to, picked);
      });
      optionsEl.appendChild(btn);
    });
  }

  function extractLang(html, lang) {
    var tmp = document.createElement('div');
    tmp.innerHTML = html;
    var span = tmp.querySelector('.lang-' + lang);
    return span ? span.innerHTML : html;
  }

  function goTo(id, userLabelHtml) {
    if (userLabelHtml) appendUserMsg(userLabelHtml);
    hideForm();
    showTyping();
    setTimeout(function () {
      hideTyping();
      var node = SCREENS[id];
      if (!node) return;
      node.bubbles.forEach(appendBotMsg);
      if (node.options && node.options.length) {
        renderOptions(node.options);
      } else {
        clearOptions();
      }
      state.current = id;
      if (node.onEnter) node.onEnter();
      scrollBottom();
    }, TYPING_DELAY);
  }

  // ---- Contact form fallback ----------------------------------------------
  function showContactForm() {
    clearOptions();
    formEl.classList.add('ba-chat-form-open');
    nameInput.value = '';
    emailInput.value = '';
    msgInput.value = '';
    formError.style.display = 'none';
    setTimeout(function () { nameInput.focus(); }, 100);
  }

  formEl.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = nameInput.value.trim();
    var email = emailInput.value.trim();
    var message = msgInput.value.trim();
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!name || !emailOk || !message) {
      formError.style.display = 'block';
      return;
    }
    formError.style.display = 'none';
    var submitBtn = wrap.querySelector('#ba-chat-form-submit');
    submitBtn.disabled = true;

    fetch('https://formsubmit.co/ajax/' + EMAIL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ _subject: 'Consulta desde el chatbot – ' + name, Nombre: name, Correo: email, Mensaje: message })
    }).then(function (r) { return r.json(); }).then(function (res) {
      submitBtn.disabled = false;
      if (res && (res.success === 'true' || res.success === true)) {
        hideForm();
        goTo('agendar-form-sent');
      } else {
        throw new Error('send failed');
      }
    }).catch(function () {
      submitBtn.disabled = false;
      var subject = 'Consulta desde el chatbot – ' + name;
      var body = 'Nombre: ' + name + '\nEmail: ' + email + '\n\nMensaje:\n' + message;
      window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      hideForm();
      goTo('agendar-form-error');
    });
  });

  wrap.querySelector('#ba-chat-form-cancel').addEventListener('click', function () {
    goTo('agendar');
  });

  // ---- Calendly (lazy-loaded) ---------------------------------------------
  var calendlyReady = false;
  function ensureCalendlyAssets(cb) {
    if (calendlyReady && window.Calendly) { cb(); return; }
    if (!document.getElementById('ba-calendly-css')) {
      var link = document.createElement('link');
      link.id = 'ba-calendly-css';
      link.rel = 'stylesheet';
      link.href = 'https://assets.calendly.com/assets/external/widget.css';
      document.head.appendChild(link);
    }
    var existing = document.getElementById('ba-calendly-js');
    if (existing) {
      existing.addEventListener('load', function () { calendlyReady = true; cb(); });
      return;
    }
    var script = document.createElement('script');
    script.id = 'ba-calendly-js';
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.onload = function () { calendlyReady = true; cb(); };
    document.head.appendChild(script);
  }
  function openCalendly() {
    ensureCalendlyAssets(function () {
      if (window.Calendly) window.Calendly.initPopupWidget({ url: CALENDLY_URL });
    });
  }

  // ---- Toggle / teaser -----------------------------------------------------
  var toggleBtn = wrap.querySelector('#ba-chat-toggle');
  var closeBtn = wrap.querySelector('#ba-chat-close');
  var restartBtn = wrap.querySelector('#ba-chat-restart');
  var teaserClose = wrap.querySelector('#ba-chat-teaser-close');

  function openChat() {
    wrap.classList.add('ba-chat-open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    dismissTeaser();
    if (!state.started) { state.started = true; goTo('root'); }
  }
  function closeChat() {
    wrap.classList.remove('ba-chat-open');
    toggleBtn.setAttribute('aria-expanded', 'false');
  }
  function dismissTeaser() {
    teaser.classList.add('ba-chat-hidden');
    try { localStorage.setItem('baChatTeaserSeen', '1'); } catch (e) {}
  }

  toggleBtn.addEventListener('click', function () {
    if (wrap.classList.contains('ba-chat-open')) closeChat(); else openChat();
  });
  closeBtn.addEventListener('click', closeChat);
  restartBtn.addEventListener('click', function () {
    messagesEl.innerHTML = '';
    hideForm();
    goTo('root');
  });
  teaserClose.addEventListener('click', function (e) {
    e.stopPropagation();
    dismissTeaser();
  });
  teaser.addEventListener('click', openChat);

  var seen = false;
  try { seen = localStorage.getItem('baChatTeaserSeen') === '1'; } catch (e) {}
  if (!seen) {
    setTimeout(function () {
      if (!wrap.classList.contains('ba-chat-open')) teaser.classList.remove('ba-chat-hidden');
    }, 4000);
  }
})();
