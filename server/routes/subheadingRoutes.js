// routes/subheadingRoutes.js
import express from "express";
import {
  createSubheading,
  getSubheadings,
  getSubheadingById,
} from "../controllers/subheadingController.js";

const router = express.Router();

router.post("/", createSubheading);
router.get("/", getSubheadings);
router.get("/:id", getSubheadingById);

export default router;
