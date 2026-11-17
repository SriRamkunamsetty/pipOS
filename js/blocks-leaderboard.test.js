const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const HTML_PATH = path.resolve(__dirname, '..', 'index.html');
const CSS_PATH = path.resolve(__dirname, '..', 'css', 'style.css');
const TOYS_JS_PATH = path.resolve(__dirname, '..', 'js', 'toys.js');

test('index.html contains combo status badge and top-5 leaderboard elements', () => {
  const html = fs.readFileSync(HTML_PATH, 'utf8');

  assert.match(html, /id=["']blockCombo["']/, 'index.html must contain #blockCombo element');
  assert.match(html, /class=["'][^"']*\bblock-leaderboard\b[^"']*["']/, 'index.html must contain .block-leaderboard container');
});

test('css/style.css defines styling for combo counter, leaderboard, and night mode', () => {
  const css = fs.readFileSync(CSS_PATH, 'utf8');

  assert.match(css, /\.block-status\s*\{/, 'Must define .block-status flex layout');
  assert.match(css, /\.block-combo\s*\{/, 'Must define .block-combo pill badge styling');
  assert.match(css, /\.block-leaderboard\s*\{/, 'Must define .block-leaderboard container styling');
  assert.match(css, /@keyframes\s+popIn/, 'Must define @keyframes popIn');
});

test('leaderboard helper maintains top 5 scores sorted descending', () => {
  const toys = require('./toys.js');
  assert.strictEqual(typeof toys.updateLeaderboardList, 'function', 'Must export updateLeaderboardList helper');

  let list = [];
  list = toys.updateLeaderboardList(list, 10, 'normal');
  list = toys.updateLeaderboardList(list, 25, 'hard');
  list = toys.updateLeaderboardList(list, 5, 'easy');
  list = toys.updateLeaderboardList(list, 18, 'normal');
  list = toys.updateLeaderboardList(list, 30, 'hard');
  list = toys.updateLeaderboardList(list, 12, 'easy');

  assert.strictEqual(list.length, 5, 'Leaderboard must be strictly capped at top 5 records');
  assert.strictEqual(list[0].score, 30, 'Top score must be 30');
  assert.strictEqual(list[1].score, 25, 'Second score must be 25');
  assert.strictEqual(list[2].score, 18, 'Third score must be 18');
  assert.strictEqual(list[3].score, 12, 'Fourth score must be 12');
  assert.strictEqual(list[4].score, 10, 'Fifth score must be 10');
  assert.ok(list[0].date, 'Records must include date timestamp');
  assert.strictEqual(list[0].mode, 'hard', 'Records must track game mode');

  // Ignored non-positive scores
  const same = toys.updateLeaderboardList(list, 0, 'normal');
  assert.strictEqual(same.length, 5);
});

test('combo pitch multiplier raises pitch for consecutive perfect drops', () => {
  const toys = require('./toys.js');
  assert.strictEqual(typeof toys.getComboPitchMultiplier, 'function', 'Must export getComboPitchMultiplier helper');

  assert.strictEqual(toys.getComboPitchMultiplier(0), 1, 'No combo must have multiplier 1');
  assert.strictEqual(toys.getComboPitchMultiplier(1), 1, 'Single perfect drop has multiplier 1');
  
  const mult2 = toys.getComboPitchMultiplier(2);
  const mult3 = toys.getComboPitchMultiplier(3);
  const mult4 = toys.getComboPitchMultiplier(4);

  assert.ok(mult2 > 1, '2x combo must raise pitch');
  assert.ok(mult3 > mult2, '3x combo must be higher pitch than 2x');
  assert.ok(mult4 > mult3, '4x combo must be higher pitch than 3x');
  assert.ok(toys.getComboPitchMultiplier(15) <= Math.pow(1.08, 8) + 0.001, 'Multiplier must smoothly cap at upper bound');
});

test('js/toys.js implements combo tracking and DOM updates in initBlocks', () => {
  const toysSrc = fs.readFileSync(TOYS_JS_PATH, 'utf8');

  assert.match(toysSrc, /st\.combo\s*=\s*\(st\.combo\s*\|\|\s*0\)\s*\+\s*1/, 'Must increment combo on perfect drop');
  assert.match(toysSrc, /renderLeaderboard\(/, 'Must call renderLeaderboard to update DOM');
  assert.match(toysSrc, /saveTopScore\(/, 'Must save score on game over');
});
