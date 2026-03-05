// src/models/Caja.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../database.js";

export class Caja extends Model {}

Caja.init(
  {
    idCaja: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tipo: {
      type: DataTypes.ENUM("ingreso", "egreso"),
    },
    concepto: DataTypes.STRING,
    monto: DataTypes.DOUBLE,
    metodo: {
      type: DataTypes.ENUM("efectivo", "qr", "tarjeta"),
    },
    fecha: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "caja",
    timestamps: false,
  }
);