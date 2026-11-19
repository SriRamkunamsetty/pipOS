import { test, describe } from 'node:test';
import assert from 'node:assert';
import Converter from './converter.js';

describe('PipOS Unit & Measurement Converter (pip-converter)', () => {
  test('convertTemperature converts Celsius, Fahrenheit, and Kelvin', () => {
    assert.strictEqual(Converter.convertTemperature(0, 'c', 'f'), 32);
    assert.strictEqual(Converter.convertTemperature(100, 'c', 'f'), 212);
    assert.strictEqual(Converter.convertTemperature(32, 'f', 'c'), 0);
    assert.strictEqual(Converter.convertTemperature(212, 'f', 'c'), 100);
    assert.strictEqual(Converter.convertTemperature(0, 'c', 'k'), 273.15);
    assert.strictEqual(Converter.convertTemperature(273.15, 'k', 'c'), 0);
  });

  test('convertLength converts between metric and imperial', () => {
    assert.strictEqual(Converter.convertLength(1, 'm', 'cm'), 100);
    assert.strictEqual(Converter.convertLength(1, 'km', 'm'), 1000);
    assert.strictEqual(Converter.convertLength(1, 'in', 'cm'), 2.54);
    assert.strictEqual(Converter.convertLength(1, 'ft', 'in'), 12);
  });

  test('convertVolume converts culinary and standard volumes', () => {
    assert.strictEqual(Converter.convertVolume(1, 'l', 'ml'), 1000);
    assert.strictEqual(Converter.convertVolume(1, 'tbsp', 'tsp'), 3);
    assert.strictEqual(Converter.convertVolume(1, 'cup', 'tbsp'), 16);
  });

  test('convertWeight converts mass and weights', () => {
    assert.strictEqual(Converter.convertWeight(1, 'kg', 'g'), 1000);
    assert.strictEqual(Converter.convertWeight(1, 'lb', 'oz'), 16);
    const kgToLb = Converter.convertWeight(1, 'kg', 'lb');
    assert.ok(Math.abs(kgToLb - 2.205) < 0.01);
  });
});
