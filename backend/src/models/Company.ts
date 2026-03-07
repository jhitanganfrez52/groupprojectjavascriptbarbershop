// src/models/Company.ts
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement
} from "sequelize-typescript";

@Table({
  tableName: "empresa",
  timestamps: false
})
export class Company extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  idCompany!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  companyName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  logoImage!: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  qrImage!: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  phoneNumber!: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  email!: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  address!: string | null;
}