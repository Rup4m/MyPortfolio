/* ==========================================================================
   preloader.js — greeting words + counter, then a curved curtain lifts and
   the hero animates in. Shorter on repeat visits in the same session.
   ========================================================================== */
(function () {
  'use strict';

  var RD = window.RD;
  var WORDS = ['নমস্কার', 'Hello', 'Design', 'Develop', 'Rupam ✦'];

  RD.preloader = {
    init: function () {
      var root = document.documentElement;
      var el = RD.qs('[data-preloader]');
      // No preloader, or arriving from another page (the curtain covers it)
      if (!el || root.classList.contains('is-entering')) {
        if (el) el.remove();
        root.classList.add('is-loaded');
        if (location.hash.length > 1) {
          var t = document.getElementById(location.hash.slice(1));
          if (t) setTimeout(function () { RD.scroll.scrollTo(t, { immediate: true }); }, 60);
        }
        return;
      }

      var word = RD.qs('[data-preloader-word]', el);
      var count = RD.qs('[data-preloader-count]', el);
      var bar = RD.qs('[data-preloader-bar]', el);

      var seen = false;
      try { seen = sessionStorage.getItem('rd-visited') === '1'; sessionStorage.setItem('rd-visited', '1'); } catch (e) {}

      var duration = RD.reducedMotion ? 300 : seen ? 900 : 2400;
      var start = performance.now();
      var loaded = document.readyState === 'complete';
      window.addEventListener('load', function () { loaded = true; });

      if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
      RD.scroll.lock();

      var wordIndex = 0;
      var wordTimer = setInterval(function () {
        wordIndex = Math.min(wordIndex + 1, WORDS.length - 1);
        word.textContent = WORDS[wordIndex];
      }, Math.max(120, duration / WORDS.length));

      function step(now) {
        var p = Math.min(1, (now - start) / duration);
        if (!loaded) p = Math.min(p, 0.9); // wait for images/fonts
        var eased = 1 - Math.pow(1 - p, 3);
        count.textContent = Math.round(eased * 100);
        bar.style.setProperty('--progress', eased.toFixed(3));
        if (p < 1) { requestAnimationFrame(step); return; }
        finish();
      }

      function finish() {
        clearInterval(wordTimer);
        word.textContent = WORDS[WORDS.length - 1];
        setTimeout(function () {
          root.classList.add('is-loaded');
          RD.scroll.unlock();
          if (location.hash.length > 1) {
            var target = document.getElementById(location.hash.slice(1));
            if (target) RD.scroll.scrollTo(target, { immediate: true });
          }
          setTimeout(function () { el.remove(); }, 1400);
        }, 250);
      }

      // Safety net: never trap the visitor behind the loader
      setTimeout(function () { loaded = true; }, 6000);

      requestAnimationFrame(step);
    }
  };
})();
