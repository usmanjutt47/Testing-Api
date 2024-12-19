import { serve } from "@hono/node-server";
import { Hono } from "hono";
import dotenv from "dotenv";
import { logger } from "hono/logger";
import { connectDB } from "./config/connection.js";
import userRouter from "./routers/userRouter.js";

dotenv.config();

const app = new Hono();
const port = process.env.PORT || 3000;

connectDB();

app.use(logger());

app.get("/", (c) => c.text("Hello Hono!"));

app.route("/user", userRouter);

console.log(`Server is running on http://localhost:${port}`);
serve(app);
