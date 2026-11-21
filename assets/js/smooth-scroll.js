/* ==========================================================================
   smooth-scroll.js — lightweight inertia scrolling (Lenis-style)
   - Interpolates the real window scroll position, so position: sticky,
     anchors, find-in-page and the scrollbar all keep working.
   - Disabled on touch devices and for prefers-reduced-motion (native scroll).
   ========================================================================== */
(function () {
  'use strict';

  var RD = window.RD;
  var EASE = 0.095;

  var state = {
    current: window.scrollY,
    target: window.scrollY,
    velocity: 0,       // px per frame, smoothed — used by marquees etc.
    direction: 1,
    enabled: false,
    locked: false
  };
  var lastSet = -9999;
  var lastY = window.scrollY;

  function maxScroll() {
    return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }

  function normalizeDelta(e) {
    var d = e.deltaY;
    if (e.deltaMode === 1) d *= 40;                       // lines
    else if (e.deltaMode === 2) d *= window.innerHeight;  // pages
    return d;
  }

  function onWheel(e) {
    if (!state.enabled || e.ctrlKey) return;              // allow pinch-zoom
    if (e.target.closest && e.target.closest('[data-scroll-prevent]')) return;
    e.preventDefault();
    if (state.locked) return;
    state.target = RD.clamp(state.target + normalizeDelta(e), 0, maxScroll());
  }

  function onScroll() {
    // Scroll that did not come from us (keyboard, scrollbar drag, find-in-page)
    if (Math.abs(window.scrollY - lastSet) > 2) {
      state.current = state.target = window.scrollY;
    }
  }

  function tick(dt) {
    if (state.enabled && !state.locked) {
      var diff = state.target - state.current;
      if (Math.abs(diff) > 0.2) {
        state.current += diff * RD.damp(EASE, dt);
        lastSet = state.current;
        window.scrollTo(0, state.current);
      } else if (diff !== 0) {
        state.current = state.target;
        lastSet = state.current;
        window.scrollTo(0, state.current);
      }
    }
    // Velocity from the real scroll position (works for native scroll too)
    var y = window.scrollY;
    var v = (y - lastY) / Math.max(dt, 0.5);
    lastY = y;
    state.velocity = RD.lerp(state.velocity, v, 0.2);
    if (Math.abs(v) > 0.5) state.direction = v > 0 ? 1 : -1;
  }

  function resolveTarget(target, offset) {
    if (typeof target === 'number') return target;
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return null;
    return el.getBoundingClientRect().top + window.scrollY + (offset || 0);
  }

  RD.scroll = {
    state: state,

    init: function () {
      state.enabled = !RD.reducedMotion && RD.finePointer;
      window.addEventListener('wheel', onWheel, { passive: false });
      window.addEventListener('scroll', onScroll, { passive: true });
      RD.onResize(function () { state.target = RD.clamp(state.target, 0, maxScroll()); });
      RD.ticker.add(tick);

      // Smooth in-page anchor links
      document.addEventListener('click', function (e) {
        var link = e.target.closest && e.target.closest('a[href^="#"]');
        if (!link) return;
        var hash = link.getAttribute('href');
        if (hash.length < 2) return;
        var el = document.getElementById(hash.slice(1));
        if (!el) return;
        e.preventDefault();
        RD.scroll.scrollTo(el);
        if (history.pushState) history.pushState(null, '', hash);
        // Move keyboard focus for accessibility, without jumping
        if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
        el.focus({ preventScroll: true });
      });
    },

    scrollTo: function (target, opts) {
      opts = opts || {};
      var y = resolveTarget(target, opts.offset);
      if (y === null) return;
      y = RD.clamp(y, 0, maxScroll());
      if (state.enabled && !opts.immediate) {
        state.target = y;
      } else {
        state.current = state.target = lastSet = y;
        window.scrollTo({ top: y, behavior: opts.immediate || RD.reducedMotion ? 'auto' : 'smooth' });
      }
    },

    lock: function () {
      state.locked = true;
      document.documentElement.classList.add('is-locked');
    },

    unlock: function () {
      state.locked = false;
      state.current = state.target = lastSet = window.scrollY;
      document.documentElement.classList.remove('is-locked');
    }
  };
})();
