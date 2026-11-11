import { readFile, writeFile, rename, mkdir } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import path from 'node:path';
import { dataDir } from '../config/index.js';
import type { Order } from '../types/order.js';

// A small JSON-file ledger of online orders. Fine for one process in
// development; swap for a database before running more than one instance.
const file = path.resolve(dataDir, 'orders.json');
let orders = new Map<string, Order>();
let loaded = false;
let writing: Promise<void> = Promise.resolve();

async function load() {
  if (loaded) return;
  try {
    const list = JSON.parse(await readFile(file, 'utf8')) as Order[];
    orders = new Map(list.map((o) => [o.ref, o]));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') throw err;
  }
  loaded = true;
}

function persist() {
  const snapshot = JSON.stringify([...orders.values()], null, 2);
  writing = writing.then(async () => {
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(`${file}.tmp`, snapshot);
    await rename(`${file}.tmp`, file);
  });
  return writing;
}

const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const REF_PATTERN = /^BC-[A-HJ-NP-Z2-9]{6}$/;

export function newRef(): string {
  return 'BC-' + [...randomBytes(6)].map((b) => alphabet[b % alphabet.length]).join('');
}

export const orderStore = {
  async get(ref: string) {
    await load();
    return orders.get(ref) || null;
  },
  async list() {
    await load();
    return [...orders.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  async find(predicate: (o: Order) => boolean) {
    await load();
    return [...orders.values()].find(predicate) || null;
  },
  async save(order: Order) {
    await load();
    order.updatedAt = new Date().toISOString();
    orders.set(order.ref, order);
    await persist();
    return order;
  },
};
