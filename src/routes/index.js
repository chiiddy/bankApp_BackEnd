import express from "express";
import user from "../controller/auth.js";
import transaction from "../controller/transaction.js";

const router = express.Router();

router.use("/", user);
router.use("/", transaction);




export default router;
