import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DB_NAME) {
  throw new Error("❌ Variables de entorno NO cargadas");
}

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialect: "postgres",
  logging: false,
});

console.log("🟢 Sequelize creado");

export default sequelize;