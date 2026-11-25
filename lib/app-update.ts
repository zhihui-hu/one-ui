// the build serves /app-version.json with the same build id that is compiled into the bundle; a worker polls it, so detection does not depend on etag, which some cdns strip from html
const buildEnv: BuildEnv = {
  PROD: process.env.NODE_ENV === "production",
  BASE_URL: "/",
  BUILD_TIME: process.env.NEXT_PUBLIC_BUILD_TIME,
};

const CHECK_INTERVAL_MS = 60_000;

export const CHECK_NOW_EVENT = "app-update:check";

// call after a request fails in a way a newer deployment explains
export function requestUpdateCheck() {
  if (typeof window !== "undefined")
    window.dispatchEvent(new Event(CHECK_NOW_EVENT));
}

type BuildEnv = {
  PROD: boolean;
  BASE_URL: string;
  BUILD_TIME?: string;
};

type WorkerMessage = {
  type: "unchanged" | "changed" | "error";
  message?: string;
};

// returns the cleanup function; a no-op outside production browsers. `env` exists for tests
export function startAppUpdateCheck(
  onUpdate: () => void,
  env: BuildEnv = buildEnv,
): () => void {
  if (
    !env.PROD ||
    typeof Worker === "undefined" ||
    !["http:", "https:"].includes(window.location.protocol)
  )
    return () => {};

  const build = String(env.BUILD_TIME);
  const baseUrl = new URL(env.BASE_URL, window.location.origin);
  const manifestUrl = new URL("app-version.json", baseUrl).href;
  const workerUrl = new URL("app-update-checker.worker.js", baseUrl);
  workerUrl.searchParams.set("build", build);
  let worker: Worker;
  try {
    worker = new Worker(workerUrl, { name: "app-update-checker" });
  } catch (error) {
    console.debug("App update checker could not start.", error);
    return () => {};
  }

  const check = (source: string) => {
    if (document.visibilityState === "hidden") return;
    worker.postMessage({ type: "check", source, url: manifestUrl, build });
  };
  const onMessage = ({ data }: MessageEvent<WorkerMessage>) => {
    if (data?.type === "changed") onUpdate();
    else if (data?.type === "error")
      console.debug("App update check failed.", data.message);
  };
  const onWorkerError = (event: ErrorEvent) =>
    console.debug("App update worker failed.", event.message);
  const onVisibilityChange = () => {
    if (document.visibilityState === "visible") check("visibilitychange");
  };
  const onOnline = () => check("online");
  const onCheckNow = () => check("request");

  worker.addEventListener("message", onMessage);
  worker.addEventListener("error", onWorkerError);
  document.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("online", onOnline);
  window.addEventListener(CHECK_NOW_EVENT, onCheckNow);
  const interval = window.setInterval(
    () => check("interval"),
    CHECK_INTERVAL_MS,
  );
  check("mount");

  return () => {
    window.clearInterval(interval);
    worker.removeEventListener("message", onMessage);
    worker.removeEventListener("error", onWorkerError);
    document.removeEventListener("visibilitychange", onVisibilityChange);
    window.removeEventListener("online", onOnline);
    window.removeEventListener(CHECK_NOW_EVENT, onCheckNow);
    worker.terminate();
  };
}

const SNOOZE_KEY = "app-update:snoozed-on";

export function snoozeUpdateForToday() {
  try {
    localStorage.setItem(SNOOZE_KEY, new Date().toDateString());
  } catch {
    // storage may be unavailable (private mode); the prompt just returns sooner
  }
}

export function isUpdateSnoozed() {
  try {
    return localStorage.getItem(SNOOZE_KEY) === new Date().toDateString();
  } catch {
    return false;
  }
}

// the query param gets past any cached html
export function reloadForUpdate() {
  const url = new URL(window.location.href);
  url.searchParams.set("t", Date.now().toString());
  window.location.replace(url.toString());
}
