import passwordConfig from "./password-config.json" with { type: "json" };

const encoder = new TextEncoder();

function bytesToBase64(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes));
}

function base64ToBytes(value: string) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}

async function derive(password: string, salt: Uint8Array, iterations: number) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const saltBuffer = new Uint8Array(salt).buffer;
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: saltBuffer, iterations }, key, passwordConfig.keyLengthBytes * 8);
  return new Uint8Array(bits);
}

export async function hashPassword(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(passwordConfig.saltLengthBytes));
  const hash = await derive(password, salt, passwordConfig.iterations);
  return `${passwordConfig.algorithm}$${passwordConfig.iterations}$${bytesToBase64(salt)}$${bytesToBase64(hash)}`;
}

export async function verifyPassword(password: string, encoded: string) {
  try {
    const parts = encoded.split("$");
    if (parts.length !== 4) return false;
    const [algorithm, count, saltValue, expectedValue] = parts;
    const iterations = Number(count);
    if (algorithm !== passwordConfig.algorithm || !Number.isSafeInteger(iterations) || iterations < 1 || iterations > passwordConfig.iterations || !saltValue || !expectedValue) return false;
    const salt = base64ToBytes(saltValue);
    const expected = base64ToBytes(expectedValue);
    if (salt.length !== passwordConfig.saltLengthBytes || expected.length !== passwordConfig.keyLengthBytes) return false;
    const actual = await derive(password, salt, iterations);
    let difference = actual.length ^ expected.length;
    for (let index = 0; index < Math.min(actual.length, expected.length); index += 1) difference |= actual[index] ^ expected[index];
    return difference === 0;
  } catch {
    return false;
  }
}
