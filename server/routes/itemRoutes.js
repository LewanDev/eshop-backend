import express from "express";

import {
  postItem,
  getItems,
  getItemByCode,
  putItemByCode,
  deleteItemByCode,
  addImagesToItem, 
} from "../controllers/itemController.js";

import upload from "../middleware/upload.js";

const router = express.Router();

// POST /api/auth/newItem
router.post("/newItem", upload.array("images"), postItem);

// GET /api/auth/items
router.get("/items", getItems);

// GET /api/auth/item/:code
router.get("/item/:code", getItemByCode);

// PUT /api/auth/item/:code
router.put("/item/:code", putItemByCode);

// DELETE /api/auth/item/:code
router.delete("/item/:code", deleteItemByCode);

// POST /api/auth/item/:code/images  -> Agregar imágenes adicionales
router.post(
  "/item/:code/images",
  upload.array("images"), // soporta subida de múltiples archivos
  addImagesToItem
);

export default router;
