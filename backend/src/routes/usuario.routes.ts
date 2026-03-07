import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import { Role } from "../models/Role.js";

const router = Router();

/* =====================
   GET /usuarios general
===================== */
router.get("/", async (_req: Request, res: Response) => {
  const usuarios = await User.findAll();
  res.json(usuarios);
});

/* =====================
   POST,PUT Y DELETE PARA EL ADMINISTRADOR Y CAJERO
===================== */
router.post("/", async (req: Request, res: Response) => {
  try {
    const passwordHash = await bcrypt.hash(req.body.password, 10);

    const usuario = await User.create({
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

    const usuario = await User.findByPk(id);
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

    const usuario = await User.findByPk(id);
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
/* =====================
   POST register y login para los Clientes nuevos
===================== */
router.post("/register", async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      ci,
      phone,
      password,
    } = req.body;

    if (!password) {
      return res.status(400).json({ error: "Password required" });
    }

    // rol cliente fijo
    const rolCliente = await Role.findOne({
      where: { name: "EMPLOYEE" },
    });

    if (!rolCliente) {
      return res.status(500).json({ error: "Client role does not exist" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const usuario = await User.create({
      firstName,
      lastName,
      ci,
      phone,
      password: passwordHash,
      roleId: rolCliente.getDataValue("idRole"),
    });

    res.status(201).json({
      message: "Client registered",
      usuario: {
        id: usuario.getDataValue("idUser"),
        firstName: usuario.getDataValue("firstName"),
      },
    });
  } catch (error) {
    res.status(400).json({ error: "Register error" });
  }
});


router.post("/login", async (req: Request, res: Response) => {
  try {
    const { ci, password } = req.body;

    const usuario = await User.findOne({
      where: { ci },
    });

    if (!usuario) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(
      password,
      usuario.getDataValue("password")
    );

    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      usuario: {
        id: usuario.getDataValue("idUser"),
        firstName: usuario.getDataValue("firstName"),
        role: usuario.getDataValue("roleId"),
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Login error" });
  }
});
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { ci, password } = req.body;

    const usuario = await User.findOne({
      where: { ci },
    });

    if (!usuario) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(
      password,
      usuario.getDataValue("password")
    );

    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      usuario: {
        id: usuario.getDataValue("idUser"),
        firstName: usuario.getDataValue("firstName"),
        role: usuario.getDataValue("roleId"),
      },
    });

  } catch (error) {
    res.status(500).json({ error: "Login error" });
  }
});
export default router;