import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// Configura CORS con una variable de entorno
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5000", // Fallback para desarrollo local
  "https://eshop-frontend-woad.vercel.app", // Dominio de producción
];

// Configura CORS para permitir el origen del frontend
app.use(
  cors({
    origin: (origin, callback) => {
      // Permite solicitudes sin origen (como Postman) o desde orígenes permitidos
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
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
    console.log("✅ Conectado a MongoDB");
    app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
  })
  .catch((err) => console.error("❌ Error al conectar MongoDB:", err));
