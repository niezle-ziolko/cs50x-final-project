import { getRequestContext } from "@cloudflare/next-on-pages";
import { createYoga, createSchema } from "graphql-yoga";
import { verify } from "jsonwebtoken";

export const runtime = "edge";

const typeDefs = /* GraphQL */ `
  type Message {
    id: String!
    message: String!
    created_at: String!
    email: String
    expires_at: String!
  }

  type Query {
    getMessage(id: String!): Message
  }
`;

const resolvers = {
  Query: {
    getMessage: async (_, { id }, { env, user }) => {
      if (!user) throw new Error("Unauthorized");

      const db = env.D1;
      const result = await db.prepare("SELECT * FROM messages WHERE id = ?").bind(id).first();

      if (!result) throw new Error("Message not found");

      const now = new Date();
      const created = new Date(result.created_at);
      const diff = now.getTime() - created.getTime();

      const expired = {
        "after hour": diff > 3600000,
        "24 hours": diff > 86400000,
        "After 7 days": diff > 7 * 86400000,
        "After 30 days": diff > 30 * 86400000,
      }[result.expires_at] ?? false;

      if (expired) {
        db.prepare("DELETE FROM messages WHERE id = ?").bind(id).run().catch(console.error);
        throw new Error("Message expired");
      }

      if (result.expires_at === "after seen") {
        db.prepare("DELETE FROM messages WHERE id = ?").bind(id).run().catch(console.error);
      }

      return result;
    },
  },
};

const schema = createSchema({ typeDefs, resolvers });

const yoga = createYoga({
  schema,
  graphqlEndpoint: "/api/graphql",
  context: async ({ request }) => {
    const { env } = getRequestContext();
    const auth = request.headers.get("authorization");
    let user = null;

    if (auth?.startsWith("Bearer ")) {
      const token = auth.split(" ")[1];
      try {
        user = verify(token, env.JWT_SECRET); // <-- Wymaga zmiennej środowiskowej `JWT_SECRET`
      } catch (e) {
        console.warn("Invalid JWT:", e);
      }
    }

    return { env, user };
  },
});

export { yoga as GET, yoga as POST };
