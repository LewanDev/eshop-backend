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
    return res.status(401).json({ msg: "Token inválido o expirado: "+error });
  }
};
export default verifyToken;
