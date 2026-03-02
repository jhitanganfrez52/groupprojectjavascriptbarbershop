import { Router, Request, Response } from "express";
import { Role } from "../models/Role.js";

const router = Router();

/* ROLES*/
router.get("/", async (_req: Request, res: Response) => {
  const roles = await Role.findAll();
  res.json(roles);
});

router.post("/", async (req: Request, res: Response) => {
  const role = await Role.create(req.body);
  res.status(201).json(role);
});

export default router;