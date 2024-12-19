import { Hono } from "hono";
import User from "../models/userModel.js";

const userRouter = new Hono();

userRouter.post("/", async (c) => {
  try {
    const { name, email } = await c.req.json();
    const newUser = await new User({ name, email }).save();
    return c.json({ success: true, data: newUser }, 201);
  } catch (error) {
    console.error(error);
    return c.json({ success: false, message: "Internal Server Error" }, 500);
  }
});

userRouter.get("/", async (c) => {
  try {
    const users = await User.find();
    return c.json({ success: true, data: users }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ success: false, message: "Internal Server Error" }, 500);
  }
});

export default userRouter;
