/* ==========================================================================
   lightbox.js — full-screen viewer for design + UI work.
   Uses event delegation, so it also works for cards rendered later
   (All Works page filters). Keyboard: ← → browse, Esc close.
   ========================================================================== */
(function () {
  'use strict';

  var RD = window.RD;

  RD.lightbox = {
    init: function () {
      var root = RD.qs('[data-lightbox-root]');
      if (!root) return;

      var img = RD.qs('[data-lightbox-img]', root);
      var caption = RD.qs('[data-lightbox-caption]', root);
      var closeBtn = RD.qs('[data-lightbox-close]', root);
      var list = [];
      var index = 0;
      var opener = null;

      function visibleTriggers() {
        return RD.qsa('[data-lightbox]').filter(function (t) { return t.getClientRects().length > 0; });
      }

      function titleOf(t) {
        if (t.hasAttribute('data-lightbox-title')) return t.getAttribute('data-lightbox-title');
        var fig = t.closest('[data-title]');
        return fig ? fig.getAttribute('data-title') : '';
      }

      function show(i) {
        index = (i + list.length) % list.length;
        var t = list[index];
        var thumb = RD.qs('img', t);
        img.src = t.getAttribute('data-lightbox');
        img.alt = thumb ? thumb.alt : '';
        var title = titleOf(t);
        caption.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(list.length).padStart(2, '0') + (title ? ' — ' + title : '');
      }

      function open(trigger) {
        list = visibleTriggers();
        if (!list.length) return;
        opener = trigger;
        show(Math.max(0, list.indexOf(trigger)));
        root.classList.add('is-open');
        root.setAttribute('aria-hidden', 'false');
        RD.scroll.lock();
        closeBtn.focus({ preventScroll: true });
      }

      function close() {
        if (!root.classList.contains('is-open')) return;
        root.classList.remove('is-open');
        root.setAttribute('aria-hidden', 'true');
        RD.scroll.unlock();
        if (opener && opener.focus) opener.focus({ preventScroll: true });
      }

      document.addEventListener('click', function (e) {
        var t = e.target.closest && e.target.closest('[data-lightbox]');
        if (t) { e.preventDefault(); open(t); }
      });
      closeBtn.addEventListener('click', close);
      RD.qs('[data-lightbox-prev]', root).addEventListener('click', function () { show(index - 1); });
      RD.qs('[data-lightbox-next]', root).addEventListener('click', function () { show(index + 1); });
      root.addEventListener('click', function (e) { if (e.target === root) close(); });

      // Swipe on touch screens
      var startX = null;
      root.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
      root.addEventListener('touchend', function (e) {
        if (startX === null) return;
        var dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
        startX = null;
      });

      document.addEventListener('keydown', function (e) {
        if (!root.classList.contains('is-open')) return;
        if (e.key === 'Escape') close();
        else if (e.key === 'ArrowRight') show(index + 1);
        else if (e.key === 'ArrowLeft') show(index - 1);
        else if (e.key === 'Tab') {
          var f = RD.qsa('button', root);
          var first = f[0], last = f[f.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      });
    }
  };
})();
