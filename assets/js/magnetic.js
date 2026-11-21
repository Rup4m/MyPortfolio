/* ==========================================================================
   magnetic.js — [data-magnetic] elements lean toward the cursor.
   An optional child [data-magnetic-inner] moves a little further for depth.
   ========================================================================== */
(function () {
  'use strict';

  var RD = window.RD;
  var STRENGTH = 0.35;
  var INNER = 0.18;

  RD.magnetic = {
    init: function () {
      if (!RD.finePointer || RD.reducedMotion) return;

      RD.qsa('[data-magnetic]').forEach(function (el) {
        var inner = RD.qs('[data-magnetic-inner]', el);

        el.addEventListener('mousemove', function (e) {
          var r = el.getBoundingClientRect();
          var x = e.clientX - (r.left + r.width / 2);
          var y = e.clientY - (r.top + r.height / 2);
          el.style.transition = 'transform 0.25s cubic-bezier(0.33, 1, 0.68, 1)';
          el.style.transform = 'translate3d(' + (x * STRENGTH).toFixed(1) + 'px,' + (y * STRENGTH).toFixed(1) + 'px,0)';
          if (inner) {
            inner.style.transition = el.style.transition;
            inner.style.transform = 'translate3d(' + (x * INNER).toFixed(1) + 'px,' + (y * INNER).toFixed(1) + 'px,0)';
          }
        });

        el.addEventListener('mouseleave', function () {
          el.style.transition = 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)';
          el.style.transform = '';
          if (inner) {
            inner.style.transition = el.style.transition;
            inner.style.transform = '';
          }
        });
      });
    }
  };
})();
