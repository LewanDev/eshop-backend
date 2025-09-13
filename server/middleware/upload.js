// backend/server/middleware/upload.js
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// __dirname equivalente en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 📂 uploads dentro de server/
const uploadPath = path.resolve(__dirname, "../uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath); // 👉 ruta absoluta y correcta
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage });

export default upload;
