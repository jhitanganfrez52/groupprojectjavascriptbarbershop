import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { Usuario } from "../models/Usuario.js";
import { Role } from "../models/Role.js";

const router = Router();

/* =====================
   GET /usuarios general
===================== */
router.get("/", async (_req: Request, res: Response) => {
  const usuarios = await Usuario.findAll();
  res.json(usuarios);
});

/* =====================
   POST,PUT Y DELETE PARA EL ADMINISTRADOR Y CAJERO
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
   PUT /usuarios/:id
===================== */
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Si se actualiza password
    if (req.body.password) {
      const passwordHash = await bcrypt.hash(req.body.password, 10);
      req.body.password = passwordHash;
    }

    await usuario.update(req.body);

    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar usuario", error });
  }
});

/* =====================
   DELETE /usuarios/:id
===================== */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await usuario.destroy();

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar usuario", error });
  }
});
/* =====================
   POST register y login para los Clientes nuevos
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
      where: { nombreRol: "CLIENTE" },/// esto varia dependiendo a como se
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