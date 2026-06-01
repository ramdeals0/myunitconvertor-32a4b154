import { useEffect, useState, useCallback } from "react";

export interface RecentConversion {
  ts: number;
  categoryId: string;
  fromId: string;
  toId: string;
  fromSymbol: string;
  toSymbol: string;
  value: string;
  result: string;
}

const KEY = "tuc:recent-conversions:v1";
const MAX = 8;

type Listener = (items: RecentConversion[]) => void;
const listeners = new Set<Listener>();

function read(): RecentConversion[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(items: RecentConversion[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* ignore quota */
  }
  listeners.forEach((l) => l(items));
}

export function addRecentConversion(entry: Omit<RecentConversion, "ts">) {
  const items = read();
  const filtered = items.filter(
    (i) => !(i.categoryId === entry.categoryId && i.fromId === entry.fromId && i.toId === entry.toId),
  );
  const next = [{ ...entry, ts: Date.now() }, ...filtered].slice(0, MAX);
  write(next);
}

export function clearRecentConversions() {
  write([]);
}

export function useRecentConversions() {
  const [items, setItems] = useState<RecentConversion[]>(() => read());
  useEffect(() => {
    const listener: Listener = (next) => setItems(next);
    listeners.add(listener);
    setItems(read());
    return () => {
      listeners.delete(listener);
    };
  }, []);
  return items;
}

/** Counts how often each unit pair appears, by category — used for smart defaults. */
export function useFavoritePairForCategory(categoryId: string): { fromId: string; toId: string } | null {
  const items = useRecentConversions();
  const counts = new Map<string, { fromId: string; toId: string; n: number }>();
  for (const i of items) {
    if (i.categoryId !== categoryId) continue;
    const k = `${i.fromId}>${i.toId}`;
    const c = counts.get(k);
    if (c) c.n += 1;
    else counts.set(k, { fromId: i.fromId, toId: i.toId, n: 1 });
  }
  let best: { fromId: string; toId: string; n: number } | null = null;
  counts.forEach((v) => {
    if (!best || v.n > best.n) best = v;
  });
  const b = best as { fromId: string; toId: string; n: number } | null;
  return b ? { fromId: b.fromId, toId: b.toId } : null;
}


export const __useCallbackRef = useCallback; // keep tree-shake friendly export
