import UserModel from "../modules/user.model.js"; // Ensure the path is correct
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function Register(req, res) {
  try {
    const { username, password } = req.body;

    // Check if username exists
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the new user
    const newUser = new UserModel({
      username,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function Login(req, res) {
  try {
    const { username, password } = req.body;

    const isUser = await UserModel.findOne({ username });
    if (!isUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, isUser.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Password incorrect" });
    }

    const token = jwt.sign({ id: isUser._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: { _id: isUser._id, username: isUser.username },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

const verify = (req, res) => {
  res.status(200).json({ message: "success" });
};

export { Register, Login, verify };
