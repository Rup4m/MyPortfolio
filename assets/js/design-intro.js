/* ==========================================================================
   design-intro.js — the cinematic transitions into the design section and
   the code section (every [data-dintro] on the page).
   While the stage is pinned: paint strokes burst outward, "What I | design"
   splits apart, and a small framed design reel zooms to fill the screen.
   Everything is driven by scroll progress (scrubbed, reversible).
   ========================================================================== */
(function () {
  'use strict';

  var RD = window.RD;

  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function num(el, prop) { return parseFloat(getComputedStyle(el).getPropertyValue(prop)) || 0; }

  RD.designIntro = {
    init: function () {
      RD.qsa('[data-dintro]').forEach(setup);
    }
  };

  function setup(el) {

      var frame = RD.qs('[data-dintro-frame]', el);
      var img = RD.qs('[data-dintro-img]', el);
      var veil = RD.qs('[data-dintro-veil]', el);
      var caption = RD.qs('[data-dintro-caption]', el);
      var left = RD.qs('[data-dintro-left]', el);
      var right = RD.qs('[data-dintro-right]', el);
      var hint = RD.qs('[data-dintro-hint]', el);
      var strokes = RD.qsa('.dintro__stroke', el).map(function (s) {
        return { el: s, x: num(s, '--x'), y: num(s, '--y'), r: num(s, '--r'), dx: num(s, '--dx'), dy: num(s, '--dy') };
      });

      // Strokes "paint" themselves in when the stage first appears
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
          if (entries[0].isIntersecting) { el.classList.add('is-inview'); io.disconnect(); }
        }, { threshold: 0.05 });
        io.observe(el);
      } else {
        el.classList.add('is-inview');
      }

      var last = -1;
      function update() {
        var r = el.getBoundingClientRect();
        var vh = window.innerHeight;
        var vw = window.innerWidth;
        if (r.bottom < 0 || r.top > vh) return;
        var range = r.height - vh;
        var p = range > 0 ? RD.clamp(-r.top / range, 0, 1) : 0;
        if (Math.abs(p - last) < 0.0004) return;
        last = p;

        var e = ease(RD.clamp((p - 0.06) / 0.62, 0, 1));
        var portrait = vw < vh;
        var insetY = (portrait ? 30 : 29) * (1 - e);
        var insetX = (portrait ? 12 : 33) * (1 - e);
        frame.style.clipPath = 'inset(' + insetY.toFixed(2) + '% ' + insetX.toFixed(2) + '% round ' + (28 * (1 - e)).toFixed(1) + 'px)';
        img.style.transform = 'translate3d(0,' + (-p * 9).toFixed(2) + '%,0) scale(' + (1.32 - 0.32 * e).toFixed(3) + ')';

        left.style.transform = 'translate3d(' + (-e * 62).toFixed(2) + 'vw,0,0)';
        right.style.transform = 'translate3d(' + (e * 62).toFixed(2) + 'vw,0,0)';

        var s = ease(RD.clamp(p / 0.5, 0, 1));
        for (var i = 0; i < strokes.length; i++) {
          var d = strokes[i];
          d.el.style.transform = 'translate(-50%,-50%) translate(' + (d.x + d.dx * s).toFixed(2) + 'vw,' + (d.y + d.dy * s).toFixed(2) + 'vh) rotate(' + (d.r * (1 + s * 2)).toFixed(2) + 'deg)';
          d.el.style.opacity = (1 - s).toFixed(3);
        }

        veil.style.opacity = RD.clamp((e - 0.55) / 0.45, 0, 1).toFixed(3);
        var c = RD.clamp((p - 0.7) / 0.16, 0, 1);
        caption.style.opacity = c.toFixed(3);
        caption.style.transform = 'translate3d(0,' + ((1 - c) * 30).toFixed(1) + 'px,0)';
        hint.style.opacity = (1 - RD.clamp(p / 0.12, 0, 1)).toFixed(3);
      }

      RD.ticker.add(update);
      RD.onResize(function () { last = -1; });
  }
})();
