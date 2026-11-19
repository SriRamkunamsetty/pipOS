/**
 * PipOS Unit & Measurement Converter (pip-converter)
 * Temperature, length, cooking volume, and weight conversion engine for PipOS.
 * Zero external dependencies. IEEE IGDTUW Open Source Week 10.0.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PipConverter = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function convertTemperature(val, from, to) {
    const num = parseFloat(val);
    if (isNaN(num)) return 0;
    if (from === to) return num;

    // Convert to Celsius first
    let celsius;
    if (from === 'c') celsius = num;
    else if (from === 'f') celsius = (num - 32) * (5 / 9);
    else if (from === 'k') celsius = num - 273.15;
    else return num;

    // Convert from Celsius to target
    if (to === 'c') return Math.round(celsius * 100) / 100;
    if (to === 'f') return Math.round((celsius * (9 / 5) + 32) * 100) / 100;
    if (to === 'k') return Math.round((celsius + 273.15) * 100) / 100;
    return celsius;
  }

  const LENGTH_FACTORS = {
    m: 1,
    cm: 0.01,
    km: 1000,
    in: 0.0254,
    ft: 0.3048,
    mi: 1609.344
  };

  function convertLength(val, from, to) {
    const num = parseFloat(val);
    if (isNaN(num)) return 0;
    const fromFactor = LENGTH_FACTORS[from];
    const toFactor = LENGTH_FACTORS[to];
    if (!fromFactor || !toFactor) return num;
    const meters = num * fromFactor;
    return Math.round((meters / toFactor) * 10000) / 10000;
  }

  const VOLUME_FACTORS = {
    ml: 1,
    l: 1000,
    tsp: 4.92892,
    tbsp: 14.7868,
    cup: 236.588,
    oz: 29.5735
  };

  function convertVolume(val, from, to) {
    const num = parseFloat(val);
    if (isNaN(num)) return 0;
    const fromFactor = VOLUME_FACTORS[from];
    const toFactor = VOLUME_FACTORS[to];
    if (!fromFactor || !toFactor) return num;
    const ml = num * fromFactor;
    return Math.round((ml / toFactor) * 1000) / 1000;
  }

  const WEIGHT_FACTORS = {
    kg: 1,
    g: 0.001,
    lb: 0.45359237,
    oz: 0.028349523125
  };

  function convertWeight(val, from, to) {
    const num = parseFloat(val);
    if (isNaN(num)) return 0;
    const fromFactor = WEIGHT_FACTORS[from];
    const toFactor = WEIGHT_FACTORS[to];
    if (!fromFactor || !toFactor) return num;
    const kg = num * fromFactor;
    return Math.round((kg / toFactor) * 1000) / 1000;
  }

  function initConverter() {
    const catSelect = document.getElementById('convCategory');
    const fromVal = document.getElementById('convFromVal');
    const toVal = document.getElementById('convToVal');
    const fromUnit = document.getElementById('convFromUnit');
    const toUnit = document.getElementById('convToUnit');
    const formulaEl = document.getElementById('convFormula');

    if (!catSelect || !fromVal || !toVal) return;

    const UNITS = {
      temp: [
        { id: 'c', label: 'Celsius (°C)' },
        { id: 'f', label: 'Fahrenheit (°F)' },
        { id: 'k', label: 'Kelvin (K)' }
      ],
      length: [
        { id: 'm', label: 'Meters (m)' },
        { id: 'cm', label: 'Centimeters (cm)' },
        { id: 'km', label: 'Kilometers (km)' },
        { id: 'in', label: 'Inches (in)' },
        { id: 'ft', label: 'Feet (ft)' },
        { id: 'mi', label: 'Miles (mi)' }
      ],
      volume: [
        { id: 'cup', label: 'Cups' },
        { id: 'tbsp', label: 'Tablespoons' },
        { id: 'tsp', label: 'Teaspoons' },
        { id: 'ml', label: 'Milliliters (mL)' },
        { id: 'l', label: 'Liters (L)' },
        { id: 'oz', label: 'Fluid Ounces (fl oz)' }
      ],
      weight: [
        { id: 'kg', label: 'Kilograms (kg)' },
        { id: 'g', label: 'Grams (g)' },
        { id: 'lb', label: 'Pounds (lb)' },
        { id: 'oz', label: 'Ounces (oz)' }
      ]
    };

    function populateUnits() {
      const cat = catSelect.value;
      const list = UNITS[cat] || UNITS.temp;

      fromUnit.innerHTML = '';
      toUnit.innerHTML = '';

      list.forEach((u, i) => {
        const opt1 = document.createElement('option');
        opt1.value = u.id;
        opt1.textContent = u.label;
        if (i === 0) opt1.selected = true;
        fromUnit.appendChild(opt1);

        const opt2 = document.createElement('option');
        opt2.value = u.id;
        opt2.textContent = u.label;
        if (i === 1 || (list.length === 1 && i === 0)) opt2.selected = true;
        toUnit.appendChild(opt2);
      });

      calculate();
    }

    function calculate() {
      const cat = catSelect.value;
      const v = parseFloat(fromVal.value) || 0;
      const f = fromUnit.value;
      const t = toUnit.value;
      let res = 0;

      if (cat === 'temp') res = convertTemperature(v, f, t);
      else if (cat === 'length') res = convertLength(v, f, t);
      else if (cat === 'volume') res = convertVolume(v, f, t);
      else if (cat === 'weight') res = convertWeight(v, f, t);

      toVal.value = res;
      if (formulaEl) {
        formulaEl.textContent = `${v} ${f.toUpperCase()} = ${res} ${t.toUpperCase()}`;
      }
    }

    catSelect.addEventListener('change', populateUnits);
    fromVal.addEventListener('input', calculate);
    fromUnit.addEventListener('change', calculate);
    toUnit.addEventListener('change', calculate);

    populateUnits();
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initConverter);
    } else {
      initConverter();
    }
  }

  return {
    convertTemperature,
    convertLength,
    convertVolume,
    convertWeight,
    initConverter
  };
});
