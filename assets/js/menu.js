/* ==========================================================================
   menu.js — slide-in navigation panel
   ========================================================================== */
(function () {
  'use strict';

  var RD = window.RD;

  RD.menu = {
    init: function () {
      var btn = RD.qs('[data-menu-toggle]');
      var menu = RD.qs('[data-menu]');
      if (!btn || !menu) return;
      var root = document.documentElement;
      var isOpen = false;

      function open() {
        isOpen = true;
        root.classList.add('menu-open');
        menu.setAttribute('aria-hidden', 'false');
        btn.setAttribute('aria-expanded', 'true');
        btn.setAttribute('aria-label', 'Close menu');
        RD.scroll.lock();
        var first = RD.qs('[data-menu-link]', menu);
        if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 350);
      }

      function close(returnFocus) {
        if (!isOpen) return;
        isOpen = false;
        root.classList.remove('menu-open');
        menu.setAttribute('aria-hidden', 'true');
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-label', 'Open menu');
        RD.scroll.unlock();
        if (returnFocus) btn.focus({ preventScroll: true });
      }

      btn.addEventListener('click', function () { if (isOpen) close(true); else open(); });
      RD.qsa('[data-menu-close]', menu).forEach(function (el) {
        el.addEventListener('click', function () { close(true); });
      });
      // Close first, then let the smooth-scroll anchor handler take over
      RD.qsa('[data-menu-link]', menu).forEach(function (link) {
        link.addEventListener('click', function () { close(false); });
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && isOpen) close(true);
      });
    }
  };
})();
