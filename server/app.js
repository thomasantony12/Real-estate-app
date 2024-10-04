import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";


import authRouter from "./routes/auth.route.js";

dotenv.config();

const port = process.env.PORT;
const app = express();
const corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };

app.use(cors(corsOptions))
app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRouter);

app.listen(port, () => {
    console.log(`Server is running at port http://localhost:${port}`);
});
