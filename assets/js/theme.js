/* ==========================================================================
   theme.js — light / dark mode switch (header + mobile menu).
   The choice is remembered on this device. The class is applied in <head>
   before the page paints, so there is no flash of the wrong theme.
   ========================================================================== */
(function () {
  'use strict';

  var RD = window.RD;
  var KEY = 'rd-theme';

  RD.theme = {
    init: function () {
      var root = document.documentElement;
      var toggles = RD.qsa('[data-theme-toggle]');
      var meta = document.querySelector('meta[name="theme-color"]');

      function sync() {
        var dark = root.classList.contains('theme-dark');
        toggles.forEach(function (t) {
          t.setAttribute('aria-pressed', String(dark));
          t.setAttribute('title', dark ? 'Switch to light mode' : 'Switch to dark mode');
          var label = RD.qs('[data-theme-label]', t);
          if (label) label.textContent = dark ? 'Light mode' : 'Dark mode';
        });
        if (meta) meta.setAttribute('content', dark ? '#111214' : '#f4f3ef');
      }

      toggles.forEach(function (t) {
        t.addEventListener('click', function () {
          var dark = !root.classList.contains('theme-dark');
          // smooth colour cross-fade only while switching
          root.classList.add('theme-switching');
          root.classList.toggle('theme-dark', dark);
          try { localStorage.setItem(KEY, dark ? 'dark' : 'light'); } catch (e) {}
          sync();
          setTimeout(function () { root.classList.remove('theme-switching'); }, 650);
        });
      });

      sync();
    }
  };
})();
