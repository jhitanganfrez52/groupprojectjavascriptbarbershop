import { Router, Request, Response } from "express";
import { CashRegister } from "../models/CashRegister.js";

const router = Router();

/* =====================
   GET /caja (listar)
===================== */
router.get("/", async (req: Request, res: Response) => {
  try {
    const { date } = req.query;

    const where: any = {};

    if (date) {
      where.date = date;
    }

   const registros = await CashRegister.findAll({
  where,
  include: ["reservation", "service"],
  order: [
    ["date", "ASC"], // 🔥 más reciente primero
    ["idCashRegister", "DESC"], // fallback por si misma fecha
  ],
});

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

  const registro = await CashRegister.findByPk(id);

  if (!registro) {
    return res.status(404).json({ msg: "Registro no encontrado" });
  }

  res.json(registro);
});

//resumen
router.get("/summary", async (_req: Request, res: Response) => {
  try {
    const ingresos = await CashRegister.sum("amount", {
      where: { type: "income" },
    });

    const egresos = await CashRegister.sum("amount", {
      where: { type: "expense" },
    });

    res.json({
      ingresos: ingresos || 0,
      egresos: egresos || 0,
      balance: (ingresos || 0) - (egresos || 0),
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener resumen" });
  }
});

/* =====================
   POST /caja (crear)
===================== */
router.post("/", async (req: Request, res: Response) => {
  try {
    const { type, concept, amount, method, date, reservationId, serviceId } = req.body;

    if (!type || !amount || !method || !date) {
      return res.status(400).json({ msg: "Campos obligatorios faltantes" });
    }

    if (type === "income" && !reservationId && !serviceId) {
      return res.status(400).json({
        msg: "Un ingreso debe tener reservationId o serviceId",
      });
    }

    const nuevo = await CashRegister.create({
      type,
      concept,
      amount,
      method,
      date,
      reservationId,
      serviceId,
    });

    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ error: "Error al crear registro" });
  }
});
//registronormal
router.post("/manual", async (req: Request, res: Response) => {
  try {
    const { type, concept, amount, method} = req.body;

    // Validaciones básicas
    if (!type || !concept || !amount || !method ) {
      return res.status(400).json({
        msg: "Todos los campos son obligatorios",
      });
    }

    const nuevo = await CashRegister.create({
      type,
      concept,
      amount,
      method,
      date: new Date(),
      reservationId: null,
      serviceId: null,
    });

    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({
      error: "Error al crear registro manual",
    });
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

  const registro = await CashRegister.findByPk(id);

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

  const registro = await CashRegister.findByPk(id);

  if (!registro) {
    return res.status(404).json({ msg: "Registro no encontrado" });
  }

  await registro.destroy();
  res.json({ msg: "Registro eliminado" });
});

export default router;