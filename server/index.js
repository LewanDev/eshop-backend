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
  const dbStatus = mongoose.connection.readyState === 1 ? "🟢 Conectado" : "🔴 Desconectado";
  res.send(`
    <html>
      <head>
        <title>Backend E-Shop</title>
        <style>
          body { font-family: Arial; text-align:center; margin-top: 50px; background: #f5f5f5; }
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

app.listen(3000, () => console.log("Backend running on http://localhost:3000"));

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
