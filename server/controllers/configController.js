import Config from "../models/Config.js";

// 📩 Guardar o actualizar configuración
export const saveConfig = async (req, res) => {
  try {
    const { emails } = req.body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ message: "Debe enviar al menos un email." });
    }

    // validamos formato
    const invalids = emails.filter(
      (email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    );
    if (invalids.length > 0) {
      return res
        .status(400)
        .json({ message: `Correos inválidos: ${invalids.join(", ")}` });
    }

    // si ya hay config guardada, actualiza
    let config = await Config.findOne();
    if (config) {
      config.emails = emails;
      await config.save();
    } else {
      config = await Config.create({ emails });
    }

    res.status(200).json({
      message: "Configuración guardada correctamente.",
      config,
    });
  } catch (error) {
    console.error("Error al guardar config:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

// 📤 Obtener configuración actual
export const getConfig = async (req, res) => {
  try {
    const config = await Config.findOne();
    if (!config) return res.status(404).json({ message: "No hay configuración guardada." });
    res.status(200).json(config);
  } catch (error) {
    console.error("Error al obtener config:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};
