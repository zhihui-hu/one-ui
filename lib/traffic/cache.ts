type Entry = { value: unknown; expires: number };

const memory = new Map<string, Entry>();
const inflight = new Map<string, Promise<unknown>>();

// the workers cache api is per colo; next dev has no `caches`, so memory covers it there
function edgeCache(): Cache | undefined {
  const store = (globalThis as { caches?: CacheStorage & { default?: Cache } })
    .caches;
  return store?.default;
}

const cacheUrl = (key: string) =>
  `https://traffic-cache.internal/${encodeURIComponent(key)}`;

async function readEdge<T>(key: string): Promise<T | undefined> {
  const cache = edgeCache();
  if (!cache) return undefined;
  try {
    const hit = await cache.match(cacheUrl(key));
    return hit ? ((await hit.json()) as T) : undefined;
  } catch {
    return undefined;
  }
}

async function writeEdge(key: string, value: unknown, ttl: number) {
  const cache = edgeCache();
  if (!cache) return;
  try {
    await cache.put(
      cacheUrl(key),
      new Response(JSON.stringify(value), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": `public, max-age=${ttl}`,
        },
      }),
    );
  } catch {}
}

type Options = {
  ttl: number;
  // after a failure, no upstream call for this long; protects rate-limited apis like bing
  backoff?: number;
};

// last good result, served with `stale: true` while the upstream keeps failing
const LAST_GOOD_TTL = 7 * 86_400;

// concurrent misses share one upstream call, so page views never spend api quota
export async function cached<T extends object>(
  key: string,
  { ttl, backoff = 600 }: Options,
  load: () => Promise<T>,
): Promise<T & { stale?: boolean }> {
  const hit = memory.get(key);
  if (hit && hit.expires > Date.now()) return hit.value as T;

  const pending = inflight.get(key);
  if (pending) return pending as Promise<T>;

  const task = (async () => {
    const edge = await readEdge<T>(key);
    if (edge !== undefined) {
      memory.set(key, { value: edge, expires: Date.now() + 30_000 });
      return edge;
    }
    try {
      const failed = await readEdge<{ message: string }>(`${key}:failed`);
      if (failed) throw new Error(failed.message);
      const value = await load();
      memory.set(key, { value, expires: Date.now() + ttl * 1000 });
      await Promise.all([
        writeEdge(key, value, ttl),
        writeEdge(`${key}:last`, value, LAST_GOOD_TTL),
      ]);
      return value;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await writeEdge(`${key}:failed`, { message }, backoff);
      const last = await readEdge<T>(`${key}:last`);
      if (last === undefined) throw error;
      const stale = { ...last, stale: true, staleReason: message };
      memory.set(key, { value: stale, expires: Date.now() + 60_000 });
      return stale;
    }
  })();

  inflight.set(key, task);
  try {
    return await task;
  } finally {
    inflight.delete(key);
  }
}
