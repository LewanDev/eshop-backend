import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: Number, required: true, unique: true },
  fecha: { type: String, required: true },

  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },

  cantidadArticulos: { type: Number, required: true },

  items: [
    {
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
      },
      color: String,
      cantidad: Number,
      precio: Number,
    },
  ],

  total: { type: Number, required: true },

  excelFile: Buffer,
});

export default mongoose.model("Order", OrderSchema);
