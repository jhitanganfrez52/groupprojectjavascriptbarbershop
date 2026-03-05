import { DataTypes, Model } from "sequelize";
import sequelize from "../database.js";
import { Usuario } from "./Usuario.js";

export class Servicio extends Model {}

Servicio.init(
  {
    idServicios: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombreServicio: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    costoServicio: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    duracionMinutos: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    descripcionServicio: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    tableName: "servicios",
    timestamps: false,
  }
);

/* =========================================
   SERVICIOS ↔ EMPLEADOS (tabla intermedia)
========================================= */

Servicio.belongsToMany(Usuario, {
  through: "servicios_empleados",
  foreignKey: "servicio_id",
  otherKey: "empleado_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Usuario.belongsToMany(Servicio, {
  through: "servicios_empleados",
  foreignKey: "empleado_id",
  otherKey: "servicio_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});