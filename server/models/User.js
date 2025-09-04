import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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

// 🔒 Hook para hashear la password antes de guardar
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // si no se cambió, no la re-hasheamos

  const salt = await bcrypt.genSalt(10); // generamos "sal"
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar contraseña ingresada vs la hasheada en DB
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
