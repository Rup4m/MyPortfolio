/* ==========================================================================
   reveal.js — adds .is-inview to elements once they scroll into view.
   Targets: [data-reveal], [data-split] (except scrub), [data-clip-reveal]
   ========================================================================== */
(function () {
  'use strict';

  var RD = window.RD;

  RD.reveal = {
    init: function () {
      var targets = RD.qsa('[data-reveal], [data-split]:not([data-split="scrub"]), [data-clip-reveal]');

      if (!('IntersectionObserver' in window) || RD.reducedMotion) {
        targets.forEach(function (el) { el.classList.add('is-inview'); });
        return;
      }

      // Clip-path-hidden elements are watched through their parent, because a
      // fully clipped element can report as "not intersecting" in some browsers.
      var map = new Map();

      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = map.get(entry.target) || entry.target;
          el.classList.add('is-inview');
          io.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

      targets.forEach(function (el) {
        // Hero items are revealed by the preloader instead
        if (el.closest('[data-hero]')) { el.classList.add('is-inview'); return; }
        var watch = el.hasAttribute('data-clip-reveal') && el.parentElement ? el.parentElement : el;
        map.set(watch, el);
        io.observe(watch);
      });
    }
  };
})();
