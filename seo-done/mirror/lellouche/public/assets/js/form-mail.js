/* Envoi des formulaires (contact + rendez-vous) par e-mail au cabinet.
   Le site est statique : le formulaire envoie un JSON à un webhook (n8n)
   qui le transmet par e-mail à dr.lellouche.patrick@gmail.com. */
(function () {
  'use strict';
  var WEBHOOK_URL = 'https://ailive.app.n8n.cloud/webhook/lellouche-formulaire';

  function clean(t) {
    return (t || '').replace(/\*/g, '').replace(/\s+/g, ' ').trim();
  }

  function labelOf(group) {
    var l = group.querySelector('label.sb-col, label');
    if (!l) return '';
    var c = l.cloneNode(true);
    var e = c.querySelectorAll('.error, small, input');
    for (var i = 0; i < e.length; i++) e[i].parentNode.removeChild(e[i]);
    return clean(c.textContent);
  }

  function optionText(input) {
    var l = input.closest('label');
    var t = l ? l.textContent : (input.parentNode && input.parentNode.textContent);
    t = clean(t);
    return t || clean(input.value);
  }

  function collect(form) {
    var fields = [];
    var email = '';
    var groups = form.querySelectorAll('.form-one-object');
    for (var g = 0; g < groups.length; g++) {
      var grp = groups[g];
      var label = labelOf(grp) || 'Champ';
      if (/v[ée]rification/i.test(label)) continue;
      var vals = [];
      var inputs = grp.querySelectorAll('input, textarea, select');
      for (var i = 0; i < inputs.length; i++) {
        var el = inputs[i];
        if (el.type === 'hidden' || el.type === 'submit' || el.type === 'file') continue;
        if (el.type === 'radio' || el.type === 'checkbox') {
          if (el.checked) vals.push(optionText(el));
        } else if (el.value) {
          vals.push(clean(el.value) || el.value);
          if (el.type === 'email' && !email) email = el.value.trim();
        }
      }
      if (vals.length) fields.push({ label: label, value: vals.join(', ') });
    }
    return { fields: fields, email: email };
  }

  function show(box, ms) {
    if (!box) return;
    box.style.display = 'block';
    if (ms) setTimeout(function () { box.style.display = 'none'; }, ms);
  }

  function emailsMatch(form) {
    var m = form.querySelectorAll('input[type=email]');
    return m.length < 2 || m[0].value.trim().toLowerCase() === m[1].value.trim().toLowerCase();
  }

  function init(form) {
    form.removeAttribute('action');
    form.setAttribute('novalidate', 'novalidate');
    var okBox = form.querySelector('.sb-vi-ajax-callback.success');
    var koBox = form.querySelector('.sb-vi-ajax-callback.server-error');
    var btn = form.querySelector('button[type=submit]');
    var busy = false;

    var hp = document.createElement('input');
    hp.type = 'text'; hp.name = 'website'; hp.tabIndex = -1; hp.autocomplete = 'off';
    hp.setAttribute('aria-hidden', 'true');
    hp.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;opacity:0';
    form.appendChild(hp);

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      ev.stopImmediatePropagation();
      if (busy) return;
      if (form.reportValidity && !form.reportValidity()) return;
      if (!emailsMatch(form)) {
        alert('Les deux adresses e-mail ne correspondent pas.');
        return;
      }
      if (hp.value) { show(okBox); return; }
      var data = collect(form);
      var payload = {
        formulaire: /prendre-rdv/.test(location.pathname) ? 'Demande de rendez-vous' : 'Contact',
        page: location.href,
        date: new Date().toISOString(),
        email: data.email,
        champs: data.fields
      };
      busy = true;
      if (btn) btn.disabled = true;
      fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        show(okBox);
        form.reset();
      }).catch(function () {
        show(koBox, 4000);
      }).then(function () {
        busy = false;
        if (btn) btn.disabled = false;
      });
    }, true);
  }

  function ready() {
    var forms = document.querySelectorAll('form#new_form_submission');
    for (var i = 0; i < forms.length; i++) init(forms[i]);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready);
  else ready();
})();
