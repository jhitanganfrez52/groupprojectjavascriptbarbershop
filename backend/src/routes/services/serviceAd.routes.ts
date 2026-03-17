//src/routes/services/servicesAd.routes.ts
import { Router } from "express";
import { Service } from "../../models/Service.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const service = await Service.create({
      name: req.body.name,
      price: req.body.price,
      durationMinutes: req.body.durationMinutes,
      description: req.body.description,
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ error: "Error al crear servicio" });
  }
});

router.get("/", async (req, res) => {
  const services = await Service.findAll();
  res.json(services);
});

router.get("/:id", async (req, res) => {
  const service = await Service.findByPk(req.params.id);

  if (!service) {
    return res.status(404).json({ error: "Servicio no encontrado" });
  }

  res.json(service);
});

router.put("/:id", async (req, res) => {
  const service = await Service.findByPk(req.params.id);

  if (!service) {
    return res.status(404).json({ error: "Servicio no encontrado" });
  }

  await service.update(req.body);

  res.json(service);
});

router.delete("/:id", async (req, res) => {
  const service = await Service.findByPk(req.params.id);

  if (!service) {
    return res.status(404).json({ error: "Servicio no encontrado" });
  }

  await service.destroy();

  res.json({ message: "Servicio eliminado" });
});

export default router;