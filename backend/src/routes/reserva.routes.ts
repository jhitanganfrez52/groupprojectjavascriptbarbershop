import { Router, Request, Response } from "express";
import { Reserva } from "../models/Reserva.js";
import { Usuario } from "../models/Usuario.js";
import { Servicio } from "../models/Servicio.js";
import { Disponibilidad } from "../models/Disponibilidad.js";

const router = Router();

/* =====================
   GET /reservas
===================== */
router.get("/", async (_req: Request, res: Response) => {
  const reservas = await Reserva.findAll({
    include: [Usuario, Disponibilidad, Servicio],
  });
  res.json(reservas);
});

/* =====================
   GET /reservas/:id
===================== */
router.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ msg: "ID inválido" });

  const reserva = await Reserva.findByPk(id, {
    include: [Usuario, Disponibilidad, Servicio],
  });

  if (!reserva) {
    return res.status(404).json({ msg: "Reserva no encontrada" });
  }

  res.json(reserva);
});

/* =====================
   POST /reservas
===================== */
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      cliente_id,
      disponibilidad_id,
      horaInicio,
      horaFin,
      detalle,
      servicios, // array de IDs
    } = req.body;

    const reserva = await Reserva.create({
      cliente_id,
      disponibilidad_id,
      horaInicio,
      horaFin,
      detalle,
    });

    // asociar servicios
    if (servicios && servicios.length > 0) {
      await reserva.setServicios(servicios);
    }

    res.status(201).json(reserva);
  } catch (error) {
    res.status(400).json({ error: "Error al crear reserva" });
  }
});

/* =====================
   PUT /reservas/:id
===================== */
router.put("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ msg: "ID inválido" });

  const reserva = await Reserva.findByPk(id);
  if (!reserva) {
    return res.status(404).json({ msg: "Reserva no encontrada" });
  }

  const { servicios, ...data } = req.body;

  await reserva.update(data);

  if (servicios) {
    await reserva.setServicios(servicios);
  }

  res.json(reserva);
});

/* =====================
   DELETE /reservas/:id
===================== */
router.delete("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ msg: "ID inválido" });

  const reserva = await Reserva.findByPk(id);
  if (!reserva) {
    return res.status(404).json({ msg: "Reserva no encontrada" });
  }

  await reserva.destroy();
  res.json({ msg: "Reserva eliminada" });
});

export default router;