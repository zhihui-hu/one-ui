const DEFAULT_TOKEN_URI = "https://oauth2.googleapis.com/token";

type KeyFile = {
  client_email: string;
  private_key: string;
  token_uri?: string;
};

const tokens = new Map<string, { value: string; expires: number }>();

// the key is the downloaded json, inline or base64
function parseKey(credentials: string): KeyFile {
  const raw = credentials.startsWith("{") ? credentials : atob(credentials);
  const key = JSON.parse(raw) as Partial<KeyFile>;
  if (!key.client_email || !key.private_key) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is not a service account key");
  }
  return key as KeyFile;
}

function base64Url(input: ArrayBuffer | string) {
  const bytes =
    typeof input === "string"
      ? new TextEncoder().encode(input)
      : new Uint8Array(input);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function signingKey(pem: string) {
  const body = pem
    .replace(/\\n/g, "\n")
    .split("\n")
    .filter((line) => line && !line.startsWith("-----"))
    .join("");
  const der = Uint8Array.from(atob(body), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey(
    "pkcs8",
    der,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

export async function googleAccessToken(
  credentials: string,
  scope: string,
): Promise<string> {
  const key = parseKey(credentials);
  const cacheKey = `${key.client_email} ${scope}`;
  const now = Math.floor(Date.now() / 1000);
  const hit = tokens.get(cacheKey);
  if (hit && hit.expires > now + 60) return hit.value;

  const tokenUri = key.token_uri ?? DEFAULT_TOKEN_URI;
  const unsigned = `${base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }))}.${base64Url(
    JSON.stringify({
      iss: key.client_email,
      scope,
      aud: tokenUri,
      iat: now,
      exp: now + 3600,
    }),
  )}`;
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    await signingKey(key.private_key),
    new TextEncoder().encode(unsigned),
  );

  const response = await fetch(tokenUri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsigned}.${base64Url(signature)}`,
    }),
    signal: AbortSignal.timeout(15_000),
  });
  const body = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
    error_description?: string;
    error?: string;
  };
  if (!body.access_token) {
    throw new Error(
      `google token error: ${body.error_description ?? body.error ?? response.status}`,
    );
  }
  tokens.set(cacheKey, {
    value: body.access_token,
    expires: now + (body.expires_in ?? 3600),
  });
  return body.access_token;
}
