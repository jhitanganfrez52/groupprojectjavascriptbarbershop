import { Router, Request, Response } from "express";
import { Reservation } from "../models/Reservation.js";
import { User } from "../models/User.js";
import { Service } from "../models/Service.js";
import { Availability } from "../models/Availability.js";

const router = Router();

/* =====================
   GET /reservas
===================== */
router.get("/", async (_req: Request, res: Response) => {
  const reservas = await Reservation.findAll({
    include: [User, Availability, Service],
  });
  res.json(reservas);
});

/* =====================
   GET /reservas/:id
===================== */
router.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ msg: "ID inválido" });

  const reserva = await Reservation.findByPk(id, {
    include: [User, Availability, Service],
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
  clientId,
  availabilityId,
  startTime,
  endTime,
  detail,
  services
} = req.body;

   const reserva = await Reservation.create({
  clientId,
  availabilityId,
  startTime,
  endTime,
  detail,
});

    // asociar servicios
    if (services && services.length > 0) {
      await reserva.$set("services", services);
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

  const reserva = await Reservation.findByPk(id);
  if (!reserva) {
    return res.status(404).json({ msg: "Reserva no encontrada" });
  }

  const { servicios, ...data } = req.body;

  await reserva.update(data);

  if (servicios) {
   await reserva.$set("services", servicios);
  }

  res.json(reserva);
});

/* =====================
   DELETE /reservas/:id
===================== */
router.delete("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ msg: "ID inválido" });

  const reserva = await Reservation.findByPk(id);
  if (!reserva) {
    return res.status(404).json({ msg: "Reserva no encontrada" });
  }

  await reserva.destroy();
  res.json({ msg: "Reserva eliminada" });
});

export default router;