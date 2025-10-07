import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

// Config de los correos
const ADMIN_EMAILS = ["nawemarchelli@gmail.com", "nmarchelli@outlook.com"];

router.post("/", async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // correo emisor
        pass: process.env.EMAIL_PASS, // contraseña o app password
      },
    });

    const { fecha, usuario, items } = req.body;

    const total = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Cargada" : "VACÍA");

    const html = `
  <div style="font-family: 'Segoe UI', Roboto, sans-serif; background-color: #f6f7fb; padding: 30px;">
    <div style="max-width: 650px; margin: 0 auto; background-color: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 5px 25px rgba(0,0,0,0.1);">
      <div style="background-color: #111827; color: #fff; padding: 25px 35px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; letter-spacing: 0.5px;">e-Shop Deluxe</h1>
        <p style="margin-top: 8px; font-size: 15px;">Confirmación de tu pedido</p>
      </div>

      <div style="padding: 25px 35px;">
        <h2 style="color: #111827; margin-bottom: 12px;">¡Gracias por tu compra, ${
          // usuario.nombre.split(" ")[0]
          usuario.nombre
        }!</h2>
        <p style="margin-top: 0; color: #555; font-size: 15px;">
          Recibimos tu pedido el <b>${fecha}</b>. A continuación te dejamos los detalles 👇
        </p>

        <div style="margin-top: 25px; background-color: #f9fafb; padding: 15px 20px; border-radius: 8px;">
          <h3 style="margin-top: 0; color: #111827;">🧾 Datos del comprador</h3>
          <p style="margin: 6px 0;"><b>Nombre:</b> ${usuario.nombre}</p>
          <p style="margin: 6px 0;"><b>Email:</b> ${usuario.email}</p>
          <p style="margin: 6px 0;"><b>Teléfono:</b> ${usuario.telefono}</p>
        </div>

        <div style="margin-top: 25px;">
          <h3 style="color: #111827;">🛒 Detalle del pedido</h3>
          <div style="border-collapse: collapse; width: 100%; margin-top: 10px;">
            ${items
              .map(
                (i) => `
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e5e7eb; padding: 10px 0;">
                  <div style="flex: 1;">
                    <p style="margin: 0; font-weight: 500; color: #111827;">${
                      i.nombre
                    }</p>
                    <p style="margin: 0; font-size: 13px; color: #6b7280;">Color: ${
                      i.color
                    }</p>
                    <p style="margin: 0; font-size: 13px; color: #6b7280;">ID: ${
                      i.id
                    }</p>
                  </div>
                  <div style="text-align: right;">
                    <p style="margin: 0; color: #111827;">x${i.cantidad}</p>
                    <p style="margin: 0; font-weight: bold; color: #111827;">$${i.precio.toLocaleString(
                      "es-AR"
                    )}</p>
                  </div>
                </div>`
              )
              .join("")}
          </div>

          <div style="margin-top: 20px; text-align: right;">
            <p style="margin: 0; font-size: 16px; color: #111827;">
              <b>Total:</b> $${items
                .reduce((acc, i) => acc + i.precio * i.cantidad, 0)
                .toLocaleString("es-AR")}
            </p>
          </div>
        </div>

        <div style="margin-top: 30px; text-align: center;">
          <p style="color: #6b7280; font-size: 13px; line-height: 1.4;">
            e-Shop Deluxe<br/>
            Buenos Aires, Argentina<br/>
            <a href="https://eshop-frontend-woad.vercel.app/" style="color: #2563eb; text-decoration: none;">e-Shop Deluxe</a>
          </p>
        </div>
      </div>

      <div style="background-color: #111827; color: #fff; text-align: center; padding: 12px;">
        <p style="margin: 0; font-size: 13px;">
          © ${new Date().getFullYear()} e-Shop Deluxe — Todos los derechos reservados.
        </p>
      </div>
    </div>
  </div>
`;

    await transporter.sendMail({
      from: `"e-Shop Deluxe" <${process.env.EMAIL_USER}>`,
      to: ADMIN_EMAILS.join(", "),
      cc: usuario.email,
      subject: "Nuevo pedido confirmado",
      html,
    });

    res.status(200).json({ success: true, message: "Pedido enviado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
