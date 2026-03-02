import { Router, Request, Response } from "express";
import { Caja } from "../models/Caja.js";

const router = Router();

/* =====================
   GET /caja (listar)
===================== */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const registros = await Caja.findAll();
    res.json(registros);
  } catch (error) {
    res.status(500).json({ error: "Error al listar caja" });
  }
});

/* =====================
   GET /caja/:id
===================== */
router.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ msg: "ID inválido" });
  }

  const registro = await Caja.findByPk(id);

  if (!registro) {
    return res.status(404).json({ msg: "Registro no encontrado" });
  }

  res.json(registro);
});

/* =====================
   POST /caja (crear)
===================== */
router.post("/", async (req: Request, res: Response) => {
  try {
    const nuevo = await Caja.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ error: "Error al crear registro" });
  }
});

/* =====================
   PUT /caja/:id (editar)
===================== */
router.put("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ msg: "ID inválido" });
  }

  const registro = await Caja.findByPk(id);

  if (!registro) {
    return res.status(404).json({ msg: "Registro no encontrado" });
  }

  await registro.update(req.body);
  res.json(registro);
});

/* =====================
   DELETE /caja/:id
===================== */
router.delete("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ msg: "ID inválido" });
  }

  const registro = await Caja.findByPk(id);

  if (!registro) {
    return res.status(404).json({ msg: "Registro no encontrado" });
  }

  await registro.destroy();
  res.json({ msg: "Registro eliminado" });
});

export default router;