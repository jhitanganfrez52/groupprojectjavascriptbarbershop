// src/models/Availability.ts
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo
} from "sequelize-typescript";

import { User } from "./User.js";

@Table({
  tableName: "availabilities",
  timestamps: false,
})
export class Availability extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  idAvailability!: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  date!: string;

  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  startTime!: string;

  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  endTime!: string;

  // relación con usuario (empleado)

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    field: "employee_id",
  })
  employeeId!: number;

  @BelongsTo(() => User)
  employee!: User;
}