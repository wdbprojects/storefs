import express from "express";
const app = express();
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import { ENV } from "./config/env";
import { auth } from "./lib/auth";
import cors from "cors";
import { userRoutes } from "./routes/user-routes";
import { productRoutes } from "./routes/product-routes";
import { commentRoutes } from "./routes/comment-routes";

/* BETTER AUTH */
app.all("/api/auth/*splat", toNodeHandler(auth));

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

/* BETTER AUTH GET SESSION */
app.get("/api/me", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return res.json(session);
});
// SIGN UP
app.post("/api/auth/sign-up/email", async (req, res) => {
  try {
    const result = await auth.api.signUpEmail({
      body: {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      },
    });
    return res.status(200).json({ success: true, user: result });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ success: false, message: "Internal Server Error!!" });
  }
});

/* BETTER AUTH SIGN UP */
app.get("/api/me", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return res.json(session);
});

app.get("/", (req, res) => {
  res.json({
    message:
      "Welcome to StoreFS API - Powered by PostgreSQL, Drizzle ORM & BetterAuth",
    endpoints: {
      users: "/api/v1/users",
      products: "/api/v1/products",
      comments: "/api/v1/comments",
    },
  });
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/comments", commentRoutes);

app.listen(ENV.PORT, () => {
  console.log(`Server is running on port ${ENV.PORT}`);
});
