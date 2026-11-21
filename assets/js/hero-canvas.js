/* ==========================================================================
   hero-canvas.js — animated background behind the portrait:
   soft "paint" colour fields (from the brush strokes in the photo) that drift
   and follow the mouse, plus a flowing line mesh echoing the code side.
   Pauses automatically when the hero is off-screen.
   ========================================================================== */
(function () {
  'use strict';

  var RD = window.RD;

  var COLORS = [
    [244, 180, 0],   // yellow
    [232, 72, 59],   // red
    [20, 163, 154],  // teal
    [242, 160, 160], // pink
    [56, 182, 201],  // cyan
    [27, 35, 80]     // navy
  ];

  RD.heroCanvas = {
    init: function () {
      var canvas = RD.qs('[data-hero-canvas]');
      if (!canvas || !canvas.getContext) return;
      var ctx = canvas.getContext('2d');
      var hero = canvas.parentElement;
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      var w = 0, h = 0;
      var visible = true;
      var mouse = { x: 0.5, y: 0.5, sx: 0.5, sy: 0.5 };

      var blobs = COLORS.map(function (c, i) {
        return {
          c: c,
          // kept near the edges so the face stays clean; the canvas multiplies over the photo
          bx: [0.07, 0.93, 0.86, 0.12, 0.5, 0.97][i],
          by: [0.25, 0.18, 0.82, 0.85, 0.02, 0.5][i],
          r: [0.34, 0.3, 0.32, 0.26, 0.22, 0.2][i],
          a: [0.2, 0.16, 0.18, 0.18, 0.12, 0.06][i],
          sp: 0.00012 + i * 0.00003,
          ph: i * 1.7,
          depth: 0.04 + (i % 3) * 0.035
        };
      });

      function resize() {
        w = hero.clientWidth;
        h = hero.clientHeight;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        draw(performance.now());
      }

      function draw(t) {
        ctx.clearRect(0, 0, w, h);
        var m = Math.min(w, h);

        // Colour fields
        ctx.globalCompositeOperation = 'source-over';
        for (var i = 0; i < blobs.length; i++) {
          var b = blobs[i];
          var x = (b.bx + Math.sin(t * b.sp + b.ph) * 0.06 + (mouse.sx - 0.5) * b.depth) * w;
          var y = (b.by + Math.cos(t * b.sp * 1.3 + b.ph) * 0.06 + (mouse.sy - 0.5) * b.depth) * h;
          var r = b.r * m * (1 + Math.sin(t * b.sp * 2 + b.ph) * 0.08);
          var g = ctx.createRadialGradient(x, y, 0, x, y, r);
          g.addColorStop(0, 'rgba(' + b.c.join(',') + ',' + b.a + ')');
          g.addColorStop(1, 'rgba(' + b.c.join(',') + ',0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }

        // Flowing line mesh (bottom right, like the wave in the banner)
        ctx.lineWidth = 1;
        var lines = 14;
        for (var l = 0; l < lines; l++) {
          ctx.strokeStyle = 'rgba(20,163,154,' + (0.05 + (l / lines) * 0.12).toFixed(3) + ')';
          ctx.beginPath();
          for (var px = 0; px <= w; px += 16) {
            var nx = px / w;
            var amp = 22 + l * 2.2;
            var py = h * (0.72 + l * 0.014) +
              Math.sin(nx * 5 + t * 0.00045 + l * 0.35) * amp * nx +
              Math.cos(nx * 9 - t * 0.0003 + l * 0.2) * 8 +
              (mouse.sy - 0.5) * 30 * nx;
            if (px === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
          ctx.stroke();
        }
      }

      function tick(dt, t) {
        if (!visible) return;
        mouse.sx = RD.lerp(mouse.sx, mouse.x, RD.damp(0.04, dt));
        mouse.sy = RD.lerp(mouse.sy, mouse.y, RD.damp(0.04, dt));
        draw(t);
      }

      window.addEventListener('mousemove', function (e) {
        mouse.x = e.clientX / window.innerWidth;
        mouse.y = e.clientY / window.innerHeight;
      }, { passive: true });

      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          visible = entries[0].isIntersecting;
        }).observe(hero);
      }

      resize();
      RD.onResize(resize);
      if (!RD.reducedMotion) RD.ticker.add(tick);
    }
  };
})();
