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
      return res.status(400).json({ msg: "El email ya está registrado" });
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
      msg: "Usuario y cliente creados correctamente",
      user: savedUser,
      client: newClient,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al registrar usuario y cliente" });
  }
};