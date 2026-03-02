import express from "express";
import dotenv from "dotenv";
import sequelize from "./database.js";

// modelos (para relaciones)
import "./models/Role.js";
import "./models/Usuario.js";
import "./models/Disponibilidad.js";
import "./models/Servicio.js";
import "./models/Reserva.js";
import "./models/Caja.js";
import "./models/Empresa.js";


// rutas
import roleRoutes from "./routes/role.routes.js";
import usuarioRoutes from "./routes/usuario.routes.js";
import empresaRoutes from "./routes/empresa.routes.js";
import path from "path";


dotenv.config();

const app = express();
app.use(express.json());

/* =====================
   ROUTES
===================== */
app.use("/roles", roleRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "src/uploads")));
/* =====================
   START
===================== */
async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log(" PostgreSQL conectado");

    app.listen(process.env.PORT, () =>
      console.log(`API en http://localhost:${process.env.PORT}`)
    );
  } catch (error) {
    console.error("Error:", error);
  }
}

start();