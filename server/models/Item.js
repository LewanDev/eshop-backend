import mongoose from "mongoose";

const colorVariantSchema = new mongoose.Schema(
  {
    color: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String, // para cuando el usuario pega un link
    },
    imageFile: {
      type: String, // ruta/filename si sube archivo local (ej: guardado en /uploads)
    },
  },
  { _id: false }
);

const imageSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String, // si el usuario pega un link
    },
    imageFile: {
      type: String, // ruta/filename si sube archivo local
    },
    altText: {
      type: String, // opcional: texto alternativo
    },
    order: {
      type: Number, // opcional: orden de la imagen en el carrusel
      default: 0,
    },
  },
  { _id: false }
);

const itemSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    name: String,
    description: String,
    composition: String,
    barcode: String,
    heading: String,
    subheading: String,
    proveedor: String,
    salesUnit: String,
    aliquot: String,
    buyPrice: { type: Number, default: 0 },
    discount1: { type: Number, default: 0 },
    discount2: { type: Number, default: 0 },
    discount3: { type: Number, default: 0 },
    discount4: { type: Number, default: 0 },
    discount5: { type: Number, default: 0 },
    currency: String,
    taxlessCost: { type: Number, default: 0 },
    measure: String,
    cost: { type: Number, default: 0 },
    utility: { type: Number, default: 0 },
    articleRanking: { type: Number, default: 0 },
    enabled: { type: Boolean, default: true },
    price1: { type: Number, default: 0 },
    price2: { type: Number, default: 0 },
    price3: { type: Number, default: 0 },
    price4: { type: Number, default: 0 },
    price5: { type: Number, default: 0 },

    // Variantes de color
    colorVariants: [colorVariantSchema],


    // 👇 acá va la corrección:
    images: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Item", itemSchema);
