// src/models/CashRegister.ts
import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement } from "sequelize-typescript";
import { ForeignKey, BelongsTo } from "sequelize-typescript";
import { Reservation } from "./Reservation.js";
import { Service } from "./Service.js";
@Table({
  tableName: "cash_register",
  timestamps: false,
})
export class CashRegister extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  idCashRegister!: number;

  @Column({
    type: DataType.ENUM("income", "expense"),
    allowNull: false,
  })
  type!: "income" | "expense";

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  concept!: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  amount!: number;

  @Column({
    type: DataType.ENUM("cash", "qr", "card"),
    allowNull: false,
  })
  method!: "cash" | "qr" | "card";

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date!: Date;
  /* =========================
   RELACION CON RESERVA
========================= */

@ForeignKey(() => Reservation)
@Column({
  type: DataType.INTEGER,
  allowNull: true,
})
reservationId?: number;

@BelongsTo(() => Reservation)
reservation?: Reservation;

/* =========================
   RELACION CON SERVICIO (para pagos sin reserva)
========================= */

@ForeignKey(() => Service)
@Column({
  type: DataType.INTEGER,
  allowNull: true,
})
serviceId?: number;

@BelongsTo(() => Service)
service?: Service;

}