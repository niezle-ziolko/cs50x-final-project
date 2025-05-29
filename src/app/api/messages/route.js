import { getRequestContext } from "@cloudflare/next-on-pages";
import { bearerHeaders } from "../utils/headers";
import { v4 as uuidv4 } from "uuid";

export async function GET(request) {
  try {
    const { env } = getRequestContext();
    const authToken = env.MESSAGE_AUTH;

    const authResponse = bearerHeaders(request, authToken);
    if (authResponse) return authResponse;

    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "Missing message ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const db = env.D1;
    const result = await db.prepare("SELECT * FROM messages WHERE id = ?").bind(id).first();

    if (!result) {
      return new Response(JSON.stringify({ error: "Message not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    const isMessageExpired = (createdAt, expiresAt) => {
      const now = new Date();
      const created = new Date(createdAt);
      const diffInMs = now - created;

      switch (expiresAt) {
      case "after hour":
        return diffInMs > (60 * 60 * 1000);
      case "24 hours":
        return diffInMs > (24 * 60 * 60 * 1000);
      case "After 7 days":
        return diffInMs > (7 * 24 * 60 * 60 * 1000);
      case "After 30 days":
        return diffInMs > (30 * 24 * 60 * 60 * 1000);
      default:
        return false;
      }
    };

    if (isMessageExpired(result.created_at, result.expires_at)) {
      db.prepare("DELETE FROM messages WHERE id = ?").bind(id).run()
        .catch(error => {
          console.error("Failed to delete expired message:", error);
        });

      return new Response(JSON.stringify({ error: "Message not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    const shouldDeleteAfterSeen = result.expires_at === "after seen";

    const response = new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

    if (shouldDeleteAfterSeen) {
      db.prepare("DELETE FROM messages WHERE id = ?").bind(id).run()
        .catch(error => {
          console.error("Failed to delete message after seen:", error);
        });
    }

    return response;

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function POST(request) {
  try {
    const { env } = getRequestContext();
    const db = env.D1;

    const body = await request.json();
    console.log(body);
    const {
      message,
      password,
      email,
      expires_at
    } = body;

    const created_at = new Date().toISOString();

    if (!message || !created_at || !expires_at) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    };

    const id = uuidv4();

    await db.prepare(
      "INSERT INTO messages (id, message, created_at, password, email, expires_at) VALUES (?, ?, ?, ?, ?, ?)"
    ).bind(
      id, 
      message, 
      created_at, 
      password,
      email,
      expires_at
    ).run();

    return new Response(JSON.stringify({ success: true, id }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  };
};

export const runtime = "edge";