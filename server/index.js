import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// Configura CORS con una variable de entorno
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173", // Fallback para desarrollo local
  "https://eshop-frontend-woad.vercel.app", // Dominio de producción
];

// Configura CORS para permitir el origen del frontend
app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir solicitudes sin origen (como Postman) o desde orígenes permitidos
      console.log("origin: " + origin);
      console.log("allowed origin: " + allowedOrigins);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin); // Devolver el origen exacto en lugar de '*'
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//Middleware
app.use(express.json());

// Rutas de prueba
app.get("/", (req, res) => {
  res.send("The API is connected and online correctly");
});

// Rutas
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server online`));
  })
  .catch((err) => console.error("❌ Error when connecting MongoDB:", err));
