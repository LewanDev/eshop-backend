// routes/headingRoutes.js
import express from "express";
import {
  createHeading,
  getHeadings,
  getHeadingById,
  updateHeading,
  deleteHeading,
} from "../controllers/headingController.js";

const router = express.Router();

router.post("/", createHeading);
router.get("/", getHeadings);
router.get("/:id", getHeadingById);
router.put("/:id", updateHeading);
router.delete("/:id", deleteHeading);

export default router;
