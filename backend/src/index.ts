// src/index.ts
import express from "express";
import dotenv from "dotenv";
import sequelize from "./database.js";
import cors from "cors";
import path from "path";

// modelos (para relaciones)
import "./models/Role.js";
import "./models/User.js";
import "./models/Availability.js";
import "./models/Service.js";
import "./models/Reservation.js";
import "./models/CashRegister.js";
import "./models/Company.js";

// rutas
import roleRoutes from "./routes/role.routes.js";
import usuarioRoutes from "./routes/usuario.routes.js";
import empresaRoutes from "./routes/empresa.routes.js";

dotenv.config();

const app = express();

/* ======================
   MIDDLEWARES
====================== */

// CORS (frontend Vite)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Body JSON
app.use(express.json());

// Archivos estáticos
app.use("/uploads", express.static(path.join(process.cwd(), "src/uploads")));

/* ======================
   RUTAS
====================== */
app.use("/roles", roleRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/empresas", empresaRoutes);

/* ======================
   SERVER
====================== */
async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    console.log(" PostgreSQL conectado");

    app.listen(process.env.PORT, () => {
      console.log(` API en http://localhost:${process.env.PORT}`);
    });
  } catch (error) {
    console.error(" Error al iniciar el servidor:", error);
  }
}

start();