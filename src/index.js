import express from "express";
import connectDB from "./config/database.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import profileRouter from "./routes/profile.js";
import requestRouter from "./routes/request.js";
import feedRouter from "./routes/feed.js";
import userRouter from "./routes/user.js";

const app = express();

app.use(express.json());
app.use(cookieParser());


app.use("/", authRouter);

app.use("/", profileRouter);

app.use("/", requestRouter);

app.use("/", feedRouter);

app.use("/", userRouter);

connectDB()
  .then(() => {
    app.listen(7777, () => {
      console.log("server successfully running on port 7777");
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error", error);
  });
