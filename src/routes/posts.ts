import { Router } from "express";
import Post from "../models/Posts";
import { authenticateAccessToken, AuthRequest } from "../middleware/auth";

const router = Router();

// Get all Posts (only for authenticated users/clients)
router.get("/", authenticateAccessToken, async (req: AuthRequest, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;