// src/models/Service.ts
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  BelongsToMany
} from "sequelize-typescript";

import { User } from "./User.js";
import { ServiceEmployee } from "./ServiceEmployee.js";

@Table({
  tableName: "services",
  timestamps: false,
})
export class Service extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  idService!: number;

  @Column({
    type: DataType.STRING(25),
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  price!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  durationMinutes!: number;

  @Column(DataType.TEXT)
  description!: string;

@BelongsToMany(
  () => User,
  () => ServiceEmployee,
  "serviceId",   // foreignKey en tabla intermedia
  "employeeId"   // otherKey
)
users!: User[];
}