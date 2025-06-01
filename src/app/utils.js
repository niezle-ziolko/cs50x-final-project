import { jwtVerify } from "jose";

export async function decryptId(encryptedId) {
  try {
    const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);
    const { payload } = await jwtVerify(encryptedId, secret);

    return payload.id;
  } catch (error) {
    console.error("Błąd odszyfrowywania ID:", error);
    throw new Error("Nieprawidłowy token ID");
  };
};

export async function decryptMessage(encryptedMessage) {
  try {
    const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);
    const { payload } = await jwtVerify(encryptedMessage, secret);

    return payload.message;
  } catch (error) {
    console.error("Błąd odszyfrowywania wiadomości:", error);
    throw new Error("Nieprawidłowy token wiadomości");
  };
};