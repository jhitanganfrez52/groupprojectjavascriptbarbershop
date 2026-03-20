import { Router, Request, Response } from "express";
import { Availability } from "../models/Availability.js";

const router = Router();

/* =====================
   POST /disponibilidades
   Crear disponibilidad (empleado)
===================== */
router.post("/", async (req: Request, res: Response) => {
  try {
    const { employeeId, date, startTime, endTime } = req.body;

    const disponibilidad = await Availability.create({
      employeeId,
      date,
      startTime,
      endTime,
    });

    res.status(201).json(disponibilidad);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error al crear disponibilidad" });
  }
});

/* =====================
   GET /disponibilidades
   Listar todas
===================== */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const disponibilidades = await Availability.findAll();
    res.json(disponibilidades);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener disponibilidades" });
  }
});

/* =====================
   GET /disponibilidades/empleado/:id
   Disponibilidad por empleado
===================== */
router.get("/empleado/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const disponibilidades = await Availability.findAll({
      where: { empleado_id: id },
    });

    res.json(disponibilidades);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener disponibilidades del empleado" });
  }
});

/* =====================
   PUT /disponibilidades/:id
   Actualizar
===================== */
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const disponibilidad = await Availability.findByPk(id);

    if (!disponibilidad) {
      return res.status(404).json({ error: "Disponibilidad no encontrada" });
    }

    await disponibilidad.update(req.body);
    res.json(disponibilidad);
  } catch (error) {
    res.status(400).json({ error: "Error al actualizar disponibilidad" });
  }
});
/* =====================
   DELETE /disponibilidades/:id
   Eliminar
===================== */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const disponibilidad = await Availability.findByPk(id);

    if (!disponibilidad) {
      return res.status(404).json({ error: "Disponibilidad no encontrada" });
    }

    await disponibilidad.destroy();
    res.json({ message: "Disponibilidad eliminada" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar disponibilidad" });
  }
});

export default router;