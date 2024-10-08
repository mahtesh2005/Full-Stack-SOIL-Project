const express = require("express");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const db = require("./src/database");
const { ApolloServer } = require("apollo-server-express");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const http = require("http");

// Import GraphQL schema and resolvers
const { typeDefs, resolvers } = require("./src/graphql");

// Database synchronization
db.sync();

async function startApolloServer(typeDefs, resolvers) {
  const app = express();
  const httpServer = http.createServer(app);
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // GraphQL endpoint path
  const graphqlPath = "/graphql";

  // Setup GraphQL subscription server
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: graphqlPath,
  });

  // Configure WebSocket server for GraphQL subscriptions
  const serverCleanup = useServer({ schema }, wsServer);

  // Setup Apollo server
  const server = new ApolloServer({
    schema,
    plugins: [
      // Proper shutdown for the HTTP server
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  // Start Apollo server
  await server.start();
  server.applyMiddleware({ app, path: graphqlPath });

  // Enable CORS and JSON parsing
  app.use(cors());
  app.use(express.json());

  // Add your existing routes here
  require("./src/routes/user.routes.js")(express, app);
  require("./src/routes/post.routes.js")(express, app);
  require("./src/routes/profile.routes")(express, app);
  require("./src/routes/special.routes.js")(express, app);
  require("./src/routes/standard.routes.js")(express, app);
  require("./src/routes/shop.routes.js")(express, app);
  require("./src/routes/order.routes.js")(express, app);
  require("./src/routes/review.routes.js")(express, app);
  require("./src/routes/follower.routes.js")(express, app)

  // Set port and listen for requests
  const PORT = 4000;
  await new Promise((resolve) =>
    httpServer.listen({ port: PORT }, resolve)
  );
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  );
}

// Start Apollo Server
startApolloServer(typeDefs, resolvers);
