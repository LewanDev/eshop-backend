import express from "express";
import ExcelJS from "exceljs";
import Order from "../models/Order.js";
import Client from "../models/Client.js";
import { getNextOrderNumber } from "../models/Counter.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { cliente, items } = req.body;

    // Buscar cliente en MongoDB
    const clientDB = await Client.findById(cliente);

    if (!clientDB) {
      return res.status(400).json({
        success: false,
        error: "Cliente no encontrado",
      });
    }

    const total = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
    const orderNumber = await getNextOrderNumber();

    // === Crear Excel ===
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Pedido");

    sheet.addRow(["Cliente", clientDB.name]);
    sheet.addRow(["Teléfono", clientDB.phone]);
    sheet.addRow([]);
    sheet.addRow(["ID", "Color", "Cantidad", "Precio", "Subtotal"]);

    items.forEach((i) => {
      sheet.addRow([
        i.itemId,
        i.color,
        i.cantidad,
        i.precio,
        i.precio * i.cantidad,
      ]);
    });

    sheet.addRow([]);
    sheet.addRow(["", "", "", "Total", total]);

    const buffer = await workbook.xlsx.writeBuffer();
    console.log("items recibidos:", items);

    const newOrder = new Order({
      orderNumber,
      fecha: new Date().toLocaleString(),
      cliente: clientDB._id,
      cantidadArticulos: items.length,
      items: items.map((i) => ({
        itemId: i.itemId,
        color: i.color,
        cantidad: i.cantidad,
        precio: i.precio,
      })),
      total,
      excelFile: buffer,
    });

    await newOrder.save();

    res.status(200).json({
      success: true,
      message: "Pedido guardado correctamente",
      orderNumber,
    });
  } catch (err) {
    console.error("Error al guardar pedido:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 📌 Obtener todos los pedidos
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("cliente", "name dni phone") // trae datos del cliente
      .populate("items.itemId", "name code") // trae datos del producto
      .sort({ orderNumber: -1 }); // últimos pedidos primero

    res.json({ success: true, orders });
  } catch (err) {
    console.error("Error al obtener pedidos:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ➤ Descargar XLS por ID
router.get("/:id/xls", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order || !order.excelFile) {
      return res.status(404).json({ error: "Archivo no encontrado" });
    }

    res.set({
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename=Pedido_${order.orderNumber}.xlsx`,
    });

    return res.send(order.excelFile);
  } catch (err) {
    console.error("❌ Error al descargar XLS:", err);
    return res.status(500).json({ error: "Error al descargar archivo" });
  }
});


export default router;
