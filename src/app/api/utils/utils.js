import { SignJWT, EncryptJWT, jwtDecrypt } from "jose";
import { getRequestContext } from "@cloudflare/next-on-pages";

const { env } = getRequestContext();

// JWT signing/encryption key - should be in environment variables in production
const getJWTSecret = () => {
  const secret = env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment");
  };

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
};

// Ensure the key has the appropriate length (32 bytes for A256GCM)
const normalizeKey = (key) => {
  if (key.length < 32) {
    return key.padEnd(32, '0');
  };

  return key.substring(0, 32);
};

const ENCRYPTION_SECRET = new TextEncoder().encode(normalizeKey(env.ENCRYPTION_KEY));

export async function encryptMessage(text) {
  try {
    const jwt = await new EncryptJWT({ msg: text })
      .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
      .setIssuedAt()
      .encrypt(ENCRYPTION_SECRET);
    
    return jwt;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Encryption failed: ' + error.message);
  };
};

export async function decryptMessage(encryptedJWT) {
  try {
    const { payload } = await jwtDecrypt(encryptedJWT, ENCRYPTION_SECRET);

    return payload.msg;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Decryption failed: ' + error.message);
  };
};

// Function to hash password using Web Crypto API with fixed salt
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  // We use a fixed salt for the same password to always get the same hash
  const salt = env.SALT_SECRET;
  const data = encoder.encode(password + salt);
  const hash = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
};

// Function for password verification
export async function verifyPassword(inputPassword, hashedPassword) {
  const hashedInput = await hashPassword(inputPassword);

  return hashedInput === hashedPassword;
};

// Function for send deleting notification
export async function sendDeletionEmail(userEmail, messageId) {

  const brevoBody = {
    sender: {
      name: "Enigma App",
      email: `${env.EMAIL_ADDRESS}`
    },
    to: [
      {
        email: userEmail
      }
    ],
    templateId: `${env.EMAIL_TEMPLATE}`,
    params: {
      id: messageId,
    }
  };

  const brevoOptions = {
    method: "POST",
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "api-key": `${env.EMAIL_SECRET}`
    },
    body: JSON.stringify(brevoBody)
  };

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", brevoOptions);
    const data = await response.json();

    if (!response.ok) {
      console.error("Brevo error response:", data);
      throw new Error(`Failed to send email: ${data.message || response.status}`);
    };

    console.log("Email sent successfully:", data);
    return data;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  };
};