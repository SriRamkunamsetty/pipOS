import { test, describe } from 'node:test';
import assert from 'node:assert';
import Scope from './scope.js';

describe('PipOS Kaleidoscope Radial Symmetry Drawing Toy (pip-scope.exe)', () => {
  test('calculateSymmetricPoints computes 2 * folds mirrored points', () => {
    const pts = Scope.calculateSymmetricPoints(150, 100, 150, 150, 8);
    assert.strictEqual(pts.length, 16); // 8 rotational + 8 mirrored
    // All points must be equidistant from center (150, 150)
    const expectedRadius = 50;
    pts.forEach(p => {
      const dist = Math.hypot(p.x - 150, p.y - 150);
      assert.ok(Math.abs(dist - expectedRadius) < 0.001);
    });
  });

  test('calculateSymmetricPoints supports 4, 6, and 12 folds', () => {
    assert.strictEqual(Scope.calculateSymmetricPoints(100, 100, 150, 150, 4).length, 8);
    assert.strictEqual(Scope.calculateSymmetricPoints(100, 100, 150, 150, 6).length, 12);
    assert.strictEqual(Scope.calculateSymmetricPoints(100, 100, 150, 150, 12).length, 24);
  });

  test('getNextHue cycles hues across 360 degrees smoothly', () => {
    assert.strictEqual(Scope.getNextHue(0, 5), 5);
    assert.strictEqual(Scope.getNextHue(355, 10), 5);
    assert.strictEqual(Scope.getNextHue(360, 2), 2);
  });
});
