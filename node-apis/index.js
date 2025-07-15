require("dotenv").config();
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");

const typeDefs = require("./schemas/typeDefs");
const resolvers = require("./resolvers");
const { getUserFromToken } = require("./utils/auth");

const app = express();
const PORT = process.env.PORT || 4000;

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const user = getUserFromToken(req); // decode user from token in headers
      return { user };
    },
    introspection: true,
    playground: true,
  });

  await server.start();

  server.applyMiddleware({ app, path: "/graphql" });

  mongoose.set("strictQuery", false);
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to MongoDB");
      app.listen(PORT, () =>
        console.log(
          `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
        )
      );
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
    });
}

startServer();
