import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { createServer } from "node:http";
import { WebSocketServer } from "ws";
import { createSchema, createYoga } from "graphql-yoga";
import { useServer } from "graphql-ws/lib/use/ws";

import pubSub from "./pubsub.js";
import resolvers from "./graphql/resolvers/index.js";

import dotenv from "dotenv";
dotenv.config();

const yoga = createYoga({
  schema: createSchema({
    typeDefs: fs.readFileSync(
      path.join(path.dirname(fileURLToPath(import.meta.url)), "graphql/schema.graphql"),
      "utf-8"
    ),
    resolvers,
  }),
  context: {
    pubSub,
  },
  graphiql: {
    subscriptionsProtocol: "WS",
  },
});

const server = createServer(yoga);

const wsServer = new WebSocketServer({
  server: server,
  path: yoga.graphqlEndpoint,
});

useServer(
  {
    execute: (args) => args.rootValue.execute(args),
    subscribe: (args) => args.rootValue.subscribe(args),
    onSubscribe: async (ctx, msg) => {
      const { schema, execute, subscribe, contextFactory, parse, validate } = yoga.getEnveloped({
        ...ctx,
        req: ctx.extra.request,
        socket: ctx.extra.socket,
        params: msg.payload,
      });

      const args = {
        schema,
        operationName: msg.payload.operationName,
        document: parse(msg.payload.query),
        variableValues: msg.payload.variables,
        contextValue: await contextFactory(),
        rootValue: {
          execute,
          subscribe,
        },
      };

      const errors = validate(args.schema, args.document);
      if (errors.length) return errors;
      return args;
    },
  },
  wsServer
);

const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.info(`Server is running on http://localhost:${port}/graphql`);
});
