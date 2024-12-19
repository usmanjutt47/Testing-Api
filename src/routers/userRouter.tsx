import { Hono } from "hono";
import User from "../models/userModel.js";

const userRouter = new Hono();

userRouter.post("/register", async (c) => {
  try {
    const { name, email, password } = await c.req.json();

    if (!name || !email || !password) {
      return c.json(
        { success: false, message: "All fields are required" },
        400
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return c.json({ success: false, message: "Email already in use" }, 409);
    }

    const newUser = await new User({ name, email, password }).save();
    return c.json({ success: true, data: newUser }, 201);
  } catch (error) {
    console.error(error);
    return c.json({ success: false, message: "Internal Server Error" }, 500);
  }
});

userRouter.post("/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return c.json(
        { success: false, message: "Invalid email or password" },
        401
      );
    }

    return c.json({ success: true, message: "Login successful" });
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
