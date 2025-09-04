// middleware/verifyToken.js
import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).json({ msg: "Token requerido" });

  const token = authHeader.split(" ")[1]; // Bearer <token>
  if (!token) return res.status(403).json({ msg: "Token inválido" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // 👈 acá seteás el userId
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Token inválido o expirado"+error });
  }
};
/*
const verifyToken = (req, res, next) => {
  try {
    // Leer encabezado Authorization
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(403).json({ msg: "No se proporcionó un token" });
    }

    // El token viene como "Bearer <token>", entonces lo divido
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(403).json({ msg: "Token inválido" });
    }

    // Verifico el token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ msg: "Token no válido o expirado" });
      }

      // Si todo ok, guardo el userId en la request
      req.userId = decoded.id;
      next();
    });
  } catch (err) {
    console.error("Error en verifyToken:", err);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};
*/
export default verifyToken;
