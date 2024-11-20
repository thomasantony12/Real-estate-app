import express from "express";
import { getUsers, getUser, updateUser, deleteUser, savePost, profilePosts, getNotificationNumber} from "../controllers/user.controller.js";
import { verifyToken } from "../middlewere/verifyToken.js";



const router = express.Router();

router.get("/", verifyToken, getUsers);

// router.get("/search/:id", verifyToken, getUser);

router.put("/:id", verifyToken, updateUser);

router.delete("/:id", verifyToken, deleteUser);

router.post("/savePost", verifyToken, savePost);

router.get("/profilePosts", verifyToken, profilePosts);

router.get("/notification", verifyToken, getNotificationNumber);

export default router;
