import mongoose from "mongoose";

const configSchema = new mongoose.Schema(
  {
    emails: {
      type: [String],
      required: true,
      validate: {
        validator: function (arr) {
          return arr.every((email) =>
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
          );
        },
        message: "Uno o más correos electrónicos no son válidos",
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Config", configSchema);
