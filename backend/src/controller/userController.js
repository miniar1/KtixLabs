import User from "../Models/userModel.js"; // default import
import bcrypt from "bcrypt";

export const registerUser = async (request, reply) => {
  try {
    const { userName, email, password } = request.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return reply.code(400).send({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      userName,
      email,
      password: hashedPassword,
     
    });
    const token = request.server.jwt.sign({
      id: newUser.id,
      email: newUser.email,
      userName: newUser.userName,
    });
    reply.code(201).send({
      message: "User registered successfully",
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        userName: newUser.userName,
      },
    });
  } catch (err) {
    console.error("Error registering user", err);
    reply.code(500).send({ error: "Failed to register user" });
  }
};

export const loginUser = async (request, reply) => {
  try {
    const { email, password } = request.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return reply.code(404).send({ error: "User not found" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return reply.code(401).send({ error: "Invalid password" });
    }

    // Generate JWT token
    const token = request.server.jwt.sign({
      id: user.id,
      email: user.email,
      userName: user.userName,
    });

    reply.send({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Error logging in user", err);
    reply.code(500).send({ error: "Failed to login user" });
  }
};