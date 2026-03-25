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
import usuarioRoutes from "./routes/user.routes.js"; // clientes
import usuarioAdRoutes from "./routes/userAd.routes.js"; // admin / cajero
import empresaRoutes from "./routes/company.routes.js";
import availableRoutes from "./routes/availability.routes.js"
import serviceRoutes from "./routes/services/serviceEmployee.routes.js";
import serviceAdmRoutes from "./routes/services/serviceAd.routes.js";
import cajaRoutes from "./routes/cash.routes.js"

import reservation from"./routes/reservation.routes.js"
dotenv.config();

const app = express();

/* ======================
   MIDDLEWARES/
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

// clientes
app.use("/usuarios", usuarioRoutes);

// admin / cajeros
app.use("/admin/usuarios", usuarioAdRoutes);

// roles
app.use("/roles", roleRoutes);
// empresas
app.use("/empresas", empresaRoutes);
app.use("/disponibilidades",availableRoutes)
//servicios
app.use("/servicios", serviceRoutes);
app.use("/admin/servicios",serviceAdmRoutes);
app.use("/reservas",reservation);
app.use("/caja",cajaRoutes)
/* ======================
   SERVER
====================== */

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    console.log(" PostgreSQL conectado");

    app.listen(PORT, () => {
      console.log(` API en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(" Error al iniciar el servidor:", error);
  }
}

start();