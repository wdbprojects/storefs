import express from "express";
const app = express();
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import { ENV } from "./config/env";
import { auth } from "./lib/auth";
import cors from "cors";

/* BETTER AUTH */
app.all("/api/auth/*splat", toNodeHandler(auth));
/* GET SESSION */
app.get("/api/me", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return res.json(session);
});

/* MIDDLEWARES */
express.json();
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ENV.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.json({
    message:
      "Welcome to StoreFS API = Powered by PostgreSQL, Drizzle ORM & BetterAuth",
    endpoints: {
      users: "/api/users",
      products: "/api/products",
      comments: "/api/comments",
    },
  });
});

const server = app.listen(ENV.PORT, () => {
  console.log(`Server is running on port ${ENV.PORT}`);
});
