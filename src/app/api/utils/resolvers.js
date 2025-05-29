import { v4 as uuidv4 } from "uuid";

export const resolvers = {
  Query: {
    getMessage: async (_, { id }, context) => {
      const { db } = context;

      const message = await db
        .prepare("SELECT * FROM messages WHERE id = ?")
        .bind(id)
        .first();

      if (!message) throw new Error("Message not found");

      const newSeen = message.seen + 1;

      if (newSeen > message.display) {
        await db.prepare("DELETE FROM messages WHERE id = ?").bind(id).run();
        throw new Error("Message not found");
      } else {
        await db
          .prepare("UPDATE messages SET seen = ? WHERE id = ?")
          .bind(newSeen, id)
          .run();

        message.seen = newSeen;
      };

      return message;
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

      return {
        id,
        message,
        created_at,
        password,
        email,
        display: displayCount,
        seen
      };
    },
  },
};