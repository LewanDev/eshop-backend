
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import authRoutes from "./routes/auth.js";
import itemRoutes from "./routes/itemRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import headingRoutes from "./routes/headingRoutes.js";
import subheadingRoutes from "./routes/subheadingRoutes.js";
import configRoutes from "./routes/configRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Configura CORS con una variable de entorno
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173", // Fallback para desarrollo local
  "https://eshop-frontend-woad.vercel.app",  /\.vercel\.app$/// Dominio de producción
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin || 
        allowedOrigins.some((allowed) =>
          allowed instanceof RegExp ? allowed.test(origin) : allowed === origin
        )
      ) {
        callback(null, origin);
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
  const dbStatus =
    mongoose.connection.readyState === 1 ? "🟢 Conectado" : "🔴 Desconectado";
  res.send(`
    <html>
      <head>
        <title>Backend E-Shop</title>
        <style>
          body { font-family: Arial; text-align:center; margin-top: 50px; background: #e0e0e0ff; }
          .card { background: white; padding: 20px; border-radius: 12px; display: inline-block; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
          h1 { color: #333; }
          .status { font-size: 1.2rem; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>🚀 Backend E-Shop Online</h1>
          <p class="status">Base de datos: ${dbStatus}</p>
          <p class="status">Uptime: ${process.uptime().toFixed(0)} seg</p>
        </div>
      </body>
    </html>
  `);
});

// Servir la carpeta uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(3000, () => console.log("Backend running..."));

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/headings", headingRoutes);
app.use("/api/subheadings", subheadingRoutes);
app.use("/api/config", configRoutes);
app.use("/api/order", orderRoutes);

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
