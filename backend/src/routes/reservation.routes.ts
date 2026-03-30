import { Router, Request, Response } from "express";
import { Reservation } from "../models/Reservation.js";
import { User } from "../models/User.js";
import { Service } from "../models/Service.js";
import { Availability } from "../models/Availability.js";
const router = Router();
const validStatus = ["pending", "confirmed", "completed", "cancelled"];
/* =====================
   GET /reservas
===================== */
router.get("/", async (_req: Request, res: Response) => {
  const reservas = await Reservation.findAll({
    include: [
      User,
      Availability,
      {
        model: Service,
        through: { attributes: [] }, //  CLAVE
      },
    ],
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
    include: [
      User,
      Availability,
      {
        model: Service,
        through: { attributes: [] }, //  CLAVE
      },
    ],
  });

  if (!reserva) {
    return res.status(404).json({ msg: "Reserva no encontrada" });
  }

  res.json(reserva);
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      clientId,
      availabilityId,
      startTime,
      endTime,
      detail,
      services,
      date: incomingDate
    } = req.body;

    //  fecha automática si no viene
    const date = req.body.date || new Date().toISOString().split("T")[0];

    // 1. validar disponibilidad
    const availability = await Availability.findByPk(availabilityId);

    if (!availability) {
      return res.status(404).json({ error: "Disponibilidad no encontrada" });
    }

    // 2. validar rango dentro del horario
    if (
      startTime < availability.startTime ||
      endTime > availability.endTime
    ) {
      return res.status(400).json({
        error: "Fuera del horario del empleado",
      });
    }

    // 3. reservas existentes en esa fecha
    const reservas = await Reservation.findAll({
      where: {
        availabilityId,
        date
      },
    });

    // 4. validar cruce
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

    // 6. servicios
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
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ msg: "ID inválido" });
    }

    const reserva = await Reservation.findByPk(id);
    if (!reserva) {
      return res.status(404).json({ msg: "Reserva no encontrada" });
    }

    const { status, services, ...data } = req.body;

    // ✅ validar status si viene
    if (status) {
      if (!validStatus.includes(status)) {
        return res.status(400).json({
          error: "Estado inválido",
        });
      }

      // 👉 opcional: lógica de transición
      // ejemplo: no volver de completed a pending
      if (reserva.status === "completed" && status !== "completed") {
        return res.status(400).json({
          error: "No se puede modificar una reserva completada",
        });
      }

      reserva.status = status;
    }

    // ✅ actualizar otros datos si vienen
    await reserva.update(data);

    // ✅ actualizar servicios
    if (services) {
      await reserva.$set("services", services);
    }

    res.json(reserva);

  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error al actualizar reserva" });
  }
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