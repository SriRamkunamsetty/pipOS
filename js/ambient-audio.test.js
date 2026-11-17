const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const HTML_PATH = path.resolve(__dirname, '..', 'index.html');
const CSS_PATH = path.resolve(__dirname, '..', 'css', 'style.css');
const AUDIO_JS_PATH = path.resolve(__dirname, 'audio.js');
const TOYS_JS_PATH = path.resolve(__dirname, 'toys.js');

test('index.html contains accessible ambient sound controls in Lullaby Lab', () => {
  const html = fs.readFileSync(HTML_PATH, 'utf8');

  assert.match(html, /id=["']ambientRainBtn["']/, 'Lullaby Lab must contain #ambientRainBtn');
  assert.match(html, /id=["']ambientCricketsBtn["']/, 'Lullaby Lab must contain #ambientCricketsBtn');
  assert.match(html, /id=["']ambientSlider["']/, 'Lullaby Lab must contain #ambientSlider');
  assert.match(html, /aria-label=["']Ambient night sounds volume["']/, 'ambientSlider must have accessible aria-label');
  assert.match(html, /class=["'][^"']*\bambient-bar\b[^"']*["']/, 'Must contain .ambient-bar container');
});

test('css/style.css defines styling for ambient bar, buttons, and night mode', () => {
  const css = fs.readFileSync(CSS_PATH, 'utf8');

  assert.match(css, /\.ambient-bar\s*\{/, 'Must define .ambient-bar container styling');
  assert.match(css, /\.ambient-actions\s*\{/, 'Must define .ambient-actions flex styling');
  assert.match(css, /\.btn-ambient\s*\{/, 'Must define .btn-ambient styling');
  assert.match(css, /\.btn-ambient\.is-on\s*\{/, 'Must define .btn-ambient active state');
  assert.match(css, /\[data-theme=["']night["']\]\s*\.btn-ambient\.is-on/, 'Must define night theme active styling');
  assert.match(css, /\.ambient-wrap\s*\{/, 'Must define .ambient-wrap slider group styling');
});

test('js/audio.js implements ambient sound generators and exports', () => {
  const audioSrc = fs.readFileSync(AUDIO_JS_PATH, 'utf8');

  assert.match(audioSrc, /function\s+startRain\s*\(/, 'audio.js must define startRain');
  assert.match(audioSrc, /function\s+stopRain\s*\(/, 'audio.js must define stopRain');
  assert.match(audioSrc, /function\s+isRainActive\s*\(/, 'audio.js must define isRainActive');
  assert.match(audioSrc, /function\s+startCrickets\s*\(/, 'audio.js must define startCrickets');
  assert.match(audioSrc, /function\s+stopCrickets\s*\(/, 'audio.js must define stopCrickets');
  assert.match(audioSrc, /function\s+isCricketsActive\s*\(/, 'audio.js must define isCricketsActive');
  assert.match(audioSrc, /function\s+stopAmbient\s*\(/, 'audio.js must define stopAmbient');
  assert.match(audioSrc, /function\s+setAmbientLevel\s*\(/, 'audio.js must define setAmbientLevel');
  assert.match(audioSrc, /function\s+getAmbientLevel\s*\(/, 'audio.js must define getAmbientLevel');
  assert.match(audioSrc, /createBiquadFilter\(\)/, 'Rain must use BiquadFilterNode to shape noise');
  assert.match(audioSrc, /createBuffer\(/, 'Rain must procedurally generate noise buffer');
});

test('ambient sound level setter clamps boundaries [0, 1]', () => {
  const audio = require('./audio.js');
  assert.strictEqual(typeof audio.setAmbientLevel, 'function');
  assert.strictEqual(typeof audio.getAmbientLevel, 'function');

  audio.setAmbientLevel(0.4);
  assert.strictEqual(audio.getAmbientLevel(), 0.4);

  audio.setAmbientLevel(-0.25);
  assert.strictEqual(audio.getAmbientLevel(), 0);

  audio.setAmbientLevel(1.5);
  assert.strictEqual(audio.getAmbientLevel(), 1);

  audio.setAmbientLevel(0.5);
  assert.strictEqual(audio.getAmbientLevel(), 0.5);
});

test('audio mute stops ambient generators unconditionally', () => {
  const audioSrc = fs.readFileSync(AUDIO_JS_PATH, 'utf8');

  // Verify set(next) stops ambient when sound is muted
  assert.match(audioSrc, /if\s*\(\s*next\s*!==\s*['"]on['"]\s*\)\s*\{[\s\S]*?stopAmbient\(\);/,
    'Turning sound off must call stopAmbient()');
});

test('js/toys.js hooks ambient controls and reacts to sound mute event', () => {
  const toysSrc = fs.readFileSync(TOYS_JS_PATH, 'utf8');

  assert.match(toysSrc, /ambientRainBtn/, 'toys.js must query ambientRainBtn');
  assert.match(toysSrc, /ambientCricketsBtn/, 'toys.js must query ambientCricketsBtn');
  assert.match(toysSrc, /ambientSlider/, 'toys.js must query ambientSlider');
  assert.match(toysSrc, /audio\.onChange\([\s\S]*?rainBtn[\s\S]*?cricketsBtn/,
    'toys.js must update ambient button states when audio mutes');
});
