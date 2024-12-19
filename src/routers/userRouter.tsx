import { Hono } from "hono";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";

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

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await new User({
      name,
      email,
      password: hashedPassword
    }).save();
    return c.json({ success: true, data: newUser }, 201);
  } catch (error) {
    console.error(error);
    return c.json({ success: false, message: "Internal Server Error" }, 500);
  }
});

userRouter.post("/login", async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json(
        { success: false, message: "Email and password are required" },
        400
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return c.json(
        { success: false, message: "Invalid email or password" },
        401
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
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

userRouter.delete("/delete", async (c) => {
  try {
    const { email } = await c.req.json();

    if (!email) {
      return c.json({ success: false, message: "Email is required" }, 400);
    }

    const user = await User.findOneAndDelete({ email });

    if (!user) {
      return c.json({ success: false, message: "User not found" }, 404);
    }

    return c.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    return c.json({ success: false, message: "Internal Server Error" }, 500);
  }
});

export default userRouter;
