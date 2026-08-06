/* ==========================================================================
   Modules page — password gate
   --------------------------------------------------------------------------
   HOW TO CHANGE THE PASSWORD
   1. Open a terminal and run, with your new password in the quotes:
        printf '%s' 'your-new-password' | shasum -a 256
   2. Paste the resulting hex string into PASSWORD_HASH below.
   The plain password never appears in this file or in the page source.

   Current default password: bootcamp2026   <-- change before launch

   SCOPE OF PROTECTION
   This is a front-end gate. It keeps the modules page out of casual reach and
   off search engines, which is what the brief asks for. It is not server-side
   security: a determined visitor with the video URLs can still request them
   directly. If the client needs real access control, the two upgrade paths are:
     a) HTTP Basic Auth at the host (.htaccess, Netlify _headers, Vercel
        middleware) — 10 minutes, protects the files themselves; or
     b) unlisted/signed video URLs from Vimeo or a private S3 bucket.
   Either can be added later without touching the layout.
   ========================================================================== */

(function () {
  'use strict';

  var PASSWORD_HASH = 'e1e44b860d860351c781953db3fb229b335cace3da2896629825a815a3d3706c';
  var STORE_KEY = 'tsb-modules-unlocked';

  var gate    = document.getElementById('gate');
  var content = document.getElementById('modules-content');
  var form    = document.getElementById('gate-form');
  var input   = document.getElementById('gate-password');
  var error   = document.getElementById('gate-error');

  if (!gate || !content || !form) return;

  function unlock(remember) {
    if (remember) {
      try { sessionStorage.setItem(STORE_KEY, '1'); } catch (e) { /* private mode */ }
    }
    document.documentElement.setAttribute('data-gate', 'open');
    gate.hidden = true;
    content.hidden = false;
    // Re-run the reveal observer over content that was hidden at first paint.
    if (window.TSB && window.TSB.observeReveals) window.TSB.observeReveals();
  }

  async function hash(text) {
    var bytes = new TextEncoder().encode(text);
    var digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest))
      .map(function (b) { return b.toString(16).padStart(2, '0'); })
      .join('');
  }

  // Already unlocked this session — skip the gate entirely.
  var stored = null;
  try { stored = sessionStorage.getItem(STORE_KEY); } catch (e) { /* ignore */ }
  if (stored === '1') {
    unlock(false);
    return;
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    error.classList.remove('is-shown');

    var value = input.value.trim();
    if (!value) {
      error.textContent = 'Enter the password to continue.';
      error.classList.add('is-shown');
      input.focus();
      return;
    }

    var ok = false;
    try {
      ok = (await hash(value)) === PASSWORD_HASH;
    } catch (e) {
      // crypto.subtle needs a secure context (https or localhost).
      error.textContent = 'This page must be served over https to check the password.';
      error.classList.add('is-shown');
      return;
    }

    if (ok) {
      unlock(true);
      content.setAttribute('tabindex', '-1');
      content.focus({ preventScroll: true });
      window.scrollTo({ top: 0 });
    } else {
      error.textContent = 'That password is not correct. Check the email from Journey 2 Justice Learning.';
      error.classList.add('is-shown');
      input.select();
    }
  });
})();
