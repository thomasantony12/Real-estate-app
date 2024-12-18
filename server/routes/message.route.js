import express from "express";
import { addMessage } from "../controllers/message.controller.js";
import { verifyToken } from "../middlewere/verifyToken.js";

const router = express.Router();


router.post("/:id", verifyToken, addMessage);

export default router;