import { ApolloServer } from "@apollo/server";
import { startServerAndCreateCloudflareWorkersHandler } from "@as-integrations/cloudflare-workers";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { typeDefs } from "../utils/schema";
import { resolvers } from "../utils/resolvers";
import { bearerHeader } from "../utils/headers";

// Creating the GraphQL schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

// Creating the Apollo Server instance
const server = new ApolloServer({
  schema
});

// Creating the handler for the Cloudflare Workers environment
const handler = startServerAndCreateCloudflareWorkersHandler(server, {
  context: async ({ request }) => {
    const { env } = await getCloudflareContext({ async: true });

    const authHeader = request.headers.get("authorization");
    const clientIps = request.headers.get("x-forwarded-for")?.split(/\s*,\s*/) || [""];

    await bearerHeader(authHeader, clientIps, env);

    return { db: env.D1 };
  },
});

// Export handler for GET and POST methods
export const GET = handler;
export const POST = handler;