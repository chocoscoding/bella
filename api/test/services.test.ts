import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { priceCart } from '../src/services/menu.service.js';
import { pickupWindow } from '../src/services/hours.service.js';
import { verifyCloverSignature } from '../src/services/webhook.service.js';
import { brands } from '../src/config/index.js';
import { AppError } from '../src/utils/errors.js';
import type { Menu } from '../src/types/menu.js';

const salesTax = { id: 'TAX', name: 'Sales Tax', rate: 900_000 }; // 9%
const menu: Menu = {
  brand: 'mexican',
  updatedAt: '',
  sections: [],
  items: [
    {
      id: 'TACOS', sku: 'mex-01', name: 'Tacos', price: 1299, available: true, description: '', image: null, categoryIds: [],
      taxRates: [salesTax],
      modifierGroups: [
        { id: 'P', name: 'Protein', min: 1, max: 1, options: [{ id: 'CHK', name: 'Chicken', price: 0 }, { id: 'STK', name: 'Steak', price: 200 }] },
        { id: 'X', name: 'Extras', min: 0, max: 2, options: [{ id: 'G', name: 'Guac', price: 250 }, { id: 'J', name: 'Jalapeños', price: 75 }, { id: 'C', name: 'Cheese', price: 150 }] },
      ],
    },
    { id: 'GONE', sku: null, name: 'Flan', price: 500, available: false, description: '', image: null, categoryIds: [], taxRates: [], modifierGroups: [] },
  ],
};

test('priceCart prices modifiers and Clover tax server-side', () => {
  const cart = priceCart(menu, [{ itemId: 'TACOS', quantity: 2, modifierIds: ['STK', 'G'], note: 'no onions' }]);
  assert.equal(cart.lines[0]!.unitPrice, 1299 + 200 + 250);
  assert.equal(cart.subtotal, 3498);
  assert.equal(cart.tax, 315); // 9% of 34.98, rounded
  assert.equal(cart.total, 3813);
});

test('priceCart enforces required and maximum options', () => {
  assert.throws(() => priceCart(menu, [{ itemId: 'TACOS', quantity: 1 }]), /Choose protein/);
  assert.throws(() => priceCart(menu, [{ itemId: 'TACOS', quantity: 1, modifierIds: ['CHK', 'G', 'J', 'C'] }]), /up to 2/);
  assert.throws(() => priceCart(menu, [{ itemId: 'TACOS', quantity: 1, modifierIds: ['CHK', 'NOPE'] }]), /no longer available/);
});

test('priceCart rejects unknown and sold-out items with a 422', () => {
  assert.throws(() => priceCart(menu, [{ itemId: 'NOPE', quantity: 1 }]), (e) => e instanceof AppError && e.status === 422);
  assert.throws(() => priceCart(menu, [{ itemId: 'GONE', quantity: 1 }]), /sold out/);
});

test('pickupWindow: open at noon ET, quarter-hour slots after prep time', () => {
  const noonEt = new Date('2026-11-04T17:00:00Z'); // Wednesday 12:00 EST
  const w = pickupWindow(brands.mexican, noonEt);
  assert.equal(w.openNow, true);
  assert.equal(w.slots[0]!.label, 'Today, 12:30 PM');
  assert.ok(w.slots.every((s) => new Date(s.at).getUTCMinutes() % 15 === 0));
});

test('pickupWindow: closed early morning offers only later slots', () => {
  const early = new Date('2026-11-04T12:00:00Z'); // 7:00 EST, Mexican opens 11:00
  const w = pickupWindow(brands.mexican, early);
  assert.equal(w.openNow, false);
  assert.equal(w.slots[0]!.label, 'Today, 11:30 AM');
});

test('verifyCloverSignature accepts a valid signature and rejects tampering or replay', () => {
  const secret = 'whsec_test';
  const body = '{"type":"PAYMENT","status":"APPROVED","id":"P1","data":"S1"}';
  const t = Math.floor(Date.now() / 1000);
  const v1 = createHmac('sha256', secret).update(`${t}.${body}`).digest('hex');
  assert.equal(verifyCloverSignature(body, `t=${t},v1=${v1}`, secret), true);
  assert.equal(verifyCloverSignature(body + ' ', `t=${t},v1=${v1}`, secret), false);
  assert.equal(verifyCloverSignature(body, `t=${t},v1=${v1}`, secret, (t + 3600) * 1000), false);
  assert.equal(verifyCloverSignature(body, undefined, secret), false);
});

test('displayName drops POS menu numbers but keeps real quantities', async () => {
  const { displayName } = await import('../src/services/menu.service.js');
  assert.equal(displayName('108. Quesadilla Texana'), 'Quesadilla Texana');
  assert.equal(displayName('#111 Scampi'), 'Scampi');
  assert.equal(displayName('107  Burrito Pastor'), 'Burrito Pastor');
  assert.equal(displayName('01.Kids Egg, Meat, Fries & Toast'), 'Kids Egg, Meat, Fries & Toast');
  assert.equal(displayName('304A 1/2 Biscuit Gravy'), '1/2 Biscuit Gravy');
  assert.equal(displayName('3 Tacos'), '3 Tacos');
  assert.equal(displayName('Carnitas Tacos'), 'Carnitas Tacos');
});
