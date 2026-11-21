/* ==========================================================================
   contact.js — wires every contact link to config.js and handles the
   "Start a project" form (sends via WhatsApp or email — no server needed).
   ========================================================================== */
(function () {
  'use strict';

  var RD = window.RD;

  var NAMES = { github: 'GitHub', linkedin: 'LinkedIn', behance: 'Behance', dribbble: 'Dribbble', instagram: 'Instagram', facebook: 'Facebook', x: 'X' };

  function openInNewTab(url) {
    // window.open with "noopener" always returns null, so use a real link click
    var a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  RD.contact = {
    init: function () {
      var C = window.RD_CONFIG || {};
      var number = String(C.whatsapp || '').replace(/[^\d]/g, '');

      function waUrl(text) { return 'https://wa.me/' + number + (text ? '?text=' + encodeURIComponent(text) : ''); }
      function mailUrl(subject, body) {
        return 'mailto:' + C.email + '?subject=' + encodeURIComponent(subject || 'Project enquiry') + (body ? '&body=' + encodeURIComponent(body) : '');
      }

      /* WhatsApp */
      if (number) {
        RD.qsa('[data-href="whatsapp"]').forEach(function (a) { a.href = waUrl(a.getAttribute('data-wa-text') || C.whatsappGreeting); });
        RD.qsa('[data-social="whatsapp"]').forEach(function (a) { a.href = waUrl(C.whatsappGreeting); });
      }
      RD.qsa('[data-text="whatsapp"]').forEach(function (el) { el.textContent = C.whatsappDisplay || ('+' + number); });

      /* Email (if not set yet, links keep pointing to the contact form) */
      RD.qsa('[data-href="email"], [data-social="email"]').forEach(function (a) {
        if (!C.email) return;
        a.href = mailUrl(a.getAttribute('data-mail-subject') || 'Hello Rupam');
        a.removeAttribute('target');
      });
      RD.qsa('[data-text="email"]').forEach(function (el) { el.textContent = C.email || 'Coming soon'; });

      /* CV */
      if (C.cv) RD.qsa('[data-href="cv"]').forEach(function (a) { a.href = C.cv; });
      if (C.portfolioPdf) RD.qsa('[data-href="portfolio"]').forEach(function (a) { a.href = C.portfolioPdf; });

      /* Social profiles */
      var socials = C.socials || {};
      RD.qsa('[data-social]').forEach(function (a) {
        var key = a.getAttribute('data-social');
        if (key === 'whatsapp' || key === 'email') return;
        if (socials[key]) {
          a.href = socials[key];
          a.classList.remove('is-pending');
        } else {
          a.classList.add('is-pending');
          a.setAttribute('aria-disabled', 'true');
          a.setAttribute('title', (NAMES[key] || key) + ' — coming soon');
          a.removeAttribute('target');
          a.addEventListener('click', function (e) { e.preventDefault(); });
        }
      });

      /* "Get a quote" buttons pre-select the service in the form */
      document.addEventListener('click', function (e) {
        var t = e.target.closest && e.target.closest('[data-service]');
        if (!t) return;
        var select = RD.qs('[data-contact-form] select[name="service"]');
        if (select) select.value = t.getAttribute('data-service');
      });

      /* Start-a-project form */
      var form = RD.qs('[data-contact-form]');
      if (!form) return;
      var status = RD.qs('[data-form-status]', form);
      var lastButton = 'whatsapp';

      form.addEventListener('click', function (e) {
        var b = e.target.closest('button[type="submit"]');
        if (b) lastButton = b.value;
      });

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var via = (e.submitter && e.submitter.value) || lastButton;

        if (!form.checkValidity()) {
          form.classList.add('was-validated');
          form.reportValidity();
          return;
        }

        var d = new FormData(form);
        var service = d.get('service');
        var lines = [
          'Hi Rupam! I\'d like to work with you.',
          '',
          'Name: ' + d.get('name'),
          'Contact: ' + d.get('reply'),
          'Service: ' + service,
          'Budget: ' + (d.get('budget') || 'Not sure yet'),
          '',
          'Project:',
          d.get('message')
        ];
        var text = lines.join('\n');

        if (via === 'email' && !C.email) {
          via = 'whatsapp';
          status.textContent = 'Email isn\'t set up yet — opening WhatsApp instead…';
        }

        if (via === 'email') {
          status.textContent = 'Opening your email app…';
          window.location.href = mailUrl('New project: ' + service, text);
        } else {
          if (!status.textContent) status.textContent = 'Opening WhatsApp with your message…';
          openInNewTab(waUrl(text));
        }
        setTimeout(function () { status.textContent = ''; }, 6000);
      });
    }
  };
})();
