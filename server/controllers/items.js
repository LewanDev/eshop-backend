import Item from "../models/Item.js";
import multer from "multer";

// POST nuevo item
export const postItem = async (req, res) => {
  try {
    // 📌 Los campos de texto vienen en req.body (pero como strings)
    const {
      code,
      name,
      description,
      composition,
      barcode,
      heading,
      subheading,
      proveedor,
      salesUnit,
      aliquot,
      buyPrice,
      discount1,
      discount2,
      discount3,
      discount4,
      discount5,
      currency,
      taxlessCost,
      measure,
      cost,
      utility,
      articleRanking,
      enabled,
      price1,
      price2,
      price3,
      price4,
      price5,
    } = req.body;

    // 📌 Los colores llegan como string → parseamos a array
    let colorVariants = [];
    if (req.body.colorVariants) {
      colorVariants = JSON.parse(req.body.colorVariants);
    }

    // Asociar las imágenes subidas a cada color
    if (req.files && req.files.length > 0) {
      req.files.forEach((file, idx) => {
        if (colorVariants[idx]) {
          colorVariants[idx].imageUrl = `/uploads/${file.filename}`;
        }
      });
    }

    const newItem = new Item({
      code,
      name,
      description,
      price1,
      currency,
      colorVariants,
      measure,
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error("❌ Error en POST /items:", err);
    res.status(500).json({ message: "Error al crear item" });
  }
};

// GET - Traer todos los items
export const getItems = async (req, res) => {
  try {
    const items = await Item.find(); // trae todos
    res.json(items);
  } catch (err) {
    console.error("❌ Error en GET /items:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// GET - Traer un item por código
export const getItemByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const item = await Item.findOne({ code });

    if (!item) {
      return res.status(404).json({ message: "Item no encontrado" });
    }

    res.json(item);
  } catch (err) {
    console.error("❌ Error en GET /items/:code:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// PUT - Editar un item existente por code
export const putItemByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const updates = req.body; // los campos a actualizar

    // Buscamos el item por code y lo actualizamos
    const updatedItem = await Item.findOneAndUpdate(
      { code },
      { $set: updates },
      { new: true } // retorna el item actualizado
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item no encontrado" });
    }

    res.json({
      message: "Item actualizado correctamente",
      item: updatedItem,
    });
  } catch (err) {
    console.error("❌ Error en PUT /item/:code:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// DELETE - Eliminar un item por code
export const deleteItemByCode = async (req, res) => {
  try {
    const { code } = req.params;

    const deletedItem = await Item.findOneAndDelete({ code });

    if (!deletedItem) {
      return res.status(404).json({ message: "Item no encontrado" });
    }

    res.json({
      message: "Item eliminado correctamente",
      item: deletedItem,
    });
  } catch (err) {
    console.error("❌ Error en DELETE /item/:code:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// POST - new Heading
export const postHeading = async (req, res) => {
  try {
    const { code, description } = req.body;

    const newHeader = new Heading({
      code: code,
      description: description,
    });

    await newHeader.save();
    res.status(201).json(newHeader);
  } catch (err) {
    console.error("Error en POST /heading", err);
    res.status(500).json({ message: "Error al crear el rubro" });
  }
};
