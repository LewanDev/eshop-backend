// controllers/headingController.js
import Heading from "../models/Heading.js";
import Subheading from "../models/Subheading.js";

// Crear un Heading
export const createHeading = async (req, res) => {
  try {
    const heading = await Heading.create(req.body);
    res.status(201).json(heading);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener todos los Headings con sus Subheadings
export const getHeadings = async (req, res) => {
  try {
    const headings = await Heading.find().lean();
    const result = await Promise.all(
      headings.map(async (h) => {
        const subheadings = await Subheading.find({ heading: h._id });
        return { ...h, subheadings };
      })
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un Heading por id con sus Subheadings
export const getHeadingById = async (req, res) => {
  try {
    const heading = await Heading.findById(req.params.id);
    if (!heading) return res.status(404).json({ message: "Heading no encontrado" });

    const subheadings = await Subheading.find({ heading: heading._id });
    res.json({ ...heading.toObject(), subheadings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar un Heading
export const updateHeading = async (req, res) => {
  try {
    const heading = await Heading.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!heading)
      return res.status(404).json({ message: "Heading no encontrado" });

    res.json(heading);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar un Heading
export const deleteHeading = async (req, res) => {
  try {
    const heading = await Heading.findByIdAndDelete(req.params.id);
    if (!heading)
      return res.status(404).json({ message: "Heading no encontrado" });

    // Eliminar también todos los subheadings relacionados
    await Subheading.deleteMany({ heading: heading._id });

    res.json({ message: "Heading y subheadings eliminados correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};