import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    composition: {
      type: String,
    },
    barcode: {
      type: String,
    },
    heading: {
      type: String,
    },
    subheading: {
      type: String,
    },
    proveedor: {
      type: String,
    },
    salesUnit: {
      type: String,
    },
    aliquot: {
      type: String,
    },
    buyPrice: {
      type: Number,
      default: 0,
    },
    discount1: {
      type: Number,
      default: 0,
    },
    discount2: {
      type: Number,
      default: 0,
    },
    discount3: {
      type: Number,
      default: 0,
    },
    discount4: {
      type: Number,
      default: 0,
    },
    discount5: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
    },
    taxlessCost: {
      type: Number,
      default: 0,
    },
    measure: {
      type: String,
    },
    cost: {
      type: Number,
      default: 0,
    },
    utility: {
      type: Number,
      default: 0,
    },
    articleRanking: {
      type: Number,
      default: 0,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    price1: {
      type: Number,
      default: 0,
    },
    price2: {
      type: Number,
      default: 0,
    },
    price3: {
      type: Number,
      default: 0,
    },
    price4: {
      type: Number,
      default: 0,
    },
    price5: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Item", itemSchema);
