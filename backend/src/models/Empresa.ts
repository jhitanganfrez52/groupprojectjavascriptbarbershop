// src/models/Empresa.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../database.js";

export class Empresa extends Model {}

Empresa.init(
  {
    idEmpresa: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombreEmpresa: DataTypes.STRING,
    imageLogo: DataTypes.STRING,
    imageQR: DataTypes.STRING,
    numeroE: DataTypes.STRING,
    correoE: DataTypes.STRING,
    direccionE: DataTypes.STRING,
  },
  {
    sequelize,
    tableName: "empresa",
    timestamps: false,
  }
);