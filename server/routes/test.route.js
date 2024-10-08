import express from "express";
import { shouldBeLoggedIn, shouldBeAdmin } from "../controllers/test.controller.js";
import { verifyToken } from "../middlewere/verifyToken.js";

const router = express.Router();

router.post("/should-be-logged-in", verifyToken, shouldBeLoggedIn);

router.post("/should-be-admin", shouldBeAdmin);

export default router;