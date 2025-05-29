import { createYoga, createSchema } from "graphql-yoga";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { bearerHeaders } from "utils/headers";
import { typeDefs } from "utils/type-defs";
import { resolvers } from "utils/resolvers";

const schema = createSchema({
  typeDefs,
  resolvers
});

const yoga = createYoga({
  schema,
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Request, Response },
  context: async ({ request }) => {
    const { env } = getRequestContext();
    const authResponse = bearerHeaders(request, env.MESSAGE_AUTH);
    if (authResponse) throw new Error("Unauthorized");
    return { db: env.D1 };
  }
});

export { yoga as GET, yoga as POST };
export const runtime = "edge";