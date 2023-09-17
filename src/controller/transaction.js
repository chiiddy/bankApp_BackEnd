import express from "express";
import User from "../models/userModel.js";
import Transaction from "../models/transactionModel.js";
import verifyToken from "../middleware/index.js";

const transaction = express.Router();

transaction.post("/deposit", verifyToken,  async (req, res) => {
  try {
    const { userId, amount } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.balance += amount;
    await user.save();
    const transaction = new Transaction({
      user: userId,
      type: "deposit",
      amount,
    });
    await transaction.save();
    res.status(200).json({ message: "Deposit successful" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

transaction.get("/transactions/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const transactions = await Transaction.find({ user: userId }).sort({
      date: -1,
    });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

transaction.post("/withdraw", verifyToken, async (req, res) => {
  try {
    const { userId, amount } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    if (user.balance < amount) {
      throw new Error("Insufficient balance");
    }
    user.balance -= amount;
    await user.save();
    const transaction = new Transaction({
      user: userId,
      type: "withdraw",
      amount,
    });
    await transaction.save();
    res.status(200).json({ message: "Withdrawal successful" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default transaction;
