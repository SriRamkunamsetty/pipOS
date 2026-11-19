import { test, describe } from 'node:test';
import assert from 'node:assert';
import Dimmer from './dimmer.js';

describe('PipOS Screen Dimmer & Night Warmth Filter (pip-dimmer)', () => {
  test('clamp correctly bounds numbers', () => {
    assert.strictEqual(Dimmer.clamp(50, 0, 100), 50);
    assert.strictEqual(Dimmer.clamp(-10, 0, 100), 0);
    assert.strictEqual(Dimmer.clamp(150, 0, 100), 100);
    assert.strictEqual(Dimmer.clamp('not-a-number', 0, 100), 0);
  });

  test('getDefaultConfig returns standard baseline', () => {
    const def = Dimmer.getDefaultConfig();
    assert.strictEqual(def.enabled, false);
    assert.strictEqual(def.warmth, 40);
    assert.strictEqual(def.brightness, 85);
  });

  test('calculateOverlayStyle hides overlay when disabled', () => {
    const style = Dimmer.calculateOverlayStyle({ enabled: false, warmth: 50, brightness: 70 });
    assert.strictEqual(style.display, 'none');
  });

  test('calculateOverlayStyle computes gradient when enabled', () => {
    const style = Dimmer.calculateOverlayStyle({ enabled: true, warmth: 60, brightness: 80 });
    assert.strictEqual(style.display, 'block');
    assert.ok(style.background.includes('rgba(245, 158, 11'));
  });

  test('saveConfig and loadConfig persist and validate state', () => {
    const mockStorage = {
      store: {},
      getItem(k) { return this.store[k] || null; },
      setItem(k, v) { this.store[k] = String(v); }
    };

    const initial = Dimmer.loadConfig(mockStorage);
    assert.strictEqual(initial.enabled, false);

    Dimmer.saveConfig({ enabled: true, warmth: 75, brightness: 60 }, mockStorage);
    const loaded = Dimmer.loadConfig(mockStorage);
    assert.strictEqual(loaded.enabled, true);
    assert.strictEqual(loaded.warmth, 75);
    assert.strictEqual(loaded.brightness, 60);
  });

  test('isBedtimeHour detects late night and early morning hours', () => {
    const dayDate = new Date('2026-11-19T14:00:00');
    assert.strictEqual(Dimmer.isBedtimeHour(dayDate), false);

    const nightDate = new Date('2026-11-19T22:30:00');
    assert.strictEqual(Dimmer.isBedtimeHour(nightDate), true);

    const earlyDate = new Date('2026-11-19T03:15:00');
    assert.strictEqual(Dimmer.isBedtimeHour(earlyDate), true);
  });
});
