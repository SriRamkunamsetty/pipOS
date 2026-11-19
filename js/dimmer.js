/**
 * PipOS Screen Dimmer & Night Warmth Filter (pip-dimmer)
 * Circadian amber warmth and brightness dimming overlay for comfortable bedtime reading.
 * Zero external dependencies. IEEE IGDTUW Open Source Week 10.0.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PipDimmer = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const STORAGE_KEY = 'pip_dimmer_config';

  function clamp(val, min = 0, max = 100) {
    const num = parseInt(val, 10);
    if (isNaN(num)) return min;
    return Math.max(min, Math.min(max, num));
  }

  function getDefaultConfig() {
    return {
      enabled: false,
      warmth: 40,    // 0% (natural) to 100% (deep amber)
      brightness: 85 // 100% (full) down to 30% (cozy dim)
    };
  }

  function loadConfig(storage = globalThis.localStorage) {
    if (!storage) return getDefaultConfig();
    try {
      const raw = storage.getItem(STORAGE_KEY);
      if (!raw) return getDefaultConfig();
      const parsed = JSON.parse(raw);
      return {
        enabled: Boolean(parsed.enabled),
        warmth: clamp(parsed.warmth, 0, 100),
        brightness: clamp(parsed.brightness, 30, 100)
      };
    } catch {
      return getDefaultConfig();
    }
  }

  function saveConfig(cfg, storage = globalThis.localStorage) {
    if (!storage) return false;
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(cfg));
      return true;
    } catch {
      return false;
    }
  }

  function calculateOverlayStyle(cfg) {
    if (!cfg || !cfg.enabled) {
      return { display: 'none', background: 'transparent' };
    }

    // Warmth: amber tint rgb(245, 158, 11) with opacity proportional to warmth
    const warmthAlpha = (cfg.warmth / 100) * 0.45;
    // Dimness: black tint rgba(0, 0, 0, dimAlpha)
    const dimAlpha = (1 - cfg.brightness / 100) * 0.7;

    return {
      display: 'block',
      background: `linear-gradient(rgba(245, 158, 11, ${warmthAlpha}), rgba(245, 158, 11, ${warmthAlpha})), rgba(0, 0, 0, ${dimAlpha})`
    };
  }

  function isBedtimeHour(date = new Date()) {
    const hours = date.getHours();
    return hours >= 21 || hours < 6; // 9 PM to 6 AM
  }

  function initDimmer() {
    const toggleBtn = document.getElementById('dimmerToggleBtn');
    const warmthSlider = document.getElementById('dimmerWarmth');
    const brightnessSlider = document.getElementById('dimmerBrightness');
    const autoBedtimeBtn = document.getElementById('dimmerAutoBtn');
    const overlay = document.getElementById('dimmerOverlay');

    if (!overlay) return;

    let cfg = loadConfig();

    function applyConfig() {
      const styles = calculateOverlayStyle(cfg);
      overlay.style.display = styles.display;
      overlay.style.background = styles.background;

      if (toggleBtn) {
        toggleBtn.textContent = cfg.enabled ? '🌙 Night Filter: ON' : '☀️ Night Filter: OFF';
        toggleBtn.setAttribute('aria-pressed', String(cfg.enabled));
      }

      saveConfig(cfg);
    }

    // Initial setup
    if (warmthSlider) warmthSlider.value = cfg.warmth;
    if (brightnessSlider) brightnessSlider.value = cfg.brightness;
    applyConfig();

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        cfg.enabled = !cfg.enabled;
        applyConfig();
      });
    }

    if (warmthSlider) {
      warmthSlider.addEventListener('input', (e) => {
        cfg.warmth = clamp(e.target.value, 0, 100);
        applyConfig();
      });
    }

    if (brightnessSlider) {
      brightnessSlider.addEventListener('input', (e) => {
        cfg.brightness = clamp(e.target.value, 30, 100);
        applyConfig();
      });
    }

    if (autoBedtimeBtn) {
      autoBedtimeBtn.addEventListener('click', () => {
        if (isBedtimeHour()) {
          cfg.enabled = true;
          cfg.warmth = 65;
          cfg.brightness = 75;
          if (warmthSlider) warmthSlider.value = 65;
          if (brightnessSlider) brightnessSlider.value = 75;
          applyConfig();
          if (typeof window.showToast === 'function') {
            window.showToast('Bedtime mode enabled (warm amber & gentle dim)');
          }
        } else {
          if (typeof window.showToast === 'function') {
            window.showToast('Daytime detected — warmth kept natural');
          }
        }
      });
    }
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initDimmer);
    } else {
      initDimmer();
    }
  }

  return {
    clamp,
    getDefaultConfig,
    loadConfig,
    saveConfig,
    calculateOverlayStyle,
    isBedtimeHour,
    initDimmer
  };
});
