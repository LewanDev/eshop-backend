import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Client from "../models/Client.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

//POST Register
router.post("/register", async (req, res) => {
  try {
    const newUser = new User({
      email: req.body.email,
      password: req.body.password,
    });

    const savedUser = await newUser.save();

    const newClient = new Client({
      user: savedUser._id,
      name: "",
      dni: "",
      address: "",
      phone: "",
    });

    await newClient.save();

    // Actualizamos el user con la referencia al client
    savedUser.client = newClient._id;
    await savedUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({
      token,
      msg: "Usuario y cliente creados correctamente",
      user: savedUser,
      client: newClient,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al registrar usuario y cliente" });
  }
});

// //POST Register
// router.post("/register", async (req, res) => {
//   try {
//     const newUser = new User({
//       email: req.body.email,
//       password: req.body.password,
//     });

//     const savedUser = await newUser.save();

//     const newClient = new Client({
//       user: savedUser._id,
//       name: "",
//       dni: "",
//       address: "",
//       phone: "",
//     });

//     await newClient.save();
//     const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });

//     res.status(201).json({
//       token,
//       msg: "Usuario y cliente creados correctamente",
//       user: savedUser,
//       client: newClient,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Error al registrar usuario y cliente" });
//   }
// });

//POST Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // validar credenciales
    if (!email || !password) {
      return res.status(400).json({ msg: "Faltan credenciales" });
    }

    // buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Usuario no encontrado" });
    }

    // comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Contraseña incorrecta" });
    }

    // generar token con el id del usuario
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // responder sin exponer contraseña
    res.json({
      msg: "✅ Login exitoso",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("❌ Error en /login:", error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
});

//GET /api/auth/profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    //const user = await User.findById(req.userId).select("-password").populate("client");
    //const user = await User.findById(req.userId).populate("client");
    const user = await User.findById(req.userId)
      .select("-password")
      .populate("client"); // ← populate!
    console.log("✨ USUARIO encontrado en backend:", user);

    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        client: user.client || {},
      },
    });
  } catch (error) {
    console.error("❌ Error en /profile:", error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
});

// PUT /api/auth/profile
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const { name, dni, address, phone } = req.body;

    // Buscamos al cliente existente del usuario
    let client = await Client.findOne({ user: req.userId });

    if (!client) {
      // Si no existe, creamos uno
      client = new Client({
        user: req.userId,
        name,
        dni,
        address,
        phone,
      });
      await client.save();
    } else {
      // Si existe, solo actualizamos los campos
      client.name = name ?? client.name;
      client.dni = dni ?? client.dni;
      client.address = address ?? client.address;
      client.phone = phone ?? client.phone;
      await client.save();
    }

    // Opcional: actualizar user si quieres permitir cambios en name/email
    const user = await User.findById(req.userId).select("-password");

    res.json({
      msg: "Perfil actualizado",
      user: { ...user.toObject(), client },
    });
  } catch (err) {
    console.error("❌ Error en PUT /profile:", err);
    res.status(500).json({ msg: "Error en el servidor" });
  }
});

export default router;
