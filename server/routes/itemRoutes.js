import express from "express";

import {
  postItem,
  getItems,
  getItemByCode,
  putItemByCode,
  deleteItemByCode,
} from "../controllers/items.js";

import upload from "../middleware/upload.js";

const router = express.Router();

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