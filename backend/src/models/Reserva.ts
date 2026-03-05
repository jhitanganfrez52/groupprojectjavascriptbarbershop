// src/models/Reserva.ts
import { DataTypes, Model } from "sequelize";
import type {
  BelongsToManySetAssociationsMixin,
} from "sequelize";
import sequelize from "../database.js";
import { Usuario } from "./Usuario.js";
import { Disponibilidad } from "./Disponibilidad.js";
import { Servicio } from "./Servicio.js";

export class Reserva extends Model {
  declare setServicios: BelongsToManySetAssociationsMixin<
    Servicio,
    number
  >;
}

Reserva.init(
  {
    idReservas: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    horaInicio: DataTypes.TIME,
    horaFin: DataTypes.TIME,
    detalle: DataTypes.TEXT,
    estado: {
      type: DataTypes.ENUM("pendiente", "confirmada", "atendida", "cancelada"),
      defaultValue: "pendiente",
    },
  },
  {
    sequelize,
    tableName: "reservas",
    timestamps: false,
  }
);

/* relaciones */
Reserva.belongsToMany(Servicio, {
  through: "reservas_servicios",
  foreignKey: "reserva_id",
  otherKey: "servicio_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Usuario.hasMany(Reserva, { foreignKey: "cliente_id" });
Reserva.belongsTo(Usuario, { foreignKey: "cliente_id" });

Disponibilidad.hasMany(Reserva, { foreignKey: "disponibilidad_id" });
Reserva.belongsTo(Disponibilidad, { foreignKey: "disponibilidad_id" });