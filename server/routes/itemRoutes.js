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
router.post("/", upload.array("images"), postItem);
//router.post("/newItem", upload.array("images"), postItem);

// GET /api/auth/items
router.get("/", getItems);
//router.get("/items", getItems);

// GET /api/auth/item/:code
router.get("/:code", getItemByCode);
//router.get("/item/:code", getItemByCode);

// PUT /api/auth/item/:code
router.put("/:code", putItemByCode);
//router.put("/item/:code", putItemByCode);

// DELETE /api/auth/item/:code
router.delete("/:code", deleteItemByCode);
//router.delete("/item/:code", deleteItemByCode);

// POST /api/auth/item/:code/images  -> Agregar imágenes adicionales
router.post("/:code/images", upload.array("images"), addImagesToItem);
// router.post("/item/:code/images",upload.array("images"), // soporta subida de múltiples archivos
//   addImagesToItem
// );

export default router;
