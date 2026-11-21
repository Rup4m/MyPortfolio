/* ==========================================================================
   main.js — boots every module. Each module is isolated in try/catch so one
   failure can never break the rest of the site. Modules that don't exist on
   a page (e.g. the hero on works.html) simply skip themselves.
   ========================================================================== */
(function () {
  'use strict';

  var RD = window.RD;

  function boot() {
    [
      'works',          // renders All Works cards first (works.html only)
      'split',          // creates word spans before reveal/effects
      'scroll',
      'reveal',
      'effects',
      'designIntro',
      'heroCanvas',
      'cursor',
      'magnetic',
      'menu',
      'lightbox',
      'devCards',
      'codeTyper',
      'contact',
      'theme',
      'clock',
      'pageTransition',
      'preloader'       // last: locks scroll, then reveals the hero
    ].forEach(function (name) {
      try {
        if (RD[name] && RD[name].init) RD[name].init();
      } catch (err) {
        console.error('[RD] ' + name + ' failed:', err);
        if (name === 'preloader') document.documentElement.classList.add('is-loaded');
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
