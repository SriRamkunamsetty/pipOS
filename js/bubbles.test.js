import { test, describe } from 'node:test';
import assert from 'node:assert';
import Bubbles from './bubbles.js';

describe('PipOS Sensory Bubble Wrap Popping Toy (pip-bubbles.exe)', () => {
  test('createInitialState creates grid with 36 unpopped bubbles', () => {
    const state = Bubbles.createInitialState();
    assert.strictEqual(state.bubbles.length, 36);
    assert.strictEqual(state.poppedCount, 0);
    assert.strictEqual(state.totalCount, 36);
    assert.strictEqual(state.bubbles[0].popped, false);
  });

  test('popBubble marks bubble as popped and increments counter', () => {
    const state = Bubbles.createInitialState();
    const res1 = Bubbles.popBubble(state, 5);
    assert.strictEqual(res1, true);
    assert.strictEqual(state.bubbles[5].popped, true);
    assert.strictEqual(state.poppedCount, 1);

    // Popping already popped bubble returns false
    const res2 = Bubbles.popBubble(state, 5);
    assert.strictEqual(res2, false);
    assert.strictEqual(state.poppedCount, 1);
  });

  test('popBubble rejects invalid bubble IDs gracefully', () => {
    const state = Bubbles.createInitialState();
    assert.strictEqual(Bubbles.popBubble(state, -1), false);
    assert.strictEqual(Bubbles.popBubble(state, 999), false);
  });

  test('resetBubbles clears all popped states', () => {
    const state = Bubbles.createInitialState();
    Bubbles.popBubble(state, 0);
    Bubbles.popBubble(state, 1);
    assert.strictEqual(state.poppedCount, 2);

    Bubbles.resetBubbles(state);
    assert.strictEqual(state.poppedCount, 0);
    assert.strictEqual(state.bubbles[0].popped, false);
    assert.strictEqual(state.bubbles[1].popped, false);
  });

  test('playPopSound runs safely without throwing in headless environments', () => {
    assert.doesNotThrow(() => {
      Bubbles.playPopSound();
    });
  });
});
