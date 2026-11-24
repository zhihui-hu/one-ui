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

// concurrent misses share one upstream call, so page views never spend api quota
export async function cached<T>(
  key: string,
  ttlSeconds: number,
  load: () => Promise<T>,
): Promise<T> {
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
    const value = await load();
    memory.set(key, { value, expires: Date.now() + ttlSeconds * 1000 });
    await writeEdge(key, value, ttlSeconds);
    return value;
  })();

  inflight.set(key, task);
  try {
    return await task;
  } finally {
    inflight.delete(key);
  }
}
