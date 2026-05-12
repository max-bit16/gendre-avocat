/* Comportements partagés — Cabinet Céline GENDRE */
(function () {
  'use strict';

  // ---- Menu mobile ----
  document.addEventListener('click', function (e) {
    var toggle = e.target.closest('[data-menu-toggle]');
    if (!toggle) return;
    var nav = document.querySelector('.cds-header__nav');
    if (!nav) return;
    var open = nav.getAttribute('data-open') === 'true';
    nav.setAttribute('data-open', open ? 'false' : 'true');
    toggle.setAttribute('aria-expanded', open ? 'false' : 'true');
    toggle.setAttribute('aria-label', open ? 'Menu' : 'Fermer le menu');
  });

  // ---- Marquer le lien actif ----
  function markActiveNav() {
    var path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.cds-header__nav a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href) return;
      if (href.split('/').pop() === path) a.setAttribute('aria-current', 'page');
    });
  }

  // ---- Scroll reveal ----
  function initReveal() {
    if (!('IntersectionObserver' in window)) return;

    var standalone = [
      '.dom-intro', '.hon-intro', '.hon-aj', '.hon-convention',
      '.home-cta', '.actu-featured', '.bio__grid', '.formation',
      '.valeurs', '.home-approche'
    ];
    var grids = [
      '.home-domains__grid', '.actu-grid', '.dom-grid',
      '.valeurs__grid', '.hon-modes__grid', '.home-stats__grid'
    ];

    standalone.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        el.classList.add('js-reveal');
      });
    });

    grids.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (grid) {
        Array.prototype.slice.call(grid.children).forEach(function (child, i) {
          child.classList.add('js-reveal');
          child.style.transitionDelay = (i * 90) + 'ms';
        });
      });
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.js-reveal').forEach(function (el) { io.observe(el); });
  }

  // ---- Compteurs animés (chiffres clés) ----
  function initCounters() {
    if (!('IntersectionObserver' in window)) return;

    document.querySelectorAll('.stat-cell__num').forEach(function (el) {
      var m = el.textContent.trim().match(/^(\d+)(.*)$/);
      if (!m) return;
      el.dataset.target = m[1];
      el.dataset.sfx    = m[2];
      el.textContent    = '0' + m[2];
    });

    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting || !e.target.dataset.target) return;
        var el  = e.target;
        var end = +el.dataset.target;
        var sfx = el.dataset.sfx || '';
        var t0  = performance.now();
        var dur = 900;
        cio.unobserve(el);
        (function frame(ts) {
          var p    = Math.min((ts - t0) / dur, 1);
          var ease = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(ease * end) + sfx;
          if (p < 1) requestAnimationFrame(frame);
        })(t0);
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-cell__num').forEach(function (el) {
      if (el.dataset.target) cio.observe(el);
    });
  }

  // ---- Formulaire contact (Web3Forms) ----
  // Obtenez votre cle gratuite sur https://web3forms.com
  var W3F_KEY = 'VOTRE_CLE_WEB3FORMS';

  document.addEventListener('submit', function (e) {
    var form = e.target.closest('form[data-cds-form]');
    if (!form) return;
    e.preventDefault();

    var status  = form.querySelector('[data-form-status]');
    var btn     = form.querySelector('[type="submit"]');
    var btnText = btn ? btn.querySelector('.btn-label') : null;
    var ok      = true;

    form.querySelectorAll('input[required], textarea[required]').forEach(function (f) {
      var errId  = f.getAttribute('aria-describedby');
      var errEl  = errId ? document.getElementById(errId) : null;
      if (!f.value.trim()) {
        ok = false;
        f.setAttribute('aria-invalid', 'true');
        f.style.boxShadow = 'inset 0 -2px 0 0 #da1e28';
        if (errEl) errEl.textContent = 'Ce champ est obligatoire.';
      } else {
        f.removeAttribute('aria-invalid');
        f.style.boxShadow = '';
        if (errEl) errEl.textContent = '';
      }
    });

    if (!ok) {
      if (status) {
        status.textContent = 'Veuillez compl\xe9ter les champs obligatoires.';
        status.style.color = '#da1e28';
      }
      return;
    }

    if (btn) btn.disabled = true;
    if (btnText) btnText.textContent = 'Envoi en cours…';

    var data = new FormData(form);
    if (!data.get('access_key')) data.append('access_key', W3F_KEY);

    fetch('https://api.web3forms.com/submit', { method: 'POST', body: data })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (status) {
          if (d.success) {
            status.textContent = 'Message envoy\xe9. Nous vous r\xe9pondrons dans les meilleurs d\xe9lais.';
            status.style.color = '#24a148';
            form.reset();
          } else {
            status.textContent = "Erreur lors de l’envoi. Veuillez r\xe9essayer.";
            status.style.color = '#da1e28';
          }
        }
      })
      .catch(function () {
        if (status) {
          status.textContent = 'Erreur r\xe9seau. V\xe9rifiez votre connexion.';
          status.style.color = '#da1e28';
        }
      })
      .finally(function () {
        if (btn) btn.disabled = false;
        if (btnText) btnText.textContent = 'Envoyer le message';
      });
  });

  document.addEventListener('DOMContentLoaded', function () {
    markActiveNav();
    initReveal();
    initCounters();
  });
})();
