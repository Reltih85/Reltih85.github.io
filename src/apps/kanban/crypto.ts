// src/apps/kanban/crypto.ts
const enc = new TextEncoder();

/** utils base64 */
export function b64(arr: Uint8Array) {
  return btoa(String.fromCharCode(...arr));
}
export function fromB64(s: string) {
  return new Uint8Array(atob(s).split("").map((c) => c.charCodeAt(0)));
}
export function randomSalt(bytes = 16): Uint8Array {
  const s = new Uint8Array(bytes);
  crypto.getRandomValues(s);
  return s;
}

/** importa la contraseña como clave base para PBKDF2 */
async function importKeyFromPassword(password: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );
}

/** deriva material estable a partir de password + salt */
async function deriveMaterial(
  password: string,
  salt: Uint8Array,
  iterations = 120_000
): Promise<Uint8Array> {
  const baseKey = await importKeyFromPassword(password);

  // 👇 usa el ArrayBuffer subyacente para evitar el error de TS
    const params = {
    name: "PBKDF2",
    hash: "SHA-256",
    salt: salt.buffer as ArrayBuffer,
    iterations,
    } satisfies Pbkdf2Params;


  const alg: AesKeyGenParams = { name: "AES-GCM", length: 256 };

  const derivedKey = await crypto.subtle.deriveKey(
    params,
    baseKey,
    alg,
    true,
    ["encrypt", "decrypt"]
  );

  const raw = new Uint8Array(await crypto.subtle.exportKey("raw", derivedKey));
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", raw));
  return digest; // 32 bytes
}

/** API pública: crear salt+hash (base64) */
export async function createSaltAndHash(password: string) {
  const salt = randomSalt();
  const material = await deriveMaterial(password, salt);
  return { salt: b64(salt), hash: b64(material) };
}

/** API pública: verificar password contra salt+hash */
export async function verifyPassword(
  password: string,
  saltB64: string,
  expectedHashB64: string
) {
  const mat = await deriveMaterial(password, fromB64(saltB64));
  return b64(mat) === expectedHashB64;
}
