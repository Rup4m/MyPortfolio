/* ==========================================================================
   works.js — the All Works page: renders projects from data/projects.js,
   filters (All / Graphic design / UI / Coding) synced with the URL hash,
   grid ⇄ list views, and the floating image preview in list view.
   ========================================================================== */
(function () {
  'use strict';

  var RD = window.RD;
  var CAT_LABEL = { design: 'Graphic design', ui: 'UI design', code: 'Coding' };
  var HASH = { '#design': 'design', '#ui': 'ui', '#code': 'code' };
  var SPRITE = 'assets/icons/sprite.svg';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function icon(name) { return '<svg class="ico" aria-hidden="true"><use href="' + SPRITE + '#i-' + name + '"/></svg>'; }
  function pad(n) { return String(n).padStart(2, '0'); }

  function card(p, i) {
    var num = pad(i + 1);
    var info =
      '<div class="wcard__info">' +
        '<span class="wcard__num">' + num + '</span>' +
        '<h3 class="wcard__title">' + esc(p.title) + '</h3>' +
        '<span class="wcard__type">' + esc(p.type) + '</span>' +
        '<span class="wcard__cat wcard__cat--' + p.cat + '">' + CAT_LABEL[p.cat] + '</span>' +
        '<time class="wcard__year">' + esc(p.year) + '</time>';

    if (p.cat === 'code') {
      var href = p.live || p.github || '#';
      var external = /^https?:/.test(href);
      var links = '';
      if (p.live) links += '<a class="link-arrow" href="' + esc(p.live) + '"' + (/^https?:/.test(p.live) ? ' target="_blank" rel="noopener"' : '') + '>Live site ' + icon('arrow') + '</a>';
      if (p.github) links += '<a class="link-arrow" href="' + esc(p.github) + '" target="_blank" rel="noopener">' + icon('github') + 'GitHub</a>';
      info += '<p class="wcard__desc">' + esc(p.desc) + '</p>' +
        '<ul class="chips">' + (p.tech || []).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
        '<div class="wcard__links">' + links + '</div></div>';
      return '<article class="wcard wcard--code" style="--i:' + i + '" data-preview="' + esc(p.img) + '">' +
        '<a class="wcard__media dev-card__preview" href="' + esc(href) + '"' + (external ? ' target="_blank" rel="noopener"' : '') +
          ' data-tilt data-cursor="' + (p.live ? 'Visit' : 'Open') + '" aria-label="' + esc(p.title) + '">' +
          '<span class="browser"><span class="browser__bar"><i></i><i></i><i></i><span class="browser__url">' + esc(p.url || '') + '</span></span>' +
          '<span class="browser__screen"><img class="browser__shot" src="' + esc(p.img) + '" loading="lazy" alt="' + esc(p.title) + ' preview"></span></span>' +
        '</a>' + info + '</article>';
    }

    info += '</div>';
    return '<article class="wcard wcard--' + p.cat + (p.shape === 'wide' ? ' wcard--wide' : '') + '" style="--i:' + i + '" data-preview="' + esc(p.img) + '">' +
      '<button class="wcard__media" type="button" data-lightbox="' + esc(p.img) + '" data-lightbox-title="' + esc(p.title + ' — ' + p.type) + '" data-cursor="View" aria-label="Open ' + esc(p.title) + '">' +
        '<img src="' + esc(p.img) + '" loading="lazy" alt="' + esc(p.title + ', ' + p.type) + '">' +
      '</button>' + info + '</article>';
  }

  RD.works = {
    init: function () {
      var grid = RD.qs('[data-works-grid]');
      var data = window.RD_PROJECTS;
      if (!grid || !data) return;

      var filter = HASH[location.hash] || 'all';
      var view = 'grid';
      try { view = localStorage.getItem('rd-works-view') || 'grid'; } catch (e) {}
      var buttons = RD.qsa('[data-filter]');
      var pill = RD.qs('[data-filter-pill]');
      var viewButtons = RD.qsa('[data-view]');

      // counts
      var counts = { all: data.length, design: 0, ui: 0, code: 0 };
      data.forEach(function (p) { counts[p.cat]++; });
      RD.qsa('[data-count]').forEach(function (el) { el.textContent = counts[el.getAttribute('data-count')]; });
      RD.qsa('[data-works-total]').forEach(function (el) { el.textContent = data.length; });

      // Hide filters that have no projects yet (e.g. UI design)
      buttons = buttons.filter(function (b) {
        var f = b.getAttribute('data-filter');
        if (f !== 'all' && !counts[f]) { b.hidden = true; return false; }
        return true;
      });
      if (filter !== 'all' && !counts[filter]) filter = 'all';

      function movePill() {
        var active = buttons.filter(function (b) { return b.getAttribute('data-filter') === filter; })[0];
        if (!active || !pill) return;
        pill.style.width = active.offsetWidth + 'px';
        pill.style.transform = 'translateX(' + active.offsetLeft + 'px)';
      }

      function render() {
        var items = data.filter(function (p) { return filter === 'all' || p.cat === filter; });
        grid.className = 'works__grid is-' + view;
        grid.innerHTML = items.map(card).join('');
        if (RD.devCards && RD.devCards.bind) RD.devCards.bind(grid);
        requestAnimationFrame(function () { requestAnimationFrame(function () { grid.classList.add('is-shown'); }); });
      }

      function setFilter(next, animate) {
        filter = next;
        buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-filter') === filter)); });
        movePill();
        if (!animate || RD.reducedMotion) { render(); return; }
        grid.classList.remove('is-shown');
        grid.classList.add('is-out');
        setTimeout(function () { grid.classList.remove('is-out'); render(); }, 380);
      }

      function setView(next) {
        view = next;
        try { localStorage.setItem('rd-works-view', view); } catch (e) {}
        viewButtons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-view') === view)); });
        grid.classList.remove('is-grid', 'is-list');
        grid.classList.add('is-' + view);
      }

      buttons.forEach(function (b) {
        b.addEventListener('click', function () {
          var f = b.getAttribute('data-filter');
          if (f === filter) return;
          if (history.replaceState) history.replaceState(null, '', f === 'all' ? location.pathname : '#' + f);
          setFilter(f, true);
        });
      });
      viewButtons.forEach(function (b) {
        b.addEventListener('click', function () { setView(b.getAttribute('data-view')); });
      });

      // Links like works.html#ui from the nav while already on this page
      window.addEventListener('hashchange', function () {
        setFilter(HASH[location.hash] || 'all', true);
        if (RD.scroll) RD.scroll.scrollTo('#main');
      });

      RD.onResize(movePill);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(movePill);

      setFilter(filter, false);
      setView(view);
      setTimeout(movePill, 50);

      /* Floating preview that follows the cursor in list view */
      var preview = RD.qs('[data-list-preview]');
      var previewImg = preview && RD.qs('[data-list-preview-img]', preview);
      if (!preview || !RD.finePointer) return;
      var pos = { x: 0, y: 0 }, cur = { x: 0, y: 0 }, active = false;
      grid.addEventListener('mousemove', function (e) {
        pos.x = e.clientX; pos.y = e.clientY;
        var row = view === 'list' && e.target.closest('.wcard');
        if (row) {
          var src = row.getAttribute('data-preview');
          if (previewImg.getAttribute('src') !== src) previewImg.setAttribute('src', src);
          if (!active) { cur.x = pos.x; cur.y = pos.y; }
          active = true;
          preview.classList.add('is-visible');
        } else {
          active = false;
          preview.classList.remove('is-visible');
        }
      });
      grid.addEventListener('mouseleave', function () { active = false; preview.classList.remove('is-visible'); });
      RD.ticker.add(function (dt) {
        if (!active) return;
        cur.x = RD.lerp(cur.x, pos.x, RD.damp(0.15, dt));
        cur.y = RD.lerp(cur.y, pos.y, RD.damp(0.15, dt));
        var rot = RD.clamp((pos.x - cur.x) * 0.08, -8, 8);
        preview.style.transform = 'translate3d(' + cur.x.toFixed(1) + 'px,' + cur.y.toFixed(1) + 'px,0) rotate(' + rot.toFixed(2) + 'deg)';
      });
    }
  };
})();
