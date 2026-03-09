// src/database.ts
import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";

// modelos
import { CashRegister } from "./models/CashRegister.js";
import { Role} from "./models/Role.js";
import { User } from "./models/User.js";
import { Service } from "./models/Service.js";
import { ServiceEmployee } from "./models/ServiceEmployee.js";
dotenv.config();

if (!process.env.DB_NAME) {
  throw new Error("Variables de entorno NO cargadas");
}

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialect: "postgres",
  logging: false,

  // aquí registras los modelos
  models: [CashRegister, Role,User,Service,ServiceEmployee],
});

console.log("Instancia Sequelize creada");

export default sequelize;