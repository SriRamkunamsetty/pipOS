/* a11y-earcons.js: WCAG 2.2 AAA keyboard focus trapping and Web Audio earcon auditory icons. */
(function () {
  'use strict';
  var PIP = (typeof window !== 'undefined' && window.PIP) ? window.PIP : {};

  var EARCON_FREQS = {
    open: [523.25, 659.25, 783.99],   // C5, E5, G5 rising
    close: [783.99, 659.25, 523.25],  // G5, E5, C5 descending
    boundary: [880.00],               // Woodblock tick
    alert: [1046.50]                  // C6 bell
  };

  function playEarcon(type) {
    if (!PIP.audio || typeof PIP.audio.note !== 'function' || !PIP.audio.isOn()) return;
    var notes = EARCON_FREQS[type];
    if (!notes || notes.length === 0) return;

    for (var i = 0; i < notes.length; i++) {
      PIP.audio.note(notes[i], {
        when: i * 0.08,
        dur: (type === 'boundary' ? 0.06 : 0.35),
        gain: (type === 'boundary' ? 0.10 : 0.16),
        type: 'sine'
      });
    }
  }

  var FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function getFocusableElements(container) {
    if (!container || typeof container.querySelectorAll !== 'function') return [];
    var all = Array.prototype.slice.call(container.querySelectorAll(FOCUSABLE_SELECTOR));
    return all.filter(function (el) {
      return el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement;
    });
  }

  function trapFocus(container, options) {
    if (!container || typeof container.addEventListener !== 'function') {
      return function () {};
    }
    options = options || {};
    var previousFocused = (typeof document !== 'undefined') ? document.activeElement : null;

    function handleKeydown(e) {
      if (e.key === 'Escape' && typeof options.onEscape === 'function') {
        e.preventDefault();
        options.onEscape();
        return;
      }

      if (e.key !== 'Tab') return;

      var focusable = getFocusableElements(container);
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }

      var first = focusable[0];
      var last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first || !container.contains(document.activeElement)) {
          e.preventDefault();
          last.focus();
          playEarcon('boundary');
        }
      } else {
        if (document.activeElement === last || !container.contains(document.activeElement)) {
          e.preventDefault();
          first.focus();
          playEarcon('boundary');
        }
      }
    }

    container.addEventListener('keydown', handleKeydown);

    // Initial focus into container
    var initial = getFocusableElements(container)[0];
    if (initial && typeof initial.focus === 'function') {
      initial.focus();
    }

    // Return unbind handler
    return function releaseFocus() {
      container.removeEventListener('keydown', handleKeydown);
      if (previousFocused && typeof previousFocused.focus === 'function') {
        try { previousFocused.focus(); } catch (err) {}
      }
    };
  }

  PIP.a11y = {
    playEarcon: playEarcon,
    trapFocus: trapFocus,
    getFocusableElements: getFocusableElements,
    EARCON_FREQS: EARCON_FREQS
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PIP.a11y;
  }
})();
