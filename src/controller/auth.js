import express from "express";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import verifyToken from "../middleware/index.js";

const user = express.Router();

user.post("/signup", async (req, res) => {
 
  const { phoneNumber, password } = req.body;

  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password is less than 8 characters" });
  }
  try {
    bcrypt.hash(password, 10).then(async (hash) => {
      await User.create({ phoneNumber, password: hash }).then((user) => {
        const maxAge = 3 * 60 * 60;
        const token = jwt.sign(
          { id: user._id, phoneNumber },
          process.env.JWT_SECRECT_KEY,
          { expiresIn: maxAge }
        );
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ message: "User successfully created", user });
      });
    });
  } catch (err) {
    res.status(400).json({
      message: "User not successfully created",
      error: err.message,
    });
  }
});

function generateToken(userId) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRECT_KEY, {
    expiresIn: "1h",
  });
  return token;
}

user.post("/signin", async (req, res) => {
  const { phoneNumber, password } = req.body;
  if (!phoneNumber || !password) {
    return res
      .status(400)
      .json({ message: "phoneNumber or password not provided " });
  }
  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      res
        .status(400)
        .json({ message: "Login not successful", error: "User not found" });
    } else {
      bcrypt.compare(password, user.password).then(function (result) {
        if (result) {
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign(
            { id: user._id, phoneNumber },
            process.env.JWT_SECRECT_KEY,
            { expiresIn: maxAge }
          );
          // user.token = token;
          res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
          res.status(201).json({ message: "Login successful", user, token });
        } else {
          res.status(400).json({ message: "Invalid Credentials" });
        }
      });
    }
  } catch (err) {
    res.status(400).json({ message: "An error occurred", error: err.message });
  }
});

export default user;
