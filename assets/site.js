/* Comportements partagés du site Cabinet Céline GENDRE */
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
  });

  // ---- Marquer le lien actif ----
  function markActiveNav() {
    var path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.cds-header__nav a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href) return;
      var hrefPath = href.split('/').pop();
      if (hrefPath === path) {
        a.setAttribute('aria-current', 'page');
      }
    });
  }
  document.addEventListener('DOMContentLoaded', markActiveNav);

  // ---- Validation de formulaire (page contact) ----
  document.addEventListener('submit', function (e) {
    var form = e.target.closest('form[data-cds-form]');
    if (!form) return;
    e.preventDefault();
    var status = form.querySelector('[data-form-status]');
    var fields = form.querySelectorAll('input[required], textarea[required]');
    var ok = true;
    fields.forEach(function (f) {
      if (!f.value.trim()) {
        ok = false;
        f.setAttribute('aria-invalid', 'true');
        f.style.boxShadow = 'inset 0 -2px 0 0 #da1e28';
      } else {
        f.removeAttribute('aria-invalid');
        f.style.boxShadow = '';
      }
    });
    if (!ok) {
      if (status) {
        status.textContent = 'Veuillez compléter les champs obligatoires.';
        status.style.color = '#da1e28';
      }
      return;
    }
    if (status) {
      status.textContent = 'Message envoyé. Nous vous répondrons dans les meilleurs délais.';
      status.style.color = '#24a148';
    }
    form.reset();
  });
})();
