import express from "express";
import { getFeedPosts, getUserPosts, likePost, addComment, deleteUserPost, editPost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";


const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

//delete
router.delete("/:postId/posts", deleteUserPost);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);
router.patch("/:id/update", verifyToken, editPost);
router.patch("/:id/comment", verifyToken, addComment);

export default router;
