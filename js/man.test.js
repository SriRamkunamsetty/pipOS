import { test, describe } from 'node:test';
import assert from 'node:assert';
import Man from './man.js';

describe('PipOS Terminal Built-In Man Pages (man <cmd>)', () => {
  test('MAN_PAGES contains essential shell command entries', () => {
    assert.ok(Man.MAN_PAGES.help);
    assert.ok(Man.MAN_PAGES.ls);
    assert.ok(Man.MAN_PAGES.cat);
    assert.ok(Man.MAN_PAGES.grep);
    assert.ok(Man.MAN_PAGES.wc);
    assert.ok(Man.MAN_PAGES.sort);
  });

  test('formatManPage structures output with standard sections', () => {
    const output = Man.formatManPage(Man.MAN_PAGES.ls);
    assert.ok(output.includes('NAME'));
    assert.ok(output.includes('SYNOPSIS'));
    assert.ok(output.includes('DESCRIPTION'));
    assert.ok(output.includes('EXAMPLES'));
    assert.ok(output.includes('ls [-l] [-a] [path]'));
  });

  test('getManPage returns formatted page for valid commands case-insensitively', () => {
    const page = Man.getManPage('CAT');
    assert.ok(page);
    assert.ok(page.includes('concatenate files'));
  });

  test('getManPage returns null for unknown commands or invalid inputs', () => {
    assert.strictEqual(Man.getManPage('nonexistentcmd'), null);
    assert.strictEqual(Man.getManPage(''), null);
    assert.strictEqual(Man.getManPage(null), null);
  });
});
