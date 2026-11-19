import { test, describe } from 'node:test';
import assert from 'node:assert';
import Soundboard from './soundboard.js';

describe('PipOS Interactive Procedural Soundboard (pip-soundboard.exe)', () => {
  test('SOUND_CATALOG provides 6 distinct nursery audio effects', () => {
    assert.strictEqual(Soundboard.SOUND_CATALOG.length, 6);
    const ids = Soundboard.SOUND_CATALOG.map(s => s.id);
    assert.ok(ids.includes('yawn'));
    assert.ok(ids.includes('giggle'));
    assert.ok(ids.includes('chirp'));
    assert.ok(ids.includes('chime'));
    assert.ok(ids.includes('sigh'));
    assert.ok(ids.includes('lullaby'));
  });

  test('playProceduralSound executes without throws in headless environments', () => {
    Soundboard.SOUND_CATALOG.forEach(snd => {
      assert.doesNotThrow(() => {
        Soundboard.playProceduralSound(snd.id);
      });
    });
  });

  test('playProceduralSound handles unrecognized sound ID safely', () => {
    assert.doesNotThrow(() => {
      Soundboard.playProceduralSound('unknown-fx');
    });
  });
});
