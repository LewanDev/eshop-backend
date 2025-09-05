import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, 
      lowercase: true,
    },
    password: {
      type: String,
      required: false,
    },
    isAdmin: {
      type: Boolean,
      default: false, 
    },
    client: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Client" }, 
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
