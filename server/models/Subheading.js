// models/Subheading.js
import mongoose from "mongoose";

const subheadingSchema = new mongoose.Schema(
  {
    code: {
      type: String, // o Number
      required: true,
      unique: true,
    },
    heading: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Heading",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Subheading", subheadingSchema);
