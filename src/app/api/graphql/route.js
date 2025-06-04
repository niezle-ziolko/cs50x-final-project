import { createYoga, createSchema } from "graphql-yoga";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { typeDefs } from "utils/schema";
import { resolvers } from "utils/resolvers";
import { bearerHeader } from "utils/headers";

// Initialize Yoga GraphQL server with configuration
const yoga = createYoga({
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Request, Response },
  schema: createSchema({
    typeDefs,
    resolvers
  }),
  context: async ({ request }) => {
    // Extract environment and headers from the incoming request context
    const { env } = await getCloudflareContext({ async: true });

    const authHeader = request.headers.get("authorization"); // Get Authorization header
    const clientIps = request.headers.get("x-forwarded-for")?.split(/\s*,\s*/) || [""]; // Parse client IPs

    // Validate the bearer token from the Authorization header with client IPs and environment
    await bearerHeader(authHeader, clientIps, env);

    // Provide database handle (D1) in the GraphQL context
    return { db: env.D1 };
  },
});

// Export Next.js handlers for GET and POST HTTP methods
export const GET = yoga;
export const POST = yoga;