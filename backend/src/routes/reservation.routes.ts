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
      date,
      startTime,
      endTime,
      detail,
      services
    } = req.body;

    // 1. validar disponibilidad
    const availability = await Availability.findByPk(availabilityId);

    if (!availability) {
      return res.status(404).json({ error: "Disponibilidad no encontrada" });
    }

    // 2. validar rango dentro del horario del empleado
    if (
      startTime < availability.startTime ||
      endTime > availability.endTime
    ) {
      return res.status(400).json({
        error: "Fuera del horario del empleado",
      });
    }

    // 3. traer reservas existentes en esa fecha
    const reservas = await Reservation.findAll({
      where: {
        availabilityId,
        date
      },
    });

    // 4. validar cruce de horarios
    const hayCruce = reservas.some(r =>
      startTime < r.endTime && endTime > r.startTime
    );

    if (hayCruce) {
      return res.status(400).json({
        error: "La hora ya está ocupada",
      });
    }

    // 5. crear reserva
    const reserva = await Reservation.create({
      clientId,
      availabilityId,
      date,
      startTime,
      endTime,
      detail,
    });

    // 6. asociar servicios
    if (services && services.length > 0) {
      await reserva.$set("services", services);
    }

    res.status(201).json(reserva);

  } catch (error) {
    console.error(error);
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