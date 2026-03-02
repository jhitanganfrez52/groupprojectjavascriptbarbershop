import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { Usuario } from "../models/Usuario.js";
import { Role } from "../models/Role.js";

const router = Router();

/* =====================
   GET /usuarios
===================== */
router.get("/", async (_req: Request, res: Response) => {
  const usuarios = await Usuario.findAll();
  res.json(usuarios);
});

/* =====================
   POST /usuarios
   (admin / caja)
===================== */
router.post("/", async (req: Request, res: Response) => {
  try {
    const passwordHash = await bcrypt.hash(req.body.password, 10);

    const usuario = await Usuario.create({
      ...req.body,
      password: passwordHash,
    });

    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json({ error: "Error al crear usuario" });
  }
});

/* =====================
   POST /usuarios/register
   (cliente público)
===================== */
router.post("/register", async (req: Request, res: Response) => {
  try {
    const {
      nombre1,
      apellido1,
      ciUsuario,
      celularUsuario,
      password,
    } = req.body;

    if (!password) {
      return res.status(400).json({ error: "Contraseña requerida" });
    }

    // rol cliente fijo
    const rolCliente = await Role.findOne({
      where: { nombreRol: "CLIENTE" },/// esto varia dependiendo a como se creo en postman el ROL
    });

    if (!rolCliente) {
      return res.status(500).json({ error: "Rol cliente no existe" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const usuario = await Usuario.create({
      nombre1,
      apellido1,
      ciUsuario,
      celularUsuario,
      password: passwordHash,
      Roles_idRoles: rolCliente.getDataValue("idRoles"),
    });

    res.status(201).json({
      message: "Cliente registrado",
      usuario: {
        id: usuario.getDataValue("idUsuarios"),
        nombre1: usuario.getDataValue("nombre1"),
      },
    });
  } catch (error) {
    res.status(400).json({ error: "Error en registro" });
  }
});

/* =====================
   POST /usuarios/login
   (sin JWT)
===================== */
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { ciUsuario, password } = req.body;

    const usuario = await Usuario.findOne({
      where: { ciUsuario },
    });

    if (!usuario) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const match = await bcrypt.compare(
      password,
      usuario.getDataValue("password")
    );

    if (!match) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    res.json({
      message: "Login correcto",
      usuario: {
        id: usuario.getDataValue("idUsuarios"),
        nombre1: usuario.getDataValue("nombre1"),
        rol: usuario.getDataValue("Roles_idRoles"),
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error en login" });
  }
});

export default router;