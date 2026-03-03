// src/models/Empresa.ts
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database.js";

/* =========================
   INTERFACES
========================= */
interface EmpresaAttributes {
  idEmpresa: number;
  nombreEmpresa: string;
  imageLogo?: string | null;
  imageQR?: string | null;
  numeroE?: string | null;
  correoE?: string | null;
  direccionE?: string | null;
}

// Campos opcionales al crear una empresa
interface EmpresaCreationAttributes extends Optional<EmpresaAttributes, "idEmpresa"> {}

/* =========================
   MODELO
========================= */
export class Empresa
  extends Model<EmpresaAttributes, EmpresaCreationAttributes>
  implements EmpresaAttributes
{
  public idEmpresa!: number;
  public nombreEmpresa!: string;
  public imageLogo!: string | null;
  public imageQR!: string | null;
  public numeroE!: string | null;
  public correoE!: string | null;
  public direccionE!: string | null;
}

Empresa.init(
  {
    idEmpresa: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombreEmpresa: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageLogo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    imageQR: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    numeroE: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    correoE: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    direccionE: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "empresa",
    timestamps: false,
  }
);