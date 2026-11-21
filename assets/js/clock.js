/* ==========================================================================
   clock.js — live local time in the footer (Bangladesh, GMT+6)
   ========================================================================== */
(function () {
  'use strict';

  var RD = window.RD;
  var TIME_ZONE = 'Asia/Dhaka';

  RD.clock = {
    init: function () {
      var els = RD.qsa('[data-clock]');
      if (!els.length) return;
      var fmt;
      try {
        fmt = new Intl.DateTimeFormat('en-US', { timeZone: TIME_ZONE, hour: '2-digit', minute: '2-digit', hour12: true });
      } catch (e) {
        fmt = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      }
      function update() {
        var t = fmt.format(new Date());
        els.forEach(function (el) { el.textContent = t; });
      }
      update();
      setInterval(update, 15000);
    }
  };
})();
