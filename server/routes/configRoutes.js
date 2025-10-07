import express from "express";
import { saveConfig, getConfig } from "../controllers/configController.js";

const router = express.Router();

router.get("/", getConfig);   // obtener la configuración actual
router.post("/", saveConfig); // guardar o actualizar emails

export default router;
