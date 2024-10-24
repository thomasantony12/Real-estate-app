import express from "express";
import {
  addPost,
  deletePost,
  editPost,
  getPost,
  getPosts,
  savePost,
} from "../controllers/post.controller.js";
import { verifyToken } from "../middlewere/verifyToken.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", verifyToken, addPost);
router.put("/:id", verifyToken, editPost);
router.delete("/:id", verifyToken, deletePost);
router.post("/savePost", verifyToken, savePost);

export default router;
