import bcrypt from "bcrypt";

// Cambiá estos valores según tu DB
const passwordAComparar = "1234"; // La contraseña que tipeaste en el frontend
const hashDeLaDB =
  "$2b$10$RWrl1vpBhXdNx84FHfYEm.96yekSBGOfGLJGl3DC/OkZjAC4fPRWS"; // Copiá el hash de MongoDB

async function test() {
  const match = await bcrypt.compare(passwordAComparar, hashDeLaDB);
  console.log("¿Coincide la contraseña con el hash?:", match);
}

test();
