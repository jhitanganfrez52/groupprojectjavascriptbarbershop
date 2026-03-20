// src/models/ReservationService.ts
import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType
} from "sequelize-typescript";

import { Reservation } from "./Reservation.js";
import { Service } from "./Service.js";

@Table({
  tableName: "reservation_services",
  timestamps: false,
})
export class ReservationService extends Model {

  @ForeignKey(() => Reservation)
  @Column(DataType.INTEGER)
  reservationId!: number;

  @ForeignKey(() => Service)
  @Column(DataType.INTEGER)
  serviceId!: number;
}