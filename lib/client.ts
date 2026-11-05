'use client';

import { useEffect, useState } from 'react';

export interface Timed<T> {
  data: T;
  status: number;
  ms: number;
}

export async function timedFetch<T>(url: string, init?: RequestInit): Promise<Timed<T>> {
  const t0 = performance.now();
  const res = await fetch(url, { cache: 'no-store', ...init });
  const data = (await res.json()) as T;
  return { data, status: res.status, ms: Math.round(performance.now() - t0) };
}

/** Starts with server-rendered data, then refreshes from the real route. */
export function useApi<T>(url: string, initial: T) {
  const [state, setState] = useState<{ data: T; ms: number | null; status: number | null }>({
    data: initial,
    ms: null,
    status: null,
  });
  useEffect(() => {
    let live = true;
    timedFetch<T>(url)
      .then((r) => live && setState({ data: r.data, ms: r.ms, status: r.status }))
      .catch(() => live && setState((s) => ({ ...s, status: 0 })));
    return () => {
      live = false;
    };
  }, [url]);
  return state;
}

export const toast = (message: string) => window.dispatchEvent(new CustomEvent('app:toast', { detail: message }));
export const openPalette = () => window.dispatchEvent(new Event('app:palette'));

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Deterministic short hash, used for fake commit ids. */
export function shortHash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0).toString(16).padStart(8, '0').slice(0, 7);
}
