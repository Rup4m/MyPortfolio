/* ==========================================================================
   page-transition.js — a curtain slides up between pages (Home ⇄ All works)
   so moving around feels like one continuous experience.
   ========================================================================== */
(function () {
  'use strict';

  var RD = window.RD;

  function pageName(url) {
    if (/works\.html$/.test(url.pathname)) {
      var map = { '#design': 'Graphic design', '#ui': 'UI design', '#code': 'Coding' };
      return map[url.hash] || 'All works';
    }
    return 'Rupam Debnath';
  }

  RD.pageTransition = {
    init: function () {
      var root = document.documentElement;
      var curtain = RD.qs('[data-curtain]');
      if (!curtain) return;
      var label = RD.qs('[data-curtain-label]', curtain);

      // Arriving from another page: lift the curtain
      if (root.classList.contains('is-entering')) {
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            root.classList.add('is-entered');
            setTimeout(function () { root.classList.remove('is-entering', 'is-entered'); }, 1300);
          });
        });
      }

      // Leaving to another page of the site: drop the curtain first
      document.addEventListener('click', function (e) {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        var a = e.target.closest && e.target.closest('a[href]');
        if (!a || a.hasAttribute('download')) return;
        if (a.target && a.target !== '_self') return;
        var url;
        try { url = new URL(a.getAttribute('href'), location.href); } catch (err) { return; }
        if (url.origin !== location.origin) return;
        if (url.pathname === location.pathname) return;               // same page: just a hash
        if (!/(\.html?|\/)$/.test(url.pathname)) return;               // only pages, not files

        e.preventDefault();
        label.textContent = pageName(url);
        try { sessionStorage.setItem('rd-nav', '1'); } catch (err) {}
        root.classList.add('is-leaving');
        setTimeout(function () { location.href = url.href; }, RD.reducedMotion ? 0 : 750);
      });

      // Coming back with the browser's back button (page restored from cache)
      window.addEventListener('pageshow', function (e) {
        if (e.persisted) root.classList.remove('is-leaving');
      });
    }
  };
})();
