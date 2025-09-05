import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import {
  register,
  login,
  getProfile,
  putProfile,
} from "../controllers/auth.js";

const router = express.Router();

//POST Register
router.post("/register", register);

//POST Login
router.post("/login", login);

//GET /api/auth/profile
router.get("/profile", verifyToken, getProfile);

// PUT /api/auth/profile
router.put("/profile", verifyToken, putProfile);

export default router;
