import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";


import authRouter from "./routes/auth.route.js";
import testRouter from "./routes/test.route.js";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import chatRouter from "./routes/chat.route.js";
import messageRouter from "./routes/message.route.js";

dotenv.config();

const port = process.env.PORT;
const app = express();
const corsOptions = {
    origin: "http://localhost:5173",
    credentials:true,
  };

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/test", testRouter);
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/chats", chatRouter);
app.use("/messages", messageRouter);

app.listen(port, () => {
    console.log(`Server is running at port http://localhost:${port}`);
});
