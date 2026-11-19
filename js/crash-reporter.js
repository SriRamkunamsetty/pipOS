/* crash-reporter.js: Sleepy Screen of Death (SSOD) crash recovery and diagnostics supervisor. */
(function () {
  'use strict';
  var PIP = (typeof window !== 'undefined' && window.PIP) ? window.PIP : {};
  var $ = PIP.$ || function (sel) { return document.querySelector(sel); };
  var toast = PIP.toast || function () {};

  var STORAGE_KEY = 'pip_last_crash';

  function formatError(error, source, lineno, colno) {
    var msg = (error && error.message) || (typeof error === 'string' ? error : 'Unknown error');
    var stack = (error && error.stack) || '';
    return {
      message: msg,
      source: source || 'window',
      lineno: lineno || 0,
      colno: colno || 0,
      stack: stack,
      timestamp: new Date().toISOString(),
      url: (typeof window !== 'undefined' && window.location) ? window.location.href : ''
    };
  }

  function recordCrash(error, source, lineno, colno) {
    var payload = formatError(error, source, lineno, colno);
    if (typeof sessionStorage !== 'undefined') {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch (e) {}
    }
    return payload;
  }

  function getLastCrash() {
    if (typeof sessionStorage === 'undefined') return null;
    try {
      var raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function clearLastCrash() {
    if (typeof sessionStorage !== 'undefined') {
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
    }
  }

  function showCrashScreen(info) {
    if (typeof document === 'undefined') return;
    var modal = $('#ssodModal');
    if (!modal) return;

    var msgEl = $('#ssodErrorMsg');
    if (msgEl) msgEl.textContent = info.message || 'A sleepy glitch occurred.';

    var stackEl = $('#ssodDetails');
    if (stackEl) stackEl.textContent = info.stack || (info.source + ':' + info.lineno + ':' + info.colno);

    modal.removeAttribute('hidden');
    var reloadBtn = $('#ssodReloadBtn');
    if (reloadBtn) reloadBtn.focus();
  }

  function hideCrashScreen() {
    if (typeof document === 'undefined') return;
    var modal = $('#ssodModal');
    if (modal) modal.setAttribute('hidden', '');
  }

  function initCrashSupervisor() {
    if (typeof window === 'undefined') return;

    window.addEventListener('error', function (e) {
      // Don't intercept benign cross-origin script errors with no info
      if (!e.message || e.message === 'Script error.') return;
      var info = recordCrash(e.error || e.message, e.filename, e.lineno, e.colno);
      showCrashScreen(info);
    });

    window.addEventListener('unhandledrejection', function (e) {
      var reason = e.reason || 'Unhandled Promise Rejection';
      var info = recordCrash(reason, 'Promise');
      showCrashScreen(info);
    });

    var reloadBtn = $('#ssodReloadBtn');
    if (reloadBtn) {
      reloadBtn.addEventListener('click', function () {
        hideCrashScreen();
        if (typeof window !== 'undefined' && window.location) {
          window.location.reload();
        }
      });
    }

    var resetBtn = $('#ssodResetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        if (typeof localStorage !== 'undefined') localStorage.clear();
        if (typeof sessionStorage !== 'undefined') sessionStorage.clear();
        hideCrashScreen();
        if (typeof window !== 'undefined' && window.location) {
          window.location.reload();
        }
      });
    }

    var copyBtn = $('#ssodCopyBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var crash = getLastCrash();
        var txt = JSON.stringify(crash, null, 2);
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(txt).then(function () {
            toast('Crash diagnostics copied to clipboard!');
          });
        }
      });
    }
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initCrashSupervisor);
    } else {
      initCrashSupervisor();
    }
  }

  PIP.crash = {
    recordCrash: recordCrash,
    getLastCrash: getLastCrash,
    clearLastCrash: clearLastCrash,
    formatError: formatError,
    showCrashScreen: showCrashScreen,
    hideCrashScreen: hideCrashScreen
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PIP.crash;
  }
})();
