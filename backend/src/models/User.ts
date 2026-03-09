// src/models/User.ts
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

import { Role } from "./Role.js";
import { BelongsToMany } from "sequelize-typescript";
import { Service } from "./Service.js";
import { ServiceEmployee } from "./ServiceEmployee.js";

@Table({
  tableName: "users",
  timestamps: false,
})
export class User extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  idUser!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstName!: string;

  @Column(DataType.STRING)
  middleName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastName!: string;

  @Column(DataType.STRING)
  secondLastName!: string;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  ci!: string;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  phone!: string;

  @Column(DataType.STRING)
  password!: string;

  // relación con roles

  @ForeignKey(() => Role)
  @Column({
    type: DataType.INTEGER,
    field: "role_id",
  })
  roleId!: number;

  @BelongsTo(() => Role)
  role!: Role;

  @BelongsToMany(() => Service, () => ServiceEmployee)
services!: Service[];
}
