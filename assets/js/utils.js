/* ==========================================================================
   utils.js — shared helpers + one requestAnimationFrame ticker for the site
   Everything hangs off a single global namespace: window.RD
   ========================================================================== */
(function () {
  'use strict';

  var RD = (window.RD = window.RD || {});

  RD.lerp = function (a, b, t) { return a + (b - a) * t; };
  RD.clamp = function (v, min, max) { return Math.min(max, Math.max(min, v)); };
  RD.qs = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  RD.qsa = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  RD.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  RD.finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* Frame-rate independent damping: returns the lerp factor for this frame */
  RD.damp = function (factor, dt) { return 1 - Math.pow(1 - factor, dt); };

  /* Single shared RAF loop. Callbacks receive (dt, time); dt = 1 at 60fps. */
  var subscribers = [];
  var last = performance.now();
  RD.ticker = {
    add: function (fn) { if (subscribers.indexOf(fn) === -1) subscribers.push(fn); },
    remove: function (fn) {
      var i = subscribers.indexOf(fn);
      if (i > -1) subscribers.splice(i, 1);
    }
  };
  function loop(now) {
    var dt = Math.min(64, now - last) / 16.667;
    last = now;
    for (var i = 0; i < subscribers.length; i++) {
      try { subscribers[i](dt, now); } catch (e) { console.error(e); }
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  /* Debounced resize helper */
  RD.onResize = function (fn) {
    var t;
    window.addEventListener('resize', function () {
      clearTimeout(t);
      t = setTimeout(fn, 120);
    });
  };
})();
