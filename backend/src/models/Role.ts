// src/models/Role.ts
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  HasMany
} from "sequelize-typescript";

import { User } from "./User.js";

@Table({
  tableName: "roles",
  timestamps: false,
})
export class Role extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  idRole!: number;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    unique: true,
  })
  name!: string;

  // relación con usuarios
  @HasMany(() => User)
  users!: User[];
}