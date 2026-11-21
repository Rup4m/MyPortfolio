/* ==========================================================================
   scroll-effects.js — everything driven by scroll position:
   parallax, image drift, velocity marquees, scrubbed text, the design → code
   "switch", the showcase counters and light/dark UI state.
   Each frame reads layout first, then writes, to avoid layout thrashing.
   ========================================================================== */
(function () {
  'use strict';

  var RD = window.RD;
  var vw = window.innerWidth;
  var vh = window.innerHeight;

  var parallaxEls = [];
  var parallaxImgs = [];
  var marquees = [];
  var scrubs = [];
  var themeSections = [];
  var sw = null; // the design → development switch
  var heroMedia = null;
  var heroContent = [];
  var waFloat = null;
  var contactEl = null;

  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function inView(r, margin) { return r.bottom > -margin && r.top < vh + margin; }

  /* ---------- setup ---------- */
  function setupMarquees() {
    RD.qsa('[data-marquee]').forEach(function (el) {
      var track = RD.qs('[data-marquee-track]', el);
      var group = track && track.children[0];
      if (!group) return;
      marquees.push({
        el: el,
        track: track,
        group: group,
        speed: parseFloat(el.getAttribute('data-speed')) || 1,
        width: group.offsetWidth,
        x: 0
      });
    });
  }

  function setupScrubs() {
    RD.qsa('[data-scrub]').forEach(function (el) {
      scrubs.push({ el: el, words: RD.qsa('.w__i', el), last: -1 });
    });
  }

  function setupSwitch() {
    var el = RD.qs('[data-switch]');
    if (!el) return;
    sw = {
      el: el,
      clip: RD.qs('[data-switch-clip]', el),
      out: RD.qs('[data-switch-out]', el),
      inn: RD.qs('[data-switch-in]', el),
      p: 0
    };
  }

  function setupShowcases() {
    RD.qsa('[data-showcase]').forEach(function (group) {
      var items = RD.qsa('[data-showcase-item]', group);
      var current = RD.qs('[data-showcase-current]', group);
      var title = RD.qs('[data-showcase-title]', group);
      var cat = RD.qs('[data-showcase-cat]', group);
      if (!items.length || !current || !title || !('IntersectionObserver' in window)) return;
      var active = 0;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var idx = items.indexOf(entry.target);
          if (idx === active) return;
          var down = idx > active;
          active = idx;
          current.textContent = String(idx + 1).padStart(2, '0');
          title.textContent = items[idx].getAttribute('data-title') || '';
          if (cat) cat.textContent = items[idx].getAttribute('data-cat') || '';
          if (title.animate && !RD.reducedMotion) {
            title.animate(
              [{ transform: 'translateY(' + (down ? '100%' : '-100%') + ')', opacity: 0 }, { transform: 'none', opacity: 1 }],
              { duration: 650, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
            );
          }
        });
      }, { rootMargin: '-45% 0px -45% 0px' });
      items.forEach(function (item) { io.observe(item); });
    });
  }

  function measure() {
    vw = window.innerWidth;
    vh = window.innerHeight;
    marquees.forEach(function (m) { m.width = m.group.offsetWidth; });
  }

  /* ---------- per-frame ---------- */
  function frame(dt) {
    var scroll = RD.scroll.state;
    var y = window.scrollY;
    var i, r, item;

    /* ---- READ ---- */
    var pReads = parallaxEls.map(function (p) { return p.parent.getBoundingClientRect(); });
    var iReads = parallaxImgs.map(function (p) { return p.wrap.getBoundingClientRect(); });
    var mReads = marquees.map(function (m) { return m.el.getBoundingClientRect(); });
    var sReads = scrubs.map(function (s) { return s.el.getBoundingClientRect(); });
    var swRect = sw ? sw.el.getBoundingClientRect() : null;
    var themeReads = themeSections.map(function (t) { return t.getBoundingClientRect(); });
    var contactTop = contactEl ? contactEl.getBoundingClientRect().top : Infinity;

    /* ---- WRITE ---- */
    // Hero: the portrait sinks and zooms slightly as you scroll away
    if (heroMedia && y < vh * 1.1 && !RD.reducedMotion) {
      var hp = RD.clamp(y / vh, 0, 1);
      heroMedia.style.transform = 'translate3d(0,' + (hp * vh * 0.32).toFixed(1) + 'px,0) scale(' + (1 + hp * 0.08).toFixed(4) + ')';
      // Inline styles only once scrolling starts, so the entrance animation isn't overridden
      for (i = 0; i < heroContent.length; i++) {
        heroContent[i].style.opacity = hp > 0 ? (1 - hp * 1.3).toFixed(3) : '';
        heroContent[i].style.transform = hp > 0 ? 'translate3d(0,' + (-hp * 70).toFixed(1) + 'px,0)' : '';
      }
    }

    // Floating WhatsApp button: after the hero, hidden over the contact section
    if (waFloat) waFloat.classList.toggle('is-visible', y > vh * 0.7 && contactTop > vh * 0.5);

    // Parallax blocks
    for (i = 0; i < parallaxEls.length; i++) {
      r = pReads[i];
      if (!inView(r, 200)) continue;
      var offset = (r.top + r.height / 2 - vh / 2) * parallaxEls[i].speed;
      parallaxEls[i].el.style.transform = 'translate3d(0,' + offset.toFixed(2) + 'px,0)';
    }

    // Image drift inside their masks
    for (i = 0; i < parallaxImgs.length; i++) {
      r = iReads[i];
      if (!inView(r, 100)) continue;
      var p = RD.clamp((vh - r.top) / (vh + r.height), 0, 1);
      var shift = (p - 0.5) * r.height * -0.12;
      parallaxImgs[i].img.style.transform = 'translate3d(0,' + shift.toFixed(2) + 'px,0) scale(1.15)';
    }

    // Marquees — speed up with scroll velocity, flip with scroll direction
    if (!RD.reducedMotion) {
      var boost = Math.min(Math.abs(scroll.velocity) * 0.18, 10);
      for (i = 0; i < marquees.length; i++) {
        item = marquees[i];
        if (!inView(mReads[i], 50) || !item.width) continue;
        var dir = item.speed > 0 ? 1 : -1;
        item.x -= (Math.abs(item.speed) + boost) * dir * scroll.direction * dt;
        if (item.x <= -item.width) item.x += item.width;
        if (item.x > 0) item.x -= item.width;
        item.track.style.transform = 'translate3d(' + item.x.toFixed(2) + 'px,0,0)';
      }
    }

    // Scrubbed statement: words light up as you read
    for (i = 0; i < scrubs.length; i++) {
      r = sReads[i];
      if (!inView(r, 0)) continue;
      var s = scrubs[i];
      var sp = RD.clamp((vh * 0.88 - r.top) / (r.height + vh * 0.3), 0, 1);
      if (Math.abs(sp - s.last) < 0.001) continue;
      s.last = sp;
      var n = s.words.length;
      for (var w = 0; w < n; w++) {
        var o = RD.clamp(sp * n - w, 0, 1);
        s.words[w].style.setProperty('--o', (0.18 + o * 0.82).toFixed(3));
      }
    }

    // Design → development switch
    if (sw && swRect) {
      var range = swRect.height - vh;
      sw.p = range > 0 ? RD.clamp(-swRect.top / range, 0, 1) : 0;
      if (inView(swRect, 0)) {
        var cp = easeInOut(RD.clamp((sw.p - 0.12) / 0.7, 0, 1));
        var maxR = Math.sqrt(vw * vw + vh * vh) / 2 + 20;
        sw.clip.style.clipPath = 'circle(' + (cp * maxR).toFixed(1) + 'px at 50% 50%)';
        sw.out.style.transform = 'translate3d(' + (-sw.p * vw * 0.35).toFixed(1) + 'px,0,0) scale(' + (1 - cp * 0.15).toFixed(3) + ')';
        sw.inn.style.transform = 'translate3d(' + ((1 - sw.p) * vw * 0.35).toFixed(1) + 'px,0,0) scale(' + (0.85 + cp * 0.15).toFixed(3) + ')';
      }
    }

    // UI state: floating menu button + light/dark theme under the header
    var root = document.documentElement;
    root.classList.toggle('show-menu-btn', y > vh * 0.6);
    var dark = false;
    var probe = 48;
    var under = null;
    for (i = 0; i < themeSections.length; i++) {
      r = themeReads[i];
      if (r.top <= probe && r.bottom > probe) {
        under = themeSections[i];
        dark = under.getAttribute('data-theme') === 'dark';
        break;
      }
    }
    if (sw && swRect && swRect.top <= probe && swRect.bottom > probe) dark = sw.p > 0.5;
    // In dark mode every section is dark, except the photo hero which stays light
    if (root.classList.contains('theme-dark') && !(under && under.hasAttribute('data-hero'))) dark = true;
    root.classList.toggle('ui-dark', dark);
  }

  RD.effects = {
    init: function () {
      RD.qsa('[data-parallax]').forEach(function (el) {
        parallaxEls.push({ el: el, parent: el.parentElement, speed: parseFloat(el.getAttribute('data-parallax')) || 0 });
      });
      RD.qsa('[data-parallax-img]').forEach(function (img) {
        parallaxImgs.push({ img: img, wrap: img.parentElement });
      });
      themeSections = RD.qsa('[data-theme]');
      heroMedia = RD.qs('[data-hero-media]');
      heroContent = RD.qsa('[data-hero-content]');
      waFloat = RD.qs('[data-wa-float]');
      contactEl = RD.qs('#contact');

      setupMarquees();
      setupScrubs();
      setupSwitch();
      setupShowcases();

      if (RD.reducedMotion) {
        // No parallax drift; the switch still follows the scrollbar directly
        parallaxEls = [];
        parallaxImgs = [];
      }

      RD.onResize(measure);
      window.addEventListener('load', measure);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);

      RD.ticker.add(frame);
    }
  };
})();
