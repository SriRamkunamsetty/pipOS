'use strict';

const { test, describe } = require('node:test');
const assert = require('node:assert');

const a11y = require('./a11y-earcons.js');

describe('WCAG 2.2 AAA Focus Trapping & Earcon Engine', () => {
  test('EARCON_FREQS has defined chord frequencies for all earcon states', () => {
    assert.deepStrictEqual(a11y.EARCON_FREQS.open, [523.25, 659.25, 783.99]);
    assert.deepStrictEqual(a11y.EARCON_FREQS.close, [783.99, 659.25, 523.25]);
    assert.deepStrictEqual(a11y.EARCON_FREQS.boundary, [880.00]);
    assert.deepStrictEqual(a11y.EARCON_FREQS.alert, [1046.50]);
  });

  test('trapFocus cycles Tab from last element back to first', () => {
    let focusedElement = null;
    const btn1 = {
      offsetWidth: 100,
      offsetHeight: 30,
      focus: () => { focusedElement = btn1; }
    };
    const btn2 = {
      offsetWidth: 100,
      offsetHeight: 30,
      focus: () => { focusedElement = btn2; }
    };

    let keydownHandler = null;
    const mockContainer = {
      querySelectorAll: () => [btn1, btn2],
      addEventListener: (type, fn) => { if (type === 'keydown') keydownHandler = fn; },
      removeEventListener: () => { keydownHandler = null; },
      contains: (el) => el === btn1 || el === btn2
    };

    global.document = { activeElement: btn2 };

    const unbind = a11y.trapFocus(mockContainer);
    assert.ok(keydownHandler, 'Keydown handler should be attached');

    // Press Tab while on last element (btn2)
    let defaultPrevented = false;
    keydownHandler({
      key: 'Tab',
      shiftKey: false,
      preventDefault: () => { defaultPrevented = true; }
    });

    assert.strictEqual(defaultPrevented, true, 'Default Tab should be prevented');
    assert.strictEqual(focusedElement, btn1, 'Focus should cycle back to first element');

    unbind();
    assert.strictEqual(keydownHandler, null, 'Unbind should remove keydown listener');
  });

  test('trapFocus cycles Shift+Tab from first element back to last', () => {
    let focusedElement = null;
    const btn1 = {
      offsetWidth: 100,
      offsetHeight: 30,
      focus: () => { focusedElement = btn1; }
    };
    const btn2 = {
      offsetWidth: 100,
      offsetHeight: 30,
      focus: () => { focusedElement = btn2; }
    };

    let keydownHandler = null;
    const mockContainer = {
      querySelectorAll: () => [btn1, btn2],
      addEventListener: (type, fn) => { if (type === 'keydown') keydownHandler = fn; },
      removeEventListener: () => { keydownHandler = null; },
      contains: (el) => el === btn1 || el === btn2
    };

    global.document = { activeElement: btn1 };

    a11y.trapFocus(mockContainer);

    // Press Shift+Tab while on first element (btn1)
    let defaultPrevented = false;
    keydownHandler({
      key: 'Tab',
      shiftKey: true,
      preventDefault: () => { defaultPrevented = true; }
    });

    assert.strictEqual(defaultPrevented, true);
    assert.strictEqual(focusedElement, btn2, 'Shift+Tab should wrap to last element');
  });

  test('trapFocus handles Escape callback', () => {
    let escaped = false;
    let keydownHandler = null;
    const mockContainer = {
      querySelectorAll: () => [],
      addEventListener: (type, fn) => { if (type === 'keydown') keydownHandler = fn; },
      removeEventListener: () => {}
    };

    a11y.trapFocus(mockContainer, {
      onEscape: () => { escaped = true; }
    });

    keydownHandler({
      key: 'Escape',
      preventDefault: () => {}
    });

    assert.strictEqual(escaped, true);
  });
});
