import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import { createApp } from '../src/app.js';

// These requests fail validation before any Clover call is made.
let server: Server;
let base = '';
before(() => {
  server = createApp().listen(0);
  base = `http://localhost:${(server.address() as AddressInfo).port}/api`;
});
after(() => server.close());

const post = (path: string, body: unknown) =>
  fetch(base + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

const valid = {
  items: [{ itemId: 'TACOS', quantity: 1 }],
  customer: { firstName: 'Test', lastName: 'Diner', email: 'test@example.com', phone: '(540) 555-0100' },
  pickup: { asap: true },
};

test('unknown brand is a 422 from the validator', async () => {
  const res = await fetch(`${base}/thai/menu`);
  assert.equal(res.status, 422);
  assert.equal((await res.json()).error, 'Unknown restaurant.');
});

test('empty bag is rejected', async () => {
  const res = await post('/mexican/quote', { items: [] });
  assert.equal(res.status, 422);
  assert.match((await res.json()).error, /empty/);
});

test('quantity outside 1–25 is rejected', async () => {
  const res = await post('/mexican/quote', { items: [{ itemId: 'TACOS', quantity: 30 }] });
  assert.equal(res.status, 422);
  const body = await res.json();
  assert.equal(body.errors[0].field, 'items[0].quantity');
});

test('order needs a valid email and a 10-digit phone', async () => {
  let res = await post('/mexican/orders', { ...valid, customer: { ...valid.customer, email: 'nope' } });
  assert.equal((await res.json()).error, 'Please check your email address.');
  res = await post('/mexican/orders', { ...valid, customer: { ...valid.customer, phone: '555-01' } });
  assert.match((await res.json()).error, /10-digit/);
});

test('order without asap needs a pickup time', async () => {
  const res = await post('/italian/orders', { ...valid, pickup: {} });
  assert.equal(res.status, 422);
  assert.equal((await res.json()).error, 'Please choose a pickup time.');
});

test('malformed order reference is rejected', async () => {
  const res = await fetch(`${base}/orders/not-a-ref`);
  assert.equal(res.status, 422);
});

test('admin routes need the token', async () => {
  const res = await fetch(`${base}/admin/orders`);
  assert.equal(res.status, 401);
});

test('webhook refuses unsigned events', async () => {
  const res = await post('/webhooks/clover', { type: 'PAYMENT' });
  assert.ok(res.status === 401 || res.status === 503);
});
