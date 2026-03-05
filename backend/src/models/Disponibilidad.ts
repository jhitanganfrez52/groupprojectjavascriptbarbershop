// src/models/Disponibilidad.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../database.js";
import { Usuario } from "./Usuario.js";

export class Disponibilidad extends Model {}

Disponibilidad.init(
  {
    idDisponibilidad: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fecha: DataTypes.DATEONLY,
    horaInicio: DataTypes.TIME,
    horaFin: DataTypes.TIME,
  },
  {
    sequelize,
    tableName: "disponibilidades",
    timestamps: false,
  }
);

Usuario.hasMany(Disponibilidad, { foreignKey: "empleado_id" });
Disponibilidad.belongsTo(Usuario, { foreignKey: "empleado_id" });