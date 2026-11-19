/**
 * PipOS Kaleidoscope Radial Symmetry Drawing Toy (pip-scope.exe)
 * 8-fold radial symmetry canvas with rainbow cycling brush and PNG export.
 * Zero external dependencies. IEEE IGDTUW Open Source Week 10.0.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PipScope = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function calculateSymmetricPoints(x, y, cx, cy, folds = 8) {
    const points = [];
    const dx = x - cx;
    const dy = y - cy;
    const radius = Math.sqrt(dx * dx + dy * dy);
    const baseAngle = Math.atan2(dy, dx);
    const step = (Math.PI * 2) / folds;

    for (let i = 0; i < folds; i++) {
      const angle = baseAngle + i * step;
      points.push({
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle)
      });
      // Mirrored across symmetry axis
      const mirrorAngle = -baseAngle + i * step;
      points.push({
        x: cx + radius * Math.cos(mirrorAngle),
        y: cy + radius * Math.sin(mirrorAngle)
      });
    }
    return points;
  }

  function getNextHue(currentHue, step = 3) {
    return (currentHue + step) % 360;
  }

  function initScope() {
    const canvas = document.getElementById('scopeCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const foldsSelect = document.getElementById('scopeFolds');
    const sizeSlider = document.getElementById('scopeSize');
    const clearBtn = document.getElementById('scopeClearBtn');
    const saveBtn = document.getElementById('scopeSaveBtn');

    let isDrawing = false;
    let folds = 8;
    let brushSize = 4;
    let hue = 0;
    let lastPos = null;

    function resetCanvas() {
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Subtle center reticle
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 4, 0, Math.PI * 2);
      ctx.stroke();
    }

    resetCanvas();

    function getCoords(e) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      if (e.touches && e.touches[0]) {
        return {
          x: (e.touches[0].clientX - rect.left) * scaleX,
          y: (e.touches[0].clientY - rect.top) * scaleY
        };
      }
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    }

    function draw(pos) {
      if (!lastPos) {
        lastPos = pos;
        return;
      }

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const ptsFrom = calculateSymmetricPoints(lastPos.x, lastPos.y, cx, cy, folds);
      const ptsTo = calculateSymmetricPoints(pos.x, pos.y, cx, cy, folds);

      ctx.strokeStyle = `hsl(${hue}, 90%, 65%)`;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (let i = 0; i < ptsFrom.length; i++) {
        ctx.beginPath();
        ctx.moveTo(ptsFrom[i].x, ptsFrom[i].y);
        ctx.lineTo(ptsTo[i].x, ptsTo[i].y);
        ctx.stroke();
      }

      hue = getNextHue(hue, 4);
      lastPos = pos;
    }

    function startDraw(e) {
      isDrawing = true;
      lastPos = getCoords(e);
      draw(lastPos);
    }

    function moveDraw(e) {
      if (!isDrawing) return;
      e.preventDefault();
      draw(getCoords(e));
    }

    function endDraw() {
      isDrawing = false;
      lastPos = null;
    }

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', moveDraw);
    window.addEventListener('mouseup', endDraw);

    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', moveDraw, { passive: false });
    window.addEventListener('touchend', endDraw);

    if (foldsSelect) {
      foldsSelect.addEventListener('change', (e) => {
        folds = parseInt(e.target.value, 10) || 8;
      });
    }

    if (sizeSlider) {
      sizeSlider.addEventListener('input', (e) => {
        brushSize = parseInt(e.target.value, 10) || 4;
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', resetCanvas);
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'pip-kaleidoscope.png';
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        setTimeout(() => link.remove(), 100);
        if (typeof window.showToast === 'function') {
          window.showToast('Kaleidoscope artwork saved!');
        }
      });
    }
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initScope);
    } else {
      initScope();
    }
  }

  return {
    calculateSymmetricPoints,
    getNextHue,
    initScope
  };
});
