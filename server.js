require("dotenv").config(); // Carga las variables de entorno desde el archivo .env

const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 3004;

// Middleware para analizar datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dark.html"));
});

app.post("/sendmail", async (req, res) => {
  try {
    console.log("Email enviado");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    const { Fname, Lname, Email, Comment } = req.body;

    const mailOptions = {
      from: "Remitente",
      to: process.env.EMAIL_USER,
      subject: "Enviado desde Nodemailer",
      text: `Nombre: ${Fname} ${Lname}\nEmail: ${Email}\nMensaje:\n${Comment}`,
    };

    console.log("Datos del formulario recibidos:", req.body);

    const info = await transporter.sendMail(mailOptions);

    console.log("Email enviado: " + info.response);

    res.status(200).json({ status: "success", data: req.body });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error al procesar el formulario en el servidor",
    });
  }
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
