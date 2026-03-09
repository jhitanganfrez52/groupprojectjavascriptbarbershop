// src/models/ServiceEmployee.ts
import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType
} from "sequelize-typescript";

import { Service } from "./Service.js";
import { User } from "./User.js";
@Table({
  tableName: "service_employees",
  timestamps: false,
})
export class ServiceEmployee extends Model {

  @ForeignKey(() => Service)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  serviceId!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  employeeId!: number;
}