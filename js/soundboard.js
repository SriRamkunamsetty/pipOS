/**
 * PipOS Interactive Procedural Soundboard (pip-soundboard.exe)
 * Procedural voice chirps, yawns, and giggles synthesized with Web Audio.
 * Zero external dependencies. IEEE IGDTUW Open Source Week 10.0.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PipSoundboard = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const SOUND_CATALOG = [
    { id: 'yawn', name: '🥱 Sleepy Yawn', desc: 'Gentle descending breath' },
    { id: 'giggle', name: '🤭 Cute Giggle', desc: 'Bubbly playful pitch hops' },
    { id: 'chirp', name: '🐣 Curious Chirp', desc: 'Bright upward sweep' },
    { id: 'chime', name: '✨ Starlight Chime', desc: 'Sparkling high arpeggio' },
    { id: 'sigh', name: '😌 Snuggle Sigh', desc: 'Warm cozy breath release' },
    { id: 'lullaby', name: '🎶 Bedtime Note', desc: 'Soft bedtime melody resolve' }
  ];

  let audioCtx = null;
  function getAudioContext() {
    if (audioCtx) return audioCtx;
    const AudioContextClass = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AudioContextClass) return null;
    audioCtx = new AudioContextClass();
    return audioCtx;
  }

  function playProceduralSound(id) {
    try {
      if (globalThis.window?.PIP?.audio?.isMuted && globalThis.window.PIP.audio.isMuted()) return;
      const ctx = getAudioContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;

      if (id === 'chirp') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.25, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (id === 'yawn') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.linearRampToValueAtTime(520, now + 0.3);
        osc.frequency.exponentialRampToValueAtTime(220, now + 1.2);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.4);
      } else if (id === 'giggle') {
        const notes = [587.33, 659.25, 783.99, 880.00];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const start = now + idx * 0.07;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, start);

          gain.gain.setValueAtTime(0.001, start);
          gain.gain.linearRampToValueAtTime(0.2, start + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.08);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + 0.09);
        });
      } else if (id === 'chime') {
        const freqs = [523.25, 659.25, 783.99, 1046.50];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const start = now + idx * 0.08;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, start);

          gain.gain.setValueAtTime(0.001, start);
          gain.gain.linearRampToValueAtTime(0.2, start + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + 0.32);
        });
      } else if (id === 'sigh') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.8);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.9);
      } else if (id === 'lullaby') {
        const chord = [261.63, 329.63, 392.00];
        chord.forEach(freq => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.12, now + 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 1.0);
        });
      }
    } catch {
      // Audio fallback
    }
  }

  function initSoundboard() {
    const gridEl = document.getElementById('soundboardGrid');
    if (!gridEl) return;

    gridEl.innerHTML = '';
    SOUND_CATALOG.forEach(snd => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'sound-card';
      card.setAttribute('aria-label', `Play ${snd.name}`);

      const title = document.createElement('span');
      title.className = 'sound-card-title';
      title.textContent = snd.name;

      const desc = document.createElement('span');
      desc.className = 'sound-card-desc';
      desc.textContent = snd.desc;

      card.appendChild(title);
      card.appendChild(desc);

      card.addEventListener('click', () => {
        playProceduralSound(snd.id);
        card.classList.add('is-playing');
        setTimeout(() => card.classList.remove('is-playing'), 300);
      });

      gridEl.appendChild(card);
    });
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initSoundboard);
    } else {
      initSoundboard();
    }
  }

  return {
    SOUND_CATALOG,
    playProceduralSound,
    initSoundboard
  };
});
