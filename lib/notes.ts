import { promises as fs } from 'node:fs';
import path from 'node:path';
import { Redis } from '@upstash/redis';
import { notes as notesCopy } from '@/data/content';

export interface Note {
  id: number;
  text: string;
  name: string;
  createdAt: string;
  rotation: number;
}

/*
 * Storage
 * - Production (Vercel): Upstash Redis over REST, when UPSTASH_REDIS_REST_URL and
 *   UPSTASH_REDIS_REST_TOKEN are set.
 * - Local dev: falls back to a JSON file in .data/ (override with NOTES_DIR).
 */

const MAX_NOTES = 500;
const KEY_LIST = 'notes:list'; // newest first, JSON strings
const KEY_SEQ = 'notes:seq';

let redisClient: Redis | null | undefined;
function redis(): Redis | null {
  if (redisClient !== undefined) return redisClient;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  redisClient = url && token ? new Redis({ url, token }) : null;
  return redisClient;
}

export const storageKind = () => (redis() ? 'upstash' : 'file');

/** On Vercel the filesystem is read-only, so without Upstash the wall is unavailable. */
export const notesAvailable = () => !!redis() || !process.env.VERCEL;

const parse = (v: unknown): Note | null => {
  if (v && typeof v === 'object') return v as Note; // @upstash/redis auto-deserialises JSON
  if (typeof v === 'string') {
    try {
      return JSON.parse(v) as Note;
    } catch {
      return null;
    }
  }
  return null;
};

/* file fallback */

const DIR = process.env.NOTES_DIR || path.join(process.cwd(), '.data');
const FILE = path.join(DIR, 'notes.json');

let queue: Promise<unknown> = Promise.resolve();
function serial<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => undefined);
  return run;
}

async function readFile(): Promise<Note[]> {
  try {
    const parsed = JSON.parse(await fs.readFile(FILE, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/* public API */

/** Total number of notes ever pinned plus the newest `limit`, newest first. */
export async function listNotes(limit = 60): Promise<{ count: number; notes: Note[] }> {
  const r = redis();
  if (r) {
    const [raw, seq] = await Promise.all([r.lrange(KEY_LIST, 0, limit - 1), r.get<number>(KEY_SEQ)]);
    const notes = raw.map(parse).filter((n): n is Note => n !== null);
    return { count: Number(seq ?? notes.length), notes };
  }
  return serial(async () => {
    const all = await readFile();
    return { count: all.at(-1)?.id ?? 0, notes: [...all].reverse().slice(0, limit) };
  });
}

export async function addNote(text: string, name: string): Promise<Note> {
  const base = {
    text,
    name,
    createdAt: new Date().toISOString(),
    rotation: Math.round((Math.random() * 6 - 3) * 10) / 10,
  };
  const r = redis();
  if (r) {
    const id = await r.incr(KEY_SEQ);
    const note: Note = { id, ...base };
    await r.pipeline().lpush(KEY_LIST, JSON.stringify(note)).ltrim(KEY_LIST, 0, MAX_NOTES - 1).exec();
    return note;
  }
  return serial(async () => {
    const all = await readFile();
    const note: Note = { id: (all.at(-1)?.id ?? 0) + 1, ...base };
    all.push(note);
    await fs.mkdir(DIR, { recursive: true });
    const tmp = FILE + '.tmp';
    await fs.writeFile(tmp, JSON.stringify(all.slice(-MAX_NOTES), null, 2));
    await fs.rename(tmp, FILE);
    return note;
  });
}

/* --------------------------------------------------------------- moderation */

const BLOCKED = [
  'fuck', 'shit', 'bitch', 'cunt', 'dick', 'pussy', 'asshole', 'bastard', 'slut', 'whore',
  'nigger', 'nigga', 'faggot', 'retard', 'porn', 'xxx', 'casino', 'viagra', 'crypto airdrop',
];

const normalise = (s: string) =>
  s
    .toLowerCase()
    .replace(/[0@]/g, 'o')
    .replace(/[1!|]/g, 'i')
    .replace(/3/g, 'e')
    .replace(/[4]/g, 'a')
    .replace(/[5$]/g, 's')
    .replace(/[^a-z\s]/g, '');

export function isClean(text: string): boolean {
  const n = normalise(text);
  const squashed = n.replace(/\s+/g, '');
  return !BLOCKED.some((w) => n.includes(w) || squashed.includes(w.replace(/\s+/g, '')));
}

export function moderate(text: string): string | null {
  const t = text.trim();
  if (t.length < 2) return 'Note is too short.';
  if (t.length > notesCopy.maxLength) return `Keep it under ${notesCopy.maxLength} characters.`;
  if (/(https?:\/\/|www\.|\.(com|net|ru|xyz|top|io)\b)/i.test(t)) return 'Links are not allowed on the wall.';
  if (/(.)\1{9,}/.test(t)) return 'That looks like spam.';
  if (!isClean(t)) return 'Please keep it friendly.';
  return null;
}

/* ------------------------------------------------------------- rate limiting */

const WINDOW_S = 10 * 60;
const MAX_PER_WINDOW = 3;
const hits = new Map<string, number[]>();

/** True when this key has already posted MAX_PER_WINDOW notes in the current window. */
export async function rateLimited(key: string): Promise<boolean> {
  const r = redis();
  if (r) {
    const k = `notes:rl:${key}`;
    const n = await r.incr(k);
    if (n === 1) await r.expire(k, WINDOW_S);
    return n > MAX_PER_WINDOW;
  }
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_S * 1000);
  const limited = recent.length >= MAX_PER_WINDOW;
  if (!limited) recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return limited;
}
