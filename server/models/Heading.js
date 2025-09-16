// models/Heading.js
import mongoose from "mongoose";

const headingSchema = new mongoose.Schema(
  {
    code: {
      type: Number, // o String si querés preservar ceros
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Heading", headingSchema);
