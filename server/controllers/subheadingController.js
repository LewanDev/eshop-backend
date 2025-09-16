// controllers/subheadingController.js
import Subheading from "../models/Subheading.js";

// Crear un Subheading
export const createSubheading = async (req, res) => {
  try {
    const subheading = await Subheading.create(req.body);
    res.status(201).json(subheading);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener todos los Subheadings (con Heading populado)
export const getSubheadings = async (req, res) => {
  try {
    const subheadings = await Subheading.find().populate("heading");
    res.json(subheadings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener Subheading por id
export const getSubheadingById = async (req, res) => {
  try {
    const subheading = await Subheading.findById(req.params.id).populate("heading");
    if (!subheading) return res.status(404).json({ message: "Subheading no encontrado" });
    res.json(subheading);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
