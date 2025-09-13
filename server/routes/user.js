import express from "express";
import verifyToken from "../middleware/verifyToken.js";

import {
  register,
  login,
  getProfile,
  putProfile,
} from "../controllers/users.js";

const userRouter = express.Router();

//POST Register
userRouter.post("/register", register);

//POST Login
userRouter.post("/login", login);

//GET /api/auth/profile
userRouter.get("/profile", verifyToken, getProfile);

// PUT /api/auth/profile
userRouter.put("/profile", verifyToken, putProfile);

export default userRouter;