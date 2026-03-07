//src/routes/userAd.routes.ts
import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User.js";

//import { verifyToken,verifyAdmin} from "../middleware/auth.js";
const router = Router();

/* =====================
   GET TODOS
===================== */
router.get("/", async (_req, res) => {
  const usuarios = await User.findAll();
  res.json(usuarios);
});

/* =====================
   GET POR ID
===================== */
router.get("/:id", async (req, res) => {
  const usuario = await User.findByPk(req.params.id);

  if (!usuario) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  res.json(usuario);
});
/* =====================
   POST,PUT Y DELETE PARA EL ADMINISTRADOR Y CAJERO
===================== */
router.post("/", async (req, res) => {
  try {
    const passwordHash = await bcrypt.hash(req.body.password, 10);

    const usuario = await User.create({
      ...req.body,
      password: passwordHash,
    });

    res.status(201).json(usuario);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({
      message: "Error al crear usuario",
      error: error.message,
    });
  }
});
/* =====================
   PUT /usuarios/:id
===================== */
router.put("/:id", async (req, res) => {
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

/* ====================/* =====================
   DELETE /usuarios/:id
===================== */
router.delete("/:id", async (req, res) => {
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

export default router;