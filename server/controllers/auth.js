import User from "../models/User.js";
import Client from "../models/Client.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    // Encriptar la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear nuevo usuario
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    // Crear nuevo cliente
    const newClient = new Client({
      user: savedUser._id,
      name: "",
      dni: "",
      address: "",
      phone: "",
    });

    await newClient.save();

    // Actualizar usuario con referencia al cliente
    savedUser.client = newClient._id;
    await savedUser.save();

    // Generar token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({
      token,
      message: "Usuario y cliente creados correctamente",
      user: savedUser,
      client: newClient,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error,
      message: "Error al registrar usuario y cliente",
    });
  }
};

//POST login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validar credenciales
    if (!email || !password) {
      return res.status(400).json({ message: "Faltan credenciales" });
    }

    // buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // generar token con el id del usuario
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // responder sin exponer contraseña
    res.json({
      message: "✅ Login exitoso",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("❌ Error en /login:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

//GET profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select("-password")
      .populate("client"); // ← populate!
    console.log("✨ USUARIO encontrado en backend:", user);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
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
    res.status(500).json({ message: "Error en el servidor" });
  }
};

//PUT profile
export const putProfile = async (req, res) => {
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
      message: "Perfil actualizado",
      user: { ...user.toObject(), client },
    });
  } catch (err) {
    console.error("❌ Error en PUT /profile:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
