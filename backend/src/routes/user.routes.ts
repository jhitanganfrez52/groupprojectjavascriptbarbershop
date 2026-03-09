//src/routes/user.routes.ts
import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import { Role } from "../models/Role.js";
import jwt from "jsonwebtoken";
const router = Router();
const JWT_SECRET = "secret";
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
      where: { name: "CLIENT" },
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

    // 🔹 crear token
    const token = jwt.sign(
      {
        id: usuario.getDataValue("idUser"),
        role: usuario.getDataValue("roleId"),
      },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      message: "Login successful",
      token,
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