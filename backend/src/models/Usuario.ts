// src/models/Usuario.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../database.js";
import { Role } from "./Role.js";

export class Usuario extends Model {}

Usuario.init(
  {
    idUsuarios: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre1:{ type: DataTypes.STRING, allowNull: false },
    nombre2: DataTypes.STRING,
    apellido1: { type: DataTypes.STRING, allowNull: false },
    apellido2: DataTypes.STRING,
    ciUsuario: {
      type: DataTypes.STRING,
      unique: true,
    },
    celularUsuario: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: DataTypes.STRING,
  },
  {
    sequelize,
    tableName: "usuarios",
    timestamps: false,
  }
);

// relaciones
Role.hasMany(Usuario, { foreignKey: "Roles_idRoles" });
Usuario.belongsTo(Role, { foreignKey: "Roles_idRoles" });