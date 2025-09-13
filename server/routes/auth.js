import express from "express";
import verifyToken from "../middleware/verifyToken.js";

import {
  register,
  login,
  getProfile,
  putProfile,
} from "../controllers/users.js";

import {
  postItem,
  getItems,
  getItemByCode,
  putItemByCode,
  deleteItemByCode,
} from "../controllers/items.js";

import upload from "../middleware/upload.js";

const router = express.Router();

//POST Register
router.post("/register", register);

//POST Login
router.post("/login", login);

//GET /api/auth/profile
router.get("/profile", verifyToken, getProfile);

// PUT /api/auth/profile
router.put("/profile", verifyToken, putProfile);

// POST /api/auth/newItem
router.post("/newItem", upload.array("images"), postItem);

// GET /api/auth/items
router.get("/items", getItems);

// GET /api/auth/items:code
router.get("/item/:code", getItemByCode);

// PUT /api/auth/item/:code
router.put("/item/:code", putItemByCode);

// DELETE /api/auth/item/:code
router.delete("/item/:code", deleteItemByCode);

export default router;
