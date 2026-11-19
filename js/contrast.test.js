import { test, describe } from 'node:test';
import assert from 'node:assert';
import Contrast from './contrast.js';

describe('PipOS Dyslexia Typography & High-Contrast Accessibility Suite (pip-contrast)', () => {
  test('getDefaultConfig returns accessible baseline configuration', () => {
    const def = Contrast.getDefaultConfig();
    assert.strictEqual(def.dyslexiaMode, false);
    assert.strictEqual(def.readingGuide, false);
    assert.strictEqual(def.highContrast, false);
    assert.strictEqual(def.textSpacing, false);
  });

  test('applyTypographyClasses applies matching classes to documentElement', () => {
    const classSet = new Set();
    const mockDoc = {
      documentElement: {
        classList: {
          toggle(cls, force) {
            if (force) classSet.add(cls);
            else classSet.delete(cls);
          }
        }
      }
    };

    Contrast.applyTypographyClasses(mockDoc, {
      dyslexiaMode: true,
      readingGuide: true,
      highContrast: false,
      textSpacing: true
    });

    assert.ok(classSet.has('mode-dyslexia'));
    assert.ok(classSet.has('mode-reading-guide'));
    assert.ok(classSet.has('mode-wide-spacing'));
    assert.ok(!classSet.has('mode-high-contrast'));
  });

  test('saveConfig and loadConfig correctly serialize and deserialize', () => {
    const mockStorage = {
      store: {},
      getItem(k) { return this.store[k] || null; },
      setItem(k, v) { this.store[k] = String(v); }
    };

    const initial = Contrast.loadConfig(mockStorage);
    assert.strictEqual(initial.dyslexiaMode, false);

    Contrast.saveConfig({ dyslexiaMode: true, readingGuide: false, highContrast: true, textSpacing: false }, mockStorage);
    const loaded = Contrast.loadConfig(mockStorage);
    assert.strictEqual(loaded.dyslexiaMode, true);
    assert.strictEqual(loaded.highContrast, true);
  });
});
