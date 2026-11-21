/* ==========================================================================
   dev-cards.js — development project interactions:
   - 3D tilt of the browser mockup following the cursor
   - on hover the full-page screenshot scrolls inside the browser frame
   bind(root) can be called again for cards rendered later.
   ========================================================================== */
(function () {
  'use strict';

  var RD = window.RD;
  var MAX_TILT = 5; // degrees

  function bindOne(link) {
    if (link.__rdBound) return;
    link.__rdBound = true;
    var browser = RD.qs('.browser', link);
    var screen = RD.qs('.browser__screen', link);
    var shot = RD.qs('.browser__shot', link);

    function setShift() {
      if (!screen || !shot) return;
      var shift = Math.max(0, shot.offsetHeight - screen.offsetHeight);
      link.style.setProperty('--shift', -shift + 'px');
    }
    link.addEventListener('mouseenter', setShift);
    link.addEventListener('focus', setShift);

    if (!RD.finePointer || RD.reducedMotion || !browser) return;

    link.addEventListener('mousemove', function (e) {
      var r = link.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      browser.style.transform = 'rotateX(' + (-y * MAX_TILT).toFixed(2) + 'deg) rotateY(' + (x * MAX_TILT).toFixed(2) + 'deg) translateZ(0)';
    });
    link.addEventListener('mouseleave', function () { browser.style.transform = ''; });
  }

  RD.devCards = {
    bind: function (root) { RD.qsa('[data-tilt]', root).forEach(bindOne); },
    init: function () { this.bind(document); }
  };
})();
