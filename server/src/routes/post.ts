import express, { Router } from "express";
import { addDepartment, createPost, deletePost, deptByUser, postByUser, updatePost, userPost } from "../controllers/post";
import { canEditDeletePost, requiresSignin } from "../middlewares";

const router: Router = express.Router();

router.post("/create-post", requiresSignin, createPost);
router.get("/user-posts", requiresSignin, postByUser);
router.get("/user-post/:id", requiresSignin, userPost);
router.put(
  "/update-post/:id",
  requiresSignin,
  canEditDeletePost,
  updatePost
)
router.delete(
  "/delete-post/:id",
  requiresSignin,
  canEditDeletePost,
  deletePost
);
router.post('/dept', requiresSignin, addDepartment);
router.get('/dept', requiresSignin, deptByUser);



module.exports = router;