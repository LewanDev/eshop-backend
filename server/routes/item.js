import express from "express";

import {
  postItem,
  getItems,
  getItemByCode,
  putItemByCode,
  deleteItemByCode,
} from "../controllers/items.js";

import upload from "../controllers/items.js";

const itemRouter = express.Router();

// POST /api/auth/newItem
itemRouter.post("/newItem", upload.array("images"), postItem);

// GET /api/auth/items
itemRouter.get("/items", getItems);

// GET /api/auth/items:code
itemRouter.get("/item/:code", getItemByCode);

// PUT /api/auth/item/:code
itemRouter.put("/item/:code", putItemByCode);

// DELETE /api/auth/item/:code
itemRouter.delete("/item/:code", deleteItemByCode);

export default itemRouter;