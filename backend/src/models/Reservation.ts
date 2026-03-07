// src/models/Reservation.ts
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  BelongsToMany
} from "sequelize-typescript";

import { User } from "./User.js";
import { Availability } from "./Availability.js";
import { Service } from "./Service.js";
import { ReservationService } from "./ReservationService.js";

@Table({
  tableName: "reservations",
  timestamps: false,
})
export class Reservation extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  idReservation!: number;

  @Column(DataType.TIME)
  startTime!: string;

  @Column(DataType.TIME)
  endTime!: string;

  @Column(DataType.TEXT)
  detail!: string;

  @Column({
    type: DataType.ENUM(
      "pending",
      "confirmed",
      "completed",
      "cancelled"
    ),
    defaultValue: "pending",
  })
  status!: string;

  /* =========================
     RELACION CON CLIENTE
  ========================= */

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    field: "client_id",
  })
  clientId!: number;

  @BelongsTo(() => User)
  client!: User;

  /* =========================
     RELACION CON DISPONIBILIDAD
  ========================= */

  @ForeignKey(() => Availability)
  @Column({
    type: DataType.INTEGER,
    field: "availability_id",
  })
  availabilityId!: number;

  @BelongsTo(() => Availability)
  availability!: Availability;

  /* =========================
     RELACION CON SERVICIOS
  ========================= */

  @BelongsToMany(() => Service, () => ReservationService)
  services!: Service[];
}