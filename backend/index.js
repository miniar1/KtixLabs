import dotenv from "dotenv";
dotenv.config();

import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyJWT from "@fastify/jwt";
import fastifyStatic from "@fastify/static";
import path from "path";
import { fileURLToPath } from "url";

import sequelize from "./src/config/db.js";
import userRoutes from "./src/routes/userRoutes.js";
import boxRoutes from "./src/routes/boxRoutes.js";

import "./src/Models/userModel.js";
import "./src/Models/boxModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ CREATE APP FIRST
const app = Fastify({
  logger: true,
});

async function buildServer() {
  // ✅ CORS
  await app.register(cors, {
    origin: true,
    credentials: true,
  });

  // ✅ JWT
  await app.register(fastifyJWT, {
    secret: process.env.JWT_SECRET || "secret",
  });

  app.decorate("authenticate", async function (request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ error: "Unauthorized" });
    }
  });

  // ✅ DATABASE
  app.decorate("db", sequelize);

  // ✅ STATIC FILES (VERY IMPORTANT FOR IMAGES)
  await app.register(fastifyStatic, {
    root: path.join(__dirname, "content"), // your images folder
    prefix: "/api/content/",               // URL prefix
  });

  // ✅ TEST ROUTE
  app.get("/", async () => {
    return { status: "API running" };
  });

  // ✅ ROUTES
  await app.register(userRoutes, { prefix: "/api/users" });
  await app.register(boxRoutes, { prefix: "/api/boxes" });

  // ✅ CONNECT DATABASE
  await sequelize.authenticate();
  console.log("✅ Database connected");

  await sequelize.sync({ alter: true });
  console.log("✅ Tables synchronized");

  return app;
}

async function start() {
  try {
    const server = await buildServer();

    await server.listen({
      port: process.env.PORT || 5001,
      host: "0.0.0.0",
    });

    console.log("🚀 Server started");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();