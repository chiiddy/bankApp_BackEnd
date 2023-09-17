import express from "express";
import * as dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import connectDB from "./src/config/connect.js";
import router from "./src/routes/index.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://magneto-banking-applications.onrender.com",
  })
);

app.use("/api", router);

async function connect() {
  try {
    app.listen(8080, () => {
      connectDB(process.env.MONGODB_PASSWORD);
      console.log("server is running on  port 8080");
    });
  } catch (err) {
    console.log(err);
  }
}
connect();
