"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { BRAND } from "./brand";
import type { CartLine, MenuItem } from "./api";

/** A bag line with display data cached so the bag renders before the menu loads. */
export type BagLine = CartLine & { key: string; name: string; unitPrice: number; options: string[] };

const KEY = `bella-bag-${BRAND}`;

type Bag = {
  lines: BagLine[];
  count: number;
  subtotal: number;
  ready: boolean;
  add: (item: MenuItem, modifierIds: string[], quantity: number, note: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  /** Refreshes saved lines from the live menu: current names and prices, removed items dropped. */
  syncWith: (items: MenuItem[]) => void;
};

const BagContext = createContext<Bag | null>(null);

export function BagProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<BagLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (Array.isArray(saved)) setLines(saved);
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, ready]);

  const add = useCallback((item: MenuItem, modifierIds: string[], quantity: number, note: string) => {
    const options = item.modifierGroups.flatMap((g) => g.options.filter((o) => modifierIds.includes(o.id)));
    const unitPrice = item.price + options.reduce((s, o) => s + o.price, 0);
    const key = [item.id, [...modifierIds].sort().join("."), note.trim()].join("|");
    setLines((current) => {
      const existing = current.find((l) => l.key === key);
      if (existing)
        return current.map((l) => (l.key === key ? { ...l, quantity: Math.min(25, l.quantity + quantity) } : l));
      return [...current, { key, itemId: item.id, name: item.name, unitPrice, options: options.map((o) => o.name), modifierIds, quantity, note: note.trim() }];
    });
  }, []);

  const value = useMemo<Bag>(
    () => ({
      lines,
      ready,
      count: lines.reduce((s, l) => s + l.quantity, 0),
      subtotal: lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0),
      add,
      setQuantity: (key, quantity) =>
        setLines((c) => (quantity < 1 ? c.filter((l) => l.key !== key) : c.map((l) => (l.key === key ? { ...l, quantity: Math.min(25, quantity) } : l)))),
      remove: (key) => setLines((c) => c.filter((l) => l.key !== key)),
      clear: () => setLines([]),
      syncWith: (items) =>
        setLines((current) => {
          const byId = new Map(items.map((i) => [i.id, i]));
          const next = current.flatMap((l) => {
            const item = byId.get(l.itemId);
            if (!item) return [];
            const options = item.modifierGroups.flatMap((g) => g.options).filter((o) => l.modifierIds.includes(o.id));
            const unitPrice = item.price + options.reduce((s, o) => s + o.price, 0);
            const names = options.map((o) => o.name);
            const same = l.name === item.name && l.unitPrice === unitPrice && names.join() === l.options.join();
            return [same ? l : { ...l, name: item.name, unitPrice, options: names }];
          });
          return next.length === current.length && next.every((l, i) => l === current[i]) ? current : next;
        }),
    }),
    [lines, ready, add],
  );
  return <BagContext.Provider value={value}>{children}</BagContext.Provider>;
}

export function useBag() {
  const bag = useContext(BagContext);
  if (!bag) throw new Error("useBag must be used inside <BagProvider>");
  return bag;
}
