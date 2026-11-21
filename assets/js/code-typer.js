/* ==========================================================================
   code-typer.js — types a syntax-highlighted snippet when it scrolls into view
   Edit CODE below to change what gets typed. Token types:
   kw (keyword), str (string), prop (property), fn (function), punc, com, txt
   ========================================================================== */
(function () {
  'use strict';

  var RD = window.RD;

  var CODE = [
    ['com', '// two sides, one developer\n'],
    ['kw', 'const '], ['txt', 'rupam '], ['punc', '= {\n'],
    ['prop', '  role'], ['punc', ': '], ['str', '"Designer & Developer"'], ['punc', ',\n'],
    ['prop', '  stack'], ['punc', ': ['], ['str', '"TS"'], ['punc', ', '], ['str', '"React"'], ['punc', ', '], ['str', '"NestJS"'], ['punc', '],\n'],
    ['prop', '  loves'], ['punc', ': ['], ['str', '"clean code"'], ['punc', ', '], ['str', '"bold type"'], ['punc', '],\n'],
    ['fn', '  build'], ['punc', '(idea) {\n'],
    ['kw', '    return '], ['fn', 'ship'], ['punc', '('], ['fn', 'design'], ['punc', '(idea));\n'],
    ['punc', '  }\n};']
  ];

  RD.codeTyper = {
    init: function () {
      var root = RD.qs('[data-code-typer]');
      var target = root && RD.qs('[data-code-target]', root);
      if (!target) return;

      function renderAll() {
        target.innerHTML = '';
        CODE.forEach(function (tok) {
          var span = document.createElement('span');
          span.className = 'tk-' + tok[0];
          span.textContent = tok[1];
          target.appendChild(span);
        });
      }

      if (RD.reducedMotion || !('IntersectionObserver' in window)) { renderAll(); return; }

      function type() {
        var t = 0, c = 0, span = null;
        (function step() {
          if (t >= CODE.length) return;
          if (!span) {
            span = document.createElement('span');
            span.className = 'tk-' + CODE[t][0];
            target.appendChild(span);
          }
          var text = CODE[t][1];
          span.textContent += text.charAt(c++);
          var ch = text.charAt(c - 1);
          if (c >= text.length) { t++; c = 0; span = null; }
          setTimeout(step, ch === '\n' ? 140 : 18 + Math.random() * 30);
        })();
      }

      var io = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        setTimeout(type, 500);
      }, { threshold: 0.4 });
      io.observe(root);
    }
  };
})();
