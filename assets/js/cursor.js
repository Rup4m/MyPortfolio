/* ==========================================================================
   cursor.js — custom cursor (mouse/trackpad only).
   [data-cursor="Label"] shows a big labelled bubble; links and buttons grow it.
   ========================================================================== */
(function () {
  'use strict';

  var RD = window.RD;

  RD.cursor = {
    init: function () {
      var root = RD.qs('[data-cursor-root]');
      if (!root || !RD.finePointer) return;
      document.documentElement.classList.add('has-cursor');

      var dot = RD.qs('.cursor__dot', root);
      var ring = RD.qs('.cursor__ring', root);
      var label = RD.qs('[data-cursor-label]', root);
      var pos = { x: -100, y: -100 };
      var ringPos = { x: -100, y: -100 };

      window.addEventListener('mousemove', function (e) {
        pos.x = e.clientX;
        pos.y = e.clientY;
        root.classList.remove('is-hidden');
      }, { passive: true });

      document.addEventListener('mouseleave', function () { root.classList.add('is-hidden'); });

      document.addEventListener('mouseover', function (e) {
        var t = e.target;
        if (!t.closest) return;
        var labelled = t.closest('[data-cursor]');
        var interactive = t.closest('a, button, [role="button"], input, textarea, select, label');
        if (labelled) {
          label.textContent = labelled.getAttribute('data-cursor');
          root.classList.add('is-label');
          root.classList.remove('is-hover');
        } else {
          root.classList.remove('is-label');
          root.classList.toggle('is-hover', !!interactive);
        }
      });

      RD.ticker.add(function (dt) {
        ringPos.x = RD.lerp(ringPos.x, pos.x, RD.damp(0.2, dt));
        ringPos.y = RD.lerp(ringPos.y, pos.y, RD.damp(0.2, dt));
        dot.style.transform = 'translate3d(' + pos.x + 'px,' + pos.y + 'px,0)';
        ring.style.transform = 'translate3d(' + ringPos.x.toFixed(1) + 'px,' + ringPos.y.toFixed(1) + 'px,0)';
      });
    }
  };
})();
