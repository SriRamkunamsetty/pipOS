'use strict';

const { test, describe } = require('node:test');
const assert = require('node:assert');

// Mock browser globals
let sessionStore = {};
global.window = {
  location: { href: 'http://localhost:8080/' },
  addEventListener: () => {}
};
global.sessionStorage = {
  getItem: (k) => sessionStore[k] || null,
  setItem: (k, v) => { sessionStore[k] = String(v); },
  removeItem: (k) => { delete sessionStore[k]; },
  clear: () => { sessionStore = {}; }
};
global.document = {
  querySelector: () => null,
  addEventListener: () => {}
};

const crash = require('./crash-reporter.js');

describe('Sleepy Screen of Death (SSOD) Crash Supervisor', () => {
  test('formatError creates complete error metadata payload', () => {
    const err = new Error('Test crash in audio engine');
    const info = crash.formatError(err, 'audio.js', 42, 10);

    assert.strictEqual(info.message, 'Test crash in audio engine');
    assert.strictEqual(info.source, 'audio.js');
    assert.strictEqual(info.lineno, 42);
    assert.strictEqual(info.colno, 10);
    assert.ok(info.timestamp);
    assert.ok(info.stack);
  });

  test('recordCrash persists payload to sessionStorage', () => {
    sessionStore = {};
    const recorded = crash.recordCrash('Out of memory', 'vfs.js', 100, 5);

    assert.strictEqual(recorded.message, 'Out of memory');
    const retrieved = crash.getLastCrash();
    assert.ok(retrieved);
    assert.strictEqual(retrieved.message, 'Out of memory');
    assert.strictEqual(retrieved.source, 'vfs.js');
  });

  test('clearLastCrash removes stored telemetry from sessionStorage', () => {
    sessionStore = {};
    crash.recordCrash('Glitch', 'synth.js');
    assert.ok(crash.getLastCrash());

    crash.clearLastCrash();
    assert.strictEqual(crash.getLastCrash(), null);
  });
});
