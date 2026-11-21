/* ==========================================================================
   split-text.js — wraps every word of [data-split] elements in masks so
   they can be revealed (or scrubbed) word by word. Keeps child elements
   such as <em>, <br> and <svg> intact.
   ========================================================================== */
(function () {
  'use strict';

  var RD = window.RD;

  function splitNode(node, counter) {
    var children = Array.prototype.slice.call(node.childNodes);
    children.forEach(function (child) {
      if (child.nodeType === 3) {
        var parts = child.textContent.split(/(\s+)/);
        var frag = document.createDocumentFragment();
        parts.forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(' '));
            return;
          }
          var outer = document.createElement('span');
          outer.className = 'w';
          var inner = document.createElement('span');
          inner.className = 'w__i';
          inner.style.setProperty('--i', counter.i++);
          inner.textContent = part;
          outer.appendChild(inner);
          frag.appendChild(outer);
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === 1 && child.tagName !== 'SVG' && child.tagName !== 'svg' && child.tagName !== 'BR') {
        splitNode(child, counter);
      }
    });
  }

  RD.split = {
    init: function () {
      RD.qsa('[data-split]').forEach(function (el) {
        if (el.classList.contains('is-split')) return;
        splitNode(el, { i: 0 });
        el.classList.add('is-split');
      });
    }
  };
})();
