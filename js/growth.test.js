const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const HTML_PATH = path.resolve(__dirname, '..', 'index.html');
const TOYS_JS_PATH = path.resolve(__dirname, 'toys.js');
const CSS_PATH = path.resolve(__dirname, '..', 'css', 'style.css');

test('index.html contains growth-chart.exe in Work section', () => {
  const html = fs.readFileSync(HTML_PATH, 'utf8');

  assert.match(html, /<article[^>]*id=["']growth["'][^>]*class=["'][^"']*w-growth[^"']*["']/i,
    'Work section must include growth chart article');
  assert.match(html, /growth-chart\.exe/i, 'Window title must be growth-chart.exe');
  assert.match(html, /id=["']chartWrap["'][^>]*role=["']region["']/i, 'Chart container must have role="region"');
  assert.match(html, /id=["']rulerBar["']/i, 'Ruler bar element must exist');
});

test('growth-chart.exe defines 6 milestones from 15cm to 90cm with accessible text', () => {
  const html = fs.readFileSync(HTML_PATH, 'utf8');

  const milestones = html.match(/<li\s+class=["']milestone["']/g);
  assert.ok(milestones, 'Milestone items must exist');
  assert.strictEqual(milestones.length, 6, 'There must be exactly 6 nursery milestones');

  // Verify all 6 height markers are present
  assert.match(html, />15 cm</);
  assert.match(html, />30 cm</);
  assert.match(html, />45 cm</);
  assert.match(html, />60 cm</);
  assert.match(html, />75 cm</);
  assert.match(html, />90 cm</);

  // Verify milestone skills
  assert.match(html, /First Moon Giggle/);
  assert.match(html, /Crooked Pentatonics/);
  assert.match(html, /Nightlight Hunter/);
  assert.match(html, /Rattle & Block Stacker/);
  assert.match(html, /Rooftop Pilot/);
  assert.match(html, /Junior Dream Engineer/);
});

test('js/toys.js implements initGrowth with IntersectionObserver animation', () => {
  const toysSrc = fs.readFileSync(TOYS_JS_PATH, 'utf8');

  assert.match(toysSrc, /function\s+initGrowth\s*\(/, 'toys.js must define initGrowth');
  assert.match(toysSrc, /initGrowth\(\)/, 'PIP.toys.init must call initGrowth()');
  assert.match(toysSrc, /PIP\.watchVisible\(wrap/, 'Growth chart must animate via watchVisible IntersectionObserver');
  assert.match(toysSrc, /is-revealed/, 'Growth chart milestones must stagger reveal animation');
});

test('css/style.css defines 12-column span and reduced-motion overrides for growth chart', () => {
  const css = fs.readFileSync(CSS_PATH, 'utf8');

  assert.match(css, /\.w-growth\s*\{\s*grid-column:\s*span\s+12;/,
    '.w-growth must span 12 columns in work grid');
  assert.match(css, /prefers-reduced-motion:\s*reduce[\s\S]*\.ruler-bar/,
    'Reduced motion must override ruler-bar and milestones');
});
