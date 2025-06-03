import { v4 as uuidv4 } from "uuid";

import { signJWT, hashPassword, verifyPassword } from "./utils";

export const resolvers = {
  Query: {
    getMessage: async (_, { id }, context) => {
      const { db } = context;

      // Fetch message record from the database by its ID
      const message = await db
        .prepare("SELECT * FROM messages WHERE id = ?")
        .bind(id)
        .first();

      // If no message found, throw an error
      if (!message) {
        throw new Error("Message not found");
      };

      // Increment the number of times the message has been seen
      const newSeen = message.seen + 1;

      // If the new seen count exceeds the allowed display limit, delete the message
      if (newSeen > message.display) {
        await db.prepare("DELETE FROM messages WHERE id = ?").bind(id).run();
        
        throw new Error("Message not found");
      } else {
        // Otherwise, update the seen count in the database
        await db
          .prepare("UPDATE messages SET seen = ? WHERE id = ?")
          .bind(newSeen, id)
          .run();
      };

      // Prepare the data payload to include in the JWT token
      const messageData = {
        id: message.id,
        message: message.message,
        created_at: message.created_at,
        password: message.password,
        email: message.email,
        display: message.display,
        seen: newSeen,
      };

      // Sign the message data payload into a JWT token
      const token = await signJWT(messageData);

      // Return the JWT token containing the message information
      return { message: token };
    },
  },

  Mutation: {
    createMessage: async (_, { message, password, email, display }, context) => {
      const { db } = context;

      // Generate current timestamp in ISO format for message creation
      const created_at = new Date().toISOString();

      // Generate a unique UUID for the new message
      const id = uuidv4();

      // Use provided display count or default to 1
      const displayCount = display !== undefined ? display : 1;

      // Initialize seen count to zero for new message
      const seen = 0;

      // If a password is provided and not empty, hash it before storing
      let hashedPassword = null;
      if (password && password.trim() !== "") {
        hashedPassword = await hashPassword(password);
      };

      // Insert the new message record into the database with all relevant fields
      await db
        .prepare(
          "INSERT INTO messages (id, message, created_at, password, email, display, seen) VALUES (?, ?, ?, ?, ?, ?, ?)"
        )
        .bind(id, message, created_at, hashedPassword, email, displayCount, seen)
        .run();

      // Sign a JWT token with the message ID to return as confirmation
      const token = await signJWT({ id });

      // Return the signed token containing the new message ID
      return { id: token };
    },

    deleteMessage: async (_, { id }, context) => {
      const { db } = context;

      // Check if a message with the given ID exists
      const existing = await db
        .prepare("SELECT id FROM messages WHERE id = ?")
        .bind(id)
        .first();

      // If no message found, return an informative message
      if (!existing) {
        return { message: "Message not found" };
      };

      // Delete the message from the database by ID
      await db.prepare("DELETE FROM messages WHERE id = ?").bind(id).run();

      // Return success confirmation message
      return { message: "Message deleted successfully" };
    },

    verifyPassword: async (_, { id, password }, context) => {
      const { db } = context;

      // Retrieve the hashed password for the message with the given ID
      const message = await db
        .prepare("SELECT password FROM messages WHERE id = ?")
        .bind(id)
        .first();

      // If message not found, indicate failure
      if (!message) {
        return { success: false, message: "Message not found" };
      };

      try {
        // Verify that the provided password matches the stored hashed password
        const isValid = await verifyPassword(password, message.password);

        // Return a message indicating whether the password is correct or invalid
        return { message: isValid ? "Password correct" : "Invalid password" };
      } catch (error) {
        // If error occurs during verification, return error message
        return { message: "Error verifying password" };
      };
    },
  },
};