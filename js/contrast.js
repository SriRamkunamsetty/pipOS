/**
 * PipOS Dyslexia Typography & High-Contrast Accessibility Suite (pip-contrast)
 * Hyper-legible typography, reading guide ruler, and high contrast for WCAG 2.2 AAA accessibility.
 * Zero external dependencies. IEEE IGDTUW Open Source Week 10.0.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PipContrast = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const STORAGE_KEY = 'pip_typography_config';

  function getDefaultConfig() {
    return {
      dyslexiaMode: false,
      readingGuide: false,
      highContrast: false,
      textSpacing: false
    };
  }

  function loadConfig(storage = globalThis.localStorage) {
    if (!storage) return getDefaultConfig();
    try {
      const raw = storage.getItem(STORAGE_KEY);
      if (!raw) return getDefaultConfig();
      const parsed = JSON.parse(raw);
      return {
        dyslexiaMode: Boolean(parsed.dyslexiaMode),
        readingGuide: Boolean(parsed.readingGuide),
        highContrast: Boolean(parsed.highContrast),
        textSpacing: Boolean(parsed.textSpacing)
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

  function applyTypographyClasses(doc, cfg) {
    if (!doc || !doc.documentElement) return;
    const root = doc.documentElement;

    root.classList.toggle('mode-dyslexia', Boolean(cfg.dyslexiaMode));
    root.classList.toggle('mode-reading-guide', Boolean(cfg.readingGuide));
    root.classList.toggle('mode-high-contrast', Boolean(cfg.highContrast));
    root.classList.toggle('mode-wide-spacing', Boolean(cfg.textSpacing));
  }

  function initContrast() {
    const dyslexiaBtn = document.getElementById('a11yDyslexiaBtn');
    const guideBtn = document.getElementById('a11yGuideBtn');
    const contrastBtn = document.getElementById('a11yContrastBtn');
    const spacingBtn = document.getElementById('a11ySpacingBtn');
    const guideRuler = document.getElementById('readingGuideRuler');

    const cfg = loadConfig();
    applyTypographyClasses(document, cfg);

    function syncButtons() {
      if (dyslexiaBtn) {
        dyslexiaBtn.setAttribute('aria-pressed', String(cfg.dyslexiaMode));
        dyslexiaBtn.textContent = cfg.dyslexiaMode ? '📖 Dyslexia Font: ON' : '📖 Dyslexia Font: OFF';
      }
      if (guideBtn) {
        guideBtn.setAttribute('aria-pressed', String(cfg.readingGuide));
        guideBtn.textContent = cfg.readingGuide ? '📏 Reading Guide: ON' : '📏 Reading Guide: OFF';
      }
      if (contrastBtn) {
        contrastBtn.setAttribute('aria-pressed', String(cfg.highContrast));
        contrastBtn.textContent = cfg.highContrast ? '👁️ High Contrast: ON' : '👁️ High Contrast: OFF';
      }
      if (spacingBtn) {
        spacingBtn.setAttribute('aria-pressed', String(cfg.textSpacing));
        spacingBtn.textContent = cfg.textSpacing ? '↔️ Wide Spacing: ON' : '↔️ Wide Spacing: OFF';
      }
      if (guideRuler) {
        guideRuler.style.display = cfg.readingGuide ? 'block' : 'none';
      }
    }

    syncButtons();

    if (dyslexiaBtn) {
      dyslexiaBtn.addEventListener('click', () => {
        cfg.dyslexiaMode = !cfg.dyslexiaMode;
        applyTypographyClasses(document, cfg);
        saveConfig(cfg);
        syncButtons();
      });
    }

    if (guideBtn) {
      guideBtn.addEventListener('click', () => {
        cfg.readingGuide = !cfg.readingGuide;
        applyTypographyClasses(document, cfg);
        saveConfig(cfg);
        syncButtons();
      });
    }

    if (contrastBtn) {
      contrastBtn.addEventListener('click', () => {
        cfg.highContrast = !cfg.highContrast;
        applyTypographyClasses(document, cfg);
        saveConfig(cfg);
        syncButtons();
      });
    }

    if (spacingBtn) {
      spacingBtn.addEventListener('click', () => {
        cfg.textSpacing = !cfg.textSpacing;
        applyTypographyClasses(document, cfg);
        saveConfig(cfg);
        syncButtons();
      });
    }

    // Move reading guide ruler with mouse pointer
    if (guideRuler) {
      window.addEventListener('mousemove', (e) => {
        if (cfg.readingGuide) {
          guideRuler.style.top = `${e.clientY}px`;
        }
      });
    }

    // Global keyboard shortcut: Alt+Shift+D to toggle Dyslexia Mode
    window.addEventListener('keydown', (e) => {
      if (e.altKey && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        cfg.dyslexiaMode = !cfg.dyslexiaMode;
        applyTypographyClasses(document, cfg);
        saveConfig(cfg);
        syncButtons();
        if (typeof window.showToast === 'function') {
          window.showToast(`Dyslexia typography ${cfg.dyslexiaMode ? 'activated' : 'deactivated'}`);
        }
      }
    });
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initContrast);
    } else {
      initContrast();
    }
  }

  return {
    getDefaultConfig,
    loadConfig,
    saveConfig,
    applyTypographyClasses,
    initContrast
  };
});
