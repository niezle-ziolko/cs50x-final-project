import { v4 as uuidv4 } from "uuid";

import { signJWT } from "./utils";

export const resolvers = {
  Query: {
    getMessage: async (_, { id }, context) => {
      const { db } = context;

      const message = await db
        .prepare("SELECT * FROM messages WHERE id = ?")
        .bind(id)
        .first();

      if (!message) {
        throw new Error("Message not found");
      };

      const newSeen = message.seen + 1;

      if (newSeen > message.display) {
        await db.prepare("DELETE FROM messages WHERE id = ?").bind(id).run();
        throw new Error("Message not found");
      } else {
        await db
          .prepare("UPDATE messages SET seen = ? WHERE id = ?")
          .bind(newSeen, id)
          .run();
      };

      // Prepare data for JWT
      const messageData = {
        id: message.id,
        message: message.message,
        created_at: message.created_at,
        password: message.password,
        email: message.email,
        display: message.display,
        seen: newSeen
      };

      // Create JWT token
      const token = await signJWT(messageData);

      return {
        message: token
      };
    },
  },

  Mutation: {
    createMessage: async (_, { message, password, email, display }, context) => {
      const { db } = context;

      const created_at = new Date().toISOString();
      const id = uuidv4();
      const displayCount = display !== undefined ? display : 1;
      const seen = 0;

      await db
        .prepare(
          "INSERT INTO messages (id, message, created_at, password, email, display, seen) VALUES (?, ?, ?, ?, ?, ?, ?)"
        )
        .bind(id, message, created_at, password, email, displayCount, seen)
        .run();

      // Prepare data for JWT - only ID
      const tokenData = {
        id
      };

      // Create JWT token with only the message ID
      const token = await signJWT(tokenData);

      return {
        id: token
      };
    },

    deleteMessage: async (_, { id }, context) => {
      const { db } = context;

      const existing = await db
        .prepare("SELECT id FROM messages WHERE id = ?")
        .bind(id)
        .first();

      if (!existing) {
        return {
          message: "Message not found"
        };
      };

      await db.prepare("DELETE FROM messages WHERE id = ?").bind(id).run();

      return {
        message: "Message deleted successfully"
      };
    },
  },
};