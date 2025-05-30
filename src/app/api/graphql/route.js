import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { ApolloServer } from "@apollo/server";
import { bearerHeader } from "utils/headers";
import { resolvers } from "utils/resolvers";
import { typeDefs } from "utils/type-defs";

const server = new ApolloServer({
  typeDefs,
  resolvers
});

const handler = startServerAndCreateNextHandler(server, {
  context: async (request) => {
    const { env } = getRequestContext();

    // Get the Authorization header
    const authHeader = request.headers.get("Authorization");
    const clientIps = request.headers.get("x-forwarded-for")?.split(/\s*,\s*/) || [""];

    await bearerHeader(authHeader, clientIps, env);

    return { db: env.D1 };
  }
});

export { handler as GET, handler as POST };
export const runtime = "edge";