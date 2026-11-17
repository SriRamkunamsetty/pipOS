const test = require('node:test');
const assert = require('node:assert/strict');
const { checkCollision, STARS_CONFIG } = require('./stars.js');

test('Catch the Falling Stars: collision detection logic', async (t) => {
  await t.test('detects collision when star is directly over cloud center', () => {
    const cloud = { x: 100, y: 300, w: 60, h: 20 };
    const star = { x: 130, y: 295, r: 10 }; // star bottom touches cloud.y
    assert.strictEqual(checkCollision(star, cloud), true);
  });

  await t.test('detects collision on left cloud edge with radius overlap', () => {
    const cloud = { x: 100, y: 300, w: 60, h: 20 };
    const star = { x: 95, y: 305, r: 8 }; // star.x + r = 103 >= cloud.x (100)
    assert.strictEqual(checkCollision(star, cloud), true);
  });

  await t.test('detects collision on right cloud edge with radius overlap', () => {
    const cloud = { x: 100, y: 300, w: 60, h: 20 };
    const star = { x: 165, y: 305, r: 8 }; // star.x - r = 157 <= cloud.x + cloud.w (160)
    assert.strictEqual(checkCollision(star, cloud), true);
  });

  await t.test('returns false when star is far above cloud', () => {
    const cloud = { x: 100, y: 300, w: 60, h: 20 };
    const star = { x: 130, y: 150, r: 10 };
    assert.strictEqual(checkCollision(star, cloud), false);
  });

  await t.test('returns false when star is far to the side of cloud', () => {
    const cloud = { x: 100, y: 300, w: 60, h: 20 };
    const star = { x: 25, y: 305, r: 10 };
    assert.strictEqual(checkCollision(star, cloud), false);
  });

  await t.test('handles null or undefined inputs safely without throwing', () => {
    assert.strictEqual(checkCollision(null, { x: 0, y: 0, w: 10, h: 10 }), false);
    assert.strictEqual(checkCollision({ x: 0, y: 0, r: 5 }, null), false);
    assert.strictEqual(checkCollision(undefined, undefined), false);
  });
});

test('Catch the Falling Stars: game configuration constants', () => {
  assert.ok(STARS_CONFIG.W > 0, 'Canvas width must be defined');
  assert.ok(STARS_CONFIG.H > 0, 'Canvas height must be defined');
  assert.strictEqual(STARS_CONFIG.MAX_MISSES, 3, 'Must allow exactly 3 misses before dawn');
  assert.ok(Array.isArray(STARS_CONFIG.STAR_PALETTE), 'Star palette must be an array');
  assert.ok(STARS_CONFIG.STAR_PALETTE.length >= 4, 'Must have at least 4 star colors');
  assert.ok(Array.isArray(STARS_CONFIG.NOTES), 'Chime notes must be defined');
  assert.ok(STARS_CONFIG.NOTES.length >= 5, 'Pentatonic scale must have at least 5 notes');
});

test('Catch the Falling Stars: index.html markup and accessibility contract', () => {
  const fs = require('fs');
  const path = require('path');
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

  assert.ok(html.includes('id="stars"'), 'index.html must contain #stars element');
  assert.ok(html.includes('class="win w-stars"'), 'index.html must use win and w-stars classes');
  assert.ok(html.includes('data-foldable'), 'stars window must be foldable');
  assert.ok(html.includes('id="starsCanvas"'), 'canvas must exist');
  assert.ok(html.includes('aria-label="Catch the Falling Stars canvas game"'), 'canvas must have descriptive aria-label');
  assert.ok(html.includes('tabindex="0"'), 'canvas must be focusable for keyboard controls');
  assert.ok(html.includes('id="starsGameOver"'), 'game over overlay must exist');
  assert.ok(html.includes('src="js/stars.js"'), 'index.html must load js/stars.js');
});

