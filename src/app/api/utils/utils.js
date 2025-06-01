import { SignJWT, jwtDecrypt, EncryptJWT, generateSecret } from "jose";
import { getRequestContext } from "@cloudflare/next-on-pages";

// JWT signing/encryption key - should be in environment variables in production
const getJWTSecret = () => {
  const { env } = getRequestContext();
  const secret = env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment");
  }

  return new TextEncoder().encode(secret); // must be 256-bit (32 bytes)
};

// Function to create JWT using jose library
export async function signJWT(payload) {
  const secret = getJWTSecret();

  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);

  return jwt;
}

// Function to encrypt a payload using A256GCM
export async function encryptWithA256GCM(payload) {
  const secret = getJWTSecret();

  if (secret.length !== 32) {
    throw new Error("JWT_SECRET must be 32 bytes long for A256GCM");
  }

  const jwe = await new EncryptJWT(payload)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" }) // 'dir' = direct encryption using symmetric key
    .setIssuedAt()
    .setExpirationTime("24h")
    .encrypt(secret);

  return jwe;
}

// Example: decrypting JWE token (optional helper)
export async function decryptWithA256GCM(jweToken) {
  const secret = getJWTSecret();
  const { payload } = await jwtDecrypt(jweToken, secret, {
    clockTolerance: "1 min"
  });

  return payload;
}
