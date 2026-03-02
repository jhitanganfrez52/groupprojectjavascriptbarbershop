// src/models/Role.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../database.js";

export class Role extends Model {}

Role.init(
  {
    idRoles: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombreRol: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: "roles",
    timestamps: false,
  }
);