/**
 * PipOS Sensory Bubble Wrap Popping Toy (pip-bubbles.exe)
 * Cozy stress-relief sensory bubble wrap popping sheet with synthesized Web Audio pops.
 * Zero external dependencies. IEEE IGDTUW Open Source Week 10.0.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PipBubbles = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const BUBBLE_COUNT = 36; // 6x6 grid

  function createInitialState(count = BUBBLE_COUNT) {
    const bubbles = [];
    for (let i = 0; i < count; i++) {
      bubbles.push({ id: i, popped: false });
    }
    return {
      bubbles,
      poppedCount: 0,
      totalCount: count
    };
  }

  function popBubble(state, id) {
    if (!state || id < 0 || id >= state.bubbles.length) return false;
    const b = state.bubbles[id];
    if (b.popped) return false;
    b.popped = true;
    state.poppedCount++;
    return true;
  }

  function resetBubbles(state) {
    if (!state) return;
    state.bubbles.forEach(b => { b.popped = false; });
    state.poppedCount = 0;
  }

  let audioCtx = null;
  function playPopSound() {
    try {
      if (globalThis.window?.PIP?.audio?.isMuted && globalThis.window.PIP.audio.isMuted()) return;
      const AudioContextClass = globalThis.AudioContext || globalThis.webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioCtx) audioCtx = new AudioContextClass();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      // Realistic pop: fast pitch drop from 800Hz to 120Hz in 50ms
      const now = audioCtx.currentTime;
      const randomPitch = 700 + Math.random() * 300;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(randomPitch, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Audio fallback
    }
  }

  function initBubbles() {
    const gridEl = document.getElementById('bubblesGrid');
    const counterEl = document.getElementById('bubblesCount');
    const resetBtn = document.getElementById('bubblesResetBtn');

    if (!gridEl) return;

    const state = createInitialState();

    function updateCounter() {
      if (counterEl) {
        counterEl.textContent = `${state.poppedCount} / ${state.totalCount} Popped`;
      }
    }

    function renderGrid() {
      gridEl.innerHTML = '';
      state.bubbles.forEach(b => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `bubble-cell ${b.popped ? 'is-popped' : ''}`;
        btn.setAttribute('aria-label', `Bubble ${b.id + 1} of ${state.totalCount}`);
        btn.setAttribute('aria-pressed', String(b.popped));

        btn.addEventListener('click', () => {
          if (!b.popped) {
            popBubble(state, b.id);
            btn.classList.add('is-popped');
            btn.setAttribute('aria-pressed', 'true');
            playPopSound();
            updateCounter();

            if (state.poppedCount === state.totalCount) {
              if (typeof window.triggerConfetti === 'function') {
                window.triggerConfetti();
              }
              if (typeof window.showToast === 'function') {
                window.showToast('🎉 All bubbles popped! Click Fresh Sheet for more.');
              }
            }
          }
        });

        gridEl.appendChild(btn);
      });
      updateCounter();
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        resetBubbles(state);
        renderGrid();
      });
    }

    renderGrid();
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initBubbles);
    } else {
      initBubbles();
    }
  }

  return {
    BUBBLE_COUNT,
    createInitialState,
    popBubble,
    resetBubbles,
    playPopSound,
    initBubbles
  };
});
