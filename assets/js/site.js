/* ==========================================================================
   Traffic Stop Bootcamp — shared behaviour
   Three small jobs: mobile nav, scroll reveal, form submission.
   No dependencies, no build step.
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     FORM ENDPOINT
     Submissions from both forms are posted here. FormSubmit relays them to the
     address in the URL — free, no account, works on static hosting.

     BEFORE LAUNCH: submit either form once from the live site. FormSubmit
     emails David@TSBootcamp.com a one-click confirmation link; until that is
     clicked, nothing is delivered.

     To use a different service (Formspree, Basin, a custom endpoint), replace
     this one string. Nothing else needs to change.
  ------------------------------------------------------------------------ */
  var FORM_ENDPOINT = 'https://formsubmit.co/ajax/David@TSBootcamp.com';


  /* --- Mobile navigation ------------------------------------------------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    // Close the panel when a link is taken or Escape is pressed.
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }


  /* --- Scroll reveal -----------------------------------------------------
     One gentle lift as a block enters. Anything the browser can't observe,
     or a visitor who asked for reduced motion, sees it immediately.        */
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function observeReveals() {
    var items = document.querySelectorAll('.reveal:not(.is-visible)');

    if (reduced || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    items.forEach(function (el) { observer.observe(el); });
  }

  observeReveals();
  window.TSB = { observeReveals: observeReveals };   // gate.js re-runs this


  /* --- Forms --------------------------------------------------------------
     Progressive: posts over fetch and swaps in a status message. If fetch
     fails, the visitor gets a working mailto fallback rather than a dead end. */
  function setStatus(node, state, message) {
    node.textContent = message;
    node.setAttribute('data-state', state);
    node.classList.add('is-shown');
  }

  document.querySelectorAll('.js-form').forEach(function (form) {
    var status = form.querySelector('.js-status');
    var button = form.querySelector('button[type="submit"]');
    var buttonLabel = button ? button.textContent : '';

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      // Spam trap: a real person never fills the off-screen field.
      if (form.querySelector('[name="_honey"]').value) return;

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var data = new FormData(form);
      setStatus(status, 'sending', 'Sending…');
      if (button) { button.disabled = true; button.textContent = 'Sending…'; }

      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data
      })
        .then(function (response) {
          if (!response.ok) throw new Error(response.status);
          form.reset();
          setStatus(status, 'ok', 'Thank you — your message is on its way to David. Expect a reply within two business days.');
        })
        .catch(function () {
          setStatus(
            status,
            'error',
            'That did not send. Email David@TSBootcamp.com directly and we will pick it up from there.'
          );
        })
        .then(function () {
          if (button) { button.disabled = false; button.textContent = buttonLabel; }
        });
    });
  });


  /* --- Preview video ------------------------------------------------------
     Two jobs, both on the home page only:

     1. Turn YouTube's own caption track off. The film already carries burned-in
        captions, so leaving YouTube's on shows every line twice. The
        cc_load_policy=0 parameter on the embed asks for this; unloading the
        module here also covers visitors whose YouTube account forces captions
        on for every video, which the parameter alone can't override.

     2. Send the viewer to the contact form the moment the video ends, so the
        next step is in front of them rather than somewhere further down.

     Requires enablejsapi=1 on the iframe src. If the API script is blocked the
     video still plays as an ordinary embed — nothing else depends on this.  */
  var VIDEO_ENDED = 0;                     // YT.PlayerState.ENDED
  var AFTER_VIDEO = 'contact.html#message';

  var previewVideo = document.getElementById('preview-video');

  if (previewVideo) {
    var api = document.createElement('script');
    api.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(api);

    // The API calls this by name once it has loaded.
    window.onYouTubeIframeAPIReady = function () {
      new window.YT.Player(previewVideo, {
        events: {
          onReady: function (event) {
            try {
              event.target.unloadModule('captions');   // HTML5 player
              event.target.unloadModule('cc');         // older player
            } catch (e) {}
          },
          onStateChange: function (event) {
            if (event.data === VIDEO_ENDED) {
              window.location.href = AFTER_VIDEO;
            }
          }
        }
      });
    };
  }


  /* --- Arriving at a form ------------------------------------------------
     Someone sent here by the end of the video lands on the form itself, so
     put the cursor in the first field rather than making them find it.     */
  if (window.location.hash === '#message' && !reduced) {
    window.addEventListener('load', function () {
      var first = document.querySelector('#message input, #message textarea');
      if (first) first.focus({ preventScroll: true });
    });
  }


  /* --- Footer year -------------------------------------------------------- */
  document.querySelectorAll('.js-year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
