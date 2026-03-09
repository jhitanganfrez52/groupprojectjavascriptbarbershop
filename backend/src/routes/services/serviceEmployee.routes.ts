import { Router } from "express";
import { Service } from "../../models/Service.js";
import { User } from "../../models/User.js";
const router = Router();

router.post("/", async (req, res) => {
  try {
    const { idUser, idService } = req.body;

    const user = await User.findByPk(idUser);
    const service = await Service.findByPk(idService);

    if (!user || !service) {
      return res.status(404).json({ error: "Usuario o servicio no encontrado" });
    }

    await user.$add("services", service);

    res.json({ message: "Servicio agregado al empleado" });

  } catch (error) {
    res.status(400).json({ error: "Error al asignar servicio" });
  }
});

router.get("/:id/services", async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    include: Service,
  });

  res.json(user);
});

router.delete("/", async (req, res) => {
  const { idUser, idService } = req.body;

  const user = await User.findByPk(idUser);
  const service = await Service.findByPk(idService);

  if (!user || !service) {
    return res.status(404).json({ error: "Usuario o servicio no encontrado" });
  }

  await user.$remove("services", service);

  res.json({ message: "Servicio removido del empleado" });
});

export default router;